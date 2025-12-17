/**
 * legal-expand - Componente DemoExamples
 *
 * @author https://github.com/686f6c61
 * @repository https://github.com/686f6c61/legal-expand
 * @license MIT
 * @date 12/2025
 *
 * Ejemplos predefinidos de textos legales para probar la funcionalidad.
 * Cards clickeables que cargan el texto en el editor.
 */

import { useTranslation } from '@hooks/useTranslation';
import { PlayIcon } from '../Icons';
import './DemoExamples.css';

interface Example {
  id: string;
  titleKey: string;
  text: string;
  snippet: string;
}

interface DemoExamplesProps {
  onSelectExample: (text: string) => void;
}

export default function DemoExamples({ onSelectExample }: DemoExamplesProps) {
  const { t } = useTranslation();

  const examples: Example[] = [
    {
      id: 'sentence',
      titleKey: 'example_sentence',
      text: 'Fundamentos de Derecho: El TS, en su sentencia de fecha 15 de marzo de 2024, confirma la doctrina establecida por el TC respecto a la aplicación del art. 24 CE en materia de tutela judicial efectiva. La AEAT, como parte demandada, alegó la prescripción del derecho conforme al art. 66 de la LGT. El tribunal considera que la liquidación del IVA e IRPF se ajusta a derecho, conforme a los arts. 108 y 123 de la LRJSP. La defensa invocó la vulneración del principio de proporcionalidad consagrado en la CE, pero el TS desestimó el recurso. Se condena en costas a la parte recurrente según el art. 394 LEC.',
      snippet: 'Fundamentos de Derecho: El TS, en su sentencia de fecha 15...',
    },
    {
      id: 'contract',
      titleKey: 'example_contract',
      text: 'CONTRATO DE ARRENDAMIENTO. En Madrid, a 10 de enero de 2024. CLÁUSULA PRIMERA: El arrendador cede el uso de la vivienda conforme a la LAU. CLÁUSULA SEGUNDA: La renta mensual se abonará mediante transferencia bancaria. CLÁUSULA TERCERA: El arrendatario se compromete al pago del IBI y gastos de comunidad. CLÁUSULA CUARTA: Conforme al CC, el incumplimiento de las obligaciones facultará al arrendador para resolver el contrato. CLÁUSULA QUINTA: Las partes se someten a la jurisdicción de los Juzgados de Madrid conforme a la LEC. CLÁUSULA SEXTA: De conformidad con la LOPD, el arrendador se compromete a la protección de datos personales del arrendatario.',
      snippet: 'CONTRATO DE ARRENDAMIENTO. En Madrid, a 10 de enero de 2024...',
    },
    {
      id: 'notification',
      titleKey: 'example_notification',
      text: 'NOTIFICACIÓN DE LIQUIDACIÓN PROVISIONAL. Expediente: 2024/123456. La AEAT, en uso de las facultades conferidas por la LGT, procede a notificar la liquidación provisional del IVA correspondiente al ejercicio fiscal 2023 por importe de 15.000 euros. Asimismo, se liquida el IRPF con una cuota de 8.500 euros. La presente liquidación se practica conforme a los arts. 101 y 102 de la LGT. De acuerdo con el art. 123 de la LRJSP, el contribuyente dispone de un plazo de 30 días hábiles para presentar alegaciones. Transcurrido dicho plazo sin que se hayan presentado alegaciones, la liquidación adquirirá firmeza conforme al art. 124 de la LRJSP. El pago deberá efectuarse conforme al art. 62 de la LGT.',
      snippet: 'NOTIFICACIÓN DE LIQUIDACIÓN PROVISIONAL. Expediente: 2024/123456...',
    },
    {
      id: 'academic',
      titleKey: 'example_academic',
      text: 'ANÁLISIS JURISPRUDENCIAL DE LOS DERECHOS FUNDAMENTALES. Según la doctrina consolidada del TS y la jurisprudencia del TEDH, los derechos fundamentales consagrados en la CE deben interpretarse de conformidad con los tratados internacionales, especialmente la DUDH y el CEDH. El TC ha reiterado en múltiples sentencias la primacía del art. 24 CE sobre el derecho a la tutela judicial efectiva. En este sentido, la STC 120/1990 estableció que el derecho reconocido en el art. 24 CE comprende el acceso a los recursos. Por su parte, el TS, en sentencia de 2022, interpretó el art. 14 CE sobre el principio de igualdad en consonancia con la doctrina del TEDH. La LOPD regula la protección de datos personales en el marco del art. 18 CE.',
      snippet: 'ANÁLISIS JURISPRUDENCIAL DE LOS DERECHOS FUNDAMENTALES...',
    },
    {
      id: 'boe',
      titleKey: 'example_boe',
      text: 'REAL DECRETO 123/2024, de 15 de marzo, publicado en el BOE núm. 65, por el que se modifica el RD 1065/2007 sobre la aplicación del IVA en operaciones inmobiliarias. PREÁMBULO: La presente norma tiene por objeto adaptar la normativa fiscal a las directivas de la UE en materia tributaria. ARTÍCULO PRIMERO: Se modifica el art. 20 del RD 1065/2007 en relación con las exenciones del IVA. ARTÍCULO SEGUNDO: La AEAT deberá adaptar sus procedimientos de gestión conforme a lo establecido en la LGT y en la LRJSP. DISPOSICIÓN FINAL: El presente RD entrará en vigor el día siguiente a su publicación en el BOE, de acuerdo con lo previsto en el art. 2.1 del CC.',
      snippet: 'REAL DECRETO 123/2024, de 15 de marzo, publicado en el BOE...',
    },
    {
      id: 'administrative',
      titleKey: 'example_administrative',
      text: 'RESOLUCIÓN DEL PROCEDIMIENTO SANCIONADOR. Expediente: SAN/2024/789. Visto el expediente instruido por la AEPD en relación con la presunta infracción de la LOPD y del RGPD por parte de la empresa ACME S.L., se dicta la presente resolución. ANTECEDENTES: Primero. Con fecha 10 de enero de 2024, tuvo entrada en la AEPD reclamación contra ACME S.L. por vulneración del art. 6 del RGPD. Segundo. La AEPD inició el procedimiento sancionador conforme al art. 63 de la LOPD. FUNDAMENTOS DE DERECHO: Primero. La AEPD es competente conforme al art. 58 del RGPD y arts. 47 y 68 de la LOPD. Segundo. Se considera acreditada la infracción del art. 6.1 del RGPD. RESUELVO: Imponer a ACME S.L. una multa de 10.000 euros conforme al art. 83 del RGPD y art. 74 de la LOPD.',
      snippet: 'RESOLUCIÓN DEL PROCEDIMIENTO SANCIONADOR. Expediente: SAN/2024/789...',
    },
  ];

  return (
    <div className="demo-examples">
      <h3 className="demo-examples-title">{t.demo.examples_title}</h3>
      <div className="examples-grid">
        {examples.map((example) => (
          <div
            key={example.id}
            className="example-card card"
            onClick={() => onSelectExample(example.text)}
          >
            <h4>{t.demo[example.titleKey as keyof typeof t.demo]}</h4>
            <p className="example-snippet text-secondary">{example.snippet}</p>
            <button className="button button-small button-secondary button-with-icon">
              <PlayIcon size={16} />
              {t.demo.try_button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
