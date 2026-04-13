import { Tool } from '../RenderPdfPrescription';
import { formPositions } from './constants';
import { computeBulletLayout, renderBulletColumns, stripHtml } from './common';

type ExaminationDiagnosisHtml = {
    html: string;
};

export const getExaminationDiagnosisHtml = (tool: Tool): ExaminationDiagnosisHtml => {
    const examinationItems =
        tool?.medicalHistory?.examinations?.map((exam) =>
            exam?.notes && exam.notes.trim() !== ''
                ? `${exam.name} (Notes: ${stripHtml(exam.notes)})`
                : exam.name,
        ) || [];

    const diagnosisItems =
        tool?.diagnosis?.map((diagnosis) => {
            const properties = Object.values(diagnosis?.properties || {});
            const sinceProperty = properties.find((property) => property?.name === 'Since');
            const statusProperty = properties.find((property) => property?.name === 'Status');

            const sinceSelection = sinceProperty?.selection?.[0];
            const statusSelection = statusProperty?.selection?.[0];

            const sinceValue = sinceSelection?.value
                ? `${sinceSelection.value}${sinceSelection.unit ? ` ${sinceSelection.unit}` : ''}`
                : '';
            const statusValue = statusSelection?.value || '';

            const details = [];
            if (sinceValue) details.push(`Since: ${sinceValue}`);
            if (statusValue) details.push(`Status: ${statusValue}`);

            return details.length > 0
                ? `${diagnosis?.name} (${details.join(', ')})`
                : diagnosis?.name;
        }) || [];

    const hasExaminationItems = examinationItems.length > 0;
    const hasDiagnosisItems = diagnosisItems.length > 0;
    const useTwoColumns = hasExaminationItems && hasDiagnosisItems;
    const columnGap = 10;
    const columnWidth = useTwoColumns
        ? (formPositions.examinationDiagnosis.width - columnGap) / 2
        : formPositions.examinationDiagnosis.width;

    const examinationLayout = computeBulletLayout(
        examinationItems,
        columnWidth,
        formPositions.examinationDiagnosis.height,
    );
    const diagnosisLayout = computeBulletLayout(
        diagnosisItems,
        columnWidth,
        formPositions.examinationDiagnosis.height,
    );

    const examinationColumnHtml = renderBulletColumns(
        examinationItems,
        columnWidth,
        formPositions.examinationDiagnosis.height,
        'display:-webkit-box;list-style-type:disc;list-style-position:inside;white-space:normal;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical',
    ).replaceAll(
        /line-height:\d+px/g,
        `line-height:${examinationLayout.lineHeight}px`,
    ).replaceAll(/font-size:\d+(\.\d+)?px/g, `font-size:${examinationLayout.fontSize}px`);

    const diagnosisColumnHtml = renderBulletColumns(
        diagnosisItems,
        columnWidth,
        formPositions.examinationDiagnosis.height,
        'display:-webkit-box;list-style-type:disc;list-style-position:inside;white-space:normal;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical',
    ).replaceAll(/line-height:\d+px/g, `line-height:${diagnosisLayout.lineHeight}px`).replaceAll(
        /font-size:\d+(\.\d+)?px/g,
        `font-size:${diagnosisLayout.fontSize}px`,
    );

    const html = `
        <div
          style="
            display:flex;
            gap:${useTwoColumns ? columnGap : 0}px;
            align-items:flex-start;
            height:100%;
            overflow:hidden;
          "
        >
          ${
              hasExaminationItems
                  ? `<div style="width:${columnWidth}px;height:100%;overflow:hidden;">
              <div style="font-size:11.5px;font-weight:400;line-height:1.2;margin-bottom:2px;">Systemic Examination</div>
              <div style="height:calc(100% - 16px);overflow:hidden;">
                ${examinationColumnHtml}
              </div>
            </div>`
                  : ''
          }
          ${
              hasDiagnosisItems
                  ? `<div style="width:${columnWidth}px;height:100%;overflow:hidden;">
              <div style="font-size:11.5px;font-weight:400;line-height:1.2;margin-bottom:2px;">Provisional Diagnosis</div>
              <div style="height:calc(100% - 16px);overflow:hidden;">
                ${diagnosisColumnHtml}
              </div>
            </div>`
                  : ''
          }
        </div>
    `;

    return { html };
};

export const getExaminationDiagnosisSectionHtml = (tool: Tool): string => {
    const examinationDiagnosisHtml = getExaminationDiagnosisHtml(tool).html;
    return `
      <div
        style="
          position:absolute;
          top:${formPositions.examinationDiagnosis.contentTop}px;
          left:${formPositions.examinationDiagnosis.left}px;
          width:${formPositions.examinationDiagnosis.width}px;
          height:${formPositions.examinationDiagnosis.height}px;
          box-sizing:border-box;
          overflow:hidden;
        "
      >
        ${examinationDiagnosisHtml}
      </div>
    `;
};
