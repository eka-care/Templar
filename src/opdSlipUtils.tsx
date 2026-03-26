import { getHeaderForReceipt, ReceiptPdfConfig, TPageSize } from './ReceiptUtils';
import { FormDataKeyLabel } from '../../utils/formDataTransform';

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
        'font-size: 0.75rem; color: #2a2a2a; margin: 0; font-weight: 500; line-height: 1.4;';
    const tokenValueStyle =
        'font-size: 1.1rem; color: #000000; margin: 0; font-weight: 700; line-height: 1.2;';

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
        gender ? { label: 'GENDER', value: gender } : null,
        age ? { label: 'AGE', value: age } : null,
        patient_mobile ? { label: 'PHONE NO.', value: patient_mobile } : null,
        uhid ? { label: 'UHID', value: uhid } : null,
    ].filter(Boolean) as { label: string; value: string }[];
};

export const getadditionalDetailsOfPatient = (
    mappedFormData?: OpdSlipBodyData['mappedFormData'],
): { label: string; value: string }[] => {
    if (!mappedFormData?.length) return [];

    return mappedFormData
        .map((fd) => {
            let displayValue: string | undefined;
            if (fd.type === 'multi_select' && Array.isArray(fd.value)) {
                displayValue = (fd?.value as FormDataKeyLabel[]).map((v) => v?.label).join(', ');
            } else if (
                fd.type === 'select' &&
                typeof fd.value === 'object' &&
                !Array.isArray(fd.value)
            ) {
                displayValue = (fd?.value as FormDataKeyLabel)?.label;
            } else {
                displayValue = fd.value != null ? String(fd?.value) : undefined;
            }

            return displayValue ? { label: fd?.label, value: displayValue } : null;
        })
        .filter(Boolean) as { label: string; value: string }[];
};

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

    return `<main id="opd-slip-body" style="padding: 3rem 2.5rem; background: #ffffff; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;">

            <!-- Patient Section -->
            <section style="margin-bottom: 2rem; padding-bottom: ${
                additionalDetailsOfPatient.length > 0 ? '1rem' : '2rem'
            }; border-bottom: ${
        additionalDetailsOfPatient.length > 0 ? 'none' : '1.6px solid #e8e8e8'
    };">
                <p style="font-size: 0.85rem; letter-spacing: 0.15em; color: #000000; text-transform: uppercase; font-weight: 700; margin: 0 0 0.8rem 0;">PATIENT DETAILS</p>
                <div style="display: flex; align-items: start; gap: 1.3rem;">
                    ${getPatientDetails({ name, gender, age, uhid, patient_mobile })
                        .map(
                            (item, index, arr) => `
                            <div style="min-width: 0; flex: 1;">
                                <p style="font-size: 0.6rem; letter-spacing: 0.08em; color: #999999; text-transform: uppercase; font-weight: 600; margin: 0 0 0.5rem 0;">${
                                    item.label
                                }</p>
                                <p style="font-size: 0.75rem; color: #2a2a2a; margin: 0; font-weight: 500; line-height: 1.4;">${
                                    item.value
                                }</p>
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
            ${
                additionalDetailsOfPatient.length > 0
                    ? `<!-- Additional Details Section -->
            <section style="margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1.6px solid #e8e8e8;">
                <p style="font-size: 0.7rem; letter-spacing: 0.08em; color: #666666; text-transform: uppercase; font-weight: 600; margin: 0 0 0.5rem 0;">Additional Details</p>
                <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem 0;">
                    ${additionalDetailsOfPatient
                        .map(
                            (item, index, arr) => `
                            <span style="font-size: 0.6rem; color: #2a2a2a; line-height: 1.6;">
                                <span style="font-weight: 700;">${item.label}:</span> ${item.value}
                            </span>
                            ${
                                index !== arr.length - 1
                                    ? `<span style="margin: 0 0.6rem; color: #cccccc; font-size: 0.55rem;">|</span>`
                                    : ''
                            }
                        `,
                        )
                        .join('')}
                </div>
            </section>`
                    : ''
            }

            <!-- Appointment Details Section -->
            <section style="margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1.6px solid #e8e8e8;">
                <p style="font-size: 0.85rem; letter-spacing: 0.15em; color: #000000; text-transform: uppercase; font-weight: 700; margin: 0 0 0.8rem 0;">Appointment Details</p>
                <div style="display: flex; align-items: start; gap: 1.3rem;">
                    ${getAppointmentDetails({ time, doctor_name, token, appointmentStatus })
                        .map(
                            (item, index, arr) => `
                            <div style="min-width: 0; flex: 1;">
                                <p style="font-size: 0.6rem; letter-spacing: 0.08em; color: #999999; text-transform: uppercase; font-weight: 600; margin: 0 0 0.5rem 0;">${
                                    item.label
                                }</p>
                                <p style="${item.valueStyle}">${item.value}</p>
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

            <!-- Services Section -->
            <section style="margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1.6px solid #e8e8e8;">
                <p style="font-size: 0.85rem; letter-spacing: 0.15em; color: #000000; text-transform: uppercase; font-weight: 700; margin: 0 0 0.8rem 0;">Service Details</p>
                
                ${
                    services.length > 0
                        ? `<div style="
                          font-size: 0.75rem;
                          color: #2a2a2a;
                          margin: 0;
                          font-weight: 500;
                          line-height: 2;
                          display: flex;
                          flex-wrap: wrap;
                          align-items: center;
                        ">
                          ${services
                              .map(
                                  (s, index) => `
                                <span style="display: flex; align-items: center;">
                                  <span>${s.service_name}</span>
                                  <span style="margin-left: 0.35rem;">( ₹${s.price} )</span>
                                  ${
                                      index !== services.length - 1
                                          ? `<span style="margin: 0 1.2rem; color: #999;">|</span>`
                                          : ''
                                  }
                                </span>
                              `,
                              )
                              .join('')}
                        </div>`
                        : `<p style="
                          font-size: 0.75rem;
                          color: #bbbbbb;
                          margin: 0;
                          font-weight: 500;
                          line-height: 1.5;
                        ">
                          No services selected
                        </p>`
                }                  

            </section>

            <!-- Payment Section -->
            <section>
                <p style="font-size: 0.85rem; letter-spacing: 0.15em; color: #000000; text-transform: uppercase; font-weight: 700; margin: 0 0 0.8rem 0;">PAYMENT Details</p>
                <p style="font-size: 0.75rem; color: #2a2a2a; margin: 0; font-weight: 500; line-height: 1.5;">
                    ${
                        payment_status
                            ? `${payment_status}`
                            : '<span style="color: #bbbbbb;">Not available</span>'
                    }
                </p>
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
        <footer id="opd-slip-footer" style="text-align: center; padding: 2rem 2rem; font-size: 0.8rem; color: black; border-top: 1.6px solid #e8e8e8; background: #ffffff; letter-spacing: 0.03em;">
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
