import { SectionPosition } from './types';

const convertCmToPx = (cm: number): number => cm * 37.795275591;

export const formPositions: Record<string, SectionPosition> = {
    symptoms: {
        titleTop: convertCmToPx(9.5),
        contentTop: convertCmToPx(9.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(12),
        height: convertCmToPx(2.4),
    },
    history: {
        titleTop: convertCmToPx(12.5),
        contentTop: convertCmToPx(12.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(12),
        height: convertCmToPx(2.4),
    },
    vitals: {
        titleTop: convertCmToPx(9.6),
        contentTop: convertCmToPx(9.8),
        left: convertCmToPx(16.25),
        width: convertCmToPx(3.4),
        height: convertCmToPx(2.85),
    },
    investigation: {
        titleTop: convertCmToPx(18.5),
        contentTop: convertCmToPx(18.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(16.8),
        height: convertCmToPx(2.4),
    },
    medications: {
        titleTop: convertCmToPx(21.5),
        contentTop: convertCmToPx(21.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(16.8),
        height: convertCmToPx(2.4),
    },
    examinationDiagnosis: {
        titleTop: convertCmToPx(15.5),
        contentTop: convertCmToPx(15.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(16.8),
        height: convertCmToPx(2.4),
    },
    advices: {
        titleTop: convertCmToPx(24.5),
        contentTop: convertCmToPx(24.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(16.8),
        height: convertCmToPx(2.4),
    },
    review: {
        titleTop: convertCmToPx(27.5),
        contentTop: convertCmToPx(27.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(8.0),
        height: convertCmToPx(1.5),
    },
    signature: {
        titleTop: convertCmToPx(27.5),
        contentTop: convertCmToPx(27.35),
        left: convertCmToPx(12.35),
        width: convertCmToPx(6.95),
        height: convertCmToPx(1.5),
    },
};

export const RGHS_VITAL_IDS = ['v-1365277675', 'lb-1201285132', 'lb-199711567', 'lb-7991006736'];
