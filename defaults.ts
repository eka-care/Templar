export const DEFAULT_CONFIG_ELEMENT_IN_DOUBLE_COLUMNS = {
    left: ['symptoms', 'vitals'],
    right: ['diagnosis', 'labTests'],
};

export const IGNORE_CONFIG_KEYS = new Set(['sym-dia', 'prescribe', 'followup', 'advices']);

export const ALL_TEETH_ID = 'sm-1723615519';
export const ORAL_FINDINGS = 'ORAL FINDINGS';

export const TEETH_TO_NAME: { [k: string]: string } = {
    [ALL_TEETH_ID]: ORAL_FINDINGS,
};
