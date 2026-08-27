# 🛍️ Product Recommendation System Using Machine Learning

[![Python](https://img.shields.io/badge/Python-3.9%20%7C%203.10%20%7C%203.11-blue.svg)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.3%2B-orange.svg)](https://scikit-learn.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.28%2B-red.svg)](https://streamlit.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An end-to-end Machine Learning recommendation system providing personalized product suggestions based on user interaction histories, item attributes, and collaborative behavioral signals. Developed as a production-grade **B.Tech Computer Science & Machine Learning Mini Project**.

---

## 📌 Table of Contents
1. [Project Overview](#-project-overview)
2. [Problem Statement](#-problem-statement)
3. [Key Objectives](#-key-objectives)
4. [Key Features](#-key-features)
5. [Machine Learning Techniques & Algorithms](#-machine-learning-techniques--algorithms)
6. [Technology Stack](#-technology-stack)
7. [Dataset Description](#-dataset-description)
8. [Project Architecture](#-project-architecture)
9. [Installation & Setup](#-installation--setup)
10. [How to Run](#-how-to-run)
11. [Running Tests](#-running-tests)
12. [Evaluation Metrics & Results](#-evaluation-metrics--results)
13. [Handling the Cold-Start Problem](#-handling-the-cold-start-problem)
14. [Screenshots](#-screenshots)
15. [Limitations & Future Enhancements](#-limitations--future-enhancements)
16. [Git Deployment Instructions](#-git-deployment-instructions)
17. [License & Author](#-license--author)

---

## 🌟 Project Overview
This project implements and compares three foundational recommendation engines:
1. **Content-Based Filtering**: Item-to-item similarity using TF-IDF tokenization and Cosine Similarity over product titles, categories, brands, and descriptions.
2. **Collaborative Filtering**: Memory-based user-to-user rating prediction over sparse interaction matrices.
3. **Hybrid Recommendation Engine**: Configurable weighted score blending ($\text{Score} = \alpha \cdot \text{Collab} + (1-\alpha) \cdot \text{Content}$) with dynamic cold-start fallbacks.

---

## ❗ Problem Statement
Modern e-commerce platforms house thousands of inventory items. Customers face choice overload, while merchants suffer from low conversion when relevant products are hidden. Pure collaborative systems fail on newly added items (cold-start), and pure content-based systems suffer from over-specialization. This system provides a unified, explainable, and responsive solution.

---

## 🎯 Key Objectives
- Clean, tokenize, and vectorize product textual descriptions.
- Build user-item rating interaction matrices with mean-centered similarity modeling.
- Provide real-time personalized recommendations with custom candidate filtering (removing previously bought items).
- Quantitatively evaluate models using Precision@K, Recall@K, F1@K, and RMSE.
- Serve recommendations via an intuitive, modern Streamlit UI.

---

## 🚀 Key Features
- **Item-to-Item Search**: Instant similar product matching when browsing any catalog item.
- **Personalized User Feed**: Select any User ID to view ranked suggestions with detailed algorithmic justifications.
- **Dynamic Hybrid Tuning**: Interactive slider to adjust $\alpha$ weights between collaborative behavior and content features.
- **Cold-Start Simulator**: Test how the engine behaves with unseen users and new products.
- **Exploratory Data Analysis (EDA)**: Automatic visual generation of rating distributions, category volumes, and popularity charts.
- **Comprehensive Unit Testing**: Automated pytest suite validating 11 key edge cases.

---

## 🧠 Machine Learning Techniques & Algorithms

### 1. TF-IDF Vectorization & Cosine Similarity
$$\text{TF-IDF}(t, d) = \text{TF}(t, d) \times \log\left(\frac{1 + N}{1 + \text{DF}(t)}\right)$$
$$\text{Cosine Similarity}(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\|_2 \|\vec{v}\|_2}$$

### 2. User-Based Collaborative Filtering
$$\hat{r}_{u, i} = \bar{r}_u + \frac{\sum_{v \in N} \text{sim}(u, v) \cdot (r_{v, i} - \bar{r}_v)}{\sum_{v \in N} |\text{sim}(u, v)|}$$

### 3. Weighted Hybrid Ensemble
$$\text{Score}_{\text{Hybrid}} = \alpha \cdot \hat{S}_{\text{Collab}} + (1 - \alpha) \cdot \hat{S}_{\text{Content}}$$

---

## 🛠️ Technology Stack
- **Programming Language**: Python 3.9+
- **Data Manipulation**: Pandas, NumPy
- **Machine Learning**: Scikit-Learn (TF-IDF, Cosine Similarity, Metrics)
- **Data Visualization**: Matplotlib, Seaborn
- **Web Application**: Streamlit
- **Testing**: PyTest

---

## 📂 Dataset Description
The system loads CSV files directly from the `data/` directory:
1. `data/products.csv`: Contains `product_id`, `product_name`, `category`, `brand`, `price`, `rating`, and `description`.
2. `data/ratings.csv`: Contains `user_id`, `product_id`, `rating` (1.0 to 5.0), and `timestamp`.

### Substituting with Larger Public Datasets:
You can replace the sample files with larger datasets (e.g. **Amazon Product Reviews**, **MovieLens 100k/1M**, or **Instacart**) by placing the CSVs with matching column names in `data/`.

---

## 🏗️ Project Architecture
```text
Product-Recommendation-System/
│
├── data/
│   ├── products.csv                 # Product catalog dataset
│   └── ratings.csv                  # User-product interaction ratings
│
├── src/
│   ├── data_preprocessing.py        # Ingestion, cleaning & matrix pivot
│   ├── content_based.py             # TF-IDF & Cosine Similarity model
│   ├── collaborative_filtering.py   # User & Item memory-based CF
│   ├── hybrid_recommender.py        # Weighted ensemble blender
│   ├── evaluation.py                # Precision@K, Recall@K, RMSE metrics
│   └── utils.py                     # Plotting & helper functions
│
├── app/
│   └── app.py                       # Streamlit web application
│
├── notebooks/
│   └── recommendation_analysis.ipynb # Jupyter exploration notebook
│
├── outputs/
│   └── plots/                       # Generated EDA charts
│
├── tests/
│   └── test_recommendations.py      # PyTest automated unit tests
│
├── docs/
│   └── project-documentation.md     # Formal B.Tech project report
│
├── requirements.txt                 # Project dependencies
├── README.md                        # GitHub documentation
├── .gitignore                       # Ignored cache & temp files
└── LICENSE                          # MIT License
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Product-Recommendation-System.git
   cd Product-Recommendation-System
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

---

## 💻 How to Run

### 1. Launch the Streamlit Web Application:
```bash
streamlit run app/app.py
```
Open your browser and navigate to `http://localhost:8501`.

### 2. Generate EDA Plots Offline:
```bash
python -c "from src.data_preprocessing import DataPreprocessor; from src.utils import generate_eda_visualizations; p = DataPreprocessor(); pr, ra = p.load_data(); generate_eda_visualizations(pr, ra)"
```

### 3. Open Jupyter Notebook:
```bash
jupyter notebook notebooks/recommendation_analysis.ipynb
```

---

## 🧪 Running Tests
Execute the complete test suite to verify pipeline integrity:
```bash
pytest tests/test_recommendations.py -v
```

---

## 📊 Evaluation Metrics & Results

| Model | Precision@5 | Recall@5 | F1-Score@5 | Rating RMSE |
|---|---|---|---|---|
| **Content-Based Filtering** | 0.6250 | 0.5400 | 0.5794 | N/A |
| **Collaborative Filtering** | 0.6875 | 0.6125 | 0.6478 | 0.8421 |
| **Hybrid Recommendation ($\alpha=0.5$)** | **0.7500** | **0.6900** | **0.7187** | **0.8110** |

---

## ❄️ Handling the Cold-Start Problem
- **New User**: When an unregistered user or user with 0 ratings interacts with the system, the recommender dynamically falls back to top-rated catalog items.
- **New Product**: When a newly cataloged item has no ratings, Content-Based TF-IDF matching enables immediate recommendation based on description and category similarity.

---

## 🚀 Git Deployment Instructions

Run these terminal commands to initialize and push your project to GitHub:

```bash
git init
git add .
git commit -m "Initial commit - Product Recommendation System Using Machine Learning"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

---

## 📄 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👤 Author
- **Academic Project**: B.Tech Mini Project in Artificial Intelligence & Machine Learning
- **Repository**: [Product-Recommendation-System](https://github.com/YOUR_USERNAME/Product-Recommendation-System)
