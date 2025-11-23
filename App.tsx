import React, { useState } from 'react';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import ResultsArea from './components/ResultsArea';
import { Paper, SearchFilters, SearchStatus } from './types';
import { searchPapersWithGemini } from './services/geminiService';
import { ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<SearchStatus>(SearchStatus.IDLE);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    yearStart: 2015,
    yearEnd: new Date().getFullYear(),
    minCitations: 0,
    maxResults: 50, 
    downloadPath: 'C:/Scholar_Papers'
  });

  const handleSearch = async () => {
    if (!filters.query.trim()) return;

    setStatus(SearchStatus.SEARCHING);
    setPapers([]);

    try {
      const results = await searchPapersWithGemini(
        filters.query,
        filters.yearStart,
        filters.yearEnd,
        filters.minCitations,
        filters.maxResults
      );
      setPapers(results);
      setStatus(SearchStatus.COMPLETED);
    } catch (error) {
      console.error(error);
      setStatus(SearchStatus.ERROR);
    }
  };

  const handleOpenScholar = () => {
    if (!filters.query) return;
    // Construct Google Scholar URL with filters
    const q = encodeURIComponent(`${filters.query}`);
    const url = `https://scholar.google.com/scholar?q=${q}&as_ylo=${filters.yearStart}&as_yhi=${filters.yearEnd}`;
    window.open(url, '_blank');
  };

  const handleTogglePaper = (id: string) => {
    setPapers(prev => prev.map(p => 
      p.id === id ? { ...p, selected: !p.selected } : p
    ));
  };

  const handleSelectAll = () => {
    setPapers(prev => prev.map(p => ({ ...p, selected: true })));
  };

  const handleDeselectAll = () => {
    setPapers(prev => prev.map(p => ({ ...p, selected: false })));
  };
  
  const handleClear = () => {
      setPapers([]);
      setStatus(SearchStatus.IDLE);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <Header />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 md:p-8 bg-gradient-to-b from-white to-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Batch Paper Downloader
            </h2>
            
            <div className="max-w-4xl mx-auto">
               <FilterPanel 
                filters={filters}
                status={status}
                onFilterChange={setFilters}
                onSearch={handleSearch}
                onOpenScholar={handleOpenScholar}
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="transition-all duration-500">
            <ResultsArea 
              papers={papers}
              status={status}
              downloadPath={filters.downloadPath}
              onTogglePaper={handleTogglePaper}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onClear={handleClear}
            />
        </div>
      </main>
      
      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© 2025 ScholarSync Tool. Designed for Academic Research.</p>
      </footer>
    </div>
  );
};

export default App;