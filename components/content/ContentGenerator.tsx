import React, { useState } from 'react';
import { geminiService } from '../../services/geminiService';
import Button from '../common/Button';
import Select from '../common/Select';
import { ContentSkeleton } from '../common/Skeleton';
import { useLanguage } from '../../LanguageContext';
import { Copy, Check, Bold, Italic, List } from '../Icons';
import { useRef, useEffect } from 'react';

const FormattingToolbar: React.FC<{ 
  onFormat: (type: 'bold' | 'italic' | 'list') => void 
}> = ({ onFormat }) => {
  return (
    <div className="flex items-center gap-1 mb-2 border-b border-pink-50 dark:border-slate-700 pb-2">
      <button
        type="button"
        onClick={() => onFormat('bold')}
        className="p-1 hover:bg-pink-100 dark:hover:bg-slate-700 rounded transition-colors"
        title="Bold"
      >
        <Bold className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
      <button
        type="button"
        onClick={() => onFormat('italic')}
        className="p-1 hover:bg-pink-100 dark:hover:bg-slate-700 rounded transition-colors"
        title="Italic"
      >
        <Italic className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
      <button
        type="button"
        onClick={() => onFormat('list')}
        className="p-1 hover:bg-pink-100 dark:hover:bg-slate-700 rounded transition-colors"
        title="Bullet List"
      >
        <List className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
};

const EditableResult: React.FC<{ 
  initialText: string; 
  label: string;
  onUpdate?: (text: string) => void;
}> = ({ initialText, label, onUpdate }) => {
  const [text, setText] = useState(initialText);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleFormat = (type: 'bold' | 'italic' | 'list') => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    let newText = text;

    if (type === 'bold') {
      newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
    } else if (type === 'italic') {
      newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
    } else if (type === 'list') {
      const lines = selectedText.split('\n');
      const bulletedLines = lines.map(line => line.trim().startsWith('•') ? line : `• ${line}`).join('\n');
      newText = text.substring(0, start) + bulletedLines + text.substring(end);
    }

    setText(newText);
    if (onUpdate) onUpdate(newText);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (onUpdate) onUpdate(e.target.value);
  };

  useEffect(() => {
    if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-pink-100 dark:border-slate-700 shadow-sm transition-all duration-300">
      <h4 className="font-bold text-brand-pink-700 dark:text-brand-pink-400 flex items-center mb-2 text-xs uppercase tracking-wider">
        {label}
      </h4>
      <FormattingToolbar onFormat={handleFormat} />
      <textarea
        ref={textAreaRef}
        value={text}
        onChange={handleChange}
        className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-gray-100 font-medium resize-none overflow-hidden min-h-[60px] p-0"
        rows={text.split('\n').length || 1}
      />
      <Stats text={text} />
    </div>
  );
};

interface FormData {
  language: string;
  brandVoice: string;
  tone: string;
  postType: string;
  goal: string;
  niche: string;
  offer: string;
  constraints: string;
  usePro: boolean;
  useSearch: boolean;
}

interface Result {
    hook: string;
    thread_post: string;
    cta: string;
    hashtag_block: string;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-brand-pink-600 hover:text-brand-pink-700 bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/20 dark:hover:bg-pink-900/30 rounded transition-colors duration-200"
      title={copied ? t.common.copied : t.common.copy}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? t.common.copied : t.common.copy}
    </button>
  );
};

const Stats: React.FC<{ text: string }> = ({ text }) => {
  const { t } = useLanguage();
  const characters = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  
  return (
    <div className="flex items-center justify-between mt-2">
      <div className="flex gap-3 text-[10px] uppercase tracking-wider font-bold opacity-50">
        <span>{words} {t.common.wordCount}</span>
        <span>{characters} {t.common.charCount}</span>
      </div>
      <CopyButton text={text} />
    </div>
  );
};

const ContentGenerator: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    language: 'Bahasa Melayu (Santai & Mesra)',
    brandVoice: 'Santai Tapi Moden',
    tone: 'Empowering',
    postType: 'morning_affirmation',
    goal: 'inspire_motivate',
    niche: 'Bisnes Digital & Pemasaran Usahawan Wanita',
    offer: 'Masterclass "Jualan Tular Threads 5 Angka"',
    constraints: 'Guna emoji. Gaya Bahasa Melayu conversational yang menarik, bernilai tinggi dan santai.',
    usePro: false,
    useSearch: false,
  });
  const [result, setResult] = useState<Result | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const prompt = `
      ARAAN UTAMA: Hasilkan kandungan perniagaan/gaya hidup wanita khas untuk aplikasi SheWrites! bagi pasaran MALAYSIA (Threads & Instagram).
      Sila pastikan kandungan dihasilkan sepenuhnya mengikut gaya bahasa: ${formData.language}.
      Gunakan frasa dan budaya relevan komuniti usahawan wanita Malaysia.

      Parameter Kandungan:
      - Gaya Nada Suara (Brand Voice): ${formData.brandVoice}
      - Tone of Voice (Mood): ${formData.tone}
      - Jenis Post: ${formData.postType}
      - Matlamat Utama (Goal): ${formData.goal}
      - Niche / Topik: ${formData.niche}
      - Produk / Tawaran Ditawarkan: ${formData.offer}
      - Nota & Syarat Tambahan: ${formData.constraints}

      Sila kembalikan kandungan dalam format JSON yang mengandungi 'hook', 'thread_post', 'cta', dan 'hashtag_block' (dengan tag pagar popular Malaysia seperti #BisnesMalaysia #WanitaKerjaya #UsahawanWanita #ThreadsMalaysia #InspirasiRezeki).
    `;

    try {
      const response = await geminiService.generateContent(prompt, formData.usePro, formData.useSearch);
      if (formData.useSearch) {
          setResult(response.text);
      } else {
          const parsedResult = JSON.parse(response.text.replace(/```json\n?/, '').replace(/```$/, ''));
          setResult(parsedResult as Result);
      }
    } catch (err) {
      setError(t.common.error);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-gray-800 dark:text-gray-100 mb-2">{t.contentGenerator.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t.contentGenerator.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label={t.contentGenerator.language} name="language" value={formData.language} onChange={handleChange} options={[
            { value: 'Bahasa Melayu (Santai & Mesra)', label: 'Bahasa Melayu (Santai & Mesra)' },
            { value: 'Bahasa Melayu (Rasmi & Profesional)', label: 'Bahasa Melayu (Rasmi & Profesional)' },
            { value: 'Bahasa Melayu (Inspirasi & Emosi)', label: 'Bahasa Melayu (Inspirasi & Emosi)' },
            { value: 'Bilingual / Manglish (Melayu + Inggeris)', label: 'Bilingual / Manglish (Melayu + Inggeris)' },
          ]} />
          <Select label={t.contentGenerator.brandVoice} name="brandVoice" value={formData.brandVoice} onChange={handleChange} options={[
            { value: 'Santai Tapi Moden', label: 'Santai Tapi Moden' },
            { value: 'BFF Entrepreneur (Mesra Akrab)', label: 'BFF Entrepreneur (Mesra Akrab)' },
            { value: 'Gadis Aesthetic & Wealth', label: 'Gadis Aesthetic & Wealth' },
            { value: 'Gaya Hidup Mewah (Quiet Luxury)', label: 'Gaya Hidup Mewah (Quiet Luxury)' },
            { value: 'Wanita Kerjaya & Faith/Rezeki', label: 'Wanita Kerjaya & Faith/Rezeki' },
            { value: 'Boss Babe Malaysia', label: 'Boss Babe Malaysia' },
            { value: 'Motivasi & Pemikiran Positif', label: 'Motivasi & Pemikiran Positif' },
          ]} />
          <Select label={t.contentGenerator.tone} name="tone" value={formData.tone} onChange={handleChange} options={[
            { value: 'Empowering', label: 'Empowering (Memperkasa)' },
            { value: 'Professional', label: 'Professional (Berwibawa)' },
            { value: 'Witty', label: 'Witty (Kelakar & Bijak)' },
            { value: 'Luxury', label: 'Luxury (Mewah & Eksklusif)' },
            { value: 'Minimalist', label: 'Minimalist (Ringkas & Padat)' },
            { value: 'Bold & Confident', label: 'Bold & Confident (Berani)' },
            { value: 'Soft & Gentle', label: 'Soft & Gentle (Lembut & Menenangkan)' },
          ]} />
          <Select label={t.contentGenerator.postType} name="postType" value={formData.postType} onChange={handleChange} options={[
            { value: 'thread_single', label: 'Post Threads Tunggal' },
            { value: 'morning_affirmation', label: 'Affirmasi Pagi & Rezeki' },
            { value: 'promo', label: 'Post Promosi & Jualan' },
            { value: 'behind_the_scenes', label: 'Di Sebalik Tabir (Behind the Scenes)' },
            { value: 'client_testimonial', label: 'Kisah Kejayaan / Testimoni Pelanggan' },
            { value: 'relatable_meme_idea', label: 'Idea Pikat/Meme Relatable Usahawan' },
            { value: 'grwm_idea', label: 'Idea GRWM (Get Ready With Me)'},
            { value: 'money_mindset_memo', label: 'Memo Mindset Kewangan & Kejayaan'},
          ]} />
          <Select label={t.contentGenerator.goal} name="goal" value={formData.goal} onChange={handleChange} options={[
            { value: 'drive_sales', label: 'Tingkatkan Jualan (Drive Sales)' },
            { value: 'grow_followers', label: 'Tambah Pengikut (Grow Followers)' },
            { value: 'awareness', label: 'Kesedaran Jenama (Build Awareness)' },
            { value: 'build_community', label: 'Bina Komuniti (Build Community)' },
            { value: 'increase_engagement', label: 'Tingkatkan Interaksi (Engagement)' },
            { value: 'launch_product', label: 'Pelancaran Produk (Launch Product)' },
            { value: 'inspire_motivate', label: 'Inspirasi & Motivasi' },
            { value: 'showcase_expertise', label: 'Tunjuk Kepakaran & Kredibiliti' },
          ]} />
           <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.contentGenerator.niche}</label>
              <input type="text" name="niche" value={formData.niche} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300" />
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.contentGenerator.offer}</label>
              <input type="text" name="offer" value={formData.offer} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300" />
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.contentGenerator.constraints}</label>
              <textarea name="constraints" value={formData.constraints} onChange={handleChange} rows={3} className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300"></textarea>
          </div>
          <div className="flex flex-col gap-2 pt-1">
              <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" name="usePro" checked={formData.usePro} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-brand-pink-600 focus:ring-brand-pink-500" /> <span>{t.contentGenerator.usePro}</span></label>
              <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" name="useSearch" checked={formData.useSearch} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-brand-pink-600 focus:ring-brand-pink-500" /> <span>{t.contentGenerator.useSearch}</span></label>
          </div>
          <Button type="submit" isLoading={isLoading}>{t.contentGenerator.button}</Button>
        </form>

        <div className="bg-pink-50 dark:bg-slate-800/50 rounded-lg p-6 h-full flex flex-col justify-between border border-pink-100 dark:border-slate-700">
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-100 mb-4">{t.common.result}</h3>
              {isLoading && <ContentSkeleton />}
              {error && <div className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-900/50">{error}</div>}
              {result && (
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      {typeof result === 'string' ? (
                         <EditableResult 
                            initialText={result} 
                            label={t.common.result}
                         />
                      ) : (
                          <>
                              <EditableResult 
                                initialText={result.hook} 
                                label={t.contentGenerator.results.hook} 
                              />
                              <EditableResult 
                                initialText={result.thread_post} 
                                label={t.contentGenerator.results.thread} 
                              />
                              <EditableResult 
                                initialText={result.cta} 
                                label={t.contentGenerator.results.cta} 
                              />
                              <EditableResult 
                                initialText={result.hashtag_block} 
                                label={t.contentGenerator.results.hashtags} 
                              />
                          </>
                      )}
                  </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;
