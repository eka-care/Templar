import { Tool } from '../RenderPdfPrescription';
import { formPositions } from './constants';
import { getValue, renderBulletColumns } from './common';

export const getHistoryColumnsHtml = (tool: Tool): string => {
    const patientHistory = tool?.medicalHistory?.patientHistory;
    const historySourceItems = [
        ...(patientHistory?.patientMedicalConditions || []).map((item) => ({
            ...item,
            __historyType: 'patientMedicalConditions',
        })),
        ...(patientHistory?.lifestyleHabits || []).map((item) => ({
            ...item,
            __historyType: 'lifestyleHabits',
        })),
        ...(patientHistory?.recentTravelHistory || []).map((item) => ({
            ...item,
            __historyType: 'recentTravelHistory',
        })),
        ...(patientHistory?.currentMedications || []).map((item) => ({
            ...item,
            __historyType: 'currentMedications',
        })),
        ...(patientHistory?.drugAllergy || []).map((item) => ({
            ...item,
            __historyType: 'drugAllergy',
        })),
        ...(patientHistory?.foodOtherAllergy || []).map((item) => ({
            ...item,
            __historyType: 'foodOtherAllergy',
        })),
        ...(patientHistory?.pastProcedures || []).map((item) => ({
            ...item,
            __historyType: 'pastProcedures',
        })),
        ...(patientHistory?.otherMedicalHistory || []).map((item) => ({
            ...item,
            __historyType: 'otherMedicalHistory',
        })),
        ...(patientHistory?.familyHistory || []).map((item) => ({
            ...item,
            __historyType: 'familyHistory',
        })),
    ];

    const historyItems = historySourceItems.map((historyItem) => {
        const itemObj = historyItem as unknown as Record<string, unknown>;
        const historyType = getValue(itemObj?.__historyType);
        const sinceObj = itemObj?.since as { custom?: string } | undefined;
        const frequencyObj = itemObj?.frequency as
            | { custom?: string; value?: string; unit?: string }
            | undefined;
        const notesValue = getValue(itemObj?.notes);

        const sinceValue = getValue(sinceObj?.custom || itemObj?.since);
        const statusValue = getValue(itemObj?.status);
        const frequencyValue = getValue(
            frequencyObj?.custom ||
                (frequencyObj?.value
                    ? `${frequencyObj?.value}${frequencyObj?.unit ? ` ${frequencyObj?.unit}` : ''}`
                    : itemObj?.frequency),
        );

        const details = [];
        if (sinceValue) details.push(`Since: ${sinceValue}`);
        if (statusValue) details.push(`Status: ${statusValue}`);
        if (frequencyValue) details.push(`Frequency: ${frequencyValue}`);

        const name = getValue(itemObj?.name);
        if (historyType === 'recentTravelHistory' && notesValue) {
            return `${name} (Notes: ${notesValue})`;
        }
        return details.length > 0 ? `${name} (${details.join(', ')})` : name;
    });

    return renderBulletColumns(
        historyItems,
        formPositions.history.width,
        formPositions.history.height,
        'display:-webkit-box;list-style-type:disc;list-style-position:inside;white-space:normal;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical',
    );
};
