import { Cross, Globe } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function Header({ language, onLanguageChange }: HeaderProps) {
  const t = translations[language];

  return (
    <header className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white shadow-xl">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-lg shadow-lg">
              <Cross className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t.appTitle}</h1>
              <p className="text-amber-300 text-sm font-medium mt-1">{t.tagline}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-amber-300" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer hover:bg-slate-600"
              aria-label={t.languageLabel}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        <div className="text-center mt-6 border-t border-slate-700 pt-4">
          <p className="text-amber-200 italic text-sm">{t.heroVerse}</p>
        </div>
      </div>
    </header>
  );
}
