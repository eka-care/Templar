import {
    GeniePadElementsSettingItem,
    SectionNameConfig,
    DentalExamination,
    DentalProcedure,
    InjectionsEntity,
    Procedure,
    DoctorProfile,
    RenderPdfConfig,
} from './types';

export interface RenderPdfPrescription {
    id: string;
    date: string;
    timeZone: string;
    dateEnd: string;
    selectedClinic: string;
    selectedClinicData?: any;
    visitId: string;
    doctor: DoctorProfile;
    patient: Patient;
    tool: Tool;
    patientAge?: string;
    padVersion: string;
    actor?: {
        id: string;
        name: string;
    };
    translate?: {
        flag: boolean;
        lang:
            | 'en'
            | 'hi'
            | 'gu'
            | 'te'
            | 'mr'
            | 'kn'
            | 'pa'
            | 'bn'
            | 'ta'
            | 'ml'
            | 'as'
            | 'or'
            | 'ml';
        advices?: boolean;
        medications?: boolean;
        injections?: boolean;
    };
    growthCharts?: GrowthChartData[];
}
export interface GrowthChartData {
    chartType:
        | 'weight-for-age'
        | 'height-for-age'
        | 'ofc-for-age'
        | 'bmi-for-age'
        | 'weight-for-height';
    chartConfig: {
        data: {
            labels?: number[];
            datasets: Array<{
                label: string | string[];
                data: Array<{ x: number; y: number } | number>;
                backgroundColor?: string;
                borderColor?: string;
                fill?: boolean;
                pointRadius?: number;
                pointHoverRadius?: number;
                borderWidth?: number;
                order?: number;
                pointBackgroundColor?: string | string[];
                pointBorderColor?: string | string[];
                pointStyle?: string;
            }>;
        };
        options: {
            scales: {
                x: {
                    type?: string;
                    min?: number;
                    max?: number;
                    ticks?: {
                        stepSize?: number;
                        color?: string;
                        font?: {
                            weight?: string;
                            size?: number;
                        };
                    };
                    title?: {
                        text: string;
                        color?: string;
                        font?: {
                            size?: number;
                            weight?: string;
                        };
                        display?: boolean;
                    };
                    grid?: {
                        display?: boolean;
                        color?: string;
                        borderColor?: string;
                    };
                };
                y: {
                    type?: string;
                    ticks?: {
                        stepSize?: number;
                        color?: string;
                        font?: {
                            weight?: string;
                            size?: number;
                        };
                    };
                    title?: {
                        text: string;
                        color?: string;
                        font?: {
                            size?: number;
                            weight?: string;
                        };
                        display?: boolean;
                    };
                    grid?: {
                        display?: boolean;
                        color?: string;
                        borderColor?: string;
                    };
                };
            };
            plugins?: {
                datalabels?: {
                    color?: string | ((context: any) => string);
                    anchor?: string;
                    align?: string | ((context: any) => string);
                    font?:
                        | ((context: any) => { size?: number; weight?: string; color?: string })
                        | {
                              size?: number;
                              weight?: string;
                          };
                    formatter?: (value: any, context: any) => string;
                };
                legend?: {
                    display?: boolean;
                };
            };
            layout?: {
                padding?: {
                    top?: number;
                    right?: number;
                    bottom?: number;
                    left?: number;
                };
            };
            elements?: {
                line?: {
                    fill?: boolean;
                    tension?: number;
                };
            };
            aspectRatio?: number;
        };
    };
}

interface Phone {
    c: string;
    n: string;
}

interface FieldsEntity {
    label: string;
    type: 'string' | 'number' | 'select';
    key: string;
    value?: number | string;
}

export interface Patient {
    id?: string;
    localId: string;
    profile: Profile1;
    formData?: FieldsEntity[];
}
interface Profile1 {
    personal: Personal1;
    medical: Medical;
}
interface Personal1 {
    name: string;
    phone: Phone;
    age: Age;
    gender: string;
}
interface Age {
    dob: string;
    value: string;
}
interface Medical {
    commonAllergies?:
        | CommonAllergiesEntityOrChronicAilmentEntityOrMedicationAllergiesEntityOrSurgeriesEntity[]
        | null;
    chronicAilment?:
        | CommonAllergiesEntityOrChronicAilmentEntityOrMedicationAllergiesEntityOrSurgeriesEntity[]
        | null;
    medicationAllergies?:
        | CommonAllergiesEntityOrChronicAilmentEntityOrMedicationAllergiesEntityOrSurgeriesEntity[]
        | null;
    surgeries?:
        | CommonAllergiesEntityOrChronicAilmentEntityOrMedicationAllergiesEntityOrSurgeriesEntity[]
        | null;
}
interface CommonAllergiesEntityOrChronicAilmentEntityOrMedicationAllergiesEntityOrSurgeriesEntity {
    name: string;
    id: string;
}

interface ExaminationsEntity {
    id: string;
    name: string;
    notes?: string;
}

interface VitalsEntity {
    id: string;
    name: string;
    value: Value;
}

interface PatientMedicalConditionsObject {
    id: string;
    name: string;
    status?: string;
    since?: SinceObj;
    notes?: string;
    reportedAt?: string;
}

interface SinceObj {
    custom: string;
}

interface PtGenericObject {
    id: string;
    name: string;
    notes?: string;
}

interface ExaminationsEntity {
    id: string;
    name: string;
    notes?: string;
}
interface VitalsEntity {
    id: string;
    name: string;
    dis_name?: string;
    value: Value;
}
interface Value {
    qt: string;
    unit: string;
}

interface MedicalHistoryDBRow {
    _id?: string;
    pid: string;
    eid: string;
    prid: string;
    name: string;
    type: string;
    value?: string;
    unit?: string;
    full_data: any;
    created_at: Date;
}

interface PatientHistoryObject {
    patientMedicalConditions: PatientMedicalConditionsObject[];
    lifestyleHabits: PtGenericObject[];
    recentTravelHistory: PtGenericObject[];
    currentMedications: PtGenericObject[];
    drugAllergy: PtGenericObject[];
    foodOtherAllergy: PtGenericObject[];
    pastProcedures: PtGenericObject[];
    otherMedicalHistory: PtGenericObject[];
    familyHistory: PtGenericObject[];
}

interface MedicalHistory {
    examinations?: ExaminationsEntity[] | null;
    vitals?: VitalsEntity[] | null;
    patientHistory: PatientHistoryObject | null;
    growthChartVitals?: {
        chartType?: 'fanton' | 'who-iap';
        chartValues: GrowthChart[];
    };
}

interface GrowthChart {
    name: string;
    value: string;
}

type mhDataElement = {
    name: string;
    values: {
        name: string;
        toshow: string;
    }[];
};

export interface IpdAdmission {
    advised?: boolean;
    include_procedures?: boolean;
    notes?: string;
}

export interface Tool {
    language: string;
    symptoms?: SymptomsEntity[] | null;
    diagnosis?: DiagnosisEntity[] | null;
    medications?: MedicationsEntity[] | null;
    injections?: InjectionsEntity[] | null;
    labTests?: LabTestsEntityOrProceduresEntity[] | null;
    labVitals?: LabVitals[] | null;
    dyform?: DyformEntity[] | null;
    medicalHistory?: MedicalHistory;
    prescriptionNotes_html?: {
        parsedText?: string;
        text?: string;
    };
    advices_html?: {
        text?: string;
    }[];
    sectionProp?: {
        mhData: {
            pmh: mhDataElement;
            fh: mhDataElement;
            lh: mhDataElement;
            th: mhDataElement;
            cm: mhDataElement;
            da: mhDataElement;
            oa: mhDataElement;
            pp: mhDataElement;
            omh: mhDataElement;
            'd-vh': mhDataElement;
            'g-vh': mhDataElement;
        };
        dy: {
            values: {
                name: string;
                toshow: string;
            }[];
        };
        sy: {
            values: {
                name: string;
                toshow: string;
            }[];
        };
    };
    referPrint?: {
        ref_heading?: string;
        ref_doc_details: {
            ref_heading?: string;
            ref_clinic?: string;
            ref_doc_notes?: string;
        }[];
        ref_notes?: string;
    };
    referRenderPdfPrint: {
        ref_doc_details: {
            ref_heading?: string;
            ref_clinic?: string;
            ref_doc_notes?: string;
        }[];
        ref_notes?: string;
    };
    advices?: AdvicesEntity[] | null;
    followup: Followup;
    prescriptionNotes: Notes;
    privateNotes: Notes;
    labVitalsDate: {
        dt: string;
        arr: {
            id: string;
            name: string;
            unit_dislay_name: string;
            value: string;
            interpretation: [Object];
            date: string;
            remark: string;
            unit: [Object];
            all_units: Unit[];
            dateInString: string;
            toshow: string;
            toshownodate: string;
        }[];
    }[];
    dentalExaminations?: DentalExamination[];
    dentalProcedures?: DentalProcedure[];
    opVision: Ophthalmology[];
    opIop: Ophthalmology[];
    opCurrentSpec: Ophthalmology[];
    opSubjectiveRefraction: Ophthalmology[];
    opAutoRefraction: Ophthalmology[];
    opFinalPrescription: Ophthalmology[];
    procedures?: Procedure[];
    ipdAdmission?: IpdAdmission;
    careCanvas?: CareCanvas[];
}
export interface CareCanvas {
    id: string;
    name: string;
    final_image: string;
    width?: string;
    height?: string;
}

export type Ophthalmology = {
    id: string;
    name: string;
    eye: {
        value: string;
    };
} & {
    [key: string]: {
        id: string;
        value: string;
        unit: string;
        custom: string;
    };
};

interface Notes {
    id: string;
    text: string;

    parsedText: string;
}

interface DyformEntity {
    id: string;
    name: string;
    elements: DyformElementEntity[] | null;
}

interface DyformElementEntity {
    id: string;
    name: string;
    value: string;
}

interface SymptomsEntity {
    id: string;
    name: string;
    duration?: DurationOrOnceEvery | null;
    severity?: Severity | null;
    remark?: string | null;
    meta?: Meta;
    properties: ToolsPropertyObject;
}

interface ToolsPropertyObject {
    [key: string]: {
        name: string;
        selection?: SelectionEntity[] | null;
    };
}
interface SelectionEntity {
    id: string;
    value: string;
    unit?: string;
}

interface DurationOrOnceEvery {
    value: string;
    custom?: string;
    unit: string;
}
interface Severity {
    display: string;
    code: string;
}
interface Meta {
    updatedAt: string;
    isLocal: number;
}

interface DiagnosisEntity {
    id: string;
    name: string;
    duration?: DurationOrOnceEvery | null;
    severity?: Severity | null;
    remark?: string | null;
    meta?: Meta;
    properties: ToolsPropertyObject;
}
interface MedicationsEntity {
    name: string;
    id: string;
    form: string;
    frequency: Frequency;
    duration: DurationOrOnceEvery1;
    timing: string;
    instruction?: string | null;
    dose: DoseObject;
    dosage_form: string;
    generic_name: string;
    product_type: string;
    meta: any;
    quantity?: { custom: string };
    area: {
        name: string;
    };
    start_from?: stObject;
    to_day?: stObject;

    tapering_dose: taperingEntity[];
    isTapering?: boolean;
    ind?: number;
    route?: MedRoute;
    taperingDoseTitleDisplay?: boolean;
}

export interface MedRoute {
    name: string;
    id: string;
    display_name: string;
    snomed_id: string;
}

interface taperingEntity {
    frequency: Frequency;
    duration: DurationOrOnceEvery1;
    timing: string;
    instruction?: string | null;
    dose: DoseObject;
    start_from: stObject;
    route?: MedRoute;
}

interface stObject {
    text?: string;
    unit?: string;
    value?: string;
}

interface DoseObject {
    custom?: string;
    id?: string;
    unit?: string;
    value?: string;
}
interface Frequency {
    type: string;
    custom?: string | null;
    onceEvery?: DurationOrOnceEvery2 | null;
}
interface DurationOrOnceEvery2 {
    value: string;
    unit: string;
}
interface DurationOrOnceEvery1 {
    value: string;
    unit: string;
    custom: string;
}

interface Value {
    qt: string;
    unit: string;
    safe?: Safe;
}

export interface Safe {
    low?: string;
    high?: string;
    type: 'Numeric' | 'string';
    is_decimal_allowed?: boolean;
    normal_value?: string;
}
interface LabTestsEntityOrProceduresEntity {
    name: string;
    id: string;
    remark: string;
    originalRemark?: string;
    test_on?: string;
    repeat_on?: string;
    content?: string[];
}

interface AdvicesEntity {
    id: string;
    text: string;
    parsedText: string;
    meta?: any;
}
interface Followup {
    date: string;
    notes: string;
    appointmentId: string;
}

interface LabVitals {
    id: string;
    name: string;
    unit_dislay_name: string;
    value: string;
    interpretation: Interpretation;
    date: string;
    remark: string;
    unit: Unit;
    toshow?: string;
    dateInString?: string;
}
interface Interpretation {
    value: string;
    id: string;
}
interface Unit {
    name: string;
    mdb_id: string;
    refRange: RefRange;
}
interface RefRange {
    low: number;
    high: number;
}

export interface TemplateV2 {
    render_pdf_config?: RenderPdfConfig;
    render_pdf_body_config?: {
        medication_config?: GeniePadElementsSettingItem[];
        pad_elements_config?: GeniePadElementsSettingItem[];
        section_name_config?: SectionNameConfig;
        injections_config?: GeniePadElementsSettingItem[];
    };
}

export interface TemplateConfig {
    header_img?: string;
    footer_img?: string;
    show_signature?: boolean;
    show_name_in_signature?: boolean;
    show_signature_text?: boolean;
    show_page_number?: boolean;
    show_prescription_id?: boolean;
    margin_left?: string;
    margin_right?: string;
    header_height?: string;
    header_top_margin?: string;
    header_bottom_margin?: string;
    header_left_margin?: string;
    header_right_margin?: string;
    floating_header?: boolean;
    floating_patient_details?: boolean;
    floating_patient_details_top_margin?: string;
    footer_height?: string;
    footer_top_margin?: string;
    footer_bottom_margin?: string;
    footer_left_margin?: string;
    footer_right_margin?: string;
    floating_footer?: boolean;
    floating_footer_details?: boolean;
    page_size?: string;
    medication_config?: GeniePadElementsSettingItem[];
    pad_elements_config?: GeniePadElementsSettingItem[];
    injections_config?: GeniePadElementsSettingItem[];
    bullets_config?: { [key: string]: boolean };
    tabular_config?: { [key: string]: boolean };
    prescription_size?: 'compact' | 'spacious' | 'normal' | 'extra-large';
    date_and_time?: 'date-time' | 'date' | 'day-month-date-year-time';
    lab_vitals_format?: 'date-data' | '';
    advices_format?: 'pipe-seperated' | '';
    patient_form_data_format?: 'pipe-seperated-without-key' | '';
    medication_table_format?:
        | 'quantity-column'
        | 'quantity-column-without-border'
        | 'quantity-remarks-column-without-border'
        | '';
    medication_name_in_capital?: boolean;
    show_not_valid_for_medical_legal_purpose_message?: boolean;
    show_eka_logo?: boolean;
    show_approval_details?: boolean;
    floating_header_page_top_margin?: string;
    floating_footer_page_bottom_margin?: string;
    make_generic_name_as_primary?: boolean;
    medication_heading_hide?: boolean;
    medication_table_heading_text?: string;
    symptoms_name_in_capital?: boolean;
    diagnosis_name_in_capital?: boolean;
    lab_tests_name_in_capital?: boolean;
    symptoms_name_in_unbold?: boolean;
    diagnosis_name_in_unbold?: boolean;
    lab_tests_name_in_unbold?: boolean;
    lab_vitals_name_in_unbold?: boolean;
    referred_to_in_unbold?: boolean;
    dyform_in_unbold?: boolean;
    dyform_data_layout?: 'bullet' | 'inline';
    dyform_heading_color?: string;
    dyform_name_color?: string;
    dyform_properties_color?: string;
    patient_form_data_in_unbold?: boolean;
    patient_form_below_border?: boolean;
    followup_in_unbold?: boolean;
    date_in_unbold?: boolean;
    medical_history_name_in_unbold?: boolean;
    vitals_in_unbold?: boolean;
    examination_findings_name_in_unbold?: boolean;
    patient_details_format?: 'name-age-slash-gender-number' | '';
    patient_details_in_uppercase?: boolean;
    patient_details_form_data_name_color?: string;
    patient_details_form_data_properties_color?: string;
    patient_details_patient_name_color?: string;
    patient_details_date_color?: string;
    attachment_image?: string;
    template_column_type?: 'single' | 'double' | '';
    columns_config?: ColumnConfig;
    symptoms_heading_color?: string;
    symptoms_name_color?: string;
    symptoms_properties_color?: string;
    diagnosis_heading_color?: string;
    diagnosis_name_color?: string;
    diagnosis_properties_color?: string;
    vitals_heading_color?: string;
    vitals_name_color?: string;
    vitals_properties_color?: string;
    lab_tests_heading_color?: string;
    lab_tests_name_color?: string;
    lab_tests_properties_color?: string;
    lab_vitals_heading_color?: string;
    lab_vitals_name_color?: string;
    lab_vitals_properties_color?: string;
    referred_to_heading_color?: string;
    referred_to_properties_color?: string;
    advices_heading_color?: string;
    advices_properties_color?: string;
    medications_table_title_bg_color?: string;
    medications_table_border_color?: string;
    medications_table_header_color?: string;
    medications_table_title_alignment?: MedicationsTableTitleAlignment;
    pmh_heading_color?: string;
    pmh_name_color?: string;
    pmh_properties_color?: string;
    patient_medical_history_heading_color?: string;
    patient_medical_history_name_color?: string;
    patient_medical_history_properties_color?: string;
    family_history_heading_color?: string;
    family_history_name_color?: string;
    family_history_properties_color?: string;
    lifestyle_habits_heading_color?: string;
    lifestyle_habits_name_color?: string;
    lifestyle_habits_properties_color?: string;
    travel_history_heading_color?: string;
    travel_history_name_color?: string;
    travel_history_properties_color?: string;
    current_medications_heading_color?: string;
    current_medications_name_color?: string;
    current_medications_properties_color?: string;
    drug_allergies_heading_color?: string;
    drug_allergies_name_color?: string;
    drug_allergies_properties_color?: string;
    other_allergies_heading_color?: string;
    other_allergies_name_color?: string;
    other_allergies_properties_color?: string;
    past_procedure_heading_color?: string;
    past_procedure_name_color?: string;
    past_procedure_properties_color?: string;
    other_medical_history_heading_color?: string;
    other_medical_history_name_color?: string;
    other_medical_history_properties_color?: string;
    examinations_heading_color?: string;
    examinations_name_color?: string;
    examinations_properties_color?: string;
    notes_heading_color?: string;
    notes_properties_color?: string;
    followup_heading_color?: string;
    followup_properties_color?: string;
    followup_date_color?: string;
    spacing_between_sections?: SpacingBetweenSections;
    footer_doctor_name_color?: string;
    rx_element_key_seperator?: SeperatorType;
    medication_table_width?: MedicationTableWidth;
    procedures_in_unbold?: boolean;
    procedures_heading_color?: string;
    procedures_name_color?: string;
    procedures_notes_color?: string;
    procedures_properties_color?: string;
    injections_table_format?:
        | 'quantity-column'
        | 'quantity-column-without-border'
        | 'quantity-remarks-column-without-border'
        | 'table'
        | '';
    injections_name_in_capital?: boolean;
    injections_heading_hide?: boolean;
    injections_table_heading_text?: string;
    injections_table_title_bg_color?: string;
    injections_table_border_color?: string;
    injections_table_header_color?: string;
    injections_table_title_alignment?: InjectionsTableTitleAlignment;
    current_injections_heading_color?: string;
    current_injections_name_color?: string;
    current_injections_properties_color?: string;
    injections_table_width?: InjectionsTableWidth;
    opthal_heading_color?: string;
    dental_examinations_heading_color?: string;
    dental_examinations_properties_color?: string;
    dental_examinations_key_color?: string;
    dental_procedures_heading_color?: string;
    dental_procedures_table_heading_color?: string;
    dental_procedures_table_border_color?: string;
    opthal_table_heading_color?: string;
    opthal_table_border_color?: string;
    admission_advised_heading_color?: string;
    admission_advised_name_color?: string;
    admission_advised_properties_color?: string;
    growth_chart_heading_color?: string;
    growth_chart_name_color?: string;
    growth_chart_properties_color?: string;
    care_canvas_heading_color?: string;
    medical_history_status_display?: string;
    growth_chart_image_display?: boolean;
    __v2?: boolean;
}

export type MedicationTableWidth = { [key: string]: number | undefined };
export type SeperatorType = '|' | ';' | ',';

export type MedicationsTableTitleAlignment = 'center' | 'right' | 'left';
export type InjectionsTableTitleAlignment = 'center' | 'right' | 'left';
export type InjectionsTableWidth = { [key: string]: number | undefined };

export type SpacingBetweenSections = 'compact' | 'normal' | 'spacious' | 'extra-spacious';

export interface ColumnConfig {
    [id: string]: string[];
}
