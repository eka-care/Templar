import moment from 'moment';
import { OpIop, OpKReading, OpPMT, OpSpec, OpVision, PX_OP_KEYS } from './types';
import { OPHTHAL_TEST_IDS } from './ophthalTestIds';

export const getColumns = (
    pxKey: PX_OP_KEYS,
):
    | { key: keyof Omit<OpVision, 'eye'>; title: string }[]
    | { key: keyof Omit<OpIop, 'eye'>; title: string }[]
    | { key: keyof Omit<OpSpec, 'eye'>; title: string }[]
    | { key: keyof Omit<OpSpec, 'eye'>; title: string }[]
    | { key: keyof Omit<OpPMT, 'eye'>; title: string }[]
    | { key: keyof Omit<OpKReading, 'eye'>; title: string }[] => {
    switch (pxKey) {
        case 'opVision':
            return [
                {
                    key: 'ucdva',
                    title: 'UCDVA',
                },
                {
                    key: 'ucnva',
                    title: 'UCNVA',
                },
                {
                    key: 'ph',
                    title: 'Pinhole',
                },
                {
                    key: 'bcdva',
                    title: 'BCDVA',
                },
                {
                    key: 'bcnva',
                    title: 'BCNVA',
                },
            ];
        case 'opIop':
            return [
                {
                    key: 'nct',
                    title: 'NCT',
                },
                {
                    key: 'gat',
                    title: 'GAT',
                },
                {
                    key: 'cct',
                    title: 'CCT',
                },
                {
                    key: 'ciop',
                    title: 'CIOP',
                },
            ];
        case 'opCurrentSpec':
        case 'opAutoRefraction':
        case 'opSubjectiveRefraction':
        case 'opFinalPrescription':
            return [
                {
                    key: 'sph',
                    title: 'SPH',
                },
                {
                    key: 'cyl',
                    title: 'CYL',
                },
                {
                    key: 'axis',
                    title: 'AXIS',
                },
                {
                    key: 'add',
                    title: 'ADD',
                },
                {
                    key: 'dva',
                    title: 'DVA',
                },
                {
                    key: 'nva',
                    title: 'NVA',
                },
            ];
        case 'opLacrimalSyringing':
            return [
                { key: 'result', title: 'Result' } as any,
                { key: 'remarks', title: 'Remarks' } as any,
            ];
        case 'opColorVision':
            return [
                { key: 'result', title: 'Result' } as any,
                { key: 'remarks', title: 'Remarks' } as any,
            ];
        case 'opPMT':
            return [
                { key: OPHTHAL_TEST_IDS?.pmt?.right?.sph, title: 'SPH' } as any,
                { key: OPHTHAL_TEST_IDS?.pmt?.right?.cyl, title: 'CYL' } as any,
                { key: OPHTHAL_TEST_IDS?.pmt?.right?.axis, title: 'AXIS' } as any,
                { key: OPHTHAL_TEST_IDS?.pmt?.right?.add, title: 'ADD' } as any,
                { key: OPHTHAL_TEST_IDS?.pmt?.right?.bcvaDist, title: 'BCVA (Dist)' } as any,
            ];
        case 'opKReading':
            return [
                { key: OPHTHAL_TEST_IDS?.kReading.right.k1, title: 'K1' } as any,
                { key: OPHTHAL_TEST_IDS?.kReading.right.axisK1, title: 'Axis (K1)' } as any,
                { key: OPHTHAL_TEST_IDS?.kReading.right.k2, title: 'K2' } as any,
                { key: OPHTHAL_TEST_IDS?.kReading.right.axisK2, title: 'Axis (K2)' } as any,
                { key: OPHTHAL_TEST_IDS?.kReading.right.cyl, title: 'CYL' } as any,
                { key: OPHTHAL_TEST_IDS?.kReading.right.axisCyl, title: 'Axis (CYL)' } as any,
            ];
    }
};

export const rxKeyToHeadingMap: { [k in PX_OP_KEYS]: string } = {
    opVision: 'Visual Acuity Test',
    opIop: 'IOP',
    opCurrentSpec: 'Current glass prescription',
    opSubjectiveRefraction: 'Subjective Refraction',
    opAutoRefraction: 'Auto Refraction',
    opFinalPrescription: 'Final Glass Prescription',
    opLacrimalSyringing: 'Lacrimal Syringing',
    opColorVision: 'Color Vision',
    opPMT: 'PMT',
    opKReading: 'K Reading / Biometry',
};

export enum LAB_TESTS_FOLLOWUP_TYPE {
    TEST_ON = 'test_on',
    REPEAT_ON = 'repeat_on',
    START_ON = 'start_on',
    SINCE = 'since',
    DATE = 'date',
}
const typeToDateFormat: { [k: string]: string } = {
    [LAB_TESTS_FOLLOWUP_TYPE.START_ON]: 'Do MMM YY',
    [LAB_TESTS_FOLLOWUP_TYPE.DATE]: 'Do MMM YY',
};

export const isExact12 = (date: string) => {
    const myDate = moment.utc(date || '').utcOffset('+05:30');
    return myDate.format('HH:mm:ss') === '12:00:00';
};

export const buildFollowUpLabel = (date?: string, type?: string) => {
    if (!date) {
        return '';
    }

    if (isExact12(date)) {
        const dateFormat = typeToDateFormat[type || ''] || 'Do MMMM YY';
        return (
            moment
                .utc(date || '')
                .utcOffset('+05:30')
                .format(dateFormat) || ''
        );
    }

    return (
        moment
            .utc(date || '')
            .utcOffset('+05:30')
            .format('Do MMMM YY, h:mm A') || ''
    );
};
