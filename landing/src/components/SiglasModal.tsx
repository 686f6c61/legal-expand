/**
 * legal-expand - Componente SiglasModal
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Modal full-screen con listado alfabético completo de todas las siglas.
 * Navegación por letras y búsqueda dentro del modal.
 */

import { useState, useMemo } from 'react';
import { useTranslation } from '@hooks/useTranslation';
import dictionaryData from '@data/dictionary.json';
import type { CompiledDictionary } from '../types';
import './SiglasModal.css';

const dictionary = dictionaryData as CompiledDictionary;

interface SiglasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SiglasModal({ isOpen, onClose }: SiglasModalProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const siglasGrouped = useMemo(() => {
    const groups: Record<string, typeof dictionary.entries> = {};

    // Agrupar por letra inicial
    dictionary.entries.forEach((entry) => {
      const letter = entry.original[0].toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(entry);
    });

    // Ordenar cada grupo
    Object.keys(groups).forEach((letter) => {
      groups[letter].sort((a, b) => a.original.localeCompare(b.original, 'es'));
    });

    return groups;
  }, []);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return siglasGrouped;

    const term = searchTerm.toLowerCase();
    const filtered: Record<string, typeof dictionary.entries> = {};

    Object.entries(siglasGrouped).forEach(([letter, entries]) => {
      const matchingEntries = entries.filter((entry) => {
        const original = entry.original.toLowerCase();
        const significado = entry.significado.toLowerCase();

        // Coincidencia en acrónimo (substring)
        if (original.includes(term)) {
          return true;
        }

        // Coincidencia en significado (solo palabras completas)
        const wordBoundaryPattern = new RegExp(`\\b${term}\\b`, 'i');
        return wordBoundaryPattern.test(significado);
      });

      if (matchingEntries.length > 0) {
        filtered[letter] = matchingEntries;
      }
    });

    return filtered;
  }, [siglasGrouped, searchTerm]);

  const letters = Object.keys(filteredGroups).sort();

  if (!isOpen) return null;

  return (
    <div className="siglas-modal-overlay" onClick={onClose}>
      <div className="siglas-modal" onClick={(e) => e.stopPropagation()}>
        <div className="siglas-modal-header">
          <h2>{t.siglas.title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="siglas-modal-search">
          <input
            type="text"
            placeholder={t.siglas.search_placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        <div className="siglas-modal-content">
          <div className="letter-navigation">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="letter-link"
              >
                {letter}
              </a>
            ))}
          </div>

          <div className="siglas-list">
            {letters.map((letter) => (
              <div key={letter} id={`letter-${letter}`} className="letter-group">
                <h3 className="letter-title">[{letter}]</h3>
                <div className="siglas-items">
                  {filteredGroups[letter].map((entry) => (
                    <div key={entry.id} className="sigla-item">
                      <span className="sigla-original">{entry.original}</span>
                      <span className="sigla-arrow">→</span>
                      <span className="sigla-significado">{entry.significado}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
