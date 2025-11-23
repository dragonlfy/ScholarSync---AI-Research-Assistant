import React from 'react';
import { SearchFilters, SearchStatus } from '../types';
import { Search, FolderDown, Calendar, ExternalLink, DownloadCloud } from 'lucide-react';

interface FilterPanelProps {
  filters: SearchFilters;
  status: SearchStatus;
  onFilterChange: (newFilters: SearchFilters) => void;
  onSearch: () => void;
  onOpenScholar: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, status, onFilterChange, onSearch, onOpenScholar }) => {
  const handleChange = (key: keyof SearchFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const isSearching = status === SearchStatus.SEARCHING;

  return (
    <div className="space-y-6">
      {/* Main Search Input */}
      <div className="relative">
        <input
            type="text"
            value={filters.query}
            onChange={(e) => handleChange('query', e.target.value)}
            placeholder="Enter research topic or keywords (e.g. 'Severe Case Warning in ICU')"
            className="w-full pl-5 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all shadow-sm"
        />
        <div className="absolute right-3 top-3">
           {/* Optional icon or clear button could go here */}
        </div>
      </div>

      {/* Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Year Range */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Year Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.yearStart}
              onChange={(e) => handleChange('yearStart', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded bg-white focus:border-indigo-500 outline-none text-sm"
            />
            <span className="text-gray-400 font-bold">-</span>
            <input
              type="number"
              value={filters.yearEnd}
              onChange={(e) => handleChange('yearEnd', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded bg-white focus:border-indigo-500 outline-none text-sm"
            />
          </div>
        </div>

        {/* Local Path */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <FolderDown className="w-3 h-3" /> Download to Local Folder
          </label>
          <input
            type="text"
            value={filters.downloadPath}
            onChange={(e) => handleChange('downloadPath', e.target.value)}
            placeholder="e.g. C:/Users/Name/Documents/Papers"
            className="w-full p-2 border border-gray-300 rounded bg-white focus:border-indigo-500 outline-none text-sm font-mono text-gray-600"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onOpenScholar}
          disabled={!filters.query}
          className="flex-1 py-3 px-6 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 group"
        >
          <ExternalLink className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
          Open Google Scholar
        </button>

        <button
          onClick={onSearch}
          disabled={isSearching || !filters.query.trim()}
          className={`flex-[2] py-3 px-6 rounded-xl text-white font-bold shadow-lg shadow-indigo-200 transition-all flex justify-center items-center gap-2
            ${isSearching 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0'
            }`}
        >
          {isSearching ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching & Extracting PDFs...
            </>
          ) : (
            <>
              <DownloadCloud className="w-5 h-5" />
              Find Papers & Gen Script
            </>
          )}
        </button>
      </div>
      
      <div className="text-center">
        <p className="text-xs text-gray-400">
          Tip: Use the "Open Google Scholar" button to verify results, then use the blue button to extract download links.
        </p>
      </div>
    </div>
  );
};

export default FilterPanel;