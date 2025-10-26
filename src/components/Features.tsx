import { BookOpen, Send, Globe2 } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface FeaturesProps {
  language: Language;
}

export function Features({ language }: FeaturesProps) {
  const t = translations[language];

  const features = [
    {
      icon: BookOpen,
      title: t.feature1Title,
      description: t.feature1Description,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300'
    },
    {
      icon: Send,
      title: t.feature2Title,
      description: t.feature2Description,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300'
    },
    {
      icon: Globe2,
      title: t.feature3Title,
      description: t.feature3Description,
      color: 'text-purple-700',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-300'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl shadow-lg p-6 sm:p-8 border-3 ${feature.borderColor} hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95`}
        >
          <div className={`${feature.bgColor} w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-5 mx-auto border-2 ${feature.borderColor}`}>
            <feature.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${feature.color}`} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 text-center">{feature.title}</h3>
          <p className="text-gray-800 leading-relaxed text-center text-base sm:text-lg font-medium">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
