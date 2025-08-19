import { Flavour } from './types';

export const DEFAULT_CONFIG_ELEMENT_IN_DOUBLE_COLUMNS = {
    left: ['symptoms', 'vitals'],
    right: ['diagnosis', 'labTests'],
};

export const IGNORE_CONFIG_KEYS: { [k in Flavour]: Set<string> } = {
    io: new Set(['symptoms', 'diagnosis', 'medications', 'labTests', 'dyform', 'followup-advices']),
    an: new Set(['symptoms', 'diagnosis', 'medications', 'labTests', 'dyform', 'followup-advices']),
    mw: new Set(['symptoms', 'diagnosis', 'medications', 'labTests', 'dyform', 'followup-advices']),
    dw: new Set(['sym-dia', 'prescribe', 'followup', 'advices']),
    ip: new Set(['sym-dia', 'prescribe', 'followup', 'advices']),
};

export const ALL_TEETH_ID = 'sm-1723615519';
export const ORAL_FINDINGS = 'ORAL FINDINGS';

export const TEETH_TO_NAME: { [k: string]: string } = {
    [ALL_TEETH_ID]: ORAL_FINDINGS,
};
