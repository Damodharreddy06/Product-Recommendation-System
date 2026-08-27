"""
Content-Based Filtering Recommendation Module.

Uses TF-IDF (Term Frequency-Inverse Document Frequency) vectorization
over product features (name, category, brand, description) and computes
Cosine Similarity to recommend items similar in attributes.
"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any, Optional


class ContentBasedRecommender:
    """
    Computes item-to-item similarity using text feature vectors and Cosine Similarity.
    """

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
        """
        Fits the TF-IDF vectorizer on the product content soup and computes
        the pairwise cosine similarity matrix.
        
        Args:
            products_df: Cleaned DataFrame with 'product_id', 'content_soup', and metadata.
        """
        self.products_df = products_df.reset_index(drop=True).copy()
        
        # Mapping helpers
        for idx, row in self.products_df.iterrows():
            pid = str(row["product_id"])
            self.product_id_to_idx[pid] = idx
            self.idx_to_product_id[idx] = pid

        # Generate TF-IDF feature matrix
        soup_texts = self.products_df["content_soup"].fillna("").tolist()
        self.tfidf_matrix = self.vectorizer.fit_transform(soup_texts)

        # Compute Pairwise Cosine Similarity: Shape (N, N)
        self.cosine_sim_matrix = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)

        return self

    def get_similar_products(self, product_id: str, top_n: int = 5) -> List[Dict[str, Any]]:
        """
        Returns top N most similar products to the given product_id based on content.
        
        Args:
            product_id: Target product ID string.
            top_n: Number of recommendations to return.
            
        Returns:
            List of dicts containing recommended product metadata and similarity scores.
        """
        if self.cosine_sim_matrix is None or self.products_df is None:
            raise RuntimeError("Model has not been fitted. Call .fit(products_df) first.")

        product_id = str(product_id).strip()

        if product_id not in self.product_id_to_idx:
            # Fallback for cold-start / unknown product: Return highest-rated products in dataset
            print(f"[Warning] Product ID '{product_id}' not found. Falling back to top-rated items.")
            fallback_df = self.products_df.sort_values(by="rating", ascending=False).head(top_n)
            recommendations = []
            for _, row in fallback_df.iterrows():
                recommendations.append({
                    "product_id": str(row["product_id"]),
                    "product_name": row["product_name"],
                    "category": row["category"],
                    "brand": row["brand"],
                    "price": float(row["price"]),
                    "rating": float(row["rating"]),
                    "similarity_score": 0.0,
                    "reason": "Cold-start fallback (Highest Rated)"
                })
            return recommendations

        target_idx = self.product_id_to_idx[product_id]
        
        # Get pairwise similarity scores for the target product
        sim_scores = list(enumerate(self.cosine_sim_matrix[target_idx]))

        # Sort items by similarity score descending (exclude the product itself at index target_idx)
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
        """
        Generates content-based recommendations for a user based on an aggregation
        of their positively rated products.
        
        Args:
            user_ratings: Dict mapping product_id -> user_rating (e.g. {'P101': 5.0, 'P103': 4.5})
            top_n: Number of recommendations
            exclude_rated: Whether to filter out products the user has already rated
        """
        if not user_ratings:
            # Cold-start fallback for users with 0 ratings
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

        # Aggregate weighted profile score across all items in catalog
        num_products = len(self.products_df)
        aggregated_scores = np.zeros(num_products)
        total_weight = 0.0

        for pid, rating in user_ratings.items():
            if pid in self.product_id_to_idx and rating >= 3.0:  # consider positive interactions
                weight = float(rating)
                idx = self.product_id_to_idx[pid]
                aggregated_scores += self.cosine_sim_matrix[idx] * weight
                total_weight += weight

        if total_weight > 0:
            aggregated_scores /= total_weight

        # Filter and rank
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

        return recommendations
