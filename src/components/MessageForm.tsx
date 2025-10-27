import { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { Language, translations, countWords } from '../lib/translations';

interface MessageFormProps {
  language: Language;
}

const WORD_LIMIT = 250;
const AUTOSAVE_KEY = 'tsinga_message_draft';
const AUTOSAVE_INTERVAL = 1000; // Exactly 1 second
const FORCE_SAVE_INTERVAL = 5000; // Force save every 5 seconds as backup

export function MessageForm({ language }: MessageFormProps) {
  const t = translations[language];
  const [preacherName, setPreacherName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveCount, setSaveCount] = useState(0);
  
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const forceSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>('');

  // Enhanced localStorage check with retry mechanism
  const isLocalStorageAvailable = () => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  // Load saved draft on component mount
  useEffect(() => {
    console.log('MessageForm mounted, checking for saved draft...');
    
    if (!isLocalStorageAvailable()) {
      console.error('localStorage is NOT available');
      setAutoSaveStatus('error');
      return;
    }

    try {
      const savedDraft = localStorage.getItem(AUTOSAVE_KEY);
      console.log('Raw saved draft:', savedDraft);
      
      if (savedDraft) {
        const { preacherName: savedPreacherName, message: savedMessage, timestamp } = JSON.parse(savedDraft);
        const savedTime = new Date(timestamp);
        const now = new Date();
        const daysDiff = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60 * 24);
        
        console.log('Draft details:', { 
          savedPreacherName, 
          messageLength: savedMessage?.length, 
          daysDiff,
          savedTime: savedTime.toLocaleString()
        });
        
        if (daysDiff <= 7 && (savedPreacherName || savedMessage)) {
          setPreacherName(savedPreacherName || '');
          setMessage(savedMessage || '');
          setLastSaved(savedTime);
          lastContentRef.current = `${savedPreacherName || ''}|${savedMessage || ''}`;
          console.log('✅ Draft RESTORED successfully');
        } else {
          localStorage.removeItem(AUTOSAVE_KEY);
          console.log('❌ Draft too old or empty, removed');
        }
      } else {
        console.log('ℹ️ No saved draft found');
      }
    } catch (error) {
      console.error('❌ Failed to load saved draft:', error);
      localStorage.removeItem(AUTOSAVE_KEY);
      setAutoSaveStatus('error');
    }
  }, []);

  // Enhanced autosave function with retry logic
  const saveToLocalStorage = async (forceLog = false) => {
    const currentContent = `${preacherName.trim()}|${message.trim()}`;
    
    // Skip if content hasn't changed (unless forced)
    if (!forceLog && currentContent === lastContentRef.current) {
      return;
    }

    if (!isLocalStorageAvailable()) {
      console.error('❌ localStorage not available during save attempt');
      setAutoSaveStatus('error');
      return;
    }

    const hasContent = preacherName.trim() || message.trim();
    
    if (hasContent) {
      try {
        setAutoSaveStatus('saving');
        const draftData = {
          preacherName: preacherName.trim(),
          message: message.trim(),
          timestamp: new Date().toISOString(),
          wordCount: countWords(message),
          saveNumber: saveCount + 1
        };
        
        // Attempt to save with retry
        let saveSuccess = false;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (!saveSuccess && retryCount < maxRetries) {
          try {
            localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draftData));
            
            // Verify the save worked by reading it back
            const verification = localStorage.getItem(AUTOSAVE_KEY);
            if (verification) {
              const parsed = JSON.parse(verification);
              if (parsed.preacherName === draftData.preacherName && parsed.message === draftData.message) {
                saveSuccess = true;
              }
            }
          } catch (retryError) {
            retryCount++;
            console.warn(`Save attempt ${retryCount} failed:`, retryError);
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms before retry
            }
          }
        }
        
        if (saveSuccess) {
          setLastSaved(new Date());
          setAutoSaveStatus('saved');
          setSaveCount(prev => prev + 1);
          lastContentRef.current = currentContent;
          
          console.log('✅ AUTOSAVE SUCCESS:', { 
            preacherName: draftData.preacherName, 
            messageLength: draftData.message.length,
            wordCount: draftData.wordCount,
            saveNumber: draftData.saveNumber,
            timestamp: new Date().toLocaleTimeString()
          });
          
          // Show save indicator
          setShowSaveIndicator(true);
          setTimeout(() => {
            setShowSaveIndicator(false);
            setAutoSaveStatus('idle');
          }, 1500);
        } else {
          throw new Error('Save verification failed after retries');
        }
        
      } catch (error) {
        console.error('❌ AUTOSAVE FAILED after retries:', error);
        setAutoSaveStatus('error');
        
        // Try to clear corrupted data
        try {
          localStorage.removeItem(AUTOSAVE_KEY);
        } catch (clearError) {
          console.error('Failed to clear corrupted data:', clearError);
        }
      }
    } else {
      // Clear draft if no content
      try {
        localStorage.removeItem(AUTOSAVE_KEY);
        setLastSaved(null);
        setAutoSaveStatus('idle');
        lastContentRef.current = '';
        console.log('🗑️ Draft cleared (no content)');
      } catch (error) {
        console.error('Failed to clear empty draft:', error);
      }
    }
  };

  // Set up regular autosave every 1 second when content changes
  useEffect(() => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    const hasContent = preacherName.trim() || message.trim();
    
    if (hasContent) {
      autosaveTimeoutRef.current = setTimeout(() => {
        saveToLocalStorage();
      }, AUTOSAVE_INTERVAL);
    }

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [preacherName, message, saveCount]);

  // Set up force save interval every 5 seconds as backup
  useEffect(() => {
    forceSaveIntervalRef.current = setInterval(() => {
      const hasContent = preacherName.trim() || message.trim();
      if (hasContent) {
        console.log('🔄 FORCE SAVE triggered (5-second backup)');
        saveToLocalStorage(true);
      }
    }, FORCE_SAVE_INTERVAL);

    return () => {
      if (forceSaveIntervalRef.current) {
        clearInterval(forceSaveIntervalRef.current);
      }
    };
  }, [preacherName, message]);

  // Enhanced page unload and visibility change handlers
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (preacherName.trim() || message.trim()) {
        console.log('🚪 Page unloading, saving draft...');
        saveToLocalStorage(true);
        // Add a small delay to ensure save completes
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && (preacherName.trim() || message.trim())) {
        console.log('👁️ Page hidden, saving draft...');
        saveToLocalStorage(true);
      } else if (document.visibilityState === 'visible') {
        console.log('👁️ Page visible again');
      }
    };

    const handleFocus = () => {
      console.log('🔍 Window focused');
      // Check if draft still exists when returning to page
      const savedDraft = localStorage.getItem(AUTOSAVE_KEY);
      if (savedDraft) {
        console.log('✅ Draft still exists on focus');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [preacherName, message]);

  // Clear draft when message is successfully sent
  const clearDraft = () => {
    try {
      localStorage.removeItem(AUTOSAVE_KEY);
      setLastSaved(null);
      setAutoSaveStatus('idle');
      setSaveCount(0);
      lastContentRef.current = '';
      console.log('🗑️ Draft cleared after successful send');
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
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
          
          {/* Enhanced Autosave indicator */}
          <div className="flex items-center space-x-1 text-sm">
            {showSaveIndicator && (
              <div className="flex items-center space-x-1 text-green-800 font-bold animate-pulse">
                <Save className="w-4 h-4" />
                <span>Saving...</span>
              </div>
            )}
            {lastSaved && !showSaveIndicator && autoSaveStatus !== 'error' && (
              <div className="flex items-center space-x-1 text-green-700 font-semibold">
                <Save className="w-4 h-4" />
                <span>Auto-saved</span>
              </div>
            )}
            {autoSaveStatus === 'error' && (
              <div className="flex items-center space-x-1 text-red-700 font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>Save failed</span>
              </div>
            )}
            {!lastSaved && !showSaveIndicator && autoSaveStatus === 'idle' && (preacherName.trim() || message.trim()) && (
              <div className="flex items-center space-x-1 text-gray-600">
                <Save className="w-4 h-4" />
                <span>Will auto-save</span>
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

          <div className="flex items-center space-x-3">
            {isOverLimit && (
              <div className="flex items-center space-x-2 text-red-700 text-sm font-semibold bg-red-100 px-3 py-1 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span>{t.wordLimitWarning}</span>
              </div>
            )}
          </div>
        </div>

        {showSuccess && (
          <div className="flex items-center justify-center space-x-2 text-green-800 bg-green-100 py-4 rounded-lg border-2 border-green-300">
            <CheckCircle className="w-6 h-6" />
            <span className="font-bold text-base sm:text-lg">{t.successMessage}</span>
          </div>
        )}

        {/* Debug info hidden in production - autosave still works silently in background */}

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
