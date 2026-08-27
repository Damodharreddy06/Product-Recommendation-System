import React, { useState } from 'react';
import { ClientRecommendationEngine } from '../engine/recommendationEngine';
import { Award, CheckCircle2, TrendingUp } from 'lucide-react';

interface EvaluationTabProps {
  engine: ClientRecommendationEngine;
}

export const EvaluationTab: React.FC<EvaluationTabProps> = ({ engine }) => {
  const [kCutoff, setKCutoff] = useState<number>(5);
  const benchmarks = engine.evaluateModels(kCutoff);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Award className="h-5 w-5 text-indigo-600" />
              <span>Machine Learning Model Evaluation & Benchmarks</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Offline empirical validation measuring Precision@K, Recall@K, F1-Score, and Rating RMSE across test splits.
            </p>
          </div>

          {/* K-Cutoff selection */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700">Cutoff (K):</span>
            {[3, 5, 10].map((k) => (
              <button
                key={k}
                onClick={() => setKCutoff(k)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                  kCutoff === k
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                K = {k}
              </button>
            ))}
          </div>
        </div>

        {/* Benchmark Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-3.5 px-4 font-bold text-slate-900">Algorithm</th>
                <th className="py-3.5 px-4 font-bold text-slate-900">Precision@{kCutoff}</th>
                <th className="py-3.5 px-4 font-bold text-slate-900">Recall@{kCutoff}</th>
                <th className="py-3.5 px-4 font-bold text-slate-900">F1-Score@{kCutoff}</th>
                <th className="py-3.5 px-4 font-bold text-slate-900">Rating RMSE</th>
                <th className="py-3.5 px-4 font-bold text-slate-900">Key Characteristic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {benchmarks.map((row) => {
                const isWinner = row.model.includes('Hybrid');
                return (
                  <tr
                    key={row.model}
                    className={`${
                      isWinner ? 'bg-indigo-50/60 font-medium' : ''
                    } hover:bg-slate-50/80 transition`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2">
                      {isWinner && <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />}
                      <span>{row.model}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {(row.precision * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-600">
                      {(row.recall * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                      {(row.f1 * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {row.rmse}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs leading-relaxed">
                      {row.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metric Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <span>1. Precision@K & Recall@K</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Precision@K</strong> measures what fraction of the top-K recommendations are relevant to the user:
          </p>
          <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl font-mono text-xs text-slate-800 text-center">
            Precision@K = |Top-K Recs ∩ Relevant Items| / K
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Recall@K</strong> measures the fraction of all truly relevant items successfully discovered in the top-K list:
          </p>
          <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl font-mono text-xs text-slate-800 text-center">
            Recall@K = |Top-K Recs ∩ Relevant Items| / |All Relevant Items|
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
            <Award className="h-4 w-4 text-emerald-600" />
            <span>2. F1-Score & Root Mean Squared Error (RMSE)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>F1-Score@K</strong> is the harmonic mean balancing Precision and Recall:
          </p>
          <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl font-mono text-xs text-slate-800 text-center">
            F1@K = 2 × (Precision@K × Recall@K) / (Precision@K + Recall@K)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>RMSE</strong> quantifies rating prediction divergence on collaborative matrices:
          </p>
          <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl font-mono text-xs text-slate-800 text-center">
            RMSE = √[ (1/N) Σ (Actual_Rating - Predicted_Rating)² ]
          </div>
        </div>
      </div>
    </div>
  );
};
