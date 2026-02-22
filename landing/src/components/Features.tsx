/**
 * legal-expand - Componente Features
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Grid de características principales del paquete.
 */

import { useTranslation } from '@hooks/useTranslation';
import {
  CheckIcon,
  DatabaseIcon,
  SearchIcon,
  ZapIcon,
  LayersIcon,
  CodeIcon,
  PackageIcon,
  FileTextIcon,
  ShieldIcon,
  SettingsIcon
} from './Icons';
import './Features.css';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    { text: t.features.verified, Icon: CheckIcon },
    { text: t.features.sources, Icon: DatabaseIcon },
    { text: t.features.variants, Icon: SearchIcon },
    { text: t.features.optimized, Icon: ZapIcon },
    { text: t.features.formats, Icon: LayersIcon },
    { text: t.features.typescript, Icon: CodeIcon },
    { text: t.features.zero_deps, Icon: PackageIcon },
    { text: t.features.tree_shake, Icon: FileTextIcon },
    { text: t.features.ssr, Icon: ShieldIcon },
    { text: t.features.dual_modules, Icon: LayersIcon },
    { text: t.features.diagnostics_api, Icon: FileTextIcon },
    { text: t.features.dictionary_validation, Icon: CheckIcon },
    { text: t.features.benchmark_ci, Icon: ZapIcon },
    { text: t.features.workspace_ready, Icon: SettingsIcon },
  ];

  return (
    <section id="features" className="features section">
      <div className="container">
        <h2 className="text-center">{t.features.title}</h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card card">
              <feature.Icon className="feature-icon" size={28} />
              <p className="mb-0">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
