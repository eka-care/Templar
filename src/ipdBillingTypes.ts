/**
 * IPD billing PDF input shapes (aligned with Stetho APIs, defined here so Templar does not import the host app).
 */

export interface IpdBillingDoc {
    name: string;
    id: string;
}

export interface IpdBillingDepartment {
    name: string;
    id: string;
}

export interface IpdBillingRateplan {
    name: string;
    id: string;
}

export interface IpdBillingPatientFormData {
    label: string;
    type: 'number' | 'string' | 'select' | 'multi_select';
    key: string;
    value: string | number | string[];
}

export interface IpdBillingPatientAge {
    value?: string;
    month?: string;
    dob?: string;
}

export interface IpdBillingPatientPhone {
    n?: string;
    c?: string;
}

export interface IpdBillingPatientPersonal {
    gender: string;
    phone?: IpdBillingPatientPhone;
    age?: IpdBillingPatientAge;
    name: string;
}

export interface IpdBillingPatientProfile {
    personal: IpdBillingPatientPersonal;
}

export interface IpdBillingPatient {
    formData: IpdBillingPatientFormData[];
    profile: IpdBillingPatientProfile;
    poid: string;
    uuid: string;
    id: string;
}

/** One IPD admission row (ipd admit list / billing). */
export interface Data {
    id: string;
    ipid: string;
    pid: string;
    docid: string;
    doc: IpdBillingDoc;
    status: string;
    patient: IpdBillingPatient;
    date: string;
    bed?: string;
    department: IpdBillingDepartment;
    rateplan?: IpdBillingRateplan;
    dischargeDate?: string;
}

export interface Service {
    id: string;
    name: string;
    qty: number;
    mrp: number;
    discount: number;
    amount: number;
    date?: string;
}

export interface ReceiptPayment {
    paymode: string;
    amount: number;
}

export interface ReceiptSku {
    quantity: number;
    amount: number;
    discount_value: number;
    discount_type: string;
    discount_amount: number;
    net_amount: number;
}

export interface Receipt {
    receipt_id: number;
    net_amount: number;
    created_at: string;
    receipt_payment?: ReceiptPayment[];
    receipt_sku?: ReceiptSku[];
}

export enum DateAndTimeConfigForReceipt {
    DATE_ONLY = 'date_only',
    DATE_AND_TIME = 'date_and_time',
    EXTENDED_DATE_AND_TIME = 'extended_date_and_time',
}

/** Receipt PDF settings from API (getReceiptPdfConfig). */
export interface ApiReceiptPdfConfig {
    doctor_oid?: string;
    clinic_id?: string;
    page_size?: 'A4' | 'A5';
    margins?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
    heights?: {
        header?: number;
        footer?: number;
    };
    flags?: {
        print_header?: boolean;
        print_footer?: boolean;
        print_uhid?: boolean;
        print_receipt_number?: boolean;
        discount_column?: 'ALWAYS' | 'IF_APL';
        quantity_column?: 'ALWAYS' | 'IF_APL';
        print_paymode_split?: boolean;
        print_transaction_id?: boolean;
        print_amount_in_words?: boolean;
        date_and_time?: DateAndTimeConfigForReceipt;
        bill_created_at?: boolean;
        print_bill_created_by?: boolean;
    };
    header_image_url?: string;
    footer_image_url?: string;
    constraints?: {
        require_uhid?: boolean;
    };
}

export interface DocProfileClinic {
    _id: string;
    name?: string;
    address?: { line1?: string };
    city_name?: string;
}

/** Subset of doctor profile used for IPD billing PDF header. */
export interface DocProfileResponse {
    profile: {
        personal: { s?: string; name: { f: string; l: string } };
        professional: {
            header_text?: string;
            clinics?: DocProfileClinic[];
        };
    };
}

/** IPD facility cache in localStorage (`ipd-conf`), beds/rooms for ward line. */
export interface IpdFacilityBed {
    id: string;
    name: string;
    room: string;
}

export interface IpdFacilityRoom {
    id: string;
    name: string;
}
