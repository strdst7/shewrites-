import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../../services/geminiService';
import Button from '../common/Button';
import { Volume2 } from '../Icons';
import { useLanguage } from '../../LanguageContext';

// Fix for TypeScript "Cannot find name 'SpeechRecognition'".
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  start: () => void;
  stop: () => void;
}

const AudioTools: React.FC = () => {
  const { t, language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [ttsText, setTtsText] = useState("Saya layak menikmati kehidupan yang tenang, mewah dan berkat. Rezeki dan kejayaan mengalir kepada saya dengan mudah setiap hari.");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Web Speech API for transcription
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition: SpeechRecognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'ms' ? 'ms-MY' : 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(prev => prev + finalTranscript);
      };
      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
        alert(language === 'ms' ? "Maaf, pelayar web anda tidak menyokong pengecam suara." : "Sorry, your browser does not support speech recognition.");
        return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript(''); // Clear previous transcript
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const playTTS = async () => {
    if (isSpeaking || !ttsText) return;
    setIsSpeaking(true);
    setAudioError(null);
    try {
        const base64Audio = await geminiService.textToSpeech(ttsText);
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const frameCount = dataInt16.length;
        const audioBuffer = audioContext.createBuffer(1, frameCount, 24000);
        const channelData = audioBuffer.getChannelData(0);

        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        source.onended = () => setIsSpeaking(false);
        
    } catch (err) {
        console.error("TTS failed", err);
        setAudioError(t.common.error);
        setIsSpeaking(false);
    }
  };


  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-gray-800 dark:text-gray-100 mb-6">{t.audioStudio.title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Transcription Section */}
        <div className="bg-pink-50 dark:bg-slate-800/50 p-6 rounded-lg border border-pink-100 dark:border-slate-700 transition-colors duration-300">
          <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-gray-200 mb-4">{t.audioStudio.speechToText.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t.audioStudio.speechToText.description}</p>
          <Button onClick={toggleRecording} isLoading={isRecording}>
            {isRecording ? t.audioStudio.speechToText.stop : t.audioStudio.speechToText.start}
          </Button>
          <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg min-h-[150px] border border-pink-100 dark:border-slate-700 shadow-inner transition-colors duration-300">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{transcript || t.audioStudio.speechToText.placeholder}</p>
          </div>
        </div>

        {/* Text-to-Speech Section */}
        <div className="bg-pink-50 dark:bg-slate-800/50 p-6 rounded-lg border border-pink-100 dark:border-slate-700 transition-colors duration-300">
          <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-gray-200 mb-4">{t.audioStudio.textToSpeech.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t.audioStudio.textToSpeech.description}</p>
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.audioStudio.textToSpeech.label}</label>
              <textarea 
                value={ttsText} 
                onChange={(e) => setTtsText(e.target.value)} 
                rows={4}
                className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300 transition-colors duration-300"
              />
          </div>
          <div className="mt-4">
            <Button onClick={playTTS} isLoading={isSpeaking} disabled={!ttsText}>
              <Volume2 className="w-5 h-5 mr-2"/>
              {isSpeaking ? t.common.generating : t.audioStudio.textToSpeech.button}
            </Button>
          </div>
           {audioError && <p className="text-red-500 mt-2">{audioError}</p>}
        </div>
      </div>
    </div>
  );
};

export default AudioTools;
