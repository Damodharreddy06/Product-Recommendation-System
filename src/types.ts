export interface Product {
  product_id: string;
  product_name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  description: string;
}

export interface Rating {
  user_id: string;
  product_id: string;
  rating: number;
  timestamp: number;
}

export interface RecommendationResult {
  product_id: string;
  product_name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  score?: number;
  predicted_rating?: number;
  similarity_score?: number;
  collab_score?: number;
  content_score?: number;
  hybrid_score?: number;
  recommendation_type: string;
  reason: string;
}

export interface ModelBenchmark {
  model: string;
  precision: number;
  recall: number;
  f1: number;
  rmse: string;
  description: string;
}

export interface ProjectFile {
  path: string;
  name: string;
  language: string;
  category: string;
  content: string;
}
