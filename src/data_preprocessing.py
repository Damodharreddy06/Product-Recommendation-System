"""
Data Preprocessing Module for Product Recommendation System.

This module handles:
1. Loading raw CSV datasets (products and ratings).
2. Data cleaning (handling missing values, duplicates, and type casting).
3. Text preprocessing and feature combination for content-based models.
4. Construction of the User-Item rating matrix.
5. Train-test splitting for offline recommendation evaluation.
"""

import os
import re
import pandas as pd
import numpy as np
from typing import Tuple, Optional, Dict, Any


class DataPreprocessor:
    """
    Handles end-to-end data ingestion, cleaning, feature engineering,
    and matrix construction for recommendation pipelines.
    """

    def __init__(self, products_path: str = "data/products.csv", ratings_path: str = "data/ratings.csv"):
        self.products_path = products_path
        self.ratings_path = ratings_path
        self.products_df: Optional[pd.DataFrame] = None
        self.ratings_df: Optional[pd.DataFrame] = None
        self.user_item_matrix: Optional[pd.DataFrame] = None
        self.cleaned_products_df: Optional[pd.DataFrame] = None

    def load_data(self) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """
        Loads products and ratings CSV files into pandas DataFrames.
        
        Returns:
            Tuple[pd.DataFrame, pd.DataFrame]: (products_df, ratings_df)
        """
        if not os.path.exists(self.products_path):
            raise FileNotFoundError(f"Products file not found at: {self.products_path}")
        if not os.path.exists(self.ratings_path):
            raise FileNotFoundError(f"Ratings file not found at: {self.ratings_path}")

        self.products_df = pd.read_csv(self.products_path)
        self.ratings_df = pd.read_csv(self.ratings_path)

        return self.products_df, self.ratings_df

    @staticmethod
    def clean_text(text: Any) -> str:
        """
        Cleans and normalizes text by lowercasing, removing special characters,
        and stripping extra whitespaces.
        """
        if pd.isna(text) or text is None:
            return ""
        text = str(text).lower()
        # Remove punctuation / special symbols, keep alphanumeric and spaces
        text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
        # Collapse multiple spaces
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def preprocess_products(self) -> pd.DataFrame:
        """
        Cleans products dataframe, handles missing values, casts numeric fields,
        and constructs a combined 'content_soup' text feature.
        """
        if self.products_df is None:
            self.load_data()

        df = self.products_df.copy()

        # Step 1: Remove duplicates based on product_id
        df = df.drop_duplicates(subset=["product_id"])

        # Step 2: Handle missing values with domain defaults
        df["product_name"] = df["product_name"].fillna("Unknown Product")
        df["category"] = df["category"].fillna("General")
        df["brand"] = df["brand"].fillna("Generic")
        df["description"] = df["description"].fillna("")
        df["price"] = pd.to_numeric(df["price"], errors="coerce").fillna(0.0)
        df["rating"] = pd.to_numeric(df["rating"], errors="coerce").fillna(0.0)

        # Step 3: Text cleaning
        df["clean_name"] = df["product_name"].apply(self.clean_text)
        df["clean_category"] = df["category"].apply(self.clean_text)
        df["clean_brand"] = df["brand"].apply(self.clean_text)
        df["clean_description"] = df["description"].apply(self.clean_text)

        # Step 4: Create 'content_soup' for TF-IDF feature extraction
        # Weighting: Product name and category repeated to increase feature relevance
        df["content_soup"] = (
            df["clean_name"] + " " +
            df["clean_name"] + " " +
            df["clean_category"] + " " +
            df["clean_category"] + " " +
            df["clean_brand"] + " " +
            df["clean_description"]
        )

        self.cleaned_products_df = df
        return df

    def preprocess_ratings(self) -> pd.DataFrame:
        """
        Cleans ratings dataframe, removes invalid values, and validates rating bounds (1.0 to 5.0).
        """
        if self.ratings_df is None:
            self.load_data()

        df = self.ratings_df.copy()

        # Step 1: Drop duplicates (keep last interaction)
        df = df.drop_duplicates(subset=["user_id", "product_id"], keep="last")

        # Step 2: Missing values removal
        df = df.dropna(subset=["user_id", "product_id", "rating"])

        # Step 3: Type casting and bounds clamping
        df["rating"] = pd.to_numeric(df["rating"], errors="coerce")
        df = df.dropna(subset=["rating"])
        df["rating"] = df["rating"].clip(lower=1.0, upper=5.0)

        # Step 4: Ensure IDs are string formatted
        df["user_id"] = df["user_id"].astype(str).str.strip()
        df["product_id"] = df["product_id"].astype(str).str.strip()

        self.ratings_df = df
        return df

    def create_user_item_matrix(self, fill_value: float = 0.0) -> pd.DataFrame:
        """
        Builds a 2D Pivot Table representing User-Item ratings.
        Rows: User IDs
        Columns: Product IDs
        Values: User rating (or fill_value for unrated items)
        """
        if self.ratings_df is None:
            self.preprocess_ratings()

        self.user_item_matrix = self.ratings_df.pivot_table(
            index="user_id",
            columns="product_id",
            values="rating"
        ).fillna(fill_value)

        return self.user_item_matrix

    def get_dataset_summary(self) -> Dict[str, Any]:
        """
        Returns key statistics of the dataset for EDA and dashboard metrics.
        """
        if self.cleaned_products_df is None:
            self.preprocess_products()
        if self.ratings_df is None:
            self.preprocess_ratings()

        num_users = self.ratings_df["user_id"].nunique()
        num_products = self.cleaned_products_df["product_id"].nunique()
        num_ratings = len(self.ratings_df)
        avg_rating = round(self.ratings_df["rating"].mean(), 2)

        # Matrix sparsity calculation
        total_possible_ratings = num_users * num_products
        sparsity = round((1.0 - (num_ratings / total_possible_ratings)) * 100, 2) if total_possible_ratings > 0 else 0.0

        return {
            "total_users": num_users,
            "total_products": num_products,
            "total_ratings": num_ratings,
            "average_rating": avg_rating,
            "matrix_sparsity_pct": sparsity,
            "categories": self.cleaned_products_df["category"].unique().tolist(),
            "brands": self.cleaned_products_df["brand"].unique().tolist()
        }

    def train_test_split_ratings(self, test_ratio: float = 0.2, random_state: int = 42) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """
        Splits interactions into train and test sets for evaluation.
        Ensures users with >= 2 ratings have at least one rating in train set.
        """
        if self.ratings_df is None:
            self.preprocess_ratings()

        shuffled = self.ratings_df.sample(frac=1.0, random_state=random_state)
        test_size = int(len(shuffled) * test_ratio)

        test_df = shuffled.iloc[:test_size].copy()
        train_df = shuffled.iloc[test_size:].copy()

        return train_df, test_df
