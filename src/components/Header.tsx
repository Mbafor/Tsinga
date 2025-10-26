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
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Main header content with title on left and toggle on right */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-2 sm:p-2.5 lg:p-3 rounded-lg shadow-lg flex-shrink-0 border-2 border-yellow-600">
              <Cross className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-900" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight text-white leading-tight">{t.appTitle}</h1>
              <p className="text-yellow-200 text-xs sm:text-sm lg:text-base font-bold mt-0.5 sm:mt-1 leading-tight">{t.tagline}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-gray-800 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-3 focus:ring-yellow-400 transition-all cursor-pointer hover:bg-gray-700 text-sm sm:text-base font-semibold"
              aria-label={t.languageLabel}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        <div className="text-center mt-3 sm:mt-4 lg:mt-6 border-t-2 border-gray-600 pt-2 sm:pt-3 lg:pt-4">
          <p className="text-yellow-100 italic text-xs sm:text-sm lg:text-base leading-relaxed px-1 sm:px-2 font-semibold">{t.heroVerse}</p>
        </div>
      </div>
    </header>
  );
}
