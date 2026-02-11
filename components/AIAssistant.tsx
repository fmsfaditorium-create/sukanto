
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { askSukantaAI } from '../services/gemini';
import { ChatMessage } from '../types';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'হাই! আমি শিক্ষক এআই। ইংরেজি গ্রামার বা রাইটিং নিয়ে কোনো সাহায্য লাগবে?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await askSukantaAI(input);
    setMessages(prev => [...prev, { role: 'model', text: aiResponse || 'আমি ঠিক বুঝতে পারিনি।' }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all z-50 group"
      >
        {isOpen ? <X className="w-8 h-8" /> : (
          <div className="relative">
            <MessageSquare className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white animate-pulse"></span>
          </div>
        )}
        <div className="absolute right-20 bg-white text-slate-800 px-4 py-2 rounded-xl shadow-lg font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-100">
          শিক্ষক এআই এর সাথে কথা বলুন
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-[400px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold flex items-center">
                  শিক্ষক এআই <Sparkles className="ml-2 w-3 h-3 text-blue-200" />
                </h3>
                <p className="text-xs text-blue-100">আপনার ডিজিটাল টিউটর</p>
              </div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  <div className="flex items-center mb-1 text-[10px] opacity-70">
                    {msg.role === 'user' ? <User className="w-3 h-3 mr-1" /> : <Bot className="w-3 h-3 mr-1" />}
                    {msg.role === 'user' ? 'আপনি' : 'শিক্ষক এআই'}
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                   <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative">
              <input 
                type="text" 
                placeholder="প্রশ্ন করুন..."
                className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 top-1.5 p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Gemini AI দ্বারা চালিত। সঠিকতা যাচাই করে নিন।
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
