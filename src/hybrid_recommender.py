"""
Hybrid Recommendation Engine Module.

Combines Content-Based Filtering and Collaborative Filtering using a
weighted linear ensemble approach:

    Hybrid_Score = (alpha * Collaborative_Score) + ((1 - alpha) * Content_Score)

Features:
- Configurable weighting parameter (alpha: 0.0 to 1.0)
- Cold-start fallback mechanism (adapts weights dynamically when user history is sparse)
- Explanations for why each product was recommended
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
from src.content_based import ContentBasedRecommender
from src.collaborative_filtering import CollaborativeFilteringRecommender


class HybridRecommender:
    """
    Weighted hybrid recommender system uniting Content-Based and Collaborative models.
    """

    def __init__(
        self,
        content_model: Optional[ContentBasedRecommender] = None,
        collab_model: Optional[CollaborativeFilteringRecommender] = None,
        default_alpha: float = 0.5
    ):
        """
        Args:
            content_model: Trained ContentBasedRecommender instance.
            collab_model: Trained CollaborativeFilteringRecommender instance.
            default_alpha: Weight for collaborative filtering (0.0 <= alpha <= 1.0).
                           Content weight becomes (1.0 - default_alpha).
        """
        self.content_model = content_model or ContentBasedRecommender()
        self.collab_model = collab_model or CollaborativeFilteringRecommender(mode="user")
        self.default_alpha = np.clip(default_alpha, 0.0, 1.0)
        self.products_df: Optional[pd.DataFrame] = None
        self.ratings_df: Optional[pd.DataFrame] = None

    def fit(self, products_df: pd.DataFrame, ratings_df: pd.DataFrame) -> "HybridRecommender":
        """
        Fits both underlying recommendation models on the provided datasets.
        """
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
        """
        Generates personalized hybrid recommendations for a given user ID.

        Args:
            user_id: User identifier string.
            top_n: Number of recommendations to generate (e.g. 5, 10, 15).
            alpha: Custom collaborative weight (default uses self.default_alpha).
            exclude_rated: Exclude products already rated/purchased by this user.
        """
        if self.products_df is None or self.ratings_df is None:
            raise RuntimeError("HybridRecommender is not fitted yet.")

        user_id = str(user_id).strip()
        weight_collab = self.default_alpha if alpha is None else np.clip(alpha, 0.0, 1.0)
        weight_content = 1.0 - weight_collab

        # 1. Fetch user rating history
        user_history = self.ratings_df[self.ratings_df["user_id"] == user_id]
        user_ratings_dict = dict(zip(user_history["product_id"], user_history["rating"]))
        rated_product_ids = set(user_ratings_dict.keys())

        # Check for Cold Start User (0 ratings)
        if len(user_ratings_dict) == 0:
            print(f"[HybridRecommender] Cold-start user '{user_id}' detected. Using Popularity/Content fallback.")
            top_fallback = self.products_df.sort_values(by="rating", ascending=False).head(top_n)
            results = []
            for _, row in top_fallback.iterrows():
                results.append({
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
                })
            return results

        # 2. Candidate generation
        all_product_ids = self.products_df["product_id"].astype(str).tolist()
        candidates = [pid for pid in all_product_ids if pid not in rated_product_ids] if exclude_rated else all_product_ids

        # 3. Content-Based Scoring for all candidates
        content_recs = self.content_model.get_user_content_recommendations(
            user_ratings=user_ratings_dict,
            top_n=len(all_product_ids),
            exclude_rated=exclude_rated
        )
        content_score_map = {rec["product_id"]: rec["score"] for rec in content_recs}

        # 4. Collaborative Filtering Scoring for all candidates
        collab_scores_map = {}
        for pid in candidates:
            # Predict rating on 1-5 scale and normalize to 0-1
            pred_rating = self.collab_model.predict_rating(user_id, pid)
            collab_scores_map[pid] = pred_rating / 5.0

        # 5. Hybrid Weighted Blending
        hybrid_candidates = []
        for pid in candidates:
            c_score = content_score_map.get(pid, 0.0)
            cf_score = collab_scores_map.get(pid, 0.0)

            # Linear ensemble formula
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

        # 6. Rank by hybrid score descending and pick Top N
        hybrid_candidates.sort(key=lambda x: x["hybrid_score"], reverse=True)
        return hybrid_candidates[:top_n]
