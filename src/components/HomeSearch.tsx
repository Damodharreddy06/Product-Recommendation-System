import React, { useState } from 'react';
import { Product, RecommendationResult } from '../types';
import { ClientRecommendationEngine } from '../engine/recommendationEngine';
import { Search, Filter, Sparkles, Tag, DollarSign, Star, Info, ArrowRight } from 'lucide-react';

interface HomeSearchProps {
  engine: ClientRecommendationEngine;
  products: Product[];
  onSelectUserTab: () => void;
}

export const HomeSearch: React.FC<HomeSearchProps> = ({ engine, products, onSelectUserTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProductId, setSelectedProductId] = useState<string>('P101');
  const [topN, setTopN] = useState<number>(5);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchQuery =
      p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const selectedProduct = products.find(p => p.product_id === selectedProductId) || products[0];
  const similarItems: RecommendationResult[] = engine.getContentRecommendations(selectedProduct.product_id, topN);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-white shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Machine Learning Recommendation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Product Recommendation System
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Explore personalized product recommendations powered by <strong className="text-white">TF-IDF text vectorization</strong>,
            <strong className="text-white"> Cosine Similarity</strong>, <strong className="text-white">User-Item Collaborative Filtering</strong>, and <strong className="text-white">Adaptive Hybrid Ensembles</strong>.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onSelectUserTab()}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              <span>Try User-Specific Recommendations</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Search & Item-to-Item Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Catalog & Search */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Search className="h-4 w-4 text-indigo-600" />
                <span>Search Catalog</span>
              </h2>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{filteredProducts.length} items</span>
            </div>

            {/* Search Input */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  id="product-search-input"
                  type="text"
                  placeholder="Search headphones, laptop, watch, espresso..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <Filter className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product List */}
            <div className="mt-4 max-h-[480px] overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const isSelected = p.product_id === selectedProductId;
                return (
                  <div
                    key={p.product_id}
                    id={`product-item-${p.product_id}`}
                    onClick={() => setSelectedProductId(p.product_id)}
                    className={`pt-2.5 pb-2.5 px-3 rounded-xl cursor-pointer transition ${
                      isSelected
                        ? 'bg-indigo-50/80 border border-indigo-200 text-indigo-950'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                        {p.product_name}
                      </h4>
                      <span className="text-xs font-bold text-slate-900 ml-2 font-mono">
                        ${p.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center space-x-1 font-medium">
                        <Tag className="h-3 w-3 text-slate-400" />
                        <span>{p.category}</span>
                      </span>
                      <span>•</span>
                      <span>{p.brand}</span>
                      <span>•</span>
                      <span className="flex items-center text-amber-600 font-semibold">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
                        {p.rating}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Product & Content-Based Recommendations */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Product Showcase */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <span className="text-xs font-bold tracking-wide uppercase text-indigo-600">
                Selected Seed Product ({selectedProduct.product_id})
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-medium">
                {selectedProduct.category}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              {selectedProduct.product_name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              {selectedProduct.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-1 font-semibold text-slate-800">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <span>Price: <strong className="font-mono">${selectedProduct.price.toFixed(2)}</strong></span>
              </div>
              <div className="flex items-center space-x-1 font-semibold text-slate-800">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>Rating: <strong>{selectedProduct.rating} / 5.0</strong></span>
              </div>
              <div className="text-slate-500">
                Brand: <strong className="text-slate-800">{selectedProduct.brand}</strong>
              </div>
            </div>
          </div>

          {/* Similar Items Header & Slider */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span>Content-Based Similar Recommendations</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated via <strong>TF-IDF feature vector cosine similarity</strong>
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <span className="text-slate-600 font-medium">Top N:</span>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={topN}
                  onChange={(e) => setTopN(Number(e.target.value))}
                  className="w-24 accent-indigo-600"
                />
                <span className="font-bold font-mono text-indigo-600">{topN}</span>
              </div>
            </div>

            {/* Recommendation Cards */}
            <div className="space-y-3">
              {similarItems.map((item, idx) => (
                <div
                  key={item.product_id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                          #{idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {item.product_name}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                          {item.category}
                        </span>
                        <span>•</span>
                        <span>{item.brand}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-800 font-mono">
                          ${item.price.toFixed(2)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center text-amber-600 font-medium">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
                          {item.rating}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                        {((item.similarity_score || 0) * 100).toFixed(1)}% Match
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center text-xs text-emerald-700 font-medium">
                    <Info className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-emerald-600" />
                    <span>{item.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
