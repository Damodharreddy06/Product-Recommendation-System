"""
Collaborative Filtering Recommendation Module.

Implements:
1. User-Based Collaborative Filtering (UBCF): Recommends products liked by users with similar rating histories.
2. Item-Based Collaborative Filtering (IBCF): Recommends products that co-occur with high ratings by similar users.
3. Rating Prediction using Cosine Similarity on User-Item interaction matrix.
"""

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any, Optional, Tuple


class CollaborativeFilteringRecommender:
    """
    Implements Memory-Based Collaborative Filtering using Cosine Similarity
    over user-item rating interaction matrices.
    """

    def __init__(self, mode: str = "user"):
        """
        Args:
            mode: 'user' for User-Based CF or 'item' for Item-Based CF.
        """
        self.mode = mode
        self.user_item_matrix: Optional[pd.DataFrame] = None
        self.similarity_matrix: Optional[pd.DataFrame] = None
        self.products_df: Optional[pd.DataFrame] = None
        self.user_means: Optional[pd.Series] = None

    def fit(self, ratings_df: pd.DataFrame, products_df: pd.DataFrame) -> "CollaborativeFilteringRecommender":
        """
        Constructs user-item matrix and computes pairwise cosine similarity.
        """
        self.products_df = products_df.copy()
        
        # Build pivot table with 0 for unobserved ratings
        self.user_item_matrix = ratings_df.pivot_table(
            index="user_id",
            columns="product_id",
            values="rating"
        ).fillna(0.0)

        # Compute mean rating per user (ignoring 0 values)
        masked_ratings = self.user_item_matrix.replace(0, np.nan)
        self.user_means = masked_ratings.mean(axis=1).fillna(3.5)

        if self.mode == "user":
            # User-User Cosine Similarity: Shape (Num_Users, Num_Users)
            # Mean-centered matrix for Pearson-like cosine similarity
            centered_matrix = self.user_item_matrix.sub(self.user_means, axis=0).fillna(0.0)
            sim_array = cosine_similarity(centered_matrix)
            self.similarity_matrix = pd.DataFrame(
                sim_array,
                index=self.user_item_matrix.index,
                columns=self.user_item_matrix.index
            )
        else:
            # Item-Item Cosine Similarity: Shape (Num_Items, Num_Items)
            item_matrix = self.user_item_matrix.T
            sim_array = cosine_similarity(item_matrix)
            self.similarity_matrix = pd.DataFrame(
                sim_array,
                index=self.user_item_matrix.columns,
                columns=self.user_item_matrix.columns
            )

        return self

    def predict_rating(self, user_id: str, product_id: str, k_neighbors: int = 5) -> float:
        """
        Predicts the rating a user would give to a specific product using weighted neighbor ratings.
        """
        if self.user_item_matrix is None or self.similarity_matrix is None:
            raise RuntimeError("Model is not fitted yet.")

        user_id = str(user_id).strip()
        product_id = str(product_id).strip()

        if user_id not in self.user_item_matrix.index:
            # Cold start user: return global mean or product mean
            if product_id in self.user_item_matrix.columns:
                product_ratings = self.user_item_matrix[product_id]
                non_zero = product_ratings[product_ratings > 0]
                return float(non_zero.mean()) if len(non_zero) > 0 else 3.5
            return 3.5

        if product_id not in self.user_item_matrix.columns:
            return float(self.user_means.get(user_id, 3.5))

        user_mean = float(self.user_means.get(user_id, 3.5))

        if self.mode == "user":
            # Find users who rated this product
            product_ratings = self.user_item_matrix[product_id]
            users_who_rated = product_ratings[product_ratings > 0].index
            users_who_rated = [u for u in users_who_rated if u != user_id]

            if not users_who_rated:
                return user_mean

            # Similarity between target user and users who rated this product
            sims = self.similarity_matrix.loc[user_id, users_who_rated]
            
            # Pick top K positive neighbors
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
            predicted = user_mean + predicted_diff
            return float(np.clip(predicted, 1.0, 5.0))
        else:
            # Item-based prediction
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

    def recommend(
        self,
        user_id: str,
        top_n: int = 5,
        exclude_rated: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Generates top N product recommendations for a given user.
        """
        if self.user_item_matrix is None:
            raise RuntimeError("Model is not fitted.")

        user_id = str(user_id).strip()

        # Handle Cold Start for unseen user
        if user_id not in self.user_item_matrix.index:
            return self._cold_start_recommendations(top_n)

        user_interactions = self.user_item_matrix.loc[user_id]
        already_rated = set(user_interactions[user_interactions > 0].index) if exclude_rated else set()

        candidate_products = [pid for pid in self.user_item_matrix.columns if pid not in already_rated]

        if not candidate_products:
            return self._cold_start_recommendations(top_n)

        predictions = []
        for pid in candidate_products:
            score = self.predict_rating(user_id, pid)
            predictions.append((pid, score))

        # Sort descending by predicted score
        predictions.sort(key=lambda x: x[1], reverse=True)
        top_predictions = predictions[:top_n]

        # Format output with product catalog metadata
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
                    "score": round(score / 5.0, 4),  # normalized 0-1
                    "reason": f"Collaborative score based on {self.mode}-similarity (Est. {round(score, 1)}★)"
                })

        return recommendations

    def _cold_start_recommendations(self, top_n: int = 5) -> List[Dict[str, Any]]:
        """
        Fallback logic for cold-start users: Returns the top products ranked by catalog rating and popularity.
        """
        top_df = self.products_df.sort_values(by="rating", ascending=False).head(top_n)
        recommendations = []
        for _, row in top_df.iterrows():
            recommendations.append({
                "product_id": str(row["product_id"]),
                "product_name": row["product_name"],
                "category": row["category"],
                "brand": row["brand"],
                "price": float(row["price"]),
                "rating": float(row["rating"]),
                "predicted_rating": float(row["rating"]),
                "score": round(float(row["rating"]) / 5.0, 4),
                "reason": "Popular fallback (Cold Start: User has no prior ratings)"
            })
        return recommendations
