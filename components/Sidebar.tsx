
import React, { useState } from 'react';
import { Category, CategoryType } from '../types';
import { GraduationCap, FileText, Layout, ChevronRight, Tags, Book, Feather, BookOpen, PenTool } from 'lucide-react';
import DictionaryModal from './DictionaryModal';

interface SidebarProps {
  categories: Category[];
  selectedCategory: CategoryType | null;
  onSelectCategory: (cat: CategoryType | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  const [isDictOpen, setIsDictOpen] = useState(false);

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('grammar')) return GraduationCap;
    if (lower.includes('paragraph')) return FileText;
    if (lower.includes('essay')) return Layout;
    if (lower.includes('poetry')) return Feather;
    if (lower.includes('stories')) return BookOpen;
    if (lower.includes('writing')) return PenTool;
    return Tags;
  };

  const getColor = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('grammar')) return 'text-emerald-600';
    if (lower.includes('paragraph')) return 'text-amber-600';
    if (lower.includes('essay')) return 'text-purple-600';
    if (lower.includes('poetry')) return 'text-rose-500';
    if (lower.includes('stories')) return 'text-indigo-500';
    return 'text-blue-500';
  };

  const getBgColor = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('grammar')) return 'bg-emerald-50';
    if (lower.includes('paragraph')) return 'bg-amber-50';
    if (lower.includes('essay')) return 'bg-purple-50';
    if (lower.includes('poetry')) return 'bg-rose-50';
    if (lower.includes('stories')) return 'bg-indigo-50';
    return 'bg-blue-50';
  };

  return (
    <aside className="hidden lg:block w-72 h-fit space-y-6 sticky top-24">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
          ক্যাটাগরি সমূহ
        </h2>
        <nav className="space-y-2">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              selectedCategory === null ? 'bg-blue-600 text-white font-bold shadow-md' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Layout className="w-5 h-5" />
              <span>সব দেখুন</span>
            </div>
            <ChevronRight className={`w-4 h-4 ${selectedCategory === null ? 'opacity-100' : 'opacity-0'}`} />
          </button>
          
          {categories.map((cat) => {
            const Icon = getIcon(cat.name);
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  isActive ? `${getBgColor(cat.name)} ${getColor(cat.name)} font-bold shadow-sm border border-current/10` : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? '' : getColor(cat.name)}`} />
                  <span>{cat.labelBn}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-sm font-bold text-slate-500 mb-4 flex items-center uppercase tracking-wider">
          <Book className="w-4 h-4 mr-2 text-blue-600" />
          সহায়ক টুলস
        </h2>
        <button 
          onClick={() => setIsDictOpen(true)}
          className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-100 transition-all border border-blue-100"
        >
          <Book className="w-5 h-5" />
          <span>ডিকশনারী</span>
        </button>
        <p className="text-[10px] text-slate-400 mt-3 leading-tight">
          কঠিন ইংরেজি শব্দের অর্থ জানতে আমাদের স্মার্ট ডিকশনারী ব্যবহার করুন।
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
        <h3 className="font-bold mb-2">প্রিমিয়াম কোর্স</h3>
        <p className="text-sm text-blue-100 mb-4">সবগুলো গ্রামার লেসন একসাথে পেতে এনরোল করুন।</p>
        <button className="w-full bg-white text-blue-700 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors">
          বিস্তারিত দেখুন
        </button>
      </div>

      {isDictOpen && <DictionaryModal onClose={() => setIsDictOpen(false)} />}
    </aside>
  );
};

export default Sidebar;
