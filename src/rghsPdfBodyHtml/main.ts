import { Tool } from '../RenderPdfPrescription';
import { DoctorProfile } from '../types';
import { formPositions } from './constants';
import { getSymptomsColumnsHtml } from './symptoms';
import { getHistoryColumnsHtml } from './history';
import { getVitalsSectionHtml } from './vitals';
import { getInvestigationColumnsHtml } from './investigation';
import { getMedicationColumnsHtml } from './medications';
import { getExaminationDiagnosisSectionHtml } from './examinationDiagnosis';
import { getAdviceColumnsHtml } from './advices';
import { getReviewSectionHtml } from './review';
import { getSignatureSectionHtml } from './signature';

const getSectionContainer = (top: number, left: number, width: number, height: number, content: string): string => `
  <div
    style="
      position:absolute;
      top:${top}px;
      left:${left}px;
      width:${width}px;
      height:${height}px;
      box-sizing:border-box;
      overflow:hidden;
    "
  >
    <div
      style="
        display:flex;
        gap:18px;
        align-items:flex-start;
        height:100%;
        overflow:hidden;
      "
    >
      ${content}
    </div>
  </div>
`;

export const getRghsBodyHtmlFromTool = (tool: Tool, docProfile?: DoctorProfile): string => {
    const symptomsColumnsHtml = getSymptomsColumnsHtml(tool);
    const historyColumnsHtml = getHistoryColumnsHtml(tool);
    const vitalsSectionHtml = getVitalsSectionHtml(tool);
    const investigationColumnsHtml = getInvestigationColumnsHtml(tool);
    const medicationColumnsHtml = getMedicationColumnsHtml(tool);
    const examinationDiagnosisSectionHtml = getExaminationDiagnosisSectionHtml(tool);
    const adviceColumnsHtml = getAdviceColumnsHtml(tool);
    const reviewSectionHtml = getReviewSectionHtml(tool);
    const signatureSectionHtml = getSignatureSectionHtml(docProfile);

    return `
      <div
        style="
          position:relative;
          width:210mm;
          min-height:297mm;
          font-family:Arial,sans-serif;
        "
      >
        ${getSectionContainer(
            formPositions.symptoms.contentTop,
            formPositions.symptoms.left,
            formPositions.symptoms.width,
            formPositions.symptoms.height,
            symptomsColumnsHtml,
        )}
        ${getSectionContainer(
            formPositions.history.contentTop,
            formPositions.history.left,
            formPositions.history.width,
            formPositions.history.height,
            historyColumnsHtml,
        )}
        ${vitalsSectionHtml}
        ${examinationDiagnosisSectionHtml}
        ${getSectionContainer(
            formPositions.investigation.contentTop,
            formPositions.investigation.left,
            formPositions.investigation.width,
            formPositions.investigation.height,
            investigationColumnsHtml,
        )}
        ${getSectionContainer(
            formPositions.medications.contentTop,
            formPositions.medications.left,
            formPositions.medications.width,
            formPositions.medications.height,
            medicationColumnsHtml,
        )}
        ${getSectionContainer(
            formPositions.advices.contentTop,
            formPositions.advices.left,
            formPositions.advices.width,
            formPositions.advices.height,
            adviceColumnsHtml,
        )}
        ${reviewSectionHtml}
        ${signatureSectionHtml}
      </div>
    `.trim();
};
