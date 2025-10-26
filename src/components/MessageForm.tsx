import { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { Language, translations, countWords } from '../lib/translations';

interface MessageFormProps {
  language: Language;
}

const WORD_LIMIT = 250;
const AUTOSAVE_KEY = 'tsinga_message_draft';
const AUTOSAVE_INTERVAL = 1500; // 1.5 seconds

export function MessageForm({ language }: MessageFormProps) {
  const t = translations[language];
  const [preacherName, setPreacherName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(AUTOSAVE_KEY);
    if (savedDraft) {
      try {
        const { preacherName: savedPreacherName, message: savedMessage, timestamp } = JSON.parse(savedDraft);
        // Only restore if saved within last 7 days
        const savedTime = new Date(timestamp);
        const now = new Date();
        const daysDiff = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff <= 7) {
          setPreacherName(savedPreacherName || '');
          setMessage(savedMessage || '');
          setLastSaved(savedTime);
        } else {
          // Remove old draft
          localStorage.removeItem(AUTOSAVE_KEY);
        }
      } catch (error) {
        console.warn('Failed to load saved draft:', error);
        localStorage.removeItem(AUTOSAVE_KEY);
      }
    }
  }, []);

  // Autosave function
  const saveToLocalStorage = () => {
    if (preacherName.trim() || message.trim()) {
      const draftData = {
        preacherName,
        message,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draftData));
      setLastSaved(new Date());
      
      // Show save indicator briefly
      setShowSaveIndicator(true);
      setTimeout(() => setShowSaveIndicator(false), 1000);
    }
  };

  // Set up autosave when content changes
  useEffect(() => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    if (preacherName.trim() || message.trim()) {
      autosaveTimeoutRef.current = setTimeout(() => {
        saveToLocalStorage();
      }, AUTOSAVE_INTERVAL);
    }

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [preacherName, message]);

  // Clear draft when message is successfully sent
  const clearDraft = () => {
    localStorage.removeItem(AUTOSAVE_KEY);
    setLastSaved(null);
  };

  const wordCount = countWords(message);
  const isOverLimit = wordCount > WORD_LIMIT;
  const canSend = message.trim().length > 0 && !isOverLimit;

  const handleSubmit = () => {
    if (!canSend) return;

    setIsSubmitting(true);
    setShowSuccess(true);

    const whatsappText = preacherName.trim()
      ? `*${preacherName}*\n\n${message}`
      : message;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setMessage('');
      setPreacherName('');
      clearDraft(); // Clear the saved draft
      setShowSuccess(false);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t.formTitle}</h2>
          
          {/* Autosave indicator */}
          <div className="flex items-center space-x-1 text-sm text-gray-700">
            {showSaveIndicator && (
              <div className="flex items-center space-x-1 text-green-800 font-semibold">
                <Save className="w-4 h-4" />
                <span>Saved</span>
              </div>
            )}
            {lastSaved && !showSaveIndicator && (
              <div className="flex items-center space-x-1">
                <Save className="w-4 h-4" />
                <span>Auto-saved</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-800 leading-relaxed text-base sm:text-lg font-medium">{t.formDescription}</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-base font-bold text-gray-900 mb-3">
            {t.preacherNameLabel}
          </label>
          <input
            type="text"
            value={preacherName}
            onChange={(e) => setPreacherName(e.target.value)}
            placeholder={t.preacherNamePlaceholder}
            className="w-full px-3 sm:px-4 py-3 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all text-base text-gray-900 placeholder-gray-600"
          />
        </div>

        <div>
          <label className="block text-base font-bold text-gray-900 mb-3">
            {t.messageLabel}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.messagePlaceholder}
            rows={8}
            className="w-full px-3 sm:px-4 py-3 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-base min-h-[120px] sm:min-h-[200px] text-gray-900 placeholder-gray-600"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <span
              className={`text-lg font-bold ${
                isOverLimit ? 'text-red-700' : wordCount > 200 ? 'text-orange-600' : 'text-gray-800'
              }`}
            >
              {wordCount}
            </span>
            <span className="text-gray-700 text-sm sm:text-base font-medium">/ {WORD_LIMIT} {t.wordCount}</span>
          </div>

          {isOverLimit && (
            <div className="flex items-center justify-center sm:justify-end space-x-2 text-red-700 text-sm font-semibold bg-red-100 px-3 py-1 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{t.wordLimitWarning}</span>
            </div>
          )}
        </div>

        {showSuccess && (
          <div className="flex items-center justify-center space-x-2 text-green-800 bg-green-100 py-4 rounded-lg border-2 border-green-300">
            <CheckCircle className="w-6 h-6" />
            <span className="font-bold text-base sm:text-lg">{t.successMessage}</span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSend || isSubmitting}
          className={`w-full flex items-center justify-center space-x-3 py-4 sm:py-5 px-6 rounded-lg font-bold text-lg transition-all ${
            canSend && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 border-2 border-blue-700'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed border-2 border-gray-400'
          }`}
        >
          <Send className="w-6 h-6" />
          <span>{t.sendButton}</span>
        </button>
      </div>
    </div>
  );
}
