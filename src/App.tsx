import { useState } from 'react';
import { Header } from './components/Header';
import { MessageForm } from './components/MessageForm';
import { Features } from './components/Features';
import { Language, translations } from './lib/translations';

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-100">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="py-12 px-4 space-y-16">
        <MessageForm language={language} />
        <Features language={language} />
      </main>

      <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-amber-100 py-8 mt-16 border-t-2 border-amber-600">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="italic text-sm mb-2">{t.footerVerse}</p>
          <p className="text-slate-400 text-xs">Daily Word Ministry - Empowering God's servants to share the Gospel at Tsinga</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
