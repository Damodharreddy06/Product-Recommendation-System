"""
Model Evaluation Module for Product Recommendation System.

Calculates key offline evaluation metrics:
1. Precision@K: Fraction of top-K recommendations that are relevant to the user.
2. Recall@K: Fraction of relevant items successfully recommended in top-K.
3. F1-Score@K: Harmonic mean of Precision@K and Recall@K.
4. RMSE (Root Mean Squared Error): Evaluates rating prediction accuracy.
5. Benchmark Comparison across Content-Based, Collaborative Filtering, and Hybrid models.
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple
from src.content_based import ContentBasedRecommender
from src.collaborative_filtering import CollaborativeFilteringRecommender
from src.hybrid_recommender import HybridRecommender


class RecommendationEvaluator:
    """
    Evaluates recommender systems on held-out test ratings.
    """

    def __init__(self, relevance_threshold: float = 4.0):
        """
        Args:
            relevance_threshold: Rating threshold (>= 4.0) to qualify an interaction as 'relevant'.
        """
        self.relevance_threshold = relevance_threshold

    def calculate_precision_recall_at_k(
        self,
        recommended_pids: List[str],
        relevant_pids: List[str],
        k: int = 5
    ) -> Tuple[float, float, float]:
        """
        Computes Precision@K, Recall@K, and F1@K for a single user.
        """
        top_k = recommended_pids[:k]
        if not top_k or not relevant_pids:
            return 0.0, 0.0, 0.0

        hits = sum(1 for pid in top_k if pid in relevant_pids)
        precision = hits / len(top_k)
        recall = hits / len(relevant_pids)
        f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0

        return precision, recall, f1

    def evaluate_rating_rmse(
        self,
        collab_model: CollaborativeFilteringRecommender,
        test_df: pd.DataFrame
    ) -> float:
        """
        Calculates Root Mean Squared Error (RMSE) for rating predictions on test interactions.
        """
        errors = []
        for _, row in test_df.iterrows():
            uid = str(row["user_id"])
            pid = str(row["product_id"])
            actual = float(row["rating"])
            predicted = collab_model.predict_rating(uid, pid)
            errors.append((actual - predicted) ** 2)

        return float(np.sqrt(np.mean(errors))) if errors else 0.0

    def benchmark_models(
        self,
        train_df: pd.DataFrame,
        test_df: pd.DataFrame,
        products_df: pd.DataFrame,
        k: int = 5
    ) -> pd.DataFrame:
        """
        Runs standardized comparison across Content-Based, Collaborative Filtering, and Hybrid models.
        
        Returns:
            pd.DataFrame containing Precision@K, Recall@K, F1@K, and description for each model.
        """
        # Initialize and fit models on training data
        cb = ContentBasedRecommender().fit(products_df)
        cf = CollaborativeFilteringRecommender(mode="user").fit(train_df, products_df)
        hybrid = HybridRecommender(cb, cf, default_alpha=0.5).fit(products_df, train_df)

        # Find test users with at least one positive rating
        test_users = test_df[test_df["rating"] >= self.relevance_threshold]["user_id"].unique()

        metrics = {
            "Content-Based": {"precision": [], "recall": [], "f1": []},
            "Collaborative Filtering": {"precision": [], "recall": [], "f1": []},
            "Hybrid Recommendation": {"precision": [], "recall": [], "f1": []}
        }

        for uid in test_users:
            actual_relevant = test_df[
                (test_df["user_id"] == uid) & (test_df["rating"] >= self.relevance_threshold)
            ]["product_id"].astype(str).tolist()

            user_train_history = train_df[train_df["user_id"] == uid]
            user_train_dict = dict(zip(user_train_history["product_id"], user_train_history["rating"]))

            # 1. Content recommendations
            cb_recs = [r["product_id"] for r in cb.get_user_content_recommendations(user_train_dict, top_n=k)]
            p_cb, r_cb, f_cb = self.calculate_precision_recall_at_k(cb_recs, actual_relevant, k=k)
            metrics["Content-Based"]["precision"].append(p_cb)
            metrics["Content-Based"]["recall"].append(r_cb)
            metrics["Content-Based"]["f1"].append(f_cb)

            # 2. Collaborative recommendations
            cf_recs = [r["product_id"] for r in cf.recommend(uid, top_n=k)]
            p_cf, r_cf, f_cf = self.calculate_precision_recall_at_k(cf_recs, actual_relevant, k=k)
            metrics["Collaborative Filtering"]["precision"].append(p_cf)
            metrics["Collaborative Filtering"]["recall"].append(r_cf)
            metrics["Collaborative Filtering"]["f1"].append(f_cf)

            # 3. Hybrid recommendations
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

        return pd.DataFrame(comparison_data)
