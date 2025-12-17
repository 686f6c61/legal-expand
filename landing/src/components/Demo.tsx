/**
 * legal-expand - Componente Demo
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Sección de demo interactiva que integra el editor en vivo y ejemplos predefinidos.
 */

import { useState } from 'react';
import { useTranslation } from '@hooks/useTranslation';
import DemoEditor from './Demo/DemoEditor';
import DemoExamples from './Demo/DemoExamples';

export default function Demo() {
  const { t } = useTranslation();
  const [selectedText, setSelectedText] = useState('');

  const handleSelectExample = (text: string) => {
    setSelectedText(text);
    // Scroll to editor
    document.querySelector('.demo-editor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id="demo" className="section">
      <div className="container">
        <h2 className="text-center">{t.demo.title}</h2>
        <p className="text-center text-secondary mb-lg">
          {t.demo.editor_title}
        </p>

        <DemoEditor initialText={selectedText} key={selectedText} />
        <DemoExamples onSelectExample={handleSelectExample} />
      </div>
    </section>
  );
}
