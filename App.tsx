
import React, { useState, useMemo, useEffect } from 'react';
import { Category, ContentItem, CategoryType, UserSession, Complaint } from './types';
import { CONTENT_DATA, APP_NAME, DEFAULT_CATEGORIES } from './constants';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ContentCard from './components/ContentCard';
import AIAssistant from './components/AIAssistant';
import AdminPanel from './components/AdminPanel';
import { 
  ChevronLeft, Share2, Printer, Bookmark, Search, BookOpen, 
  UserCircle, ArrowRight, Phone, ShieldCheck, Loader2, X, 
  LogOut, CheckCircle, Smartphone, Monitor, Info, MapPin, 
  MessageSquareWarning, Send, Mail
} from 'lucide-react';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isWritingView, setIsWritingView] = useState(false);
  const [viewingItemId, setViewingItemId] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Visitor & Verification states
  const [visitorName, setVisitorName] = useState<string | null>(localStorage.getItem('shikkhok_visitor_name'));
  const [visitorMobile, setVisitorMobile] = useState<string | null>(localStorage.getItem('shikkhok_visitor_mobile'));
  const [isVerified, setIsVerified] = useState<boolean>(localStorage.getItem('shikkhok_visitor_verified') === 'true');
  const [visitorLocation, setVisitorLocation] = useState<{latitude: number, longitude: number} | null>(null);
  
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'info' | 'otp'>('info');
  const [tempName, setTempName] = useState('');
  const [tempMobile, setTempMobile] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  // Complaint state
  const [complaintText, setComplaintText] = useState('');
  const [complaintMobile, setComplaintMobile] = useState(visitorMobile || '');
  const [complaintEmail, setComplaintEmail] = useState('');
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  // Sync complaint mobile with visitor mobile when verified
  useEffect(() => {
    if (visitorMobile && !complaintMobile) {
      setComplaintMobile(visitorMobile);
    }
  }, [visitorMobile]);

  // Function to load data from storage
  const loadData = () => {
    const savedCategories = localStorage.getItem('shikkhok_categories');
    const cats = savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
    setCategories(cats);

    const savedContent = localStorage.getItem('shikkhok_custom_content');
    const customItems = savedContent ? JSON.parse(savedContent) : [];
    setContentList([...CONTENT_DATA, ...customItems]);
  };

  const handleSaveCategories = (updatedCats: Category[]) => {
    setCategories(updatedCats);
    localStorage.setItem('shikkhok_categories', JSON.stringify(updatedCats));
  };

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let device = "Desktop PC";
    if (/android/i.test(ua)) device = "Android Mobile";
    else if (/iPhone|iPad|iPod/i.test(ua)) device = "iOS Device";
    else if (/Windows/i.test(ua)) device = "Windows PC";
    else if (/Mac/i.test(ua)) device = "Apple Mac";

    let browser = "Browser";
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";

    return `${device} (${browser})`;
  };

  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setVisitorLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  useEffect(() => {
    loadData();
    if (isVerified) {
      fetchLocation();
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'shikkhok_custom_content' || e.key === 'shikkhok_categories') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isVerified]);

  useEffect(() => {
    if (!visitorName || !visitorMobile || !isVerified) return;

    const updateSession = () => {
      const savedSessions = localStorage.getItem('shikkhok_active_sessions');
      let sessions: UserSession[] = savedSessions ? JSON.parse(savedSessions) : [];
      
      const now = Date.now();
      sessions = sessions.filter(s => (now - s.lastActive) < 300000);
      
      const existingIdx = sessions.findIndex(s => s.id === sessionId);
      const deviceInfo = getDeviceInfo();

      if (existingIdx > -1) {
        sessions[existingIdx].lastActive = now;
        sessions[existingIdx].name = visitorName;
        sessions[existingIdx].mobile = visitorMobile;
        sessions[existingIdx].device = deviceInfo;
        if (visitorLocation) {
          sessions[existingIdx].location = visitorLocation;
        }
      } else {
        sessions.push({ 
          id: sessionId, 
          name: visitorName, 
          mobile: visitorMobile, 
          device: deviceInfo,
          location: visitorLocation || undefined,
          lastActive: now 
        });
      }
      
      localStorage.setItem('shikkhok_active_sessions', JSON.stringify(sessions));
    };

    updateSession();
    const interval = setInterval(updateSession, 20000);
    return () => clearInterval(interval);
  }, [visitorName, visitorMobile, isVerified, sessionId, visitorLocation]);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim() && tempMobile.trim()) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setVerificationStep('otp');
      }, 1200);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '1234') { 
      setIsVerifying(true);
      fetchLocation(); 
      setTimeout(() => {
        localStorage.setItem('shikkhok_visitor_name', tempName.trim());
        localStorage.setItem('shikkhok_visitor_mobile', tempMobile.trim());
        localStorage.setItem('shikkhok_visitor_verified', 'true');
        setVisitorName(tempName.trim());
        setVisitorMobile(tempMobile.trim());
        setIsVerified(true);
        setIsVerifying(false);
        setShowVisitorModal(false);
        
        if (pendingItemId) {
          setViewingItemId(pendingItemId);
          setPendingItemId(null);
        }
      }, 800);
    } else {
      alert('ভুল ওটিপি কোড! অনুগ্রহ করে ১২৩৪ ব্যবহার করুন।');
    }
  };

  const handleLogoutVisitor = () => {
    localStorage.removeItem('shikkhok_visitor_name');
    localStorage.removeItem('shikkhok_visitor_mobile');
    localStorage.removeItem('shikkhok_visitor_verified');
    setVisitorName(null);
    setVisitorMobile(null);
    setIsVerified(false);
    setVisitorLocation(null);
    setShowProfileModal(false);
    setViewingItemId(null);
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim() || (!complaintMobile.trim() && !complaintEmail.trim())) {
      alert('অনুগ্রহ করে আপনার অভিযোগ এবং অন্তত একটি যোগাযোগের মাধ্যম (মোবাইল বা ইমেইল) প্রদান করুন।');
      return;
    }

    setIsSubmittingComplaint(true);
    
    setTimeout(() => {
      const savedComplaints = localStorage.getItem('shikkhok_complaints');
      const complaints: Complaint[] = savedComplaints ? JSON.parse(savedComplaints) : [];
      
      const newComplaint: Complaint = {
        id: `comp-${Date.now()}`,
        userName: visitorName || 'অপরিচিত ইউজার',
        userMobile: complaintMobile || visitorMobile || 'নেই',
        userEmail: complaintEmail || undefined,
        message: complaintText,
        timestamp: Date.now()
      };
      
      localStorage.setItem('shikkhok_complaints', JSON.stringify([...complaints, newComplaint]));
      
      setIsSubmittingComplaint(false);
      setComplaintText('');
      setComplaintEmail('');
      // Keep mobile as it might be visitor's default
      setComplaintSuccess(true);
      
      setTimeout(() => setComplaintSuccess(false), 3000);
    }, 1000);
  };

  const isUserAuthorized = isLoggedIn || (!!visitorName && !!visitorMobile && isVerified);

  const viewingItem = useMemo(() => {
    if (!viewingItemId || !isUserAuthorized) return null;
    return contentList.find(item => item.id === viewingItemId) || null;
  }, [viewingItemId, contentList, isUserAuthorized]);

  const filteredItems = useMemo(() => {
    return contentList.filter(item => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(searchStr) || 
        item.titleBn.toLowerCase().includes(searchStr) ||
        item.excerpt.toLowerCase().includes(searchStr) ||
        item.content.toLowerCase().includes(searchStr);
      
      let matchesCategory = true;
      if (isWritingView) {
        matchesCategory = item.category === 'Paragraph' || item.category === 'Essay';
      } else if (selectedCategory) {
        matchesCategory = item.category === selectedCategory;
      }
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, isWritingView, contentList]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() !== '') {
      setViewingItemId(null);
      setIsAdminMode(false);
    }
  };

  const handleNavigate = (view: 'home' | CategoryType | 'writing' | 'admin') => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'admin') {
      setIsAdminMode(true);
      setViewingItemId(null);
      return;
    }
    setIsAdminMode(false);
    setViewingItemId(null);
    setSearchTerm('');
    if (view === 'home') {
      setSelectedCategory(null);
      setIsWritingView(false);
    } else if (view === 'writing') {
      setSelectedCategory(null);
      setIsWritingView(true);
    } else {
      setSelectedCategory(view);
      setIsWritingView(false);
    }
  };

  const handleItemClick = (item: ContentItem) => {
    if (!isUserAuthorized) {
      setPendingItemId(item.id);
      setVerificationStep('info');
      setOtpInput('');
      setShowVisitorModal(true);
    } else {
      setViewingItemId(item.id);
      window.scrollTo(0, 0);
    }
  };

  const activeViewLabel = isAdminMode ? 'admin' : isWritingView ? 'writing' : (selectedCategory || 'home');

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 bg-slate-50">
      <Navbar 
        onSearch={handleSearch} 
        searchTerm={searchTerm} 
        onNavigate={handleNavigate}
        onProfileClick={() => setShowProfileModal(true)}
        activeView={activeViewLabel}
        isLoggedIn={isLoggedIn}
        categories={categories}
        visitorName={visitorName}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {isAdminMode ? (
          <AdminPanel 
            isLoggedIn={isLoggedIn} 
            onLogin={() => setIsLoggedIn(true)} 
            onLogout={() => setIsLoggedIn(false)}
            contentList={contentList}
            categories={categories}
            onAddItem={(item) => {
              const updated = [...contentList, item];
              setContentList(updated);
              localStorage.setItem('shikkhok_custom_content', JSON.stringify(updated.filter(i => !CONTENT_DATA.find(orig => orig.id === i.id))));
            }}
            onUpdateItem={(updatedItem) => {
              const updated = contentList.map(i => i.id === updatedItem.id ? updatedItem : i);
              setContentList(updated);
              localStorage.setItem('shikkhok_custom_content', JSON.stringify(updated.filter(i => !CONTENT_DATA.find(orig => orig.id === i.id))));
            }}
            onDeleteItem={(id) => {
              const updated = contentList.filter(i => i.id !== id);
              setContentList(updated);
              localStorage.setItem('shikkhok_custom_content', JSON.stringify(updated.filter(i => !CONTENT_DATA.find(orig => orig.id === i.id))));
            }}
            onSaveCategories={handleSaveCategories}
          />
        ) : viewingItem ? (
          <div className="animate-in fade-in slide-in-from-left-4">
            <button 
              onClick={() => { setViewingItemId(null); window.scrollTo(0, 0); }}
              className="flex items-center text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> ফিরে যান
            </button>
            <article className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              <div className="p-8 lg:p-12">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                    {viewingItem.category}
                  </span>
                  {viewingItem.subCategory && (
                    <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-medium">
                      {viewingItem.subCategory}
                    </span>
                  )}
                </div>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                      {viewingItem.titleBn}
                    </h1>
                    <p className="text-xl text-slate-500 font-medium italic">
                      {viewingItem.title}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-colors"><Share2 className="w-5 h-5" /></button>
                    <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-colors"><Printer className="w-5 h-5" /></button>
                    <button className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"><Bookmark className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="prose prose-blue prose-lg max-w-none text-slate-700 leading-relaxed space-y-6">
                  {viewingItem.content.split('\n').map((para, i) => (
                    <p key={i} className="whitespace-pre-wrap">{para.trim()}</p>
                  ))}
                </div>
              </div>
            </article>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <Sidebar 
              categories={categories}
              selectedCategory={selectedCategory} 
              onSelectCategory={(cat) => { 
                setSelectedCategory(cat); 
                setIsWritingView(false); 
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
            <div className="flex-1">
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                  {isWritingView ? (
                    <>ক্যাটাগরি: <span className="text-blue-600">রাইটিং (Writing)</span></>
                  ) : selectedCategory ? (
                    <>ক্যাটাগরি: <span className="text-blue-600">{categories.find(c => c.name === selectedCategory)?.labelBn || selectedCategory}</span></>
                  ) : (
                    searchTerm ? `"${searchTerm}" এর ফলাফল` : 'আপনার শিক্ষার যাত্রা শুরু হোক এখানে'
                  )}
                </h2>
                <p className="text-slate-500">{searchTerm ? `${filteredItems.length}টি কন্টেন্ট পাওয়া গেছে` : 'সেরা রিসোর্সগুলো আপনার জন্য খুঁজে নিন।'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredItems.map(item => (
                  <ContentCard key={item.id} item={item} onClick={handleItemClick} />
                ))}
              </div>
              {filteredItems.length === 0 && (
                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-300">
                  <div className="text-slate-300 mb-4 flex justify-center"><Search className="w-16 h-16" /></div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">কোনো ফলাফল পাওয়া যায়নি</h3>
                  <button onClick={() => handleNavigate('home')} className="mt-6 text-blue-600 font-bold hover:underline">সব কন্টেন্ট দেখুন</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Complaint Box Section */}
        {!isAdminMode && (
          <section className="mt-20 max-w-2xl mx-auto pb-10">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2 rounded-xl">
                    <MessageSquareWarning className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">অভিযোগ বা মতামত</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">আপনার কথা আমাদের জানান</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                {complaintSuccess ? (
                  <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800">ধন্যবাদ!</h4>
                    <p className="text-slate-500 text-center">আপনার অভিযোগটি সফলভাবে জমা হয়েছে।</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitComplaint} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <input 
                          type="tel" 
                          placeholder="মোবাইল নম্বর"
                          className="w-full pl-20 pr-4 py-3.5 bg-slate-100 border-2 border-slate-500 rounded-3xl focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                          value={complaintMobile}
                          onChange={(e) => setComplaintMobile(e.target.value)}
                        />
                        <Phone className="absolute left-4 top-4 text-slate-300 w-4 h-4" />
                      </div>
                      </br>
                      
                    <textarea 
                      required
                      placeholder="আপনার সমস্যা বা অভিযোগ বিস্তারিত লিখুন..."
                      className="w-full min-h-[120px] p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                      value={complaintText}
                      onChange={(e) => setComplaintText(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={isSubmittingComplaint || !complaintText.trim()}
                      className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                      {isSubmittingComplaint ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>সাবমিট করুন</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-wider mt-2">
                      * মোবাইল অথবা ইমেইল যেকোনো একটি দেওয়া বাধ্যতামূলক
                    </p>
                  </form>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Verification Modal */}
      {showVisitorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 p-8 md:p-10 animate-in zoom-in-95 duration-500 relative">
            <button onClick={() => setShowVisitorModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${verificationStep === 'info' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-emerald-500 text-white'}`}>
                  {verificationStep === 'info' ? '১' : <CheckCircle className="w-4 h-4" />}
                </div>
                <div className={`w-12 h-1 rounded-full ${verificationStep === 'otp' ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${verificationStep === 'otp' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                  ২
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg shadow-blue-50">
                {verificationStep === 'info' ? <UserCircle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                {verificationStep === 'info' ? 'আপনার তথ্য দিন' : 'কোড ভেরিফিকেশন'}
              </h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {verificationStep === 'info' 
                  ? 'বিস্তারিত পড়ার জন্য অনুগ্রহ করে নাম ও মোবাইল নম্বর দিয়ে নিবন্ধিত হন।' 
                  : `আমরা আপনার ${tempMobile} নম্বরে একটি কোড পাঠিয়েছি।`}
              </p>
            </div>

            {verificationStep === 'info' ? (
              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">পূর্ণ নাম</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      autoFocus
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                      placeholder="আপনার নাম লিখুন..."
                      value={tempName}
                      onChange={e => setTempName(e.target.value)}
                    />
                    <UserCircle className="absolute right-4 top-3.5 text-slate-300 w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">মোবাইল নম্বর</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                      placeholder="০১6XXXXXXXX"
                      value={tempMobile}
                      onChange={e => setTempMobile(e.target.value)}
                    />
                    <Phone className="absolute right-4 top-3.5 text-slate-300 w-5 h-5" />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-blue-600 text-white py-4 mt-2 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center space-x-3 group disabled:opacity-70"
                >
                  {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      <span>কোড পাঠান</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <input 
                    type="text" 
                    autoFocus
                    required
                    maxLength={4}
                    className="w-full text-center px-4 py-5 bg-slate-50 border-2 border-blue-100 rounded-3xl focus:border-blue-500 focus:bg-white outline-none transition-all font-black text-3xl tracking-[1.5rem] text-blue-600 placeholder:text-slate-200"
                    placeholder="0000"
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value)}
                  />
                  <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 animate-pulse">
                    <div className="flex items-center space-x-1">
                      <Info className="w-3 h-3 text-blue-500" />
                      <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">টেস্ট কোড: ১২৩৪</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={isVerifying || otpInput.length < 4}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      <ShieldCheck className="w-6 h-6" />
                      <span>ভেরিফাই ও প্রবেশ</span>
                    </>
                  )}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setVerificationStep('info')}
                  className="w-full text-slate-400 text-xs font-bold hover:text-blue-600 transition-colors"
                >
                  মোবাইল নম্বর পরিবর্তন করুন
                </button>
              </form>
            )}
            <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-widest font-bold">{APP_NAME} Hub • Secure Education</p>
          </div>
        </div>
      )}

      {/* Visitor Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-sm rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-500 relative">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 h-28 w-full relative">
               <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
            </div>
            <div className="px-8 pb-10 -mt-14 text-center relative z-10">
              <div className="w-28 h-28 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center mx-auto mb-4 border-8 border-white">
                <UserCircle className="w-16 h-16 text-blue-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{visitorName || 'অপরিচিত'}</h2>
              <div className="flex items-center justify-center space-x-2 mt-2">
                 <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full flex items-center">
                   <ShieldCheck className="w-3 h-3 mr-1" /> ভেরিফাইড ইউজার
                 </p>
              </div>
              
              <div className="mt-8 space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm"><Phone className="w-4 h-4 text-blue-500" /></div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">মোবাইল নম্বর</p>
                      <p className="font-bold text-slate-700">{visitorMobile}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm"><Smartphone className="w-4 h-4 text-indigo-500" /></div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ডিভাইস</p>
                      <p className="font-bold text-slate-700 text-[10px]">{getDeviceInfo().split('(')[0]}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button 
                    onClick={() => setShowProfileModal(false)}
                    className="bg-slate-100 text-slate-600 py-3.5 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    বন্ধ করুন
                  </button>
                  <button 
                    onClick={handleLogoutVisitor}
                    className="bg-red-50 text-red-600 py-3.5 rounded-2xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>লগআউট</span>
                  </button>
                </div>
              </div>
            </div>
            <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-20">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6 cursor-pointer group" onClick={() => handleNavigate('home')}>
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform"><BookOpen className="text-white w-5 h-5" /></div>
            <span className="text-xl font-bold text-slate-800">{APP_NAME}</span>
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">বাংলাদেশের শিক্ষার্থীদের জন্য মানসম্মত ইংরেজি শেখার প্ল্যাটফর্ম। সহজ ভাষায় গ্রামার এবং রাইটিং এর সমাধান।</p>
          <div className="mt-8 pt-8 border-t border-slate-100 text-slate-400 text-xs">© {new Date().getFullYear()} {APP_NAME}। সর্বস্বত্ব সংরক্ষিত।</div>
        </div>
      </footer>
      {!isAdminMode && <AIAssistant />}
    </div>
  );
};

export default App;
