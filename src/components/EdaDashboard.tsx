import React from 'react';
import { Product, Rating } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { BarChart3, Users, Package, Star, Layers, Activity } from 'lucide-react';

interface EdaDashboardProps {
  products: Product[];
  ratings: Rating[];
}

const COLORS = ['#6366f1', '#38bdf8', '#34d399', '#f59e0b', '#ec4899', '#8b5cf6'];

export const EdaDashboard: React.FC<EdaDashboardProps> = ({ products, ratings }) => {
  // 1. Rating Distribution
  const ratingCounts: { [key: string]: number } = { '1.0': 0, '2.0': 0, '3.0': 0, '3.5': 0, '4.0': 0, '4.5': 0, '5.0': 0 };
  ratings.forEach(r => {
    const key = r.rating.toFixed(1);
    if (ratingCounts[key] !== undefined) ratingCounts[key]++;
    else ratingCounts[key] = (ratingCounts[key] || 0) + 1;
  });
  const ratingDistData = Object.keys(ratingCounts).map(k => ({
    rating: `${k} ★`,
    count: ratingCounts[k]
  }));

  // 2. Most Rated Products
  const prodRatingCounts: { [key: string]: number } = {};
  ratings.forEach(r => {
    prodRatingCounts[r.product_id] = (prodRatingCounts[r.product_id] || 0) + 1;
  });
  const mostRatedData = Object.entries(prodRatingCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([pid, count]) => {
      const prod = products.find(p => p.product_id === pid);
      return {
        name: prod ? prod.product_name.substring(0, 16) + '...' : pid,
        ratings: count
      };
    });

  // 3. Category distribution
  const catCounts: { [key: string]: number } = {};
  products.forEach(p => {
    catCounts[p.category] = (catCounts[p.category] || 0) + 1;
  });
  const categoryData = Object.entries(catCounts).map(([cat, count]) => ({
    name: cat,
    value: count
  }));

  // 4. Average rating by category
  const catRatingSum: { [key: string]: { sum: number; count: number } } = {};
  ratings.forEach(r => {
    const prod = products.find(p => p.product_id === r.product_id);
    if (prod) {
      if (!catRatingSum[prod.category]) catRatingSum[prod.category] = { sum: 0, count: 0 };
      catRatingSum[prod.category].sum += r.rating;
      catRatingSum[prod.category].count += 1;
    }
  });
  const catAvgData = Object.entries(catRatingSum).map(([cat, val]) => ({
    category: cat,
    avgRating: Number((val.sum / val.count).toFixed(2))
  }));

  // High-level Stats
  const uniqueUsers = new Set(ratings.map(r => r.user_id)).size;
  const totalRatings = ratings.length;
  const avgRating = (ratings.reduce((a, b) => a + b.rating, 0) / totalRatings).toFixed(2);
  const totalPossible = uniqueUsers * products.length;
  const sparsity = ((1 - totalRatings / totalPossible) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Title & Summary stats */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <span>Exploratory Data Analysis (EDA) & Statistics</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual breakdown of product catalogs, user interactions, rating distributions, and matrix sparsity.
          </p>
        </div>

        {/* 5 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center space-x-2 text-indigo-700 text-xs font-bold mb-1">
              <Package className="h-4 w-4 text-indigo-600" />
              <span>Catalog Items</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{products.length}</div>
            <div className="text-[11px] text-slate-500 font-medium">6 Unique Categories</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center space-x-2 text-sky-700 text-xs font-bold mb-1">
              <Users className="h-4 w-4 text-sky-600" />
              <span>Active Users</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{uniqueUsers}</div>
            <div className="text-[11px] text-slate-500 font-medium">Explicit interaction records</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center space-x-2 text-amber-700 text-xs font-bold mb-1">
              <Activity className="h-4 w-4 text-amber-600" />
              <span>Total Ratings</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{totalRatings}</div>
            <div className="text-[11px] text-slate-500 font-medium">1.0 - 5.0 Star scale</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold mb-1">
              <Star className="h-4 w-4 text-emerald-600" />
              <span>Mean Rating</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{avgRating} ★</div>
            <div className="text-[11px] text-slate-500 font-medium">Positive user skew</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold mb-1">
              <Layers className="h-4 w-4 text-purple-600" />
              <span>Matrix Sparsity</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{sparsity}%</div>
            <div className="text-[11px] text-slate-500 font-medium">Unobserved user-item pairs</div>
          </div>
        </div>
      </div>

      {/* 2x2 Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: User Rating Distribution */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            1. User Rating Distribution
          </h3>
          <p className="text-xs text-slate-500 mb-4">Histogram of user feedback star ratings</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="rating" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Most Rated Products */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            2. Most Popular Products (Interaction Volume)
          </h3>
          <p className="text-xs text-slate-500 mb-4">Top products receiving the highest number of ratings</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostRatedData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />
                <Bar dataKey="ratings" fill="#0284c7" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Category Share */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            3. Product Catalog Breakdown by Category
          </h3>
          <p className="text-xs text-slate-500 mb-4">Item inventory proportions across departments</p>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Average Category Rating */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            4. Average Satisfaction by Category
          </h3>
          <p className="text-xs text-slate-500 mb-4">Mean user rating per product category</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catAvgData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />
                <Bar dataKey="avgRating" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
