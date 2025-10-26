import { useState } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Language, translations, countWords } from '../lib/translations';

interface MessageFormProps {
  language: Language;
}

const WORD_LIMIT = 250;

export function MessageForm({ language }: MessageFormProps) {
  const t = translations[language];
  const [preacherName, setPreacherName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      setShowSuccess(false);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{t.formTitle}</h2>
        <p className="text-slate-600 leading-relaxed">{t.formDescription}</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t.preacherNameLabel}
          </label>
          <input
            type="text"
            value={preacherName}
            onChange={(e) => setPreacherName(e.target.value)}
            placeholder={t.preacherNamePlaceholder}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t.messageLabel}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.messagePlaceholder}
            rows={10}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`text-lg font-semibold ${
                isOverLimit ? 'text-red-600' : wordCount > 200 ? 'text-amber-600' : 'text-slate-600'
              }`}
            >
              {wordCount}
            </span>
            <span className="text-slate-500">/ {WORD_LIMIT} {t.wordCount}</span>
          </div>

          {isOverLimit && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{t.wordLimitWarning}</span>
            </div>
          )}
        </div>

        {showSuccess && (
          <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 py-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{t.successMessage}</span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSend || isSubmitting}
          className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-lg font-semibold text-white transition-all ${
            canSend && !isSubmitting
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
          <span>{t.sendButton}</span>
        </button>
      </div>
    </div>
  );
}
