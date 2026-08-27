"""
Unit Tests for Product Recommendation System.

Run with:
    pytest tests/test_recommendations.py -v
"""

import os
import sys
import pytest
import pandas as pd
import numpy as np

# Add root folder to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.data_preprocessing import DataPreprocessor
from src.content_based import ContentBasedRecommender
from src.collaborative_filtering import CollaborativeFilteringRecommender
from src.hybrid_recommender import HybridRecommender
from src.evaluation import RecommendationEvaluator


@pytest.fixture(scope="module")
def prepared_data():
    """Loads and preprocesses real sample datasets for testing."""
    preprocessor = DataPreprocessor(products_path="data/products.csv", ratings_path="data/ratings.csv")
    products_raw, ratings_raw = preprocessor.load_data()
    clean_products = preprocessor.preprocess_products()
    clean_ratings = preprocessor.preprocess_ratings()
    return clean_products, clean_ratings


# 1. Dataset Loading Test
def test_dataset_loading(prepared_data):
    clean_products, clean_ratings = prepared_data
    assert not clean_products.empty, "Products dataset should not be empty"
    assert not clean_ratings.empty, "Ratings dataset should not be empty"
    assert "product_id" in clean_products.columns
    assert "rating" in clean_ratings.columns


# 2. Data Preprocessing Test
def test_data_preprocessing(prepared_data):
    clean_products, clean_ratings = prepared_data
    assert "content_soup" in clean_products.columns, "Feature soup column must be created"
    assert clean_products["price"].dtype in [np.float64, np.int64, float]
    assert clean_ratings["rating"].min() >= 1.0
    assert clean_ratings["rating"].max() <= 5.0
    assert not clean_products["product_id"].duplicated().any(), "Product IDs must be unique"


# 3. Content-Based Recommendation Test
def test_content_based_recommendations(prepared_data):
    clean_products, _ = prepared_data
    model = ContentBasedRecommender().fit(clean_products)
    recs = model.get_similar_products(product_id="P101", top_n=5)
    
    assert len(recs) == 5
    assert all("product_id" in r for r in recs)
    assert all("similarity_score" in r for r in recs)
    # Check that the seed item itself is not recommended
    assert all(r["product_id"] != "P101" for r in recs)
    # Assert similarity scores are sorted descending
    scores = [r["similarity_score"] for r in recs]
    assert scores == sorted(scores, reverse=True)


# 4. Collaborative Filtering Test
def test_collaborative_recommendations(prepared_data):
    clean_products, clean_ratings = prepared_data
    model = CollaborativeFilteringRecommender(mode="user").fit(clean_ratings, clean_products)
    recs = model.recommend(user_id="U1001", top_n=5)

    assert len(recs) == 5
    assert all("product_id" in r for r in recs)
    assert all("predicted_rating" in r for r in recs)
    # Check that recommended products were not previously rated by U1001
    u1001_rated = set(clean_ratings[clean_ratings["user_id"] == "U1001"]["product_id"])
    assert all(r["product_id"] not in u1001_rated for r in recs)


# 5. Hybrid Recommendation Test
def test_hybrid_recommendations(prepared_data):
    clean_products, clean_ratings = prepared_data
    cb = ContentBasedRecommender().fit(clean_products)
    cf = CollaborativeFilteringRecommender().fit(clean_ratings, clean_products)
    hybrid = HybridRecommender(cb, cf, default_alpha=0.5).fit(clean_products, clean_ratings)

    recs = hybrid.recommend(user_id="U1002", top_n=5, alpha=0.6)
    assert len(recs) == 5
    assert all("hybrid_score" in r for r in recs)
    assert all("collab_score" in r for r in recs)
    assert all("content_score" in r for r in recs)


# 6. Invalid User ID Test
def test_invalid_user_id(prepared_data):
    clean_products, clean_ratings = prepared_data
    cf = CollaborativeFilteringRecommender().fit(clean_ratings, clean_products)
    # When given a non-existent user ID, system should gracefully handle it with fallback
    recs = cf.recommend(user_id="INVALID_USER_9999", top_n=3)
    assert len(recs) == 3
    assert all("product_id" in r for r in recs)


# 7. Invalid Product ID Test
def test_invalid_product_id(prepared_data):
    clean_products, _ = prepared_data
    cb = ContentBasedRecommender().fit(clean_products)
    # When given a non-existent product ID, should return fallback items without crashing
    recs = cb.get_similar_products(product_id="NON_EXISTENT_P999", top_n=4)
    assert len(recs) == 4


# 8. New User Cold Start Test
def test_new_user_cold_start(prepared_data):
    clean_products, clean_ratings = prepared_data
    hybrid = HybridRecommender().fit(clean_products, clean_ratings)
    recs = hybrid.recommend(user_id="NEW_REGISTERED_USER_001", top_n=5)
    assert len(recs) == 5
    # Should provide fallback recommendation without throwing error
    assert any("fallback" in r.get("recommendation_type", "").lower() for r in recs)


# 9. New Product Cold Start Test
def test_new_product_cold_start(prepared_data):
    clean_products, clean_ratings = prepared_data
    # Add a brand new product that has 0 ratings in ratings_df
    new_product_row = pd.DataFrame([{
        "product_id": "P999_NEW",
        "product_name": "Ultra Sound Wireless ANC Earbuds",
        "category": "Audio",
        "brand": "SoundWave",
        "price": 120.0,
        "rating": 4.5,
        "content_soup": "ultra sound wireless anc earbuds audio soundwave wireless noise cancelling bluetooth"
    }])
    extended_products = pd.concat([clean_products, new_product_row], ignore_index=True)
    
    cb = ContentBasedRecommender().fit(extended_products)
    recs = cb.get_similar_products(product_id="P999_NEW", top_n=3)
    assert len(recs) == 3
    assert all(r["category"] == "Audio" for r in recs)


# 10. Empty Dataset Edge Case Test
def test_empty_dataset_handling():
    empty_df = pd.DataFrame(columns=["product_id", "product_name", "category", "brand", "price", "rating", "content_soup"])
    cb = ContentBasedRecommender()
    with pytest.raises(Exception):
        # Calling fit on empty without soup or recommendations without fit should raise clear error
        cb.get_similar_products("P101", top_n=5)


# 11. Custom Recommendation Count (K=3, 7, 10)
def test_number_of_recommendations_boundary(prepared_data):
    clean_products, clean_ratings = prepared_data
    hybrid = HybridRecommender().fit(clean_products, clean_ratings)
    
    for k in [3, 7, 10]:
        recs = hybrid.recommend(user_id="U1001", top_n=k)
        assert len(recs) == k
