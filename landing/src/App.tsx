/**
 * legal-expand - Componente App Principal
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Componente raíz de la aplicación que organiza todas las secciones de la landing page.
 */

import { useState } from 'react';
import { TranslationProvider } from './contexts/TranslationContext';
import Header from '@components/Header';
import Hero from '@components/Hero';
import Features from '@components/Features';
import QuickStart from '@components/QuickStart';
import Demo from '@components/Demo';
import UseCases from '@components/UseCases';
import ApiReference from '@components/ApiReference';
import SiglasTable from '@components/SiglasTable';
import SiglasModal from '@components/SiglasModal';
import Footer from '@components/Footer';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <TranslationProvider>
      <div className="app">
        <Header />
        <main>
          <Hero />
          <Features />
          <QuickStart />
          <Demo />
          <UseCases />
          <ApiReference />
          <SiglasTable onOpenModal={() => setIsModalOpen(true)} />
        </main>
        <Footer />
        <SiglasModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </TranslationProvider>
  );
}
