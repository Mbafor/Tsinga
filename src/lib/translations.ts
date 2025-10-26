export type Language = 'en' | 'fr';

// Function to detect browser language and return supported language
export const detectBrowserLanguage = (): Language => {
  // Get browser language
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  
  // Check if it's French (fr, fr-FR, fr-CA, etc.)
  if (browserLang.toLowerCase().startsWith('fr')) {
    return 'fr';
  }
  
  // Default to English for all other languages
  return 'en';
};

export const translations = {
  en: {
    appTitle: 'Daily Word Ministry at Full Gospel Tsinga',
    tagline: 'Spreading the Gospel with Clarity and Power',
    languageLabel: 'Language',
    heroVerse: '"How beautiful are the feet of those who bring good news!" - Romans 10:15',
    formTitle: 'Share Your Daily Word',
    formDescription: 'As servants of the Most High, let us be concise yet powerful in our message. Scripture teaches us that brevity coupled with truth carries the anointing. Keep your message under 250 words so it may be easily received and shared among the brethren.',
    preacherNameLabel: 'Your Name (Optional)',
    preacherNamePlaceholder: 'Enter your name',
    messageLabel: 'Your Message',
    messagePlaceholder: 'Write your inspired message here... Let the Holy Spirit guide your words.',
    wordCount: 'words',
    wordLimitWarning: 'Please reduce your message to 250 words or less to maintain clarity',
    sendButton: 'Share via WhatsApp',
    successMessage: 'May the Lord bless this message...',
    feature1Title: 'The Power of Brevity',
    feature1Description: 'Jesus often taught in parables - short, powerful stories that transformed hearts. Concise messages penetrate deeper into the spirit.',
    feature2Title: 'Swift Ministry',
    feature2Description: 'With one click, share the Word with your congregation. "Go quickly and tell" - Matthew 28:7',
    feature3Title: 'Reach All Nations',
    feature3Description: 'Ministry in both English and French, fulfilling the Great Commission across language barriers.',
    footerVerse: '"Let your speech always be gracious, seasoned with salt" - Colossians 4:6'
  },
  fr: {
    appTitle: 'Ministère de la Parole Quotidienne a Full Gospel Tsinga',
    tagline: 'Répandre l\'Évangile avec Clarté et Puissance',
    languageLabel: 'Langue',
    heroVerse: '"Qu\'ils sont beaux les pieds de ceux qui annoncent de bonnes nouvelles!" - Romains 10:15',
    formTitle: 'Partagez Votre Parole Quotidienne',
    formDescription: 'En tant que serviteurs du Très-Haut, soyons concis mais puissants dans notre message. L\'Écriture nous enseigne que la brièveté couplée à la vérité porte l\'onction. Gardez votre message sous 250 mots pour qu\'il soit facilement reçu et partagé parmi les frères.',
    preacherNameLabel: 'Votre Nom (Optionnel)',
    preacherNamePlaceholder: 'Entrez votre nom',
    messageLabel: 'Votre Message',
    messagePlaceholder: 'Écrivez votre message inspiré ici... Laissez le Saint-Esprit guider vos paroles.',
    wordCount: 'mots',
    wordLimitWarning: 'Veuillez réduire votre message à 250 mots ou moins pour maintenir la clarté',
    sendButton: 'Partager via WhatsApp',
    successMessage: 'Que le Seigneur bénisse ce message...',
    feature1Title: 'La Puissance de la Brièveté',
    feature1Description: 'Jésus enseignait souvent en paraboles - des histoires courtes et puissantes qui transformaient les cœurs. Les messages concis pénètrent plus profondément dans l\'esprit.',
    feature2Title: 'Ministère Rapide',
    feature2Description: 'En un clic, partagez la Parole avec votre congrégation. "Allez vite et dites" - Matthieu 28:7',
    feature3Title: 'Atteindre Toutes les Nations',
    feature3Description: 'Ministère en anglais et en français, accomplissant la Grande Commission au-delà des barrières linguistiques.',
    footerVerse: '"Que votre parole soit toujours accompagnée de grâce, assaisonnée de sel" - Colossiens 4:6'
  }
};

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};
