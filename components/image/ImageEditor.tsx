import React, { useState } from 'react';
import { geminiService } from '../../services/geminiService';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { ImageFile } from '../../types';
import { Download } from '../Icons';
import { useLanguage } from '../../LanguageContext';

const ImageEditor: React.FC = () => {
  const { t, language } = useLanguage();
  const [prompt, setPrompt] = useState<string>('Jadikan gambar ini kelihatan lebih mewah, terang dan estetik dengan sentuhan ton merah jambu yang lembut dan berseri.');
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage({
          file: file,
          base64: (reader.result as string).split(',')[1],
        });
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !originalImage) return;
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const result = await geminiService.editImage(prompt, originalImage);
      setEditedImage(result);
    } catch (err) {
      setError(t.common.error);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'shewrites-edited-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-gray-800 dark:text-gray-100 mb-2">{t.imageEditor.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t.imageEditor.description}</p>
      
      <form onSubmit={handleSubmit} className="mb-8 p-4 border border-pink-100 dark:border-slate-700 rounded-lg space-y-4 transition-colors duration-300">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.imageEditor.step1}</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 dark:file:bg-pink-900/30 file:text-brand-pink-700 dark:file:text-brand-pink-300 hover:file:bg-pink-200 dark:hover:file:bg-pink-900/50"/>
        </div>
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.imageEditor.step2}</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300 transition-colors duration-300"
              placeholder={t.common.placeholder}
            />
          </div>
          <Button type="submit" isLoading={isLoading} disabled={!originalImage || !prompt}>{t.imageEditor.button}</Button>
      </form>

      {error && <div className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-900/50 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="text-center">
          <h3 className="font-serif font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">{t.imageEditor.original}</h3>
          <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
            {originalImage ? (
              <img src={URL.createObjectURL(originalImage.file)} alt="Original" className="max-w-full max-h-full object-contain rounded-lg"/>
            ) : <p className="text-gray-500 dark:text-gray-400 text-sm">{t.common.upload} image to start</p>}
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-serif font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">{t.imageEditor.edited}</h3>
          <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg aspect-square flex items-center justify-center relative overflow-hidden">
            {isLoading && <Spinner />}
            {!isLoading && editedImage && (
              <>
                <img src={editedImage} alt="Edited" className="max-w-full max-h-full object-contain rounded-lg"/>
                <div className="absolute top-2 right-2">
                    <button
                        onClick={handleDownload}
                        className="flex items-center px-3 py-1.5 bg-black bg-opacity-50 text-white text-xs font-semibold rounded-full hover:bg-opacity-75 transition-colors"
                        aria-label="Download image"
                    >
                        <Download className="w-4 h-4 mr-1.5" />
                        {language === 'ms' ? 'Muat Turun' : 'Download'}
                    </button>
                </div>
              </>
            )}
            {!isLoading && !editedImage && <p className="text-gray-500 dark:text-gray-400 text-sm">{t.imageEditor.placeholder}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
