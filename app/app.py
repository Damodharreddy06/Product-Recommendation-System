"""
Streamlit Web Application for Product Recommendation System.

Run with:
    streamlit run app/app.py
"""

import sys
import os

# Add root directory to path for module imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from src.data_preprocessing import DataPreprocessor
from src.content_based import ContentBasedRecommender
from src.collaborative_filtering import CollaborativeFilteringRecommender
from src.hybrid_recommender import HybridRecommender
from src.evaluation import RecommendationEvaluator
from src.utils import generate_eda_visualizations


# --- Page Configuration ---
st.set_page_config(
    page_title="Product Recommendation Engine | ML Mini Project",
    page_icon="🛍️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-title {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        font-size: 1.05rem;
        color: #64748b;
        margin-bottom: 1.5rem;
    }
    .metric-box {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
    }
    .product-card {
        background-color: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1.2rem;
        margin-bottom: 1rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 9999px;
        background-color: #e0f2fe;
        color: #0369a1;
    }
</style>
""", unsafe_allow_html=True)


@st.cache_resource
def load_and_initialize_system():
    """Caches data loading and precomputes model matrices for fast web responsiveness."""
    preprocessor = DataPreprocessor()
    products_raw, ratings_raw = preprocessor.load_data()
    clean_products = preprocessor.preprocess_products()
    clean_ratings = preprocessor.preprocess_ratings()
    summary = preprocessor.get_dataset_summary()

    # Train Models
    cb_model = ContentBasedRecommender().fit(clean_products)
    cf_model = CollaborativeFilteringRecommender(mode="user").fit(clean_ratings, clean_products)
    hybrid_model = HybridRecommender(cb_model, cf_model, default_alpha=0.5).fit(clean_products, clean_ratings)
    evaluator = RecommendationEvaluator()

    return {
        "preprocessor": preprocessor,
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
    products_df = system["products_df"]
    ratings_df = system["ratings_df"]
    summary = system["summary"]
    cb_model = system["cb_model"]
    cf_model = system["cf_model"]
    hybrid_model = system["hybrid_model"]
    evaluator = system["evaluator"]

    # Sidebar Navigation
    st.sidebar.title("Navigation")
    app_mode = st.sidebar.radio(
        "Select Section:",
        [
            "🏠 Home & Product Search",
            "🎯 Personalized Recommender",
            "📊 EDA & Data Insights",
            "🧪 Model Evaluation & Metrics",
            "🎓 Viva & Technical Guide"
        ]
    )

    st.sidebar.markdown("---")
    st.sidebar.caption("💡 **B.Tech ML Mini Project**")
    st.sidebar.caption("Algorithms: TF-IDF, Cosine Similarity, Collaborative Matrix, Weighted Hybrid")

    # -------------------------------------------------------------
    # 1. HOME & SEARCH PAGE
    # -------------------------------------------------------------
    if app_mode == "🏠 Home & Product Search":
        st.markdown('<div class="main-title">🛍️ Product Recommendation System</div>', unsafe_allow_html=True)
        st.markdown(
            '<div class="sub-title">An end-to-end Machine Learning recommendation engine implementing '
            'Content-Based Filtering, Collaborative Filtering, and Weighted Hybrid ensembles.</div>',
            unsafe_allow_html=True
        )

        # High-level Metrics
        m1, m2, m3, m4 = st.columns(4)
        m1.metric("📦 Catalog Products", summary["total_products"])
        m2.metric("👥 Active Users", summary["total_users"])
        m3.metric("⭐ Total Ratings", summary["total_ratings"])
        m4.metric("📊 Matrix Sparsity", f"{summary['matrix_sparsity_pct']}%")

        st.markdown("---")
        st.subheader("🔍 Search & Item-to-Item Content Recommendations")
        st.write("Search for an item to find matching products based on TF-IDF text features & Cosine Similarity.")

        search_col1, search_col2 = st.columns([3, 1])
        with search_col1:
            search_query = st.text_input("Enter product name, keyword, or brand:", placeholder="e.g. Headphones, Apple, Coffee...")
        with search_col2:
            cat_filter = st.selectbox("Category Filter:", ["All Categories"] + summary["categories"])

        filtered_df = products_df.copy()
        if cat_filter != "All Categories":
            filtered_df = filtered_df[filtered_df["category"] == cat_filter]

        if search_query:
            filtered_df = filtered_df[
                filtered_df["product_name"].str.contains(search_query, case=False, na=False) |
                filtered_df["brand"].str.contains(search_query, case=False, na=False) |
                filtered_df["description"].str.contains(search_query, case=False, na=False)
            ]

        if filtered_df.empty:
            st.warning("No products matched your search query. Try another keyword.")
        else:
            selected_product_name = st.selectbox(
                "Select a product to view similar items:",
                filtered_df["product_name"].tolist()
            )

            selected_row = filtered_df[filtered_df["product_name"] == selected_product_name].iloc[0]
            selected_pid = selected_row["product_id"]

            st.markdown(f"""
            <div class="product-card">
                <h3>Selected: {selected_row['product_name']}</h3>
                <p><strong>Brand:</strong> {selected_row['brand']} | <strong>Category:</strong> {selected_row['category']} | <strong>Price:</strong> ${selected_row['price']:.2f} | <strong>Rating:</strong> {selected_row['rating']} ★</p>
                <p><em>{selected_row['description']}</em></p>
            </div>
            """, unsafe_allow_html=True)

            num_recs = st.slider("Number of Similar Recommendations:", min_value=3, max_value=8, value=5)
            similar_items = cb_model.get_similar_products(selected_pid, top_n=num_recs)

            st.write(f"#### 🎯 Top {num_recs} Similar Products (Content-Based Cosine Similarity):")
            rec_cols = st.columns(min(len(similar_items), 3))
            for i, item in enumerate(similar_items):
                col_idx = i % 3
                with rec_cols[col_idx]:
                    st.markdown(f"""
                    <div class="product-card">
                        <h4>{i+1}. {item['product_name']}</h4>
                        <span class="badge">{item['category']}</span>
                        <p style="margin-top:0.5rem;"><strong>Brand:</strong> {item['brand']}</p>
                        <p><strong>Price:</strong> ${item['price']:.2f}</p>
                        <p><strong>Rating:</strong> {item['rating']} ★</p>
                        <p><strong>Similarity Score:</strong> <code>{item['similarity_score']:.4f}</code></p>
                        <p style="color:#059669; font-size:0.85rem;">✓ {item['reason']}</p>
                    </div>
                    """, unsafe_allow_html=True)

    # -------------------------------------------------------------
    # 2. PERSONALIZED RECOMMENDER PAGE
    # -------------------------------------------------------------
    elif app_mode == "🎯 Personalized Recommender":
        st.markdown('<div class="main-title">🎯 User-Centric Recommendation Engine</div>', unsafe_allow_html=True)
        st.markdown('<div class="sub-title">Generate personalized product feeds tailored to specific user profiles using Collaborative, Content, or Hybrid models.</div>', unsafe_allow_html=True)

        user_list = sorted(ratings_df["user_id"].unique().tolist())
        c1, c2, c3 = st.columns([2, 2, 2])

        with c1:
            user_id = st.selectbox("Select Target User ID:", user_list + ["New User (Cold Start Simulation)"])
        with c2:
            rec_type = st.selectbox("Recommendation Strategy:", ["Hybrid Recommendation", "Collaborative Filtering", "Content-Based Filtering"])
        with c3:
            top_k = st.selectbox("Number of Recommendations (K):", [5, 10, 15])

        alpha_weight = 0.5
        if rec_type == "Hybrid Recommendation":
            st.write("##### ⚖️ Configure Hybrid Ensemble Weights:")
            w_col1, w_col2 = st.columns([3, 1])
            with w_col1:
                alpha_weight = st.slider(
                    "Collaborative Filtering Weight (α):",
                    min_value=0.0,
                    max_value=1.0,
                    value=0.5,
                    step=0.05,
                    help="α = 1.0 is Pure Collaborative, α = 0.0 is Pure Content-Based"
                )
            with w_col2:
                st.info(f"**Blend:**\n- Collab: `{int(alpha_weight*100)}%`\n- Content: `{int((1-alpha_weight)*100)}%`")

        # Show target user's interaction history
        if user_id != "New User (Cold Start Simulation)":
            st.write("#### 📜 User Interaction History")
            u_history = ratings_df[ratings_df["user_id"] == user_id].merge(products_df, on="product_id", how="left")
            history_display = u_history[["product_id", "product_name", "category", "brand", "rating_x"]].rename(columns={"rating_x": "User Rating"})
            st.dataframe(history_display, use_container_width=True)
        else:
            st.info("❄️ **Cold-Start Simulation Active**: This user has 0 previous ratings. The engine will gracefully fall back to trending catalog items.")

        if st.button("🚀 Generate Personalized Recommendations", type="primary"):
            st.write("---")
            st.subheader(f"✨ Top {top_k} Recommended Products for `{user_id}`")

            target_uid = "UNSEEN_USER" if "Cold Start" in user_id else user_id

            if rec_type == "Hybrid Recommendation":
                recs = hybrid_model.recommend(target_uid, top_n=top_k, alpha=alpha_weight)
            elif rec_type == "Collaborative Filtering":
                recs = cf_model.recommend(target_uid, top_n=top_k)
            else:
                user_ratings_dict = dict(zip(
                    ratings_df[ratings_df["user_id"] == target_uid]["product_id"],
                    ratings_df[ratings_df["user_id"] == target_uid]["rating"]
                ))
                recs = cb_model.get_user_content_recommendations(user_ratings_dict, top_n=top_k)

            # Display recommendation cards
            for idx, r in enumerate(recs):
                score_str = f"Score: <code>{r.get('hybrid_score', r.get('score', r.get('predicted_rating', 'N/A')))}</code>"
                st.markdown(f"""
                <div class="product-card">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h4 style="margin:0;">#{idx+1}. {r['product_name']}</h4>
                        <span class="badge">{r['category']}</span>
                    </div>
                    <p style="margin-top:0.5rem; margin-bottom:0.25rem;">
                        <strong>Brand:</strong> {r['brand']} | <strong>Catalog Rating:</strong> {r['rating']} ★ | <strong>Price:</strong> ${r['price']:.2f}
                    </p>
                    <p style="margin-bottom:0.25rem;">{score_str}</p>
                    <p style="color:#059669; font-size:0.88rem; margin:0;">💡 <em>{r.get('reason', 'Based on algorithmic match')}</em></p>
                </div>
                """, unsafe_allow_html=True)

    # -------------------------------------------------------------
    # 3. EDA & VISUALIZATIONS PAGE
    # -------------------------------------------------------------
    elif app_mode == "📊 EDA & Data Insights":
        st.markdown('<div class="main-title">📊 Exploratory Data Analysis</div>', unsafe_allow_html=True)
        st.markdown('<div class="sub-title">Statistical exploration and distribution plots generated via Matplotlib and Seaborn.</div>', unsafe_allow_html=True)

        col1, col2 = st.columns(2)
        with col1:
            st.write("#### 1. User Rating Distribution")
            fig, ax = plt.subplots(figsize=(6, 3.8))
            sns.countplot(data=ratings_df, x="rating", palette="Blues_d", ax=ax)
            ax.set_title("User Rating Distribution", fontsize=11, fontweight="bold")
            st.pyplot(fig)
            plt.close()

        with col2:
            st.write("#### 2. Popularity: Most Rated Products")
            fig, ax = plt.subplots(figsize=(6, 3.8))
            top_pids = ratings_df["product_id"].value_counts().head(6).reset_index()
            top_pids.columns = ["product_id", "rating_count"]
            merged_top = top_pids.merge(products_df, on="product_id", how="left")
            merged_top["short_name"] = merged_top["product_name"].str[:18] + "..."
            sns.barplot(data=merged_top, y="short_name", x="rating_count", palette="viridis", ax=ax)
            ax.set_title("Top 6 Rated Products", fontsize=11, fontweight="bold")
            st.pyplot(fig)
            plt.close()

        col3, col4 = st.columns(2)
        with col3:
            st.write("#### 3. Category Average Ratings")
            fig, ax = plt.subplots(figsize=(6, 3.8))
            merged_df = ratings_df.merge(products_df, on="product_id", how="left")
            cat_avg = merged_df.groupby("category")["rating_x"].mean().reset_index()
            sns.barplot(data=cat_avg, x="category", y="rating_x", palette="crest", ax=ax)
            ax.set_ylim(0, 5.2)
            ax.set_title("Avg Rating by Category", fontsize=11, fontweight="bold")
            plt.xticks(rotation=20)
            st.pyplot(fig)
            plt.close()

        with col4:
            st.write("#### 4. Item Breadth by Category")
            fig, ax = plt.subplots(figsize=(6, 3.8))
            cat_counts = products_df["category"].value_counts().reset_index()
            cat_counts.columns = ["category", "count"]
            sns.barplot(data=cat_counts, x="count", y="category", palette="magma", ax=ax)
            ax.set_title("Item Count per Category", fontsize=11, fontweight="bold")
            st.pyplot(fig)
            plt.close()

        st.write("#### 📄 Exported Plot Artifacts")
        st.info("All 6 publication-ready charts are automatically compiled into the `outputs/plots/` directory.")

    # -------------------------------------------------------------
    # 4. MODEL EVALUATION PAGE
    # -------------------------------------------------------------
    elif app_mode == "🧪 Model Evaluation & Metrics":
        st.markdown('<div class="main-title">🧪 Machine Learning Model Evaluation</div>', unsafe_allow_html=True)
        st.markdown('<div class="sub-title">Empirical comparison of recommendation performance across Precision@K, Recall@K, F1@K, and Rating RMSE.</div>', unsafe_allow_html=True)

        k_val = st.selectbox("Select Evaluation Cutoff (K):", [3, 5, 10], index=1)
        
        train_df, test_df = system["preprocessor"].train_test_split_ratings(test_ratio=0.25, random_state=42)
        benchmark_df = evaluator.benchmark_models(train_df, test_df, products_df, k=k_val)

        st.write(f"### 📋 Benchmark Results @ K={k_val}")
        st.dataframe(benchmark_df, use_container_width=True)

        st.markdown("""
        ### 📖 Metric Definitions
        1. **Precision@K**: The proportion of recommended items in the top-K ranking that are truly relevant (rated $\\ge 4.0$).
           $$\\text{Precision@K} = \\frac{|\\text{Top-K Recs} \\cap \\text{Relevant Items}|}{K}$$
        2. **Recall@K**: The proportion of all relevant items in the user's test set that were captured in the top-K list.
           $$\\text{Recall@K} = \\frac{|\\text{Top-K Recs} \\cap \\text{Relevant Items}|}{|\\text{All Relevant Items}|}$$
        3. **F1-Score@K**: The harmonic mean of Precision@K and Recall@K.
           $$\\text{F1@K} = 2 \\times \\frac{\\text{Precision@K} \\times \\text{Recall@K}}{\\text{Precision@K} + \\text{Recall@K}}$$
        4. **RMSE (Root Mean Squared Error)**: Standard metric for rating prediction accuracy on collaborative models.
           $$\\text{RMSE} = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (r_{ui} - \\hat{r}_{ui})^2}$$
        """)

    # -------------------------------------------------------------
    # 5. VIVA & TECHNICAL GUIDE
    # -------------------------------------------------------------
    elif app_mode == "🎓 Viva & Technical Guide":
        st.markdown('<div class="main-title">🎓 Project Viva & Technical Defense Guide</div>', unsafe_allow_html=True)
        st.markdown('<div class="sub-title">Comprehensive explanations and conceptual Q&A designed for B.Tech ML examinations.</div>', unsafe_allow_html=True)

        viva_qa = [
            (
                "1. What is the fundamental difference between Content-Based and Collaborative Filtering?",
                "**Content-Based Filtering** recommends items based on item metadata attributes (title, tags, category, description) using TF-IDF and Cosine Similarity. It does not require user interaction data and excels at avoiding cold-start item issues.\n\n"
                "**Collaborative Filtering** relies purely on user behavior history (ratings, purchases, clicks). It computes user-user or item-item similarities from the interaction matrix and can discover serendipitous items outside the user's explicit past categories."
            ),
            (
                "2. Why is a Hybrid Recommendation Approach preferred in production systems?",
                "Each standalone model has key limitations: Collaborative Filtering suffers from the **Cold-Start Problem** (new items/users have no ratings) and **Matrix Sparsity** (most entries in user-item matrix are zero). Content-Based filtering suffers from **Overspecialization** (only recommends items similar to what the user already saw).\n\n"
                "A **Hybrid System** combines both scores with configurable weights ($\\alpha$), balancing personalization, diversity, and cold-start resilience."
            ),
            (
                "3. How does TF-IDF vectorization work in content recommendation?",
                "**TF-IDF** stands for *Term Frequency - Inverse Document Frequency*:\n"
                "- **TF(t, d)**: Measures frequency of word *t* in document *d*.\n"
                "- **IDF(t)**: $\\log(\\frac{N}{1 + \\text{DF}(t)})$, penalizing ubiquitous words like 'the', 'is' and boosting unique descriptive product keywords.\n"
                "The resulting vector reflects the distinct identity of each product."
            ),
            (
                "4. How do you handle the Cold-Start problem in this project?",
                "- **New User**: When a user ID has 0 ratings in the matrix, the system falls back to global popular/highest-rated items or category-based preference questionnaires.\n"
                "- **New Product**: When a newly added product has 0 ratings, content-based TF-IDF similarity automatically integrates it into recommendations without needing prior user purchases."
            ),
            (
                "5. What does Matrix Sparsity mean, and how is it calculated?",
                "Matrix Sparsity represents the percentage of unobserved entries in the User-Item matrix:\n"
                "$$\\text{Sparsity (\\%)} = \\left(1 - \\frac{\\text{Total Ratings}}{\\text{Total Users} \\times \\text{Total Products}}\\right) \\times 100$$\n"
                "In our sample dataset, sparsity is around 80-85%, while real-world platforms (like Amazon or Netflix) exceed 99%."
            )
        ]

        for q, a in viva_qa:
            with st.expander(q, expanded=False):
                st.markdown(a)


if __name__ == "__main__":
    main()
