
import React from 'react';
import { ContentItem, CategoryType } from '../types';
import { ArrowRight, Bookmark } from 'lucide-react';

interface ContentCardProps {
  item: ContentItem;
  onClick: (item: ContentItem) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onClick }) => {
  const getBadgeColor = (type: CategoryType) => {
    // Fixed: CategoryType is a type, not a value. Using string literals 'Grammar', 'Paragraph', 'Essay'.
    switch (type) {
      case 'Grammar': return 'bg-emerald-100 text-emerald-700';
      case 'Paragraph': return 'bg-amber-100 text-amber-700';
      case 'Essay': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
      onClick={() => onClick(item)}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getBadgeColor(item.category)}`}>
          {item.category}
        </span>
        <button className="text-slate-300 hover:text-blue-500 transition-colors">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
        {item.titleBn} <span className="text-slate-400 font-normal text-sm block">({item.title})</span>
      </h3>
      
      <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">
        {item.excerpt}
      </p>
      
      <div className="flex items-center text-blue-600 font-bold text-sm pt-4 border-t border-slate-50 group-hover:translate-x-1 transition-transform">
        আরও পড়ুন <ArrowRight className="ml-2 w-4 h-4" />
      </div>
    </div>
  );
};

export default ContentCard;
