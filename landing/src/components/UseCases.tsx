/**
 * legal-expand - Componente UseCases
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Casos de uso por tipo de usuario: estudiantes, opositores, academias,
 * despachos legales, administración pública y desarrolladores.
 */

import { useTranslation } from '@hooks/useTranslation';
import { GraduationCapIcon, TargetIcon, BuildingIcon, BriefcaseIcon, UsersIcon, CodeIcon } from './Icons';
import './UseCases.css';

export default function UseCases() {
  const { t } = useTranslation();

  const useCases = [
    {
      key: 'students',
      Icon: GraduationCapIcon,
      code: `import { expandirSiglas } from 'legal-expand';

const apuntes = 'El TS aplica el art. 24 CE...';
const apuntesExpandidos = expandirSiglas(apuntes);
// Apuntes más comprensibles para estudio`,
    },
    {
      key: 'oppositors',
      Icon: TargetIcon,
      code: `import { expandirSiglas } from 'legal-expand';

const temario = 'La AEAT gestiona el IVA e IRPF...';
const resultado = expandirSiglas(temario, {
  expandOnlyFirst: true  // Documentos largos
});`,
    },
    {
      key: 'academies',
      Icon: BuildingIcon,
      code: `import { expandirSiglas } from 'legal-expand';

const material = await fetch('/materiales/tema1.txt');
const texto = await material.text();
const expandido = expandirSiglas(texto, {
  format: 'html'  // Para mostrar en plataforma web
});`,
    },
    {
      key: 'law_firms',
      Icon: BriefcaseIcon,
      code: `import { expandirSiglas } from 'legal-expand';

// Documento para cliente sin conocimientos técnicos
const contrato = fs.readFileSync('contrato.txt', 'utf-8');
const contratoClaro = expandirSiglas(contrato, {
  expandOnlyFirst: true,
  exclude: ['Sr.', 'Sra.']  // Excluir abreviaturas comunes
});`,
    },
    {
      key: 'public_admin',
      Icon: UsersIcon,
      code: `import { expandirSiglas } from 'legal-expand';

const comunicado = 'La AEAT informa sobre el IRPF...';
const comunicadoCiudadano = expandirSiglas(comunicado, {
  format: 'html'
});
// Comunicación más accesible para ciudadanos`,
    },
    {
      key: 'developers',
      Icon: CodeIcon,
      code: `import { expandirSiglas, listarSiglas } from 'legal-expand';

// Integración con LLM
const documentoLegal = await obtenerDocumento();
const expandido = expandirSiglas(documentoLegal);

// Enviar a LLM con siglas expandidas
const analisis = await llm.analyze(expandido);`,
    },
  ];

  return (
    <section id="use-cases" className="use-cases section">
      <div className="container">
        <h2 className="text-center">{t.usecases.title}</h2>

        <div className="use-cases-grid">
          {useCases.map((useCase) => {
            const caseData = t.usecases[useCase.key as keyof typeof t.usecases] as { title: string; description: string };
            return (
              <div key={useCase.key} className="use-case-card card">
                <div className="use-case-header">
                  <useCase.Icon className="use-case-icon" size={32} />
                  <h3>{caseData.title}</h3>
                </div>
                <p className="text-secondary">{caseData.description}</p>

                <div className="code-block">
                  <pre><code>{useCase.code}</code></pre>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
