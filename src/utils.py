"""
Utility Functions for Product Recommendation System.

Includes:
- Plot generation and saving to outputs/plots/ using Matplotlib & Seaborn
- Model serialization and loading helpers
- Formatting and display helpers
"""

import os
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend for headless script execution
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from typing import Dict, Any, List


def setup_directories(output_dir: str = "outputs/plots"):
    """Ensures required output directories exist."""
    os.makedirs(output_dir, exist_ok=True)


def generate_eda_visualizations(
    products_df: pd.DataFrame,
    ratings_df: pd.DataFrame,
    output_dir: str = "outputs/plots"
) -> List[str]:
    """
    Generates and saves the 6 required EDA charts for the project:
    1. rating_distribution.png
    2. most_rated_products.png
    3. avg_rating_by_category.png
    4. ratings_per_user.png
    5. category_distribution.png
    6. price_vs_rating.png
    
    Returns:
        List of saved plot filepaths.
    """
    setup_directories(output_dir)
    saved_files = []
    sns.set_theme(style="whitegrid", palette="muted")

    # 1. Rating Distribution
    plt.figure(figsize=(8, 5))
    ax = sns.countplot(data=ratings_df, x="rating", palette="Blues_d")
    plt.title("User Rating Distribution (1 to 5 Stars)", fontsize=14, fontweight="bold", pad=12)
    plt.xlabel("Rating Given", fontsize=12)
    plt.ylabel("Interaction Count", fontsize=12)
    for p in ax.patches:
        ax.annotate(f"{int(p.get_height())}", (p.get_x() + p.get_width() / 2., p.get_height()),
                    ha="center", va="center", xytext=(0, 5), textcoords="offset points", fontsize=10)
    plt.tight_layout()
    plot_path = os.path.join(output_dir, "rating_distribution.png")
    plt.savefig(plot_path, dpi=300)
    plt.close()
    saved_files.append(plot_path)

    # 2. Most-Rated Products
    plt.figure(figsize=(10, 6))
    top_pids = ratings_df["product_id"].value_counts().head(8).reset_index()
    top_pids.columns = ["product_id", "rating_count"]
    merged_top = top_pids.merge(products_df[["product_id", "product_name"]], on="product_id", how="left")
    merged_top["short_name"] = merged_top["product_name"].str[:25] + "..."

    sns.barplot(data=merged_top, y="short_name", x="rating_count", palette="viridis")
    plt.title("Top Most-Rated Products in Catalog", fontsize=14, fontweight="bold", pad=12)
    plt.xlabel("Number of Ratings Received", fontsize=12)
    plt.ylabel("Product", fontsize=12)
    plt.tight_layout()
    plot_path = os.path.join(output_dir, "most_rated_products.png")
    plt.savefig(plot_path, dpi=300)
    plt.close()
    saved_files.append(plot_path)

    # 3. Average Rating by Category
    plt.figure(figsize=(9, 5))
    merged_df = ratings_df.merge(products_df, on="product_id", how="left")
    cat_avg = merged_df.groupby("category")["rating_x"].mean().reset_index()
    cat_avg.columns = ["category", "avg_user_rating"]
    cat_avg = cat_avg.sort_values(by="avg_user_rating", ascending=False)

    sns.barplot(data=cat_avg, x="category", y="avg_user_rating", palette="crest")
    plt.ylim(0, 5.2)
    plt.title("Average User Rating Across Product Categories", fontsize=14, fontweight="bold", pad=12)
    plt.xlabel("Category", fontsize=12)
    plt.ylabel("Average Rating (1-5)", fontsize=12)
    plt.xticks(rotation=15)
    plt.tight_layout()
    plot_path = os.path.join(output_dir, "avg_rating_by_category.png")
    plt.savefig(plot_path, dpi=300)
    plt.close()
    saved_files.append(plot_path)

    # 4. Number of Ratings per User
    plt.figure(figsize=(8, 5))
    user_counts = ratings_df["user_id"].value_counts()
    sns.histplot(user_counts, bins=8, color="#2563eb", kde=True)
    plt.title("Distribution of Interaction Activity per User", fontsize=14, fontweight="bold", pad=12)
    plt.xlabel("Ratings Given per User", fontsize=12)
    plt.ylabel("Number of Users", fontsize=12)
    plt.tight_layout()
    plot_path = os.path.join(output_dir, "ratings_per_user.png")
    plt.savefig(plot_path, dpi=300)
    plt.close()
    saved_files.append(plot_path)

    # 5. Product Categories Volume
    plt.figure(figsize=(8, 5))
    cat_counts = products_df["category"].value_counts().reset_index()
    cat_counts.columns = ["category", "count"]
    sns.barplot(data=cat_counts, x="count", y="category", palette="magma")
    plt.title("Catalog Breadth: Item Count per Category", fontsize=14, fontweight="bold", pad=12)
    plt.xlabel("Number of Unique Products", fontsize=12)
    plt.ylabel("Category", fontsize=12)
    plt.tight_layout()
    plot_path = os.path.join(output_dir, "category_distribution.png")
    plt.savefig(plot_path, dpi=300)
    plt.close()
    saved_files.append(plot_path)

    # 6. Price vs Catalog Rating
    plt.figure(figsize=(8, 5))
    sns.scatterplot(
        data=products_df,
        x="price",
        y="rating",
        hue="category",
        s=120,
        alpha=0.85
    )
    plt.title("Product Price vs. Catalog Rating", fontsize=14, fontweight="bold", pad=12)
    plt.xlabel("Price ($)", fontsize=12)
    plt.ylabel("Rating (Stars)", fontsize=12)
    plt.legend(bbox_to_anchor=(1.05, 1), loc="upper left")
    plt.tight_layout()
    plot_path = os.path.join(output_dir, "price_vs_rating.png")
    plt.savefig(plot_path, dpi=300)
    plt.close()
    saved_files.append(plot_path)

    return saved_files
