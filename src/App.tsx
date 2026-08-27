import { useState, useMemo } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { sampleProducts, sampleRatings } from './data/sampleData';
import { allProjectFiles } from './data/projectFiles';
import { ClientRecommendationEngine } from './engine/recommendationEngine';

import { Navbar } from './components/Navbar';
import { HomeSearch } from './components/HomeSearch';
import { PersonalizedRecs } from './components/PersonalizedRecs';
import { EdaDashboard } from './components/EdaDashboard';
import { EvaluationTab } from './components/EvaluationTab';
import { FileViewer } from './components/FileViewer';
import { VivaGuide } from './components/VivaGuide';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('search');
  const [downloadingZip, setDownloadingZip] = useState<boolean>(false);

  // Initialize recommendation engine with sample dataset
  const engine = useMemo(() => {
    return new ClientRecommendationEngine(sampleProducts, sampleRatings);
  }, []);

  const handleDownloadZip = async () => {
    try {
      setDownloadingZip(true);
      const zip = new JSZip();

      // Add all project files into zip structure
      allProjectFiles.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add notebook & plots placeholder
      zip.file(
        'outputs/plots/README.md',
        '# Output Visualizations\nRun `python -c "from src.data_preprocessing import DataPreprocessor; from src.utils import generate_eda_visualizations; p, r = DataPreprocessor().load_data(); generate_eda_visualizations(p, r)"` to regenerate high-resolution PNG charts.'
      );

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'Product-Recommendation-System-ML-Project.zip');
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadZip={handleDownloadZip}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'search' && (
          <HomeSearch
            engine={engine}
            products={sampleProducts}
            onSelectUserTab={() => setActiveTab('personalized')}
          />
        )}

        {activeTab === 'personalized' && (
          <PersonalizedRecs
            engine={engine}
            products={sampleProducts}
          />
        )}

        {activeTab === 'eda' && (
          <EdaDashboard
            products={sampleProducts}
            ratings={sampleRatings}
          />
        )}

        {activeTab === 'evaluation' && (
          <EvaluationTab engine={engine} />
        )}

        {activeTab === 'files' && (
          <FileViewer
            files={allProjectFiles}
            onDownloadZip={handleDownloadZip}
          />
        )}

        {activeTab === 'viva' && (
          <VivaGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            <span className="font-semibold text-slate-800">Product Recommendation System Using Machine Learning</span>
            <span className="mx-2 text-slate-300">•</span>
            <span>TF-IDF • Cosine Similarity • Collaborative Filtering • Hybrid Ensemble</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('files')}
              className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition"
            >
              Browse Code Files
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline transition"
            >
              {downloadingZip ? 'Compressing ZIP...' : 'Export Project (.zip)'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
