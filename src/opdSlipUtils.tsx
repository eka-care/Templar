import { getHeaderForReceipt, ReceiptPdfConfig, TPageSize } from './ReceiptUtils';

export interface FormDataKeyLabel {
    key: string;
    label: string;
}

export interface OpdSlipService {
    service_name: string;
    service_id: string;
    price: number;
}

export interface OpdSlipHeaderData {
    doctorName: string;
    headerText: string;
    clinicName: string;
    clinicAddress: string;
    config: ReceiptPdfConfig;
}

export interface OpdSlipBodyData {
    name: string;
    age?: string;
    gender?: string;
    uhid?: string;
    time?: string;
    date?: string;
    patient_mobile?: string;
    doctor_name?: string;
    token?: string;
    services: OpdSlipService[];
    payment_status?: string;
    appointmentStatus?: string; // enums arent present in stetho, they exist only in elixir. stetho still does string BK, string CK.  todo, consolidate these
    mappedFormData?: Array<{
        label: string;
        type: 'string' | 'number' | 'select' | 'multi_select';
        key: string;
        value: string | number | FormDataKeyLabel | FormDataKeyLabel[];
    }>;
}

export interface OpdSlipFooterData {
    created_by?: string;
    created_at?: string;
}

export const getHeaderForOpdSlip = (data: OpdSlipHeaderData): string => {
    return getHeaderForReceipt(data);
};

export const getAppointmentDetails = ({
    time,
    doctor_name,
    token,
    appointmentStatus,
}: Partial<OpdSlipBodyData>): { label: string; value: string; valueStyle: string }[] => {
    const defaultValueStyle =
        'font-size: 1rem; color: #2a2a2a; margin: 0; font-weight: 500; line-height: 1.4;';
    const tokenValueStyle =
        'font-size: 1.4rem; color: #000000; margin: 0; font-weight: 700; line-height: 1.2;';

    return [
        time ? { label: 'DATE & TIME', value: time, valueStyle: defaultValueStyle } : null,
        doctor_name ? { label: 'DOCTOR', value: doctor_name, valueStyle: defaultValueStyle } : null,

        appointmentStatus
            ? {
                  label: 'STATUS',
                  value: appointmentStatus,
                  valueStyle: defaultValueStyle,
              }
            : null,
        token ? { label: 'TOKEN', value: token, valueStyle: tokenValueStyle } : null,
    ].filter(Boolean) as { label: string; value: string; valueStyle: string }[];
};

export const getPatientDetails = ({
    name,
    gender,
    uhid,
    age,
    patient_mobile,
}: Partial<OpdSlipBodyData>): { label: string; value: string }[] => {
    return [
        name ? { label: 'NAME', value: name } : null,
        patient_mobile ? { label: 'PHONE NO.', value: patient_mobile } : null,
        uhid ? { label: 'UHID', value: uhid } : null,
        gender ? { label: 'GENDER', value: gender } : null,
        age ? { label: 'AGE', value: age } : null,
    ].filter(Boolean) as { label: string; value: string }[];
};

export const getadditionalDetailsOfPatient = (
    mappedFormData?: OpdSlipBodyData['mappedFormData'],
): { label: string; value: string }[] => {
    if (!mappedFormData?.length) return [];

    return mappedFormData
        .map((fd) => {
            let displayValue: string | undefined;
            if (fd?.type === 'multi_select' && Array.isArray(fd?.value)) {
                displayValue = (fd?.value as FormDataKeyLabel[]).map((v) => v?.label).join(', ');
            } else if (
                fd?.type === 'select' &&
                typeof fd?.value === 'object' &&
                !Array.isArray(fd?.value)
            ) {
                displayValue = (fd?.value as FormDataKeyLabel)?.label;
            } else {
                displayValue = fd?.value != null ? String(fd?.value) : undefined;
            }

            return displayValue ? { label: fd?.label, value: displayValue } : null;
        })
        .filter(Boolean) as { label: string; value: string }[];
};

const fixedWidthItems = ['GENDER', 'AGE'] as const;

export const getBodyForOpdSlip = (data: OpdSlipBodyData): string => {
    const {
        name,
        gender,
        time,
        doctor_name,
        token,
        services,
        payment_status,
        age,
        uhid,
        patient_mobile,
        appointmentStatus,
        mappedFormData,
    } = data;

    const additionalDetailsOfPatient = getadditionalDetailsOfPatient(mappedFormData);
    const doesPatientAttributesExist = additionalDetailsOfPatient.length > 0;

    const patientDetails = getPatientDetails({ name, gender, age, uhid, patient_mobile });
    if (token) {
        patientDetails.push({ label: 'TOKEN', value: token });
    }

    const appointmentDetails = getAppointmentDetails({ time, doctor_name, appointmentStatus });

    const defaultValueStyle =
        'font-size: 1rem; color: #2a2a2a; margin: 0; font-weight: 500; line-height: 1.4;';
    const tokenValueStyle =
        'font-size: 1rem; color: #000000; margin: 0; font-weight: 700; line-height: 1.2;';

    return `<main id="opd-slip-body" style="padding-bottom: 1.5rem; padding-top: 0rem; padding-right: 2.5rem; padding-left: 2.5rem; background: #ffffff; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;">

            <!-- Patient Section -->
            <section style="margin-bottom: 0.6rem; padding-bottom: 1rem; border-bottom: 1.6px solid #e8e8e8;">
                <p style="font-size: 0.85rem; letter-spacing: 0.15em; color: #000000; text-transform: uppercase; font-weight: 700; margin: 0 0 0.2rem 0;">PATIENT DETAILS</p>
                <div style="display: flex; align-items: start; gap: 0.8rem;">
                    ${patientDetails
                        .map(
                            (item, index, arr) => `
                            <div style="min-width: 0; ${fixedWidthItems.includes(item.label as typeof fixedWidthItems[number]) ? 'flex: 0 0 auto;' : 'flex: 1;'}">
                                <p style="font-size: 0.7rem; letter-spacing: 0.08em; color: #999999; text-transform: uppercase; font-weight: 600; margin: 0 0 0.5rem 0;">${
                                    item.label
                                }</p>
                                <p style="${
                                    item.label === 'TOKEN' ? tokenValueStyle : defaultValueStyle
                                }">${item.value}</p>
                            </div>
                            ${
                                index !== arr.length - 1
                                    ? `<div style="color: #cccccc; font-size: 1rem; line-height: 1; padding-top: 1rem;">|</div>`
                                    : ''
                            }
                        `,
                        )
                        .join('')}
                </div>
            </section>

            <!-- Appointment & Additional Details Section -->
           ${`<section style="margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1.6px solid #e8e8e8;">
    
            <p style="font-size: 0.8rem; letter-spacing: 0.12em; color: #000000; text-transform: uppercase; font-weight: 700; margin: 0 0 0.6rem 0;">
                APPOINTMENT & ADDITIONAL DETAILS
            </p>
        
            <div style="
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                column-gap: 1rem; 
                row-gap: 0.4rem;
                font-size: 0.8rem;
                line-height: 1.25;
            ">
                
                ${[...appointmentDetails, ...additionalDetailsOfPatient]
                    .map(
                        (item) => `
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        <span style="color: #888888; font-weight: 600;">${item.label}:</span>
                        <span style="color: #000000; font-weight: 500;"> ${item.value}</span>
                    </div>
                `,
                    )
                    .join('')}
            </div>
        
        </section>`}

            <!-- Services & Payment Section -->
            <section>
                <p style="font-size: 0.8rem; color: #2a2a2a; margin: 0 0 0 0; font-weight: 500; line-height: 1;">
                    <span style="font-weight: 700; margin-right: 1rem;">Services:</span>
                    ${
                        services.length > 0
                            ? services
                                  .map(
                                      (s, index) =>
                                          `${s.service_name} ( ₹${s.price} )${index !== services.length - 1 ? ' <span style="color: #999;">|</span>' : ''}`,
                                  )
                                  .join(' ')
                            : '<span style="color: #bbbbbb;">No services selected</span>'
                    }
                </p>
                ${
                    payment_status
                        ? `<p style="font-size: 0.8rem; color: #2a2a2a; margin: 0; font-weight: 500; line-height: 2;">
                    <span style="font-weight: 700; margin-right: 1rem;">Payment:</span> ${payment_status}
                </p>`
                        : ''
                }
            </section>

        </main>`;
};

export const getFooterForOpdSlip = (data: OpdSlipFooterData): string => {
    const { created_by, created_at } = data;

    const footerParts = [
        'Valid only for this visit',
        created_by ? `Created by: ${created_by}` : undefined,
        created_at ? `Created at: ${created_at}` : undefined,
    ].filter(Boolean) as string[];

    return `
        <footer id="opd-slip-footer" style="text-align: center; padding: 0.8rem 2rem 0; font-size: 0.8rem; color: black; border-top: 1.6px solid #e8e8e8; background: #ffffff; letter-spacing: 0.03em; position: fixed; bottom: 1.5rem; left: 0; right: 0;">
            <div style="margin: 0; line-height: 1.6; font-weight: 400; display: flex; justify-content: center; align-items: center; gap: 1.3rem;">
                ${footerParts
                    .map(
                        (item, index, arr) => `
                        <span>${item}</span>
                        ${index !== arr.length - 1 ? `<span style="color: #cccccc;">|</span>` : ''}
                    `,
                    )
                    .join('')}
            </div>
        </footer>`;
};

export const getHeadCssForOpdSlip = (pageSize: TPageSize): string => {
    const rootFontSize = pageSize === 'A5' ? '11px' : '16px';
    return `<style>html { font-size: ${rootFontSize}; }</style>`;
};
