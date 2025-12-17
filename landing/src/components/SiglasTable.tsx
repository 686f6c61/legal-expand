/**
 * legal-expand - Componente SiglasTable
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Tabla de 646 siglas con búsqueda en tiempo real, filtrado por categoría,
 * paginación y opciones de descarga y visualización en modal.
 */

import { useState, useMemo } from 'react';
import { useTranslation } from '@hooks/useTranslation';
import dictionaryData from '@data/dictionary.json';
import type { CompiledDictionary, Category } from '../types';
import './SiglasTable.css';

const dictionary = dictionaryData as CompiledDictionary;

interface SiglasTableProps {
  onOpenModal: () => void;
}

function categorizeSigla(sigla: string, significado: string): Category {
  if (significado.includes('Impuesto')) return 'Impuestos';
  if (significado.includes('Ley') || significado.includes('Código')) return 'Leyes';
  if (significado.includes('Agencia') || significado.includes('Dirección') || significado.includes('Ministerio')) return 'Organismos';
  if (sigla.endsWith('.') && sigla.length <= 5) return 'Abreviaturas';
  return 'Otros';
}

export default function SiglasTable({ onOpenModal }: SiglasTableProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category>('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const categories: Category[] = ['Todas', 'Impuestos', 'Leyes', 'Organismos', 'Abreviaturas', 'Otros'];

  const filteredSiglas = useMemo(() => {
    let filtered = dictionary.entries;

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      filtered = filtered.filter((entry) => {
        const original = entry.original.toLowerCase();
        const significado = entry.significado.toLowerCase();

        // Coincidencia en acrónimo (substring)
        if (original.includes(term)) {
          return true;
        }

        // Coincidencia en significado (solo palabras completas)
        // Crear regex para buscar palabra completa, ignorando acentos y puntuación
        const wordBoundaryPattern = new RegExp(`\\b${term}\\b`, 'i');
        return wordBoundaryPattern.test(significado);
      });

      // Ordenar: primero coincidencias exactas en acrónimo, luego coincidencias que empiezan con el término, luego el resto
      filtered.sort((a, b) => {
        const aOriginal = a.original.toLowerCase();
        const bOriginal = b.original.toLowerCase();

        // Coincidencia exacta
        if (aOriginal === term && bOriginal !== term) return -1;
        if (bOriginal === term && aOriginal !== term) return 1;

        // Empieza con el término
        if (aOriginal.startsWith(term) && !bOriginal.startsWith(term)) return -1;
        if (bOriginal.startsWith(term) && !aOriginal.startsWith(term)) return 1;

        // Contiene el término en el acrónimo vs solo en el significado
        const aInOriginal = aOriginal.includes(term);
        const bInOriginal = bOriginal.includes(term);
        if (aInOriginal && !bInOriginal) return -1;
        if (bInOriginal && !aInOriginal) return 1;

        // Por defecto, orden alfabético
        return aOriginal.localeCompare(bOriginal, 'es');
      });
    }

    // Filtrar por categoría
    if (categoryFilter !== 'Todas') {
      filtered = filtered.filter(
        (entry) => categorizeSigla(entry.original, entry.significado) === categoryFilter
      );
    }

    return filtered;
  }, [searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredSiglas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSiglas = filteredSiglas.slice(startIndex, startIndex + itemsPerPage);

  const handleDownload = async () => {
    try {
      const response = await fetch('/siglas-listado.txt');
      const blob = await response.blob();

      // Crear blob con encoding UTF-8 explícito
      const utf8Blob = new Blob([blob], { type: 'text/plain;charset=utf-8' });

      // Crear URL y descargar
      const url = window.URL.createObjectURL(utf8Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'siglas-legales-españolas.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      // Fallback: abrir en nueva pestaña
      window.open('/siglas-listado.txt', '_blank');
    }
  };

  return (
    <section id="siglas" className="siglas-section section">
      <div className="container">
        <h2 className="text-center">{t.siglas.title}</h2>
        <p className="text-center text-secondary mb-lg">
          {filteredSiglas.length} {t.siglas.total}
        </p>

        <div className="siglas-controls">
          <input
            type="text"
            className="siglas-search"
            placeholder={t.siglas.search_placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            className="siglas-filter"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value as Category);
              setCurrentPage(1);
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {t.siglas[`category_${cat.toLowerCase().replace(' ', '_')}` as keyof typeof t.siglas] || cat}
              </option>
            ))}
          </select>

          <button className="button button-secondary" onClick={onOpenModal}>
            {t.siglas.view_all}
          </button>

          <button className="button button-secondary" onClick={handleDownload}>
            {t.siglas.download}
          </button>
        </div>

        <div className="siglas-table-container">
          <table className="siglas-table">
            <thead>
              <tr>
                <th>{t.siglas.table_acronym}</th>
                <th>{t.siglas.table_meaning}</th>
              </tr>
            </thead>
            <tbody>
              {currentSiglas.map((entry) => (
                <tr key={entry.id}>
                  <td className="sigla-cell">{entry.original}</td>
                  <td className="significado-cell">{entry.significado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="siglas-pagination">
            <button
              className="button button-small"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {t.siglas.pagination_previous}
            </button>

            <span className="pagination-info">
              {t.siglas.showing} {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSiglas.length)} {t.siglas.of} {filteredSiglas.length}
            </span>

            <button
              className="button button-small"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              {t.siglas.pagination_next}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
