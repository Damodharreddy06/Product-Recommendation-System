import React, { useState } from 'react';
import { ClientRecommendationEngine } from '../engine/recommendationEngine';
import { Product, RecommendationResult } from '../types';
import { UserCheck, Sliders, Sparkles, Star, DollarSign, History, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PersonalizedRecsProps {
  engine: ClientRecommendationEngine;
  products: Product[];
}

export const PersonalizedRecs: React.FC<PersonalizedRecsProps> = ({ engine }) => {
  const allUsers = engine.getAllUserIds();
  const [selectedUser, setSelectedUser] = useState<string>('U1001');
  const [strategy, setStrategy] = useState<'hybrid' | 'collab' | 'content'>('hybrid');
  const [alpha, setAlpha] = useState<number>(0.5);
  const [topK, setTopK] = useState<number>(5);
  const [isColdStart, setIsColdStart] = useState<boolean>(false);

  const activeUserId = isColdStart ? 'NEW_COLD_START_USER' : selectedUser;
  const userHistory = isColdStart ? [] : engine.getUserHistory(selectedUser);

  let recommendations: RecommendationResult[] = [];
  if (strategy === 'hybrid') {
    recommendations = engine.getHybridRecommendations(activeUserId, alpha, topK, true);
  } else if (strategy === 'collab') {
    recommendations = engine.getCollaborativeRecommendations(activeUserId, topK, true);
  } else {
    recommendations = engine.getUserContentRecommendations(activeUserId, topK, true);
  }

  return (
    <div className="space-y-6">
      {/* Header controls bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-indigo-600" />
              <span>Personalized Recommendation Console</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a user profile or simulate cold-start to generate personalized item rankings.
            </p>
          </div>

          {/* Strategy Pills */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setStrategy('hybrid')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                strategy === 'hybrid'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weighted Hybrid
            </button>
            <button
              onClick={() => setStrategy('collab')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                strategy === 'collab'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Collaborative Filtering
            </button>
            <button
              onClick={() => setStrategy('content')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                strategy === 'content'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Content Profile
            </button>
          </div>
        </div>

        {/* User Selection & Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* User selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select User Profile:
            </label>
            <select
              id="user-select-dropdown"
              disabled={isColdStart}
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white disabled:opacity-50 transition"
            >
              {allUsers.map((uid) => (
                <option key={uid} value={uid}>
                  {uid} ({engine.getUserHistory(uid).length} prior ratings)
                </option>
              ))}
            </select>
          </div>

          {/* Cold Start Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Simulate New User (Cold Start):
            </label>
            <button
              id="cold-start-toggle-btn"
              onClick={() => setIsColdStart(!isColdStart)}
              className={`w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm rounded-xl font-medium border transition ${
                isColdStart
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80'
              }`}
            >
              {isColdStart ? (
                <>
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  <span className="font-semibold">Cold Start (Active)</span>
                </>
              ) : (
                <span>Test 0-Rating User</span>
              )}
            </button>
          </div>

          {/* Top K selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Top Recommendations (K):
            </label>
            <div className="flex space-x-2">
              {[5, 10, 15].map((k) => (
                <button
                  key={k}
                  onClick={() => setTopK(k)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                    topK === k
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Top {k}
                </button>
              ))}
            </div>
          </div>

          {/* Hybrid Weight slider */}
          {strategy === 'hybrid' && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Collab Weight (α):</span>
                <span className="text-indigo-600 font-mono">{alpha.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>100% Content</span>
                <span>50/50</span>
                <span>100% Collab</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid: User History & Recommended Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: User Prior Rating History */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-3">
              <History className="h-4 w-4 text-indigo-600" />
              <span>Prior Interactions ({userHistory.length})</span>
            </h3>

            {isColdStart ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="flex items-center font-bold text-amber-800">
                  <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                  <span>Cold-Start Mode Active</span>
                </div>
                <p className="leading-relaxed">
                  This user has 0 historical interactions. The recommender automatically engages cold-start fallbacks
                  (trending & highest-rated products) to ensure zero drop-off.
                </p>
              </div>
            ) : userHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No ratings recorded for this user.</p>
            ) : (
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {userHistory.map(({ product, rating }) => (
                  <div
                    key={product.product_id}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-xs"
                  >
                    <div className="font-semibold text-slate-900 line-clamp-1">
                      {product.product_name}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-slate-500">
                      <span>{product.category}</span>
                      <span className="flex items-center font-bold text-amber-600">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
                        {rating.toFixed(1)} / 5.0
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Recommendation Feed */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span>
                    Top {recommendations.length} Recommendations for{' '}
                    <span className="text-indigo-600">{activeUserId}</span>
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Method: <strong className="capitalize text-slate-700">{strategy}</strong> | Prior ratings filtered out
                </p>
              </div>
            </div>

            {/* List of Recommendation Cards */}
            <div className="space-y-3.5">
              {recommendations.map((item, idx) => (
                <div
                  key={item.product_id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-xs transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                          #{idx + 1}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {item.product_name}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {item.category}
                        </span>
                        <span>•</span>
                        <span>Brand: <strong className="text-slate-700">{item.brand}</strong></span>
                        <span>•</span>
                        <span className="font-semibold text-slate-900 font-mono">
                          ${item.price.toFixed(2)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center text-amber-600 font-medium">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
                          {item.rating} Catalog
                        </span>
                      </div>
                    </div>

                    {/* Scores badge */}
                    <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-1 flex-shrink-0">
                      <div className="text-xs font-mono font-bold text-white bg-indigo-600 px-2.5 py-1 rounded-lg shadow-xs">
                        Score: {item.hybrid_score !== undefined ? item.hybrid_score.toFixed(4) : (item.score || 0).toFixed(4)}
                      </div>
                      {item.predicted_rating && (
                        <div className="text-[11px] text-slate-500 font-medium">
                          Pred: {item.predicted_rating.toFixed(1)} ★
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explainability footnote */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center text-xs text-emerald-700 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-emerald-600" />
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
