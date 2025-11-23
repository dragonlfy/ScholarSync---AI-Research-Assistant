import React from 'react';
import { Paper } from '../types';
import { ExternalLink, CheckCircle, Circle, BookMarked, Download } from 'lucide-react';

interface PaperCardProps {
  paper: Paper;
  onToggle: (id: string) => void;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, onToggle }) => {
  return (
    <div 
      className={`group relative bg-white rounded-xl p-5 border transition-all duration-200 
        ${paper.selected ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'border-gray-200 shadow-sm hover:border-indigo-300'}
      `}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
              {paper.year}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
              {paper.publisher}
            </span>
            <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
              <BookMarked className="w-3 h-3" />
              ~{paper.citations} Citations
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-700 transition-colors">
            <a href={paper.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {paper.title}
            </a>
          </h3>
          
          <p className="text-sm text-gray-600 font-medium mb-3">
            {paper.authors.join(", ")}
          </p>
          
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {paper.summary}
          </p>
        </div>

        <button 
          onClick={() => onToggle(paper.id)}
          className="flex-shrink-0 text-gray-300 hover:text-indigo-600 transition-colors"
        >
          {paper.selected ? (
            <CheckCircle className="w-6 h-6 text-indigo-600" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <a 
          href={paper.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          View Source
        </a>
        
        {/* Visual indicator of downloadable status */}
        {paper.url.endsWith('.pdf') && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                <Download className="w-3 h-3" />
                Direct PDF
            </span>
        )}
      </div>
    </div>
  );
};

export default PaperCard;
