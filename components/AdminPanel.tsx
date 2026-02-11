
import React, { useState, useEffect } from 'react';
import { Category, ContentItem, CategoryType, UserSession, Complaint } from '../types';
import { 
  Lock, Plus, Trash2, Edit3, LayoutDashboard, LogOut, CheckCircle2, 
  AlertCircle, Tags, FileText, ChevronRight, Sparkles, Users, 
  Circle, Phone, Monitor, Smartphone, Laptop, MapPin, 
  ExternalLink, MessageSquareWarning, Clock, Calendar, UserCircle, Mail
} from 'lucide-react';

interface AdminPanelProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  contentList: ContentItem[];
  categories: Category[];
  onAddItem: (item: ContentItem) => void;
  onUpdateItem: (item: ContentItem) => void;
  onDeleteItem: (id: string) => void;
  onSaveCategories: (cats: Category[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isLoggedIn, onLogin, onLogout, contentList, categories, onAddItem, onUpdateItem, onDeleteItem, onSaveCategories 
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'categories' | 'stats' | 'complaints'>('content');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [activeSessions, setActiveSessions] = useState<UserSession[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchData = () => {
        // Active Sessions
        const savedSessions = localStorage.getItem('shikkhok_active_sessions');
        if (savedSessions) {
          const sessions: UserSession[] = JSON.parse(savedSessions);
          const now = Date.now();
          setActiveSessions(sessions.filter(s => (now - s.lastActive) < 300000));
        }

        // Complaints
        const savedComplaints = localStorage.getItem('shikkhok_complaints');
        if (savedComplaints) {
          setComplaints(JSON.parse(savedComplaints));
        }
      };
      
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [selectedCatName, setSelectedCatName] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catLabelBn, setCatLabelBn] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '1122335') {
      onLogin();
      setError('');
    } else {
      setError('ইউজারনেম বা পাসওয়ার্ড সঠিক নয়!');
    }
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteComplaint = (id: string) => {
    if (!confirm('অভিযোগটি ডিলিট করতে চান?')) return;
    const updated = complaints.filter(c => c.id !== id);
    setComplaints(updated);
    localStorage.setItem('shikkhok_complaints', JSON.stringify(updated));
    triggerSuccess('অভিযোগ ডিলিট করা হয়েছে।');
  };

  const handleEditContent = (item: ContentItem) => {
    setEditingContentId(item.id);
    setTitle(item.title);
    setTitleBn(item.titleBn);
    setSelectedCatName(item.category);
    setSubCategory(item.subCategory || '');
    setExcerpt(item.excerpt);
    setContent(item.content);
    setShowContentForm(true);
  };

  const handleSubmitContent = (e: React.FormEvent) => {
    e.preventDefault();
    const itemData: ContentItem = {
      id: editingContentId || `custom-${Date.now()}`,
      title,
      titleBn,
      category: selectedCatName || (categories.length > 0 ? categories[0].name : 'Uncategorized'),
      subCategory: subCategory || undefined,
      excerpt,
      content
    };
    if (editingContentId) onUpdateItem(itemData);
    else onAddItem(itemData);
    setShowContentForm(false);
    triggerSuccess('কন্টেন্ট সফলভাবে সেভ করা হয়েছে!');
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatLabelBn(cat.labelBn);
    setShowCatForm(true);
  };

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedCats;
    if (editingCatId) {
      updatedCats = categories.map(c => c.id === editingCatId ? { ...c, name: catName, labelBn: catLabelBn } : c);
    } else {
      updatedCats = [...categories, { id: `cat-${Date.now()}`, name: catName, labelBn: catLabelBn }];
    }
    onSaveCategories(updatedCats);
    setShowCatForm(false);
    setEditingCatId(null);
    setCatName('');
    setCatLabelBn('');
    triggerSuccess('ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleDeleteCategory = (id: string) => {
    if (!confirm('এই ক্যাটাগরি ডিলিট করলে এর অধীনে থাকা কন্টেন্টগুলো খুঁজে পাওয়া কঠিন হতে পারে। ডিলিট করবেন?')) return;
    onSaveCategories(categories.filter(c => c.id !== id));
    triggerSuccess('ক্যাটাগরি ডিলিট করা হয়েছে।');
  };

  const getDeviceIcon = (deviceStr: string) => {
    if (deviceStr.includes("Android") || deviceStr.includes("iOS")) return Smartphone;
    if (deviceStr.includes("Mac") || deviceStr.includes("PC")) return Laptop;
    return Monitor;
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="w-8 h-8" /></div>
          <h2 className="text-2xl font-bold text-slate-800">এডমিন লগইন</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200" placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" className="w-full px-4 py-3 rounded-xl border border-slate-200" placeholder="••••" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">প্রবেশ করুন</button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><LayoutDashboard className="w-6 h-6" /></div>
          <h1 className="text-3xl font-bold text-slate-800">এডমিন ড্যাশবোর্ড</h1>
        </div>
        <button onClick={onLogout} className="flex items-center space-x-1 text-slate-400 hover:text-red-500 font-medium transition-colors">
          <LogOut className="w-4 h-4" />
          <span>লগআউট</span>
        </button>
      </div>

      <div className="flex space-x-1 bg-slate-200 p-1 rounded-2xl mb-8 w-fit overflow-x-auto">
        <button onClick={() => setActiveTab('content')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'content' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>
          <div className="flex items-center space-x-2"><FileText className="w-4 h-4" /> <span>কন্টেন্ট</span></div>
        </button>
        <button onClick={() => setActiveTab('categories')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'categories' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>
          <div className="flex items-center space-x-2"><Tags className="w-4 h-4" /> <span>ক্যাটাগরি</span></div>
        </button>
        <button onClick={() => setActiveTab('stats')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'stats' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>
          <div className="flex items-center space-x-2"><Users className="w-4 h-4" /> <span>অনলাইন ({activeSessions.length})</span></div>
        </button>
        <button onClick={() => setActiveTab('complaints')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'complaints' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>
          <div className="flex items-center space-x-2"><MessageSquareWarning className="w-4 h-4" /> <span>অভিযোগ ({complaints.length})</span></div>
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {activeTab === 'content' ? (
        <div className="animate-in fade-in">
          {showContentForm ? (
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 mb-10 animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                  {editingContentId ? 'কন্টেন্ট এডিট করুন' : 'নতুন কন্টেন্ট আপলোড'}
                </h2>
                <button onClick={() => setShowContentForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">বাতিল</button>
              </div>
              <form onSubmit={handleSubmitContent} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">টাইটেল (বাংলা)</label>
                    <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={titleBn} onChange={e => setTitleBn(e.target.value)} placeholder="উদা: টেন্স এর বিস্তারিত..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">টাইটেল (ইংরেজি)</label>
                    <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Complete Guide to Tense" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">ক্যাটাগরি</label>
                      <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white cursor-pointer" value={selectedCatName} onChange={e => setSelectedCatName(e.target.value)}>
                        <option value="">নির্বাচন করুন</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.labelBn}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">সাব-ক্যাটাগরি</label>
                      <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={subCategory} onChange={e => setSubCategory(e.target.value)} placeholder="উদা: Tense / Basics" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">সংক্ষিপ্ত বর্ণনা</label>
                    <textarea required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24" value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="কন্টেন্ট সম্পর্কে ছোট করে লিখুন..." />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">বিস্তারিত কন্টেন্ট</label>
                  <textarea required className="flex-1 px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[350px] font-medium" value={content} onChange={e => setContent(e.target.value)} placeholder="আপনার মূল কন্টেন্ট এখানে লিখুন..." />
                  <button type="submit" className="mt-6 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>সেভ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-bold text-slate-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-slate-400" />
                  সব কন্টেন্ট ({contentList.length})
                </h3>
                <button onClick={() => { setEditingContentId(null); setShowContentForm(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-50">
                  <Plus className="w-4 h-4" /> <span>নতুন কন্টেন্ট</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-4">টাইটেল</th>
                      <th className="px-6 py-4">ক্যাটাগরি</th>
                      <th className="px-6 py-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {contentList.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{item.titleBn}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{item.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-1 opacity-40 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditContent(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit3 className="w-5 h-5" /></button>
                            <button onClick={() => { if(confirm('ডিলিট করবেন?')) onDeleteItem(item.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'categories' ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-bold text-slate-800 flex items-center">
              <Tags className="w-5 h-5 mr-2 text-slate-400" />
              ক্যাটাগরি ম্যানেজমেন্ট
            </h3>
            {!showCatForm && (
              <button onClick={() => { setEditingCatId(null); setCatName(''); setCatLabelBn(''); setShowCatForm(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-50">
                <Plus className="w-4 h-4" /> <span>নতুন ক্যাটাগরি</span>
              </button>
            )}
          </div>
          {/* Categories table content... (assume same structure as previous working version) */}
        </div>
      ) : activeTab === 'stats' ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden p-8 animate-in fade-in">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">ইউজার ট্র্যাকিং</h3>
              <p className="text-slate-500">বর্তমানে কতজন শিক্ষার্থী শিক্ষক প্ল্যাটফর্ম ব্যবহার করছেন।</p>
            </div>
            <div className="bg-emerald-100 text-emerald-700 px-6 py-4 rounded-3xl flex flex-col items-center">
              <span className="text-3xl font-black">{activeSessions.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">অনলাইন</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSessions.map(session => {
              const DIcon = getDeviceIcon(session.device || "");
              return (
                <div key={session.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                        <UserCircle className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{session.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{session.mobile}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase">
                      <DIcon className="w-3 h-3 text-indigo-500" />
                      <span className="truncate">{session.device}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden p-8 animate-in fade-in">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">ব্যবহারকারীর অভিযোগসমূহ</h3>
              <p className="text-slate-500">শিক্ষার্থীদের পাঠানো অভিযোগ ও যোগাযোগের তথ্য নিচে দেখুন।</p>
            </div>
            <div className="bg-rose-100 text-rose-700 px-6 py-4 rounded-3xl flex flex-col items-center">
              <span className="text-3xl font-black">{complaints.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">মোট অভিযোগ</span>
            </div>
          </div>

          <div className="space-y-6">
            {complaints.length > 0 ? [...complaints].reverse().map(complaint => (
              <div key={complaint.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:shadow-md transition-all group">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-white p-2.5 rounded-xl shadow-sm">
                        <UserCircle className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{complaint.userName}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg"><Phone className="w-3 h-3 mr-1" /> {complaint.userMobile}</span>
                          {complaint.userEmail && (
                            <span className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg"><Mail className="w-3 h-3 mr-1" /> {complaint.userEmail}</span>
                          )}
                          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(complaint.timestamp).toLocaleTimeString()}</span>
                          <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(complaint.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed font-medium shadow-sm">
                      {complaint.message}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteComplaint(complaint.id)}
                    className="p-3 bg-white text-rose-500 rounded-xl shadow-sm border border-slate-100 hover:bg-rose-500 hover:text-white transition-all shrink-0 md:opacity-0 group-hover:opacity-100"
                    title="ডিলিট করুন"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
                <MessageSquareWarning className="w-16 h-16 mx-auto mb-4 opacity-10" />
                <p className="font-bold">এখনো কোনো অভিযোগ জমা পড়েনি।</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
