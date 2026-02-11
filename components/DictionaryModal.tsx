
import React, { useState } from 'react';
import { Search, X, Book, Loader2, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { askSukantaAI } from '../services/gemini';

interface DictionaryModalProps {
  onClose: () => void;
}

const DictionaryModal: React.FC<DictionaryModalProps> = ({ onClose }) => {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<{ meaning: string; details: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;

    setLoading(true);
    setResult(null);
    
    // Updated prompt for Teacher AI
    const prompt = `Provide a dictionary entry for the English word "${word}". 
    Format your response EXACTLY like this:
    MEANING: [Primary Bengali Meaning Only]
    DETAILS: [Parts of Speech, Synonyms, and an Example Sentence with Bengali translation]
    
    Ensure the MEANING is just the word/phrase in Bengali.`;

    const response = await askSukantaAI(prompt);
    
    if (response) {
      const meaningMatch = response.match(/MEANING:\s*(.*)/i);
      const detailsMatch = response.match(/DETAILS:\s*([\s\S]*)/i);
      
      if (meaningMatch && detailsMatch) {
        setResult({
          meaning: meaningMatch[1].trim(),
          details: detailsMatch[1].trim()
        });
      } else {
        // Fallback if AI doesn't follow format exactly
        setResult({
          meaning: word,
          details: response
        });
      }
    }
    setLoading(false);
  };

  const handleBack = () => {
    setResult(null);
    setWord('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Book className="w-6 h-6" />
            <h2 className="text-xl font-bold">শিক্ষক স্মার্ট ডিকশনারী</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!result && !loading ? (
            <form onSubmit={handleLookup} className="relative mb-6 animate-in slide-in-from-top-4">
              <input 
                type="text" 
                autoFocus
                className="w-full pl-12 pr-4 py-4 bg-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-800"
                placeholder="যেকোনো ইংরেজি শব্দ লিখুন..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
              <Search className="absolute left-4 top-4.5 text-slate-400 w-6 h-6" />
              <button 
                type="submit"
                disabled={!word.trim()}
                className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                খুঁজুন
              </button>
            </form>
          ) : null}

          <div className="min-h-[300px] max-h-[450px] overflow-y-auto bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 text-slate-400 py-12">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="font-medium animate-pulse">অর্থ খোঁজা হচ্ছে...</p>
              </div>
            ) : result ? (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center text-blue-600 mb-6">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">ডিকশনারী ফলাফল</span>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-slate-400 text-xs font-bold uppercase mb-1">বাংলা অর্থ:</h3>
                  <div className="text-3xl md:text-4xl font-extrabold text-blue-900 leading-tight">
                    {result.meaning}
                  </div>
                </div>

                <div className="prose prose-blue prose-sm max-w-none mb-10">
                  <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">বিস্তারিত:</h3>
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    {result.details}
                  </div>
                </div>

                <button 
                  onClick={handleBack}
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>ফেরত যান</span>
                </button>
              </div>
            ) : !loading && (
              <div className="h-full flex flex-col items-center justify-center space-y-4 text-slate-300 text-center py-12">
                <AlertCircle className="w-12 h-12" />
                <p className="text-sm max-w-[200px]">শব্দ লিখে 'খুঁজুন' বাটনে ক্লিক করুন</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-tighter">শিক্ষক ডিজিটাল লার্নিং • AI অ্যাসিস্ট্যান্ট</p>
        </div>
      </div>
    </div>
  );
};

export default DictionaryModal;
