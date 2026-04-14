import { Tool } from '../RenderPdfPrescription';
import { formPositions } from './constants';
import { renderBulletColumns } from './common';

export const getSymptomsColumnsHtml = (tool: Tool): string => {
    const mappedSymptoms =
        tool?.symptoms?.map((symptom) => {
            const properties = Object.values(symptom?.properties || {});
            const sinceProperty = properties.find((property) => property?.name === 'Since');
            const severityProperty = properties.find((property) => property?.name === 'Severity');

            const sinceSelection = sinceProperty?.selection?.[0];
            const severitySelection = severityProperty?.selection?.[0];

            const sinceValue = sinceSelection?.value
                ? `${sinceSelection.value}${sinceSelection.unit ? ` ${sinceSelection.unit}` : ''}`
                : '-';
            const severityValue = severitySelection?.value || '-';

            return {
                name: symptom?.name,
                since: sinceValue,
                severity: severityValue,
            };
        }) || [];

    const items = mappedSymptoms.map((symptom) => {
        const details = [];
        if (symptom.since && symptom.since !== '-') {
            details.push(`Since: ${symptom.since}`);
        }
        if (symptom.severity && symptom.severity !== '-') {
            details.push(`Severity: ${symptom.severity}`);
        }
        return details.length > 0 ? `${symptom.name} (${details.join(', ')})` : symptom.name;
    });

    return renderBulletColumns(
        items,
        formPositions.symptoms.width,
        formPositions.symptoms.height,
        'display:-webkit-box;list-style-type:disc;list-style-position:inside;white-space:normal;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical',
    );
};
