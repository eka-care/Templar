import { TemplateConfig } from './RenderPdfPrescription';

export type Flavour = 'dw' | 'mw' | 'ip' | 'io' | 'an';

export const isRXMT1 = 'isRXMT1';
export const isRXMT2 = 'isRXMT2';
export const isRXMT3 = 'isRXMT3';
export const isRXMT4 = 'isRXMT4';

export type HxngMonetisation = typeof isRXMT1 | typeof isRXMT2 | typeof isRXMT3 | typeof isRXMT4;

export type GeniePadElementsSettingItem = {
    id: string;
    name: string;
    isShown: boolean;
    isAutoCopy?: boolean;
};

export interface LocalTemplateConfig {
    header_border?: boolean;
    footer_border?: boolean;
    header_auto_adjust?: boolean;
    footer_auto_adjust?: boolean;
}

export type SectionNameConfig = { [key: string]: string };

export interface DFormEntity {
    label: string;
    type: 'string' | 'number' | 'select' | 'multi_select';
    key: string;
    options?: { key: string; label: string }[];
    is_mandatory?: boolean;
}

export type PX_OP_KEYS =
    | 'opVision'
    | 'opIop'
    | 'opCurrentSpec'
    | 'opSubjectiveRefraction'
    | 'opAutoRefraction'
    | 'opFinalPrescription';

export interface OpVision {
    eye?: {
        value?: string;
    };
    ucdva?: {
        id: string;
        value?: string;
        custom?: string;
    };
    ucnva?: {
        id: string;
        value?: string;
        custom?: string;
    };
    ph?: {
        id: string;
        value?: string;
        custom?: string;
    };
    bcdva?: {
        id: string;
        value?: string;
        custom?: string;
    };
    bcnva?: {
        id: string;
        value?: string;
        custom?: string;
    };
}

export interface OpSpec {
    eye?: {
        value?: string;
    };
    sph?: {
        id: string;
        value?: string;
        custom?: string;
    };
    cyl?: {
        id: string;
        value?: string;
        custom?: string;
    };
    axis?: {
        id: string;
        value?: string;
        custom?: string;
    };
    add?: {
        id: string;
        value?: string;
        custom?: string;
    };
    dva?: {
        id: string;
        value?: string;
        custom?: string;
    };
    nva?: {
        id: string;
        value?: string;
        custom?: string;
    };
}

export interface OpIop {
    eye?: {
        value?: string;
    };
    nct?: {
        id: string;
        value?: string;
        custom?: string;
    };
    gat?: {
        id: string;
        value?: string;
        custom?: string;
    };
    cct?: {
        id: string;
        value?: string;
        custom?: string;
    };
    ciop?: {
        id: string;
        value?: string;
        custom?: string;
    };
}

export interface User {
    uuid: string;
    oid: string;
    fn: string;
    ln: string;
    gen: string;
    'is-p': boolean;
    'is-a'?: boolean;
    'is-d': boolean;
    'is-d-s': boolean;
    dob: string;
    mob: string;
    type: number;
    'doc-id': string;
    'b-id': string;
    iat: number;
    exp: number;
}

export type MyDoc = {
    id: string;
    personal: Personal;
    professional: Professional;
};

export type DoctorProfile = {
    _id: string;
    profile: Profile;
    created_at?: string;
    updated_at?: string;
};

export type MyClinic = {
    id: string;
    name: string;
    abdm?: {
        hfr_id?: string;
    };
    partner_clinic_id?: string;
};

export interface MyProfileResponse {
    user: User;
    docs?: MyDoc[];
    clinics?: MyClinic[];
    doctor?: DoctorProfile;
    loginmeta?: {
        role?: 'ADMIN' | 'DOCTOR' | 'STAFF';
        docid?: string;
        switch?: boolean;
        userid?: string;
        username?: string;
        isvalid?: boolean;
    };
    business?: {
        id: string;
        name: string;
        logo?: string;
    };
    roles?: string[];
    group?: {
        id: string;
        name: string;
    };
}
export interface Profile {
    personal: Personal;
    professional: Professional;
}
export interface Personal {
    name: Name;
    phone?: Phone;
    email?: string;
    gender?: string;
    dob?: string;
    pic?: string;
}
export interface Name {
    f: string;
    l: string;
}
export interface Phone {
    code: string;
    value: string;
}

export interface Template {
    templateId: string;
    displayName: string;
}
export interface Templates {
    print?: Template[];
    send?: Template[];
}

export interface RenderPdfConfig extends TemplateConfig {
    docid: string;
    clinicId: string;
    type: 'PRINT' | 'SEND';
}

export type TemplateV2 = RenderPdfConfig;

export interface Clinic {
    _id: string;
    city_id: string;
    city_name?: string;
    name: string;
    email?: string;
    number?: NumberEntity[] | null;
    address?: Address;
    price: Price;
    location?: string[] | null;
    logo: string;
    gplacesid?: string;
    abdm?: {
        hfr_id?: string;
    };
    partner_clinic_id?: string;
}
export interface NumberEntity {
    c: string;
    n: string;
}
export interface Address {
    line1: string;
    city: string;
    state: string;
    country: string;
    pin: string;
}
export interface Price {
    c: string;
    v: number;
}

export interface Professional {
    registrations?: Registrations;
    degree: SpecialityEntityOrMajorSpeciality[];
    major_speciality?: SpecialityEntityOrMajorSpeciality;
    speciality?: SpecialityEntityOrMajorSpeciality[];
    default_clinic: string;
    invite?: {
        invite_code?: string;
        invite_link?: string;
    };
    language?: { code: string; value: string }[];
    templates?: Templates;
    templates_v2?: TemplateV2[];
    signature: string;
    onboarded_for?: string[];
    username: string;
    clinics?: Clinic[];
    category?: string[];
    googleReviewLink?: string;
    header_text?: string;
    signature_text?: string;
    saas?: string;
    cs?: SuccessManager;
    saas_detail?: SaasDetail;
    businessId?: string;
    feature?: FeaturesStatus | null;
    'hxng-monetisation'?: HxngMonetisation;
    hpr_id?: string;
    hpr_id_number?: string;
    business?: {
        id: string;
        name?: string;
        logo?: string;
    };
}

export interface SuccessManager {
    training_status: string;
    success_manager: string;
    oid: string;
    training_start: string;
    training_end: string;
    last_connect: string;
}

export interface Registrations {
    council: string;
    id: string;
    medical_id: string;
    year: string;
}
export interface SpecialityEntityOrMajorSpeciality {
    id: string;
    name: string;
}
export interface FeaturesStatus {
    rn?: boolean;
}

export interface SaasDetail {
    start_date: string;
    status: boolean;
    date_of_collection: string;
    trial_start: string;
    valid_till: string;
    trial_end: string;
}

export interface MedDose {
    id?: string;
    value?: string;
    unit?: string;
    custom?: string;
    timing?: Date | string;
}

export interface InfusionRate {
    total_volume?: MedDose;
    infusion_time?: MedDose;
    iv_drop_rate?: MedDose;
    iv_rate?: MedDose;
}

export interface Frequency {
    type: string; // either code or onceEvery or SOS or toContinue or custom
    code?: string;
    onceEvery?: {
        value: string;
        unit: string;
    };
    custom?: string;
    time_split?: MedDose[];
}

export interface Duration {
    value?: string;
    unit?: string;
    custom?: string;
}

export interface InjectionsEntity {
    name: string;
    id: string;
    generic_name: string;
    form: string;
    df_id?: string;
    dosage_form?: string;
    route: string;
    dose: MedDose;
    infusion_rate: InfusionRate;
    frequency: Frequency;
    duration: Duration;
    timing: string;
    instructions?: string;
    tapering_dose?: InjectionsEntity[];
    added_drug?: InjectionsEntity[];
    actual_name?: string;
    taperingDoseTitleDisplay?: boolean;
}

export interface Surface {
    id: string;
    name: string;
}

export interface DentalExamination {
    entity_id?: string;
    id: string;
    name: string;
    teeth_id?: string;
    surfaces?: Surface[];
    since?: string;
    remark?: string;
    group_id?: string;
    type?: DENTAL_ENTITY_TYPE; // examination or procedure
    index?: number;
}

export enum DENTAL_ENTITY_TYPE {
    EXAMINATION = 'examination',
    PROCEDURE = 'procedure',
}

export interface DentalProcedure {
    entity_id?: string;
    id: string;
    name: string;
    teeth_ids?: string[];
    surfaces?: Surface[];
    visits?: string;
    start_on?: string;
    remark?: string;
    service_id?: string;
    conducted_by?: string;
    assisted_by?: string;
    index?: number;
}

export interface Procedure {
    id: string;
    name: string;
    date?: string;
    notes?: string;
}

export interface masssagedAppointmentMetaDataObject {
    key: string;
    value: string;
}
