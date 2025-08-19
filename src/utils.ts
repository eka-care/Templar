import moment from 'moment';
import { OpIop, OpSpec, OpVision, PX_OP_KEYS } from './types';

export const getColumns = (
    pxKey: PX_OP_KEYS,
):
    | { key: keyof Omit<OpVision, 'eye'>; title: string }[]
    | { key: keyof Omit<OpIop, 'eye'>; title: string }[]
    | { key: keyof Omit<OpSpec, 'eye'>; title: string }[]
    | { key: keyof Omit<OpSpec, 'eye'>; title: string }[] => {
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
    }
};

export const rxKeyToHeadingMap: { [k in PX_OP_KEYS]: string } = {
    opVision: 'Visual Acuity Test',
    opIop: 'IOP',
    opCurrentSpec: 'Current glass prescription',
    opSubjectiveRefraction: 'Subjective Refraction',
    opAutoRefraction: 'Auto Refraction',
    opFinalPrescription: 'Final Glass Prescription',
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
