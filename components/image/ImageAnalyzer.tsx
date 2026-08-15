import React, { useState } from 'react';
import { geminiService } from '../../services/geminiService';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { ImageFile } from '../../types';
import { useLanguage } from '../../LanguageContext';

const ImageAnalyzer: React.FC = () => {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState<string>("Analisis estetika gambar ini mengikut persepsi usahawan wanita Malaysia. Adakah ia bermotifkan 'soft life', 'boss babe', atau 'quiet luxury'? Cadangkan 5 idea post Threads tular dalam Bahasa Melayu berdasarkan mood gambar ini.");
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile({
          file: file,
          base64: (reader.result as string).split(',')[1],
        });
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !imageFile) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await geminiService.analyzeImage(prompt, imageFile);
      setAnalysis(result);
    } catch (err) {
      setError(t.common.error);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-gray-800 dark:text-gray-100 mb-2">{t.imageAnalyzer.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t.imageAnalyzer.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.imageAnalyzer.step1}</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 dark:file:bg-pink-900/30 file:text-brand-pink-700 dark:file:text-brand-pink-300 hover:file:bg-pink-200 dark:hover:file:bg-pink-900/50"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.imageAnalyzer.step2}</label>
                    <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300"
                    placeholder={t.common.placeholder}
                    />
                </div>
                <Button type="submit" isLoading={isLoading} disabled={!imageFile || !prompt}>{t.imageAnalyzer.button}</Button>
            </form>
            <div className="text-center pt-4">
                <h3 className="font-serif font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">{t.imageAnalyzer.yourImage}</h3>
                <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
                    {imageFile ? (
                    <img src={URL.createObjectURL(imageFile.file)} alt="Untuk dianalisis" className="max-w-full max-h-full object-contain rounded-lg"/>
                    ) : <p className="text-gray-500 dark:text-gray-400 text-sm">{t.common.upload} image to start</p>}
                </div>
            </div>
        </div>

        <div className="bg-pink-50 dark:bg-slate-800/50 rounded-lg p-6 border border-pink-100 dark:border-slate-700 transition-colors duration-300">
            <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-100 mb-4">{t.imageAnalyzer.aiAnalysis}</h3>
            {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
            {error && <div className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-900/50">{error}</div>}
            {analysis && (
                <div className="space-y-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {analysis}
                </div>
            )}
             {!isLoading && !analysis && !error && (
                <div className="text-center text-gray-500 dark:text-gray-400 pt-10">
                <p>{t.imageAnalyzer.placeholder}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzer;
