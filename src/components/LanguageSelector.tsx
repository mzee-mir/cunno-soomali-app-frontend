import React from 'react';
import { useLanguage } from '../context/LanguageProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'so', name: 'Somali' }
  ];

  return (
    <Select
      value={language}
      onValueChange={(value) => setLanguage(value)}
    >
      <SelectTrigger className="w-[120px] bg-card border-border">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;