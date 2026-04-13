import { Tool } from '../RenderPdfPrescription';
import { RGHS_VITAL_IDS, formPositions } from './constants';
import { getValue } from './common';

export const getVitalsHtml = (tool: Tool): string => {
    const vitalsDummyItems = RGHS_VITAL_IDS.map((id) => {
        const vital = (tool?.medicalHistory?.vitals || []).find((item) => item.id === id);
        if (!vital) return '';
        const valuePart = getValue(vital.value?.qt);
        const unitPart = getValue(vital.value?.unit);
        return `${valuePart}${unitPart ? ` ${unitPart}` : ''}`.trim();
    });

    const vitalsExtraGapPx = 6;
    const vitalsCount = vitalsDummyItems.length;
    const totalGaps = vitalsExtraGapPx * Math.max(vitalsCount - 1, 0);
    const usableVitalsHeight = Math.max(formPositions.vitals.height - totalGaps, 1);
    const vitalsLineSlot = usableVitalsHeight / Math.max(vitalsCount, 1);
    const vitalsFontSize = 11;

    return vitalsDummyItems
        .map(
            (item, index) =>
                `<div style="position:absolute;left:0;right:0;top:${(
                    index * vitalsLineSlot +
                    index * vitalsExtraGapPx
                ).toFixed(2)}px;font-size:${vitalsFontSize}px;line-height:${(vitalsLineSlot * 0.95).toFixed(
                    2,
                )}px;white-space:nowrap;">${item}</div>`,
        )
        .join('');
};

export const getVitalsSectionHtml = (tool: Tool): string => {
    const vitalsHtml = getVitalsHtml(tool);
    return `
      <div
        style="
          position:absolute;
          top:${formPositions.vitals.contentTop}px;
          left:${formPositions.vitals.left}px;
          width:${formPositions.vitals.width}px;
          height:${formPositions.vitals.height}px;
          box-sizing:border-box;
          overflow:hidden;
          text-align:left;
          padding-left:8px;
          padding-top:0px;
          position:relative;
        "
      >
        ${vitalsHtml}
      </div>
    `;
};
