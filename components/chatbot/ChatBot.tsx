import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import Button from '../common/Button';
import { useLanguage } from '../../LanguageContext';

const ChatBot: React.FC = () => {
  const { t, language } = useLanguage();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    geminiService.startChat();
    setHistory([{ role: 'model', parts: [{ text: t.aiCoach.welcome }] }]);
  }, [language]); // Restart chat or refresh welcome when language changes

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    
    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setHistory(prev => [...prev, userMessage]);
    
    // Add a placeholder for the model's response
    setHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

    try {
      const stream = await geminiService.streamChatMessage(input);
      setInput('');
      
      for await (const chunk of stream) {
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].parts[0].text += chunk.text;
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].parts[0].text = t.aiCoach.error;
        return newHistory;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <h2 className="text-2xl font-serif font-bold text-gray-800 dark:text-gray-100 mb-1">{t.aiCoach.title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.aiCoach.description}</p>
      <div className="flex-grow bg-pink-50 dark:bg-slate-800/50 border border-pink-100 dark:border-slate-700 rounded-lg p-4 overflow-y-auto mb-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-brand-pink-500 text-white shadow-lg shadow-brand-pink-500/20' : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 shadow-sm border border-pink-50 dark:border-slate-700'}`}>
              <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
              {msg.role === 'model' && index === history.length - 1 && isLoading && <div className="w-2 h-2 bg-pink-300 dark:bg-pink-700 rounded-full animate-pulse inline-block ml-1"></div>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          className="flex-grow px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300"
          placeholder={t.aiCoach.placeholder}
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} isLoading={isLoading}>{t.aiCoach.send}</Button>
      </div>
    </div>
  );
};

export default ChatBot;
