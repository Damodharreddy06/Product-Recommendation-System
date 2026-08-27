import React, { useState } from 'react';
import { ProjectFile } from '../types';
import { FileCode, Download, Copy, Check, Terminal, FolderTree } from 'lucide-react';

interface FileViewerProps {
  files: ProjectFile[];
  onDownloadZip: () => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({ files, onDownloadZip }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(files[0]?.path || '');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedFile = files.find(f => f.path === selectedFilePath) || files[0];

  const handleCopy = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Group files by category
  const categories = Array.from(new Set(files.map(f => f.category)));

  return (
    <div className="space-y-6">
      {/* GitHub Repository Quick Actions Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <FolderTree className="h-5 w-5 text-indigo-600" />
              <span>Project Source Code & GitHub Files</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse, inspect, or download the complete Python machine learning repository directly.
            </p>
          </div>

          <button
            onClick={onDownloadZip}
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download Entire Project (.ZIP)</span>
          </button>
        </div>

        {/* Quick Git Commands Bar */}
        <div className="mt-5 p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-2.5 whitespace-nowrap">
            <Terminal className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span className="text-slate-400 font-medium">Git Push:</span>
            <span className="text-emerald-300">git init && git add . && git commit -m "Initial commit" && git push</span>
          </div>
          <span className="text-[11px] text-slate-400 hidden lg:inline font-sans font-medium">Production Ready B.Tech Repo</span>
        </div>
      </div>

      {/* Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: File Tree */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs max-h-[640px] overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
            Project Repository ({files.length} Files)
          </h3>

          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat}>
                <div className="text-[11px] font-bold text-indigo-700 px-2 mb-1.5 flex items-center space-x-1">
                  <span>📂 {cat}</span>
                </div>
                <div className="space-y-1">
                  {files
                    .filter((f) => f.category === cat)
                    .map((file) => {
                      const isSelected = file.path === selectedFilePath;
                      return (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFilePath(file.path)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="truncate">{file.name}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-sans ml-2 font-medium">
                            {file.language}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Code Display */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[640px]">
          {/* File Header */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCode className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-mono text-slate-200 font-bold">{selectedFile.path}</span>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Text Area */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed select-text whitespace-pre bg-slate-950/90">
            {selectedFile.content}
          </div>
        </div>
      </div>
    </div>
  );
};
