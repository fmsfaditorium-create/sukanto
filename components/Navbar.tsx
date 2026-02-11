
import React from 'react';
import { BookOpen, Search, Menu, X, User, ChevronDown, Circle, UserCircle } from 'lucide-react';
import { APP_NAME } from '../constants';
import { Category, CategoryType } from '../types';

interface NavbarProps {
  onSearch: (term: string) => void;
  searchTerm: string;
  onNavigate: (view: 'home' | CategoryType | 'writing' | 'admin') => void;
  onProfileClick: () => void;
  activeView: string | null;
  isLoggedIn: boolean;
  categories: Category[];
  visitorName: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, searchTerm, onNavigate, onProfileClick, activeView, isLoggedIn, categories, visitorName }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleNavClick = (view: 'home' | CategoryType | 'writing' | 'admin') => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  const linkClass = (view: string | null) => 
    `transition-all font-bold px-4 py-2 rounded-xl text-sm whitespace-nowrap ${
      activeView === view 
        ? 'text-blue-600 bg-blue-50 shadow-sm' 
        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
    }`;

  const mainCategories = categories.slice(0, 4);
  const otherCategories = categories.slice(4);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center py-3">
          <div 
            className="flex items-center space-x-2 cursor-pointer group shrink-0"
            onClick={() => handleNavClick('home')}
          >
            <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-blue-100">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tighter">{APP_NAME}</span>
          </div>

          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="পাঠ্যসূচী খুঁজুন..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-3 text-slate-400 w-4 h-4" />
            </div>
          </div>

          <div className="hidden lg:flex space-x-1 items-center overflow-x-auto px-2">
            <button onClick={() => handleNavClick('home')} className={linkClass('home')}>হোম</button>
            
            {mainCategories.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => handleNavClick(cat.name)} 
                className={linkClass(cat.name)}
              >
                {cat.labelBn}
              </button>
            ))}

            {otherCategories.length > 0 && (
              <div className="relative group">
                <button className="flex items-center space-x-1 transition-all font-bold px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
                  <span>আরও</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {otherCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleNavClick(cat.name)}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {cat.labelBn}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <button onClick={() => handleNavClick('writing')} className={linkClass('writing')}>রাইটিং</button>
          </div>

          <div className="flex items-center space-x-3 ml-4">
            {visitorName && (
              <button 
                onClick={onProfileClick}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl mr-2 hover:bg-blue-100 transition-colors"
              >
                <div className="relative">
                  <UserCircle className="w-4 h-4 text-blue-600" />
                  <Circle className="absolute -top-0.5 -right-0.5 w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-blue-700">{visitorName}</span>
              </button>
            )}

            <button 
              onClick={() => handleNavClick('admin')}
              className={`hidden sm:flex items-center space-x-2 px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg ${
                isLoggedIn 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-100' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{isLoggedIn ? 'ড্যাশবোর্ড' : 'লগইন'}</span>
            </button>

            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-8 space-y-6 shadow-2xl animate-in slide-in-from-top-4">
          <div className="relative w-full md:hidden">
            <input
              type="text"
              placeholder="সার্চ করুন..."
              className="w-full pl-11 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
          </div>

          {visitorName && (
            <div 
              onClick={onProfileClick}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-50 rounded-2xl cursor-pointer"
            >
              <UserCircle className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">আপনার প্রোফাইল</p>
                <p className="font-bold text-blue-800">{visitorName}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-blue-400 -rotate-90" />
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">মেনু নেভিগেশন</h4>
            <button onClick={() => handleNavClick('home')} className="text-left px-4 py-3 rounded-2xl hover:bg-blue-50 font-bold text-slate-700">হোম পেজ</button>
            
            {categories.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => handleNavClick(cat.name)} 
                className="text-left px-4 py-3 rounded-2xl hover:bg-blue-50 font-bold text-slate-700"
              >
                {cat.labelBn}
              </button>
            ))}
            
            <button onClick={() => handleNavClick('writing')} className="text-left px-4 py-3 rounded-2xl hover:bg-blue-50 font-bold text-slate-700">রাইটিং প্র্যাকটিস</button>
            
            <div className="pt-4 border-t border-slate-50 mt-4">
              <button onClick={() => handleNavClick('admin')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100">
                {isLoggedIn ? 'এডমিন ড্যাশবোর্ড' : 'এডমিন লগইন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
