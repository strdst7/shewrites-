import React, { useState } from 'react';
import { geminiService } from '../../services/geminiService';
import Button from '../common/Button';
import Select from '../common/Select';
import { ImageSkeleton } from '../common/Skeleton';
import { Download } from '../Icons';
import { ImageFile } from '../../types';
import { useLanguage } from '../../LanguageContext';

const ImageGenerator: React.FC = () => {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState<string>('Susunan meja kerja estetik untuk usahawan wanita Malaysia. Jurnal merah jambu, iPad dengan nota digital, kopi latte berhias art, dan sejambak bunga di atas meja marmar. Pencahayaan terang, tenang dan elegan.');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [overlayText, setOverlayText] = useState("REZEKI MENGALIR DENGAN MUDAH");
  const [sourceImage, setSourceImage] = useState<ImageFile | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage({
          file: file,
          base64: (reader.result as string).split(',')[1],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSourceImage = () => {
      setSourceImage(null);
      const input = document.getElementById('source-image-input') as HTMLInputElement;
      if (input) {
          input.value = '';
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    setIsLoading(true);
    setError(null);
    setImage(null);

    try {
      const generatedImage = await geminiService.generateImage(prompt, aspectRatio, sourceImage);
      setImage(generatedImage);
    } catch (err) {
      setError(t.common.error);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = 'her-daily-threads-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getAspectRatioClass = () => {
    switch(aspectRatio) {
      case '9:16': return 'aspect-[9/16]';
      case '16:9': return 'aspect-[16/9]';
      case '4:3': return 'aspect-[4/3]';
      case '3:4': return 'aspect-[3/4]';
      default: return 'aspect-square';
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-gray-800 dark:text-gray-100 mb-2">{t.imageGenerator.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t.imageGenerator.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.imageGenerator.prompt}</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300"
              placeholder={t.common.placeholder}
            />
          </div>
          <Select
            label={t.imageGenerator.aspectRatio}
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            options={[
              { value: '1:1', label: 'Segi Empat Sama (1:1)' },
              { value: '16:9', label: 'Melintang / Landscape (16:9)' },
              { value: '9:16', label: 'Menegak / Portrait (9:16)' },
              { value: '4:3', label: 'Piawai / Standard (4:3)' },
              { value: '3:4', label: 'Tinggi (3:4)' },
            ]}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.imageGenerator.reference}</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t.imageGenerator.referenceDesc}</p>
            <input id="source-image-input" type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 dark:file:bg-pink-900/30 file:text-brand-pink-700 dark:file:text-brand-pink-300 hover:file:bg-pink-200 dark:hover:file:bg-pink-900/50"/>
          </div>
    
          {sourceImage && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-sm border border-pink-100 dark:border-slate-700">
                <img src={URL.createObjectURL(sourceImage.file)} alt="Reference" className="w-full h-full object-cover" />
                <button
                    type="button"
                    onClick={clearSourceImage}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 leading-none hover:bg-opacity-75 transition-colors"
                    aria-label="Remove reference image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
          )}
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.imageGenerator.overlayText}</label>
            <input
              type="text"
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300"
              placeholder="Contoh: INGATAN HARI INI..."
            />
          </div>
          <Button type="submit" isLoading={isLoading}>{t.imageGenerator.button}</Button>
        </form>

        <div className="bg-pink-50 dark:bg-slate-800/50 rounded-lg p-4 flex justify-center items-center border border-pink-100 dark:border-slate-700 min-h-[300px]">
          {isLoading && <ImageSkeleton message={t.common.generating} />}
          {error && <div className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-900/50">{error}</div>}
          {image && (
            <div className={`relative w-full max-w-md ${getAspectRatioClass()}`}>
              <img src={image} alt="Generated content" className="object-cover w-full h-full rounded-lg shadow-lg" />
              {overlayText && (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <p className="text-center text-white font-serif text-2xl md:text-3xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                    {overlayText}
                  </p>
                </div>
              )}
               <div className="absolute top-2 right-2">
                <button
                    onClick={handleDownload}
                    className="flex items-center px-3 py-1.5 bg-black bg-opacity-50 text-white text-xs font-semibold rounded-full hover:bg-opacity-75 transition-colors"
                    aria-label="Download image"
                >
                    <Download className="w-4 h-4 mr-1.5" />
                    {t.ms ? 'Muat Turun' : 'Download'}
                </button>
              </div>
            </div>
          )}
          {!isLoading && !image && !error && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>{t.imageGenerator.placeholder}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;