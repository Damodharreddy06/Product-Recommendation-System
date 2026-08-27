import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Lightbulb } from 'lucide-react';

interface VivaQA {
  question: string;
  category: string;
  shortAnswer: string;
  detailedAnswer: string;
  formula?: string;
}

export const VivaGuide: React.FC = () => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [filterCat, setFilterCat] = useState<string>('All');

  const questions: VivaQA[] = [
    {
      question: '1. What is the fundamental difference between Content-Based and Collaborative Filtering?',
      category: 'Core Concepts',
      shortAnswer: 'Content-based uses item metadata; Collaborative filtering uses user interaction history.',
      detailedAnswer:
        'Content-Based Filtering analyzes item metadata (product names, categories, brands, text descriptions) via TF-IDF vectorization and measures similarity between products. It requires no other user data. In contrast, Collaborative Filtering creates a User-Item interaction matrix and discovers patterns by identifying users with similar taste profiles or items with co-rated ratings.'
    },
    {
      question: '2. What is the Cold-Start Problem, and how is it addressed in this project?',
      category: 'System Architecture',
      shortAnswer: 'Lack of initial interaction data for new users or new items.',
      detailedAnswer:
        '1. New User Cold-Start: When a user has 0 historical ratings, Collaborative Filtering cannot compute neighbor similarities. The system falls back to top-trending / highest-rated catalog items.\n2. New Product Cold-Start: When a new product is added to the catalog with 0 ratings, Collaborative Filtering ignores it, but Content-Based Filtering immediately recommends it by extracting TF-IDF features from its name and description.'
    },
    {
      question: '3. Explain the mathematical formula and role of TF-IDF vectorization in Content-Based Filtering.',
      category: 'Mathematics',
      shortAnswer: 'Weights terms by frequency in the document and penalizes common words across the corpus.',
      formula: 'TF-IDF(t, d, D) = TF(t, d) × ln[(1 + |D|) / (1 + DF(t))]',
      detailedAnswer:
        'TF (Term Frequency) measures how often a keyword appears in a product description. IDF (Inverse Document Frequency) down-weights generic common words (like "the", "with", "device") and amplifies domain-specific distinctive terms (like "bluetooth", "espresso", "noise-canceling"). The resulting vectors are normalized to unit length so Cosine Similarity reflects pure angular similarity.'
    },
    {
      question: '4. How does Cosine Similarity differ from Euclidean Distance in recommendations?',
      category: 'Mathematics',
      shortAnswer: 'Cosine measures angular direction rather than geometric magnitude.',
      formula: 'Cosine Sim(A, B) = (A · B) / (||A|| × ||B||)',
      detailedAnswer:
        'Euclidean distance is sensitive to document length (a long description has large magnitudes). Cosine Similarity measures the cosine of the angle between two multi-dimensional feature vectors. A score of 1.0 means identical word distribution, 0 means completely disjoint keywords.'
    },
    {
      question: '5. Why do we perform Mean-Centering in Collaborative Filtering?',
      category: 'Collaborative Filtering',
      shortAnswer: 'Eliminates user rating bias (harsh raters vs lenient raters).',
      formula: 'Centered Rating = r_{u,i} - r̄_u',
      detailedAnswer:
        'Some users naturally give 5 stars to everything, while critical users treat 3 stars as high praise. Subtracting the user\'s personal mean rating transforms raw ratings into relative preferences (positive deviations denote appreciation, negative deviations denote dislike), dramatically improving prediction accuracy.'
    },
    {
      question: '6. How does the Weighted Hybrid model compute its final recommendation score?',
      category: 'Hybrid Model',
      shortAnswer: 'Linear combination of Collaborative and Content scores with tunable weight alpha.',
      formula: 'Hybrid Score = α × Collab_Score + (1 - α) × Content_Score',
      detailedAnswer:
        'The parameter α (between 0.0 and 1.0) controls the trade-off. Setting α = 0.5 balances both signals equally. In situations where user rating history is scarce, the system can automatically adjust α towards content matching.'
    },
    {
      question: '7. What does Matrix Sparsity mean, and what is its typical value in real-world systems?',
      category: 'System Architecture',
      shortAnswer: 'The fraction of empty cells in the User-Item matrix; often > 99% in production.',
      formula: 'Sparsity % = [1 - (Total Ratings / (Users × Items))] × 100',
      detailedAnswer:
        'Because any individual shopper buys only a tiny fraction of a 100,000+ item catalog, most entries in the rating matrix are 0 (unobserved). In our sample dataset, sparsity is around 85%, whereas real Amazon/Netflix matrices exceed 99.8% sparsity.'
    },
    {
      question: '8. How are Precision@K and Recall@K evaluated in this project?',
      category: 'Evaluation',
      shortAnswer: 'Precision is hit rate in top-K; Recall is coverage of the user\'s total relevant test items.',
      detailedAnswer:
        'We define items with actual rating >= 4.0 in a held-out 25% test set as "relevant". Precision@K = (Relevant items in top-K) / K. Recall@K = (Relevant items in top-K) / (Total relevant items in test set).'
    },
    {
      question: '9. What is the difference between User-Based and Item-Based Collaborative Filtering?',
      category: 'Collaborative Filtering',
      shortAnswer: 'User-based finds like-minded people; Item-based finds co-rated items.',
      detailedAnswer:
        'User-Based CF computes similarity between user vectors (rows) and scales poorly when users outnumber items. Item-Based CF computes similarity between item vectors (columns), which are more stable over time and often provide better real-time latency in commercial e-commerce.'
    },
    {
      question: '10. What are the main limitations of this mini-project and how can they be improved?',
      category: 'Evaluation',
      shortAnswer: 'Memory-based scaling limits; can be enhanced with Matrix Factorization (SVD) and Deep Learning.',
      detailedAnswer:
        'Current implementations compute full in-memory pairwise matrices, which works well for thousands of items. For billions of interactions, production systems utilize Matrix Factorization (SVD / Funk-SVD), Approximate Nearest Neighbors (FAISS), and Two-Tower Neural Networks.'
    }
  ];

  const categories = ['All', 'Core Concepts', 'Mathematics', 'Collaborative Filtering', 'Hybrid Model', 'Evaluation', 'System Architecture'];

  const filteredQuestions = filterCat === 'All'
    ? questions
    : questions.filter(q => q.category === filterCat);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              B.Tech Viva Examination & Technical Defense Guide
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              10 high-yield questions, mathematical proofs, and conceptual definitions for project presentations.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                filterCat === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {filteredQuestions.map((q, idx) => {
          const isOpen = expandedIdx === idx;
          return (
            <div
              key={q.question}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs transition"
            >
              <button
                onClick={() => setExpandedIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-start justify-between gap-3 hover:bg-slate-50/70 transition cursor-pointer"
              >
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                    {q.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {q.question}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                    {q.shortAnswer}
                  </p>
                </div>

                <div className="text-slate-400 p-1 flex-shrink-0">
                  {isOpen ? <ChevronUp className="h-5 w-5 text-indigo-600" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-6 pt-3 border-t border-slate-100 space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50">
                  {q.formula && (
                    <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-950 font-mono text-xs flex items-center space-x-2.5">
                      <Lightbulb className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                      <span className="font-semibold">{q.formula}</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line text-slate-600 leading-relaxed">{q.detailedAnswer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
