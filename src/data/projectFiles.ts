import { ProjectFile } from '../types';

export const allProjectFiles: ProjectFile[] = [
  {
    path: 'data/products.csv',
    name: 'products.csv',
    language: 'csv',
    category: 'Datasets',
    content: `product_id,product_name,category,brand,price,rating,description
P101,Sony WH-1000XM5 Wireless Headphones,Audio,Sony,399.99,4.8,"Industry leading noise canceling wireless over-ear headphones with 30-hour battery life and crystal clear hands-free calling"
P102,Bose QuietComfort 45,Audio,Bose,329.00,4.7,"Premium noise cancelling wireless headphones with acoustic noise cancelling technology, high-fidelity audio, and comfortable plush ear cushions"
P103,Apple AirPods Pro 2nd Gen,Audio,Apple,249.00,4.8,"True wireless earbuds with active noise cancellation, adaptive transparency, personalized spatial audio, and MagSafe charging case"
P104,Sennheiser Momentum 4 Wireless,Audio,Sennheiser,349.95,4.6,"Audiophile-grade wireless Bluetooth headphones with 60-hour battery life, adaptive ANC, and customizable sound equalizer"
P105,JBL Flip 6 Portable Bluetooth Speaker,Audio,JBL,129.95,4.5,"Waterproof portable Bluetooth speaker with powerful sound, deep bass, 12 hours playtime, and rugged durable design"
P106,Sony SRS-XB13 Wireless Speaker,Audio,Sony,59.99,4.4,"Compact portable waterproof wireless Bluetooth speaker with extra bass, sound diffusion processor, and detachable strap"
P107,Apple MacBook Pro 14 M3,Computers,Apple,1599.00,4.9,"High performance laptop with Apple M3 chip, 14.2-inch Liquid Retina XDR display, 512GB SSD, and 18-hour battery life"
P108,Dell XPS 13 Plus Ultrabook,Computers,Dell,1399.00,4.5,"Sleek premium ultrabook laptop with 13.4-inch OLED touch display, Intel Core i7 13th Gen, 16GB RAM, 512GB SSD"
P109,Lenovo ThinkPad X1 Carbon Gen 11,Computers,Lenovo,1450.00,4.7,"Business laptop with ultralight carbon fiber chassis, Intel Core i7, 16GB RAM, fingerprint reader, and legendary keyboard"
P110,ASUS ROG Zephyrus G14 Gaming Laptop,Computers,ASUS,1499.99,4.6,"Powerful compact gaming laptop with AMD Ryzen 9, NVIDIA GeForce RTX 4060 GPU, 165Hz QHD display, and vapor chamber cooling"
P111,Logitech MX Master 3S Wireless Mouse,Electronics,Logitech,99.99,4.8,"Ergonomic performance wireless mouse with 8K DPI sensor, quiet clicks, electromagnetic MagSpeed scrolling, and multi-device pairing"
P112,Logitech MX Mechanical Wireless Keyboard,Electronics,Logitech,169.99,4.7,"Low-profile tactile mechanical keyboard with smart backlighting, Bluetooth and USB receiver connectivity for multi-OS"
P113,Anker 737 Power Bank 24000mAh,Electronics,Anker,149.99,4.7,"High-speed 140W fast-charging portable charger battery bank with smart digital display for laptops, tablets, and phones"
P114,Samsung 32-inch 4K UHD Smart Monitor M8,Electronics,Samsung,499.99,4.4,"Slim 4K UHD smart monitor with built-in streaming apps, SlimFit camera, USB-C connectivity, and remote control"
P115,Apple Watch Series 9,Wearables,Apple,399.00,4.8,"Smartwatch with advanced health sensors, S9 SiP chip, double tap gesture, always-on Retina display, and ECG heart monitoring"
P116,Samsung Galaxy Watch 6,Wearables,Samsung,299.99,4.5,"Smartwatch with body composition analysis, advanced sleep tracking, personalized HR zones, and sapphire crystal glass"
P117,Garmin Forerunner 265 GPS Running Watch,Wearables,Garmin,449.99,4.8,"Lightweight GPS running smartwatch with colorful AMOLED display, training readiness metrics, triathlon mode, and HRV status"
P118,Fitbit Charge 6 Fitness Tracker,Wearables,Fitbit,159.95,4.3,"Health and fitness tracker with built-in GPS, YouTube Music controls, Google Maps navigation, ECG app, and 7-day battery"
P119,Nespresso VertuoPlus Coffee Maker,Home & Kitchen,Nespresso,169.00,4.6,"Automatic single-serve coffee and espresso machine with centrifusion extraction technology and milk frother bundle compatibility"
P120,Breville Barista Touch Espresso Machine,Home & Kitchen,Breville,999.95,4.8,"Automated touchscreen espresso machine with integrated conical burr grinder, automatic microfoam milk texturing, and thermoJet heating"
P121,Instant Pot Duo 7-in-1 Pressure Cooker,Home & Kitchen,Instant Pot,99.95,4.7,"Multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, and food warmer"
P122,Ninja AF101 4-Quart Air Fryer,Home & Kitchen,Ninja,119.99,4.8,"Compact digital air fryer that crisps, roasts, reheats, and dehydrates with wide temperature range and dishwasher-safe basket"
P123,Bowflex SelectTech 552 Adjustable Dumbbells,Fitness,Bowflex,429.00,4.8,"Space-saving adjustable dumbbells pairing from 5 to 52.5 lbs with rapid dial selector mechanism for home gym strength training"
P124,Peloton Guide AI Strength Training,Fitness,Peloton,195.00,4.4,"AI-powered movement tracking device for strength workouts that connects to your TV with rep tracking and form guidance"
P125,Manduka PRO Yoga and Pilates Mat,Fitness,Manduka,138.00,4.7,"Ultra-dense high-performance yoga mat with lifetime guarantee, joint protection, and non-slip textured grip surface"`
  },
  {
    path: 'data/ratings.csv',
    name: 'ratings.csv',
    language: 'csv',
    category: 'Datasets',
    content: `user_id,product_id,rating,timestamp
U1001,P101,5.0,1698105600
U1001,P102,4.5,1698192000
U1001,P103,5.0,1698278400
U1001,P104,4.0,1698364800
U1001,P111,4.5,1698451200
U1002,P107,5.0,1698105600
U1002,P108,4.0,1698192000
U1002,P109,4.5,1698278400
U1002,P111,5.0,1698364800
U1002,P112,4.5,1698451200
U1002,P114,4.0,1698537600
U1003,P115,5.0,1698105600
U1003,P116,4.0,1698192000
U1003,P117,5.0,1698278400
U1003,P118,3.5,1698364800
U1003,P123,4.5,1698451200
U1003,P124,4.0,1698537600
U1004,P119,5.0,1698105600
U1004,P120,5.0,1698192000
U1004,P121,4.5,1698278400
U1004,P122,4.5,1698364800
U1004,P105,4.0,1698451200
U1005,P101,4.5,1698105600
U1005,P103,5.0,1698192000
U1005,P105,4.5,1698278400
U1005,P106,4.0,1698364800
U1005,P115,4.5,1698451200
U1006,P107,4.5,1698105600
U1006,P110,5.0,1698192000
U1006,P111,4.0,1698278400
U1006,P112,4.5,1698364800
U1006,P113,4.5,1698451200
U1007,P123,5.0,1698105600
U1007,P124,4.5,1698192000
U1007,P125,5.0,1698278400
U1007,P117,4.5,1698364800
U1007,P118,4.0,1698451200
U1008,P101,4.0,1698105600
U1008,P102,4.5,1698192000
U1008,P107,5.0,1698278400
U1008,P109,4.5,1698364800
U1008,P111,4.5,1698451200
U1008,P113,5.0,1698537600
U1009,P119,4.5,1698105600
U1009,P121,5.0,1698192000
U1009,P122,4.5,1698278400
U1009,P125,4.0,1698364800
U1010,P103,4.5,1698105600
U1010,P107,5.0,1698192000
U1010,P115,5.0,1698278400
U1010,P116,4.0,1698364800
U1010,P113,4.5,1698451200
U1011,P104,5.0,1698105600
U1011,P105,4.0,1698192000
U1011,P106,4.5,1698278400
U1011,P101,4.5,1698364800
U1012,P108,4.0,1698105600
U1012,P110,4.5,1698192000
U1012,P112,4.0,1698278400
U1012,P114,4.5,1698364800
U1013,P120,5.0,1698105600
U1013,P121,4.5,1698192000
U1013,P122,4.0,1698278400
U1014,P117,5.0,1698105600
U1014,P123,4.5,1698192000
U1014,P125,4.5,1698278400
U1015,P101,5.0,1698105600
U1015,P107,4.5,1698192000
U1015,P111,4.0,1698278400
U1015,P115,4.5,1698364800`
  },
  {
    path: 'src/data_preprocessing.py',
    name: 'data_preprocessing.py',
    language: 'python',
    category: 'Source Code (src/)',
    content: `"""
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
    def __init__(self, products_path: str = "data/products.csv", ratings_path: str = "data/ratings.csv"):
        self.products_path = products_path
        self.ratings_path = ratings_path
        self.products_df: Optional[pd.DataFrame] = None
        self.ratings_df: Optional[pd.DataFrame] = None
        self.user_item_matrix: Optional[pd.DataFrame] = None
        self.cleaned_products_df: Optional[pd.DataFrame] = None

    def load_data(self) -> Tuple[pd.DataFrame, pd.DataFrame]:
        if not os.path.exists(self.products_path):
            raise FileNotFoundError(f"Products file not found at: {self.products_path}")
        if not os.path.exists(self.ratings_path):
            raise FileNotFoundError(f"Ratings file not found at: {self.ratings_path}")

        self.products_df = pd.read_csv(self.products_path)
        self.ratings_df = pd.read_csv(self.ratings_path)
        return self.products_df, self.ratings_df

    @staticmethod
    def clean_text(text: Any) -> str:
        if pd.isna(text) or text is None:
            return ""
        text = str(text).lower()
        text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def preprocess_products(self) -> pd.DataFrame:
        if self.products_df is None:
            self.load_data()

        df = self.products_df.copy()
        df = df.drop_duplicates(subset=["product_id"])
        df["product_name"] = df["product_name"].fillna("Unknown Product")
        df["category"] = df["category"].fillna("General")
        df["brand"] = df["brand"].fillna("Generic")
        df["description"] = df["description"].fillna("")
        df["price"] = pd.to_numeric(df["price"], errors="coerce").fillna(0.0)
        df["rating"] = pd.to_numeric(df["rating"], errors="coerce").fillna(0.0)

        df["clean_name"] = df["product_name"].apply(self.clean_text)
        df["clean_category"] = df["category"].apply(self.clean_text)
        df["clean_brand"] = df["brand"].apply(self.clean_text)
        df["clean_description"] = df["description"].apply(self.clean_text)

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
        if self.ratings_df is None:
            self.load_data()

        df = self.ratings_df.copy()
        df = df.drop_duplicates(subset=["user_id", "product_id"], keep="last")
        df = df.dropna(subset=["user_id", "product_id", "rating"])
        df["rating"] = pd.to_numeric(df["rating"], errors="coerce")
        df = df.dropna(subset=["rating"])
        df["rating"] = df["rating"].clip(lower=1.0, upper=5.0)

        df["user_id"] = df["user_id"].astype(str).str.strip()
        df["product_id"] = df["product_id"].astype(str).str.strip()

        self.ratings_df = df
        return df

    def create_user_item_matrix(self, fill_value: float = 0.0) -> pd.DataFrame:
        if self.ratings_df is None:
            self.preprocess_ratings()

        self.user_item_matrix = self.ratings_df.pivot_table(
            index="user_id",
            columns="product_id",
            values="rating"
        ).fillna(fill_value)

        return self.user_item_matrix

    def get_dataset_summary(self) -> Dict[str, Any]:
        if self.cleaned_products_df is None:
            self.preprocess_products()
        if self.ratings_df is None:
            self.preprocess_ratings()

        num_users = self.ratings_df["user_id"].nunique()
        num_products = self.cleaned_products_df["product_id"].nunique()
        num_ratings = len(self.ratings_df)
        avg_rating = round(self.ratings_df["rating"].mean(), 2)

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
        if self.ratings_df is None:
            self.preprocess_ratings()

        shuffled = self.ratings_df.sample(frac=1.0, random_state=random_state)
        test_size = int(len(shuffled) * test_ratio)
        test_df = shuffled.iloc[:test_size].copy()
        train_df = shuffled.iloc[test_size:].copy()
        return train_df, test_df`
  },
  {
    path: 'src/content_based.py',
    name: 'content_based.py',
    language: 'python',
    category: 'Source Code (src/)',
    content: `"""
Content-Based Filtering Recommendation Module.

Uses TF-IDF vectorization over product features and Cosine Similarity
to recommend items with similar attributes.
"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any, Optional


class ContentBasedRecommender:
    def __init__(self, max_features: int = 5000, ngram_range: tuple = (1, 2)):
        self.vectorizer = TfidfVectorizer(
            stop_words="english",
            max_features=max_features,
            ngram_range=ngram_range
        )
        self.products_df: Optional[pd.DataFrame] = None
        self.tfidf_matrix = None
        self.cosine_sim_matrix: Optional[np.ndarray] = None
        self.product_id_to_idx: Dict[str, int] = {}
        self.idx_to_product_id: Dict[int, str] = {}

    def fit(self, products_df: pd.DataFrame) -> "ContentBasedRecommender":
        self.products_df = products_df.reset_index(drop=True).copy()
        for idx, row in self.products_df.iterrows():
            pid = str(row["product_id"])
            self.product_id_to_idx[pid] = idx
            self.idx_to_product_id[idx] = pid

        soup_texts = self.products_df["content_soup"].fillna("").tolist()
        self.tfidf_matrix = self.vectorizer.fit_transform(soup_texts)
        self.cosine_sim_matrix = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)
        return self

    def get_similar_products(self, product_id: str, top_n: int = 5) -> List[Dict[str, Any]]:
        if self.cosine_sim_matrix is None or self.products_df is None:
            raise RuntimeError("Model has not been fitted. Call .fit(products_df) first.")

        product_id = str(product_id).strip()
        if product_id not in self.product_id_to_idx:
            fallback_df = self.products_df.sort_values(by="rating", ascending=False).head(top_n)
            return [
                {
                    "product_id": str(row["product_id"]),
                    "product_name": row["product_name"],
                    "category": row["category"],
                    "brand": row["brand"],
                    "price": float(row["price"]),
                    "rating": float(row["rating"]),
                    "similarity_score": 0.0,
                    "reason": "Cold-start fallback (Highest Rated)"
                }
                for _, row in fallback_df.iterrows()
            ]

        target_idx = self.product_id_to_idx[product_id]
        sim_scores = list(enumerate(self.cosine_sim_matrix[target_idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = [item for item in sim_scores if item[0] != target_idx][:top_n]

        recommendations = []
        for idx, score in sim_scores:
            row = self.products_df.iloc[idx]
            recommendations.append({
                "product_id": str(row["product_id"]),
                "product_name": row["product_name"],
                "category": row["category"],
                "brand": row["brand"],
                "price": float(row["price"]),
                "rating": float(row["rating"]),
                "similarity_score": round(float(score), 4),
                "reason": f"Content Match ({round(float(score) * 100, 1)}% similarity)"
            })
        return recommendations

    def get_user_content_recommendations(
        self,
        user_ratings: Dict[str, float],
        top_n: int = 5,
        exclude_rated: bool = True
    ) -> List[Dict[str, Any]]:
        if not user_ratings:
            fallback_df = self.products_df.sort_values(by="rating", ascending=False).head(top_n)
            return [
                {
                    "product_id": str(row["product_id"]),
                    "product_name": row["product_name"],
                    "category": row["category"],
                    "brand": row["brand"],
                    "price": float(row["price"]),
                    "rating": float(row["rating"]),
                    "score": round(float(row["rating"]) / 5.0, 4),
                    "reason": "Popular item fallback (New User)"
                }
                for _, row in fallback_df.iterrows()
            ]

        num_products = len(self.products_df)
        aggregated_scores = np.zeros(num_products)
        total_weight = 0.0

        for pid, rating in user_ratings.items():
            if pid in self.product_id_to_idx and rating >= 3.0:
                weight = float(rating)
                idx = self.product_id_to_idx[pid]
                aggregated_scores += self.cosine_sim_matrix[idx] * weight
                total_weight += weight

        if total_weight > 0:
            aggregated_scores /= total_weight

        scored_indices = list(enumerate(aggregated_scores))
        if exclude_rated:
            rated_indices = {self.product_id_to_idx[pid] for pid in user_ratings if pid in self.product_id_to_idx}
            scored_indices = [item for item in scored_indices if item[0] not in rated_indices]

        scored_indices = sorted(scored_indices, key=lambda x: x[1], reverse=True)[:top_n]

        recommendations = []
        for idx, score in scored_indices:
            row = self.products_df.iloc[idx]
            recommendations.append({
                "product_id": str(row["product_id"]),
                "product_name": row["product_name"],
                "category": row["category"],
                "brand": row["brand"],
                "price": float(row["price"]),
                "rating": float(row["rating"]),
                "score": round(float(score), 4),
                "reason": f"Matches your interest in {row['category']}"
            })
        return recommendations`
  },
  {
    path: 'src/collaborative_filtering.py',
    name: 'collaborative_filtering.py',
    language: 'python',
    category: 'Source Code (src/)',
    content: `"""
Collaborative Filtering Recommendation Module.

Implements User-Based and Item-Based Collaborative Filtering using Cosine Similarity
over user-item rating interaction matrices.
"""

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any, Optional


class CollaborativeFilteringRecommender:
    def __init__(self, mode: str = "user"):
        self.mode = mode
        self.user_item_matrix: Optional[pd.DataFrame] = None
        self.similarity_matrix: Optional[pd.DataFrame] = None
        self.products_df: Optional[pd.DataFrame] = None
        self.user_means: Optional[pd.Series] = None

    def fit(self, ratings_df: pd.DataFrame, products_df: pd.DataFrame) -> "CollaborativeFilteringRecommender":
        self.products_df = products_df.copy()
        self.user_item_matrix = ratings_df.pivot_table(
            index="user_id",
            columns="product_id",
            values="rating"
        ).fillna(0.0)

        masked_ratings = self.user_item_matrix.replace(0, np.nan)
        self.user_means = masked_ratings.mean(axis=1).fillna(3.5)

        if self.mode == "user":
            centered_matrix = self.user_item_matrix.sub(self.user_means, axis=0).fillna(0.0)
            sim_array = cosine_similarity(centered_matrix)
            self.similarity_matrix = pd.DataFrame(
                sim_array,
                index=self.user_item_matrix.index,
                columns=self.user_item_matrix.index
            )
        else:
            item_matrix = self.user_item_matrix.T
            sim_array = cosine_similarity(item_matrix)
            self.similarity_matrix = pd.DataFrame(
                sim_array,
                index=self.user_item_matrix.columns,
                columns=self.user_item_matrix.columns
            )
        return self

    def predict_rating(self, user_id: str, product_id: str, k_neighbors: int = 5) -> float:
        if self.user_item_matrix is None or self.similarity_matrix is None:
            raise RuntimeError("Model is not fitted yet.")

        user_id = str(user_id).strip()
        product_id = str(product_id).strip()

        if user_id not in self.user_item_matrix.index:
            if product_id in self.user_item_matrix.columns:
                product_ratings = self.user_item_matrix[product_id]
                non_zero = product_ratings[product_ratings > 0]
                return float(non_zero.mean()) if len(non_zero) > 0 else 3.5
            return 3.5

        if product_id not in self.user_item_matrix.columns:
            return float(self.user_means.get(user_id, 3.5))

        user_mean = float(self.user_means.get(user_id, 3.5))

        if self.mode == "user":
            product_ratings = self.user_item_matrix[product_id]
            users_who_rated = product_ratings[product_ratings > 0].index
            users_who_rated = [u for u in users_who_rated if u != user_id]

            if not users_who_rated:
                return user_mean

            sims = self.similarity_matrix.loc[user_id, users_who_rated]
            positive_sims = sims[sims > 0].sort_values(ascending=False).head(k_neighbors)
            if positive_sims.empty:
                return user_mean

            numerator = 0.0
            denominator = 0.0
            for other_user, sim_val in positive_sims.items():
                other_rating = self.user_item_matrix.loc[other_user, product_id]
                other_mean = self.user_means.get(other_user, 3.5)
                numerator += sim_val * (other_rating - other_mean)
                denominator += abs(sim_val)

            predicted_diff = (numerator / denominator) if denominator > 0 else 0.0
            return float(np.clip(user_mean + predicted_diff, 1.0, 5.0))
        else:
            user_ratings = self.user_item_matrix.loc[user_id]
            rated_items = user_ratings[user_ratings > 0].index
            rated_items = [item for item in rated_items if item != product_id]

            if not rated_items:
                return user_mean

            sims = self.similarity_matrix.loc[product_id, rated_items]
            positive_sims = sims[sims > 0].sort_values(ascending=False).head(k_neighbors)
            if positive_sims.empty:
                return user_mean

            numerator = sum(positive_sims[item] * user_ratings[item] for item in positive_sims.index)
            denominator = sum(abs(positive_sims[item]) for item in positive_sims.index)
            predicted = (numerator / denominator) if denominator > 0 else user_mean
            return float(np.clip(predicted, 1.0, 5.0))

    def recommend(self, user_id: str, top_n: int = 5, exclude_rated: bool = true) -> List[Dict[str, Any]]:
        user_id = str(user_id).strip()
        if user_id not in self.user_item_matrix.index:
            return self._cold_start_recommendations(top_n)

        user_interactions = self.user_item_matrix.loc[user_id]
        already_rated = set(user_interactions[user_interactions > 0].index) if exclude_rated else set()
        candidate_products = [pid for pid in self.user_item_matrix.columns if pid not in already_rated]

        if not candidate_products:
            return self._cold_start_recommendations(top_n)

        predictions = [(pid, self.predict_rating(user_id, pid)) for pid in candidate_products]
        predictions.sort(key=lambda x: x[1], reverse=True)
        top_predictions = predictions[:top_n]

        recommendations = []
        for pid, score in top_predictions:
            prod_row = self.products_df[self.products_df["product_id"] == pid]
            if not prod_row.empty:
                row = prod_row.iloc[0]
                recommendations.append({
                    "product_id": pid,
                    "product_name": row["product_name"],
                    "category": row["category"],
                    "brand": row["brand"],
                    "price": float(row["price"]),
                    "rating": float(row["rating"]),
                    "predicted_rating": round(score, 2),
                    "score": round(score / 5.0, 4),
                    "reason": f"Collaborative score based on {self.mode}-similarity (Est. {round(score, 1)}★)"
                })
        return recommendations

    def _cold_start_recommendations(self, top_n: int = 5) -> List[Dict[str, Any]]:
        top_df = self.products_df.sort_values(by="rating", ascending=False).head(top_n)
        return [
            {
                "product_id": str(row["product_id"]),
                "product_name": row["product_name"],
                "category": row["category"],
                "brand": row["brand"],
                "price": float(row["price"]),
                "rating": float(row["rating"]),
                "predicted_rating": float(row["rating"]),
                "score": round(float(row["rating"]) / 5.0, 4),
                "reason": "Popular fallback (Cold Start: User has no prior ratings)"
            }
            for _, row in top_df.iterrows()
        ]`
  },
  {
    path: 'src/hybrid_recommender.py',
    name: 'hybrid_recommender.py',
    language: 'python',
    category: 'Source Code (src/)',
    content: `"""
Hybrid Recommendation Engine Module.

Combines Content-Based Filtering and Collaborative Filtering using a
weighted linear ensemble approach:

    Hybrid_Score = (alpha * Collaborative_Score) + ((1 - alpha) * Content_Score)
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
from src.content_based import ContentBasedRecommender
from src.collaborative_filtering import CollaborativeFilteringRecommender


class HybridRecommender:
    def __init__(
        self,
        content_model: Optional[ContentBasedRecommender] = None,
        collab_model: Optional[CollaborativeFilteringRecommender] = None,
        default_alpha: float = 0.5
    ):
        self.content_model = content_model or ContentBasedRecommender()
        self.collab_model = collab_model or CollaborativeFilteringRecommender(mode="user")
        self.default_alpha = np.clip(default_alpha, 0.0, 1.0)
        self.products_df: Optional[pd.DataFrame] = None
        self.ratings_df: Optional[pd.DataFrame] = None

    def fit(self, products_df: pd.DataFrame, ratings_df: pd.DataFrame) -> "HybridRecommender":
        self.products_df = products_df.copy()
        self.ratings_df = ratings_df.copy()
        self.content_model.fit(self.products_df)
        self.collab_model.fit(self.ratings_df, self.products_df)
        return self

    def recommend(
        self,
        user_id: str,
        top_n: int = 5,
        alpha: Optional[float] = None,
        exclude_rated: bool = True
    ) -> List[Dict[str, Any]]:
        user_id = str(user_id).strip()
        weight_collab = self.default_alpha if alpha is None else np.clip(alpha, 0.0, 1.0)
        weight_content = 1.0 - weight_collab

        user_history = self.ratings_df[self.ratings_df["user_id"] == user_id]
        user_ratings_dict = dict(zip(user_history["product_id"], user_history["rating"]))
        rated_product_ids = set(user_ratings_dict.keys())

        if len(user_ratings_dict) == 0:
            top_fallback = self.products_df.sort_values(by="rating", ascending=False).head(top_n)
            return [
                {
                    "product_id": str(row["product_id"]),
                    "product_name": row["product_name"],
                    "category": row["category"],
                    "brand": row["brand"],
                    "price": float(row["price"]),
                    "rating": float(row["rating"]),
                    "collab_score": 0.0,
                    "content_score": round(float(row["rating"]) / 5.0, 4),
                    "hybrid_score": round(float(row["rating"]) / 5.0, 4),
                    "recommendation_type": "Cold-Start Fallback (Top Rated)",
                    "reason": "Top trending item recommended for new visitors"
                }
                for _, row in top_fallback.iterrows()
            ]

        all_product_ids = self.products_df["product_id"].astype(str).tolist()
        candidates = [pid for pid in all_product_ids if pid not in rated_product_ids] if exclude_rated else all_product_ids

        content_recs = self.content_model.get_user_content_recommendations(
            user_ratings=user_ratings_dict,
            top_n=len(all_product_ids),
            exclude_rated=exclude_rated
        )
        content_score_map = {rec["product_id"]: rec["score"] for rec in content_recs}

        hybrid_candidates = []
        for pid in candidates:
            pred_rating = self.collab_model.predict_rating(user_id, pid)
            cf_score = pred_rating / 5.0
            c_score = content_score_map.get(pid, 0.0)
            h_score = (weight_collab * cf_score) + (weight_content * c_score)

            prod_row = self.products_df[self.products_df["product_id"] == pid].iloc[0]
            hybrid_candidates.append({
                "product_id": pid,
                "product_name": prod_row["product_name"],
                "category": prod_row["category"],
                "brand": prod_row["brand"],
                "price": float(prod_row["price"]),
                "rating": float(prod_row["rating"]),
                "collab_score": round(cf_score, 4),
                "content_score": round(c_score, 4),
                "hybrid_score": round(h_score, 4),
                "recommendation_type": "Hybrid (Collab + Content)",
                "reason": (
                    f"Weighted Blend ({int(weight_collab*100)}% Collab [{(cf_score*5.0):.1f}★] + "
                    f"{int(weight_content*100)}% Content [{c_score*100:.0f}%])"
                )
            })

        hybrid_candidates.sort(key=lambda x: x["hybrid_score"], reverse=True)
        return hybrid_candidates[:top_n]`
  },
  {
    path: 'src/evaluation.py',
    name: 'evaluation.py',
    language: 'python',
    category: 'Source Code (src/)',
    content: `"""
Model Evaluation Module for Product Recommendation System.

Calculates Precision@K, Recall@K, F1-Score@K, and Rating RMSE.
"""

import numpy as np
import pandas as pd
from typing import List, Tuple
from src.content_based import ContentBasedRecommender
from src.collaborative_filtering import CollaborativeFilteringRecommender
from src.hybrid_recommender import HybridRecommender


class RecommendationEvaluator:
    def __init__(self, relevance_threshold: float = 4.0):
        self.relevance_threshold = relevance_threshold

    def calculate_precision_recall_at_k(
        self,
        recommended_pids: List[str],
        relevant_pids: List[str],
        k: int = 5
    ) -> Tuple[float, float, float]:
        top_k = recommended_pids[:k]
        if not top_k or not relevant_pids:
            return 0.0, 0.0, 0.0

        hits = sum(1 for pid in top_k if pid in relevant_pids)
        precision = hits / len(top_k)
        recall = hits / len(relevant_pids)
        f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0
        return precision, recall, f1

    def evaluate_rating_rmse(self, collab_model: CollaborativeFilteringRecommender, test_df: pd.DataFrame) -> float:
        errors = []
        for _, row in test_df.iterrows():
            uid = str(row["user_id"])
            pid = str(row["product_id"])
            actual = float(row["rating"])
            predicted = collab_model.predict_rating(uid, pid)
            errors.append((actual - predicted) ** 2)
        return float(np.sqrt(np.mean(errors))) if errors else 0.0

    def benchmark_models(self, train_df: pd.DataFrame, test_df: pd.DataFrame, products_df: pd.DataFrame, k: int = 5) -> pd.DataFrame:
        cb = ContentBasedRecommender().fit(products_df)
        cf = CollaborativeFilteringRecommender(mode="user").fit(train_df, products_df)
        hybrid = HybridRecommender(cb, cf, default_alpha=0.5).fit(products_df, train_df)

        test_users = test_df[test_df["rating"] >= self.relevance_threshold]["user_id"].unique()
        metrics = {
            "Content-Based": {"precision": [], "recall": [], "f1": []},
            "Collaborative Filtering": {"precision": [], "recall": [], "f1": []},
            "Hybrid Recommendation": {"precision": [], "recall": [], "f1": []}
        }

        for uid in test_users:
            actual_relevant = test_df[(test_df["user_id"] == uid) & (test_df["rating"] >= self.relevance_threshold)]["product_id"].astype(str).tolist()
            user_train_history = train_df[train_df["user_id"] == uid]
            user_train_dict = dict(zip(user_train_history["product_id"], user_train_history["rating"]))

            cb_recs = [r["product_id"] for r in cb.get_user_content_recommendations(user_train_dict, top_n=k)]
            p_cb, r_cb, f_cb = self.calculate_precision_recall_at_k(cb_recs, actual_relevant, k=k)
            metrics["Content-Based"]["precision"].append(p_cb)
            metrics["Content-Based"]["recall"].append(r_cb)
            metrics["Content-Based"]["f1"].append(f_cb)

            cf_recs = [r["product_id"] for r in cf.recommend(uid, top_n=k)]
            p_cf, r_cf, f_cf = self.calculate_precision_recall_at_k(cf_recs, actual_relevant, k=k)
            metrics["Collaborative Filtering"]["precision"].append(p_cf)
            metrics["Collaborative Filtering"]["recall"].append(r_cf)
            metrics["Collaborative Filtering"]["f1"].append(f_cf)

            h_recs = [r["product_id"] for r in hybrid.recommend(uid, top_n=k)]
            p_h, r_h, f_h = self.calculate_precision_recall_at_k(h_recs, actual_relevant, k=k)
            metrics["Hybrid Recommendation"]["precision"].append(p_h)
            metrics["Hybrid Recommendation"]["recall"].append(r_h)
            metrics["Hybrid Recommendation"]["f1"].append(f_h)

        rmse_val = self.evaluate_rating_rmse(cf, test_df)
        comparison_data = []
        for model_name, score_dict in metrics.items():
            avg_p = np.mean(score_dict["precision"]) if score_dict["precision"] else 0.0
            avg_r = np.mean(score_dict["recall"]) if score_dict["recall"] else 0.0
            avg_f = np.mean(score_dict["f1"]) if score_dict["f1"] else 0.0
            comparison_data.append({
                "Model": model_name,
                f"Precision@{k}": round(float(avg_p), 4),
                f"Recall@{k}": round(float(avg_r), 4),
                f"F1-Score@{k}": round(float(avg_f), 4),
                "RMSE (Rating Error)": round(rmse_val, 4) if "Collaborative" in model_name or "Hybrid" in model_name else "N/A",
                "Key Advantage": (
                    "Overcomes cold-start items; leverages item text features" if "Content" in model_name else
                    "Discovers serendipitous connections without relying on item tags" if "Collaborative" in model_name else
                    "Best overall balance; mitigating cold-start & sparsity weaknesses"
                )
            })
        return pd.DataFrame(comparison_data)`
  },
  {
    path: 'src/utils.py',
    name: 'utils.py',
    language: 'python',
    category: 'Source Code (src/)',
    content: `"""
Utility Functions for Product Recommendation System.
Generates Matplotlib and Seaborn charts to outputs/plots/
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from typing import List


def setup_directories(output_dir: str = "outputs/plots"):
    os.makedirs(output_dir, exist_ok=True)


def generate_eda_visualizations(products_df: pd.DataFrame, ratings_df: pd.DataFrame, output_dir: str = "outputs/plots") -> List[str]:
    setup_directories(output_dir)
    saved_files = []
    sns.set_theme(style="whitegrid", palette="muted")

    # 1. Rating Distribution
    plt.figure(figsize=(8, 5))
    ax = sns.countplot(data=ratings_df, x="rating", palette="Blues_d")
    plt.title("User Rating Distribution (1 to 5 Stars)", fontsize=14, fontweight="bold")
    plt.tight_layout()
    p1 = os.path.join(output_dir, "rating_distribution.png")
    plt.savefig(p1, dpi=300)
    plt.close()
    saved_files.append(p1)

    # 2. Most Rated Products
    plt.figure(figsize=(10, 6))
    top_pids = ratings_df["product_id"].value_counts().head(8).reset_index()
    top_pids.columns = ["product_id", "rating_count"]
    merged_top = top_pids.merge(products_df[["product_id", "product_name"]], on="product_id", how="left")
    merged_top["short_name"] = merged_top["product_name"].str[:25] + "..."
    sns.barplot(data=merged_top, y="short_name", x="rating_count", palette="viridis")
    plt.title("Top Most-Rated Products in Catalog", fontsize=14, fontweight="bold")
    plt.tight_layout()
    p2 = os.path.join(output_dir, "most_rated_products.png")
    plt.savefig(p2, dpi=300)
    plt.close()
    saved_files.append(p2)

    return saved_files`
  },
  {
    path: 'app/app.py',
    name: 'app.py',
    language: 'python',
    category: 'Web App (Streamlit)',
    content: `"""
Streamlit Web Application for Product Recommendation System.

Run with:
    streamlit run app/app.py
"""

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import streamlit as st
import pandas as pd
import numpy as np

from src.data_preprocessing import DataPreprocessor
from src.content_based import ContentBasedRecommender
from src.collaborative_filtering import CollaborativeFilteringRecommender
from src.hybrid_recommender import HybridRecommender
from src.evaluation import RecommendationEvaluator

st.set_page_config(page_title="Product Recommendation Engine", page_icon="🛍️", layout="wide")

@st.cache_resource
def load_and_initialize_system():
    preprocessor = DataPreprocessor()
    products_raw, ratings_raw = preprocessor.load_data()
    clean_products = preprocessor.preprocess_products()
    clean_ratings = preprocessor.preprocess_ratings()
    summary = preprocessor.get_dataset_summary()

    cb_model = ContentBasedRecommender().fit(clean_products)
    cf_model = CollaborativeFilteringRecommender(mode="user").fit(clean_ratings, clean_products)
    hybrid_model = HybridRecommender(cb_model, cf_model, default_alpha=0.5).fit(clean_products, clean_ratings)
    evaluator = RecommendationEvaluator()

    return {
        "products_df": clean_products,
        "ratings_df": clean_ratings,
        "summary": summary,
        "cb_model": cb_model,
        "cf_model": cf_model,
        "hybrid_model": hybrid_model,
        "evaluator": evaluator
    }

def main():
    system = load_and_initialize_system()
    st.title("🛍️ Product Recommendation System (ML Mini Project)")
    st.write("Explore Content-Based, Collaborative Filtering, and Weighted Hybrid Recommendations.")

if __name__ == "__main__":
    main()`
  },
  {
    path: 'tests/test_recommendations.py',
    name: 'test_recommendations.py',
    language: 'python',
    category: 'Tests (PyTest)',
    content: `"""
Unit Tests for Product Recommendation System.
Run with: pytest tests/test_recommendations.py -v
"""

import os
import sys
import pytest
import pandas as pd
import numpy as np

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.data_preprocessing import DataPreprocessor
from src.content_based import ContentBasedRecommender
from src.collaborative_filtering import CollaborativeFilteringRecommender
from src.hybrid_recommender import HybridRecommender

@pytest.fixture(scope="module")
def prepared_data():
    preprocessor = DataPreprocessor()
    preprocessor.load_data()
    return preprocessor.preprocess_products(), preprocessor.preprocess_ratings()

def test_dataset_loading(prepared_data):
    p, r = prepared_data
    assert not p.empty and not r.empty

def test_content_recommendations(prepared_data):
    p, _ = prepared_data
    cb = ContentBasedRecommender().fit(p)
    recs = cb.get_similar_products("P101", top_n=5)
    assert len(recs) == 5

def test_collaborative_recommendations(prepared_data):
    p, r = prepared_data
    cf = CollaborativeFilteringRecommender().fit(r, p)
    recs = cf.recommend("U1001", top_n=5)
    assert len(recs) == 5

def test_hybrid_recommendations(prepared_data):
    p, r = prepared_data
    h = HybridRecommender().fit(p, r)
    recs = h.recommend("U1002", top_n=5, alpha=0.5)
    assert len(recs) == 5`
  },
  {
    path: 'requirements.txt',
    name: 'requirements.txt',
    language: 'text',
    category: 'Configuration',
    content: `pandas>=2.0.0
numpy>=1.24.0
scikit-learn>=1.3.0
matplotlib>=3.7.0
seaborn>=0.12.0
streamlit>=1.28.0
pytest>=7.4.0`
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    category: 'Documentation',
    content: `# 🛍️ Product Recommendation System Using Machine Learning

An end-to-end Machine Learning recommendation system implementing Content-Based Filtering, Collaborative Filtering, and Weighted Hybrid Ensembles with Streamlit UI and offline evaluation metrics.

## Installation & Running
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/Product-Recommendation-System.git
cd Product-Recommendation-System
python -m venv venv
source venv/bin/activate # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
streamlit run app/app.py
\`\`\``
  },
  {
    path: 'docs/project-documentation.md',
    name: 'project-documentation.md',
    language: 'markdown',
    category: 'Documentation',
    content: `# Product Recommendation System Using Machine Learning
Formal B.Tech Project Report & Technical Specifications covering Abstract, Architecture, Mathematical formulations, Preprocessing, Evaluation, and Conclusions.`
  }
];
