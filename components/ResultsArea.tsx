import React from 'react';
import { Paper, SearchStatus } from '../types';
import PaperCard from './PaperCard';
import { Download, FileText, Trash2, CheckSquare, Square, Code, FileDown, AlertCircle } from 'lucide-react';

interface ResultsAreaProps {
  papers: Paper[];
  status: SearchStatus;
  downloadPath: string;
  onTogglePaper: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onClear: () => void;
}

const ResultsArea: React.FC<ResultsAreaProps> = ({ 
  papers, 
  status, 
  downloadPath,
  onTogglePaper, 
  onSelectAll,
  onDeselectAll,
  onClear
}) => {
  const selectedCount = papers.filter(p => p.selected).length;

  const generatePythonScript = (papersToDownload: Paper[], path: string) => {
    // Clean path
    const sanitizedPath = path.replace(/\\/g, '/');
    const papersData = JSON.stringify(papersToDownload.map(p => ({
      title: p.title.replace(/"/g, '\\"'),
      url: p.url,
      year: p.year
    })), null, 4);

    return `
import os
import requests
import re
import sys
import time
import random

# --- CONFIGURATION ---
DOWNLOAD_DIR = r"${sanitizedPath}" 
PAPERS = ${papersData}
# ---------------------

def sanitize_filename(name):
    return re.sub(r'[\\\\/*?:"<>|]', "", name)

def download_file(url, filepath, retries=2):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    for attempt in range(retries + 1):
        try:
            response = requests.get(url, headers=headers, timeout=15, stream=True, verify=False)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=1024):
                        f.write(chunk)
                return True
            elif response.status_code == 403:
                print(f"    [!] 403 Forbidden (Anti-bot). Skipping.")
                return False
        except Exception as e:
            if attempt < retries:
                time.sleep(1)
                continue
            print(f"    [!] Error: {e}")
    return False

def main():
    print("===========================================")
    print("      ScholarSync Batch Downloader         ")
    print("===========================================")
    
    if not os.path.exists(DOWNLOAD_DIR):
        try:
            os.makedirs(DOWNLOAD_DIR)
        except:
            pass
            
    print(f"Target Folder: {os.path.abspath(DOWNLOAD_DIR)}")
    print(f"Queue: {len(PAPERS)} papers")
    print("-" * 40)

    success = 0
    
    # Disable SSL warnings for legacy university sites
    requests.packages.urllib3.disable_warnings()

    for i, paper in enumerate(PAPERS):
        title = paper['title']
        url = paper['url']
        year = paper['year']
        
        safe_title = sanitize_filename(title)[:120]
        filename = f"{year} - {safe_title}.pdf"
        filepath = os.path.join(DOWNLOAD_DIR, filename)
        
        print(f"[{i+1}/{len(PAPERS)}] Processing: {title[:40]}...")
        
        if os.path.exists(filepath):
            print(f"    -> Exists. Skipping.")
            success += 1
            continue
            
        if download_file(url, filepath):
            print(f"    -> Downloaded.")
            success += 1
        else:
            print(f"    -> Failed or Protected. Manual download needed.")
            
        # Be nice to servers
        time.sleep(random.uniform(0.5, 1.5))

    print("-" * 40)
    print(f"Done. {success}/{len(PAPERS)} saved.")
    input("Press Enter to close...")

if __name__ == "__main__":
    main()
`;
  };

  const handleDownloadScript = () => {
    if (selectedCount === 0) return;
    
    const selectedPapers = papers.filter(p => p.selected);
    const scriptContent = generatePythonScript(selectedPapers, downloadPath || 'Scholar_Downloads');
    
    const blob = new Blob([scriptContent], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'start_download.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (status === SearchStatus.IDLE) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileDown className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700">Ready to Extract Papers</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Enter your keywords above. You can jump to Google Scholar to verify, 
          or use our tool to extract PDF links and generate a batch download script.
        </p>
      </div>
    );
  }

  if (status === SearchStatus.SEARCHING) {
    return (
      <div className="space-y-4 animate-pulse max-w-4xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl border border-gray-200"></div>
        ))}
      </div>
    );
  }

  if (status === SearchStatus.ERROR) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-700">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-bold text-lg">Extraction Failed</p>
        <p className="mt-1">We couldn't retrieve the papers. Please try refining your keywords or checking your API connection.</p>
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center text-amber-800">
        <p className="font-bold">No direct PDF links found matching criteria.</p>
        <p className="mt-1">Try a broader year range or simpler keywords.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Found Papers ({papers.length})</h3>
          <p className="text-sm text-gray-500">Select the ones you want to download.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button onClick={onSelectAll} className="text-sm text-indigo-600 hover:underline font-medium">Select All</button>
            <span className="text-gray-300">|</span>
            <button onClick={onDeselectAll} className="text-sm text-gray-500 hover:underline">None</button>
            <span className="text-gray-300">|</span>
            <button onClick={onClear} className="text-sm text-red-500 hover:underline">Clear</button>
        </div>
      </div>

      {/* Download Call to Action */}
      {selectedCount > 0 && (
        <div className="sticky top-4 z-30 bg-indigo-600 text-white p-4 rounded-xl shadow-xl flex justify-between items-center mb-6 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">{selectedCount} Papers Selected</p>
              <p className="text-indigo-100 text-xs">Ready to generate batch script</p>
            </div>
          </div>
          <button 
            onClick={handleDownloadScript}
            className="bg-white text-indigo-700 px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Script
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        {papers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} onToggle={onTogglePaper} />
        ))}
      </div>
    </div>
  );
};

export default ResultsArea;