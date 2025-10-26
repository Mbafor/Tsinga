import { useState } from 'react';
import { Header } from './components/Header';
import { MessageForm } from './components/MessageForm';
import { Features } from './components/Features';
import { Language, translations, detectBrowserLanguage } from './lib/translations';

function App() {
  const [language, setLanguage] = useState<Language>(detectBrowserLanguage());
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-100">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="py-8 sm:py-12 px-4 space-y-12 sm:space-y-16">
        <MessageForm language={language} />
        <Features language={language} />
      </main>

      <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white py-6 sm:py-8 mt-12 sm:mt-16 border-t-4 border-yellow-500">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="italic text-base mb-3 leading-relaxed font-semibold text-yellow-100">{t.footerVerse}</p>
          <p className="text-gray-300 text-sm leading-relaxed font-medium">Daily Word Ministry - Empowering God's servants to share the Gospel</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
