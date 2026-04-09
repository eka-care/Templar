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
    tags?: string[];
    labels?: string[];
    partnerMetadata?: Record<string, string>;
    apt_custom_attributes?: { label: string; value: string }[];
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

const fixedWidthItems = ['GENDER', 'AGE', 'TOKEN'];

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
        mappedFormData,
        tags,
        labels,
        partnerMetadata,
        apt_custom_attributes,
    } = data;

    const additionalDetailsOfPatient = [
        ...getadditionalDetailsOfPatient(mappedFormData),
        ...(apt_custom_attributes ?? []),
    ];

    const sectionTitleStyle =
        'font-size: 0.375rem; font-weight: 600; color: rgba(0,0,0,0.6); letter-spacing: 0.03125rem; text-transform: uppercase; margin: 0; line-height: normal;';
    const labelStyle =
        'font-size: 0.375rem; color: rgba(0,0,0,0.5); letter-spacing: 0.0125rem; margin: 0;';
    const valueStyle = 'font-size: 0.4375rem; font-weight: 700; color: #000000; margin: 0;';
    const dividerStyle =
        'width: 0.047rem; background: rgba(0,0,0,0.1); align-self: stretch; border-radius: 6.25rem; flex-shrink: 0;';
    const sectionDivider =
        '<div style="width: 100%; height: 0.0625rem; background: rgba(0,0,0,0.1); border-radius: 6.25rem;"></div>';

    // --- Row builders for Section 1 ---
    const patientRow1Items = [
        name ? { label: 'NAME', value: name } : null,
        doctor_name ? { label: 'DOCTOR', value: doctor_name } : null,
        time ? { label: 'DATE & TIME', value: time } : null,
        payment_status ? { label: 'PAYMENT STATUS', value: payment_status } : null,

        /// MIGHT NEED TO REMOVE THE BELWO

        patient_mobile ? { label: 'PHONE', value: patient_mobile } : null,
        uhid ? { label: 'UHID', value: uhid } : null,

        gender ? { label: 'GENDER', value: gender } : null,
        age ? { label: 'AGE', value: age } : null,
        token ? { label: 'TOKEN', value: token } : null,
    ].filter(Boolean) as { label: string; value: string }[];

    const buildRow = (items: { label: string; value: string }[]): string => {
        const cells: string[] = [];
        items.forEach((item, i) => {
            if (i > 0) cells.push(`<div style="${dividerStyle}"></div>`);
            const minWidth = fixedWidthItems.includes(item.label) ? '2.5rem' : '4.688rem';
            cells.push(`<div style="display: flex; flex-direction: column; gap: 0.25rem; min-width: ${minWidth}; max-width: 10rem;">
            <p style="${labelStyle}">${item.label}</p>
            <p style="${valueStyle}">${item.value}</p>
        </div>`);
        });

        return `<div style="display: flex; align-items: center; gap: 0.375rem; height: 1.5625rem;">${cells.join(
            '',
        )}</div>`;
    };

    const buildThreeColRows = (items: { label: string; value: string }[]): string => {
        return `
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem 1rem;">
            ${items
                .map(
                    (item, index) => `
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            
                            ${index > 0 ? `<div style="${dividerStyle}"></div>` : ''}

                            <div style="display: flex; gap: 0.5rem; align-items: center; max-width: 10.625rem;">
                                <span style="font-size: 0.375rem; color: rgba(0,0,0,0.5);">
                                    ${item.label}:
                                </span>
                                <span style="font-size: 0.4375rem; font-weight: 500; color: #000000; white-space: nowrap;">
                                    ${item.value}
                                </span>
                            </div>

                        </div>
                    `,
                )
                .join('')}
        </div>
    `;
    };

    // --- Services pills ---
    const servicesPills =
        services.length > 0
            ? services
                  .map(
                      (s) =>
                          `<div style="background: rgba(0,0,0,0.05); border-radius: 0.125rem; padding: 0 0.625rem; display: flex; align-items: center; justify-content: center; gap: 0.125rem; height: 0.875rem;">
                <span style="font-size: 0.4375rem; color: rgba(0,0,0,0.5);">${s.service_name}</span>
                <span style="font-size: 0.4375rem; color: #000000; padding-top: 0.063rem;">₹${s.price}</span>
            </div>`,
                  )
                  .join('')
            : '<span style="font-size: 0.4375rem; color: rgba(0,0,0,0.3);">No services selected</span>';

    // --- Tags & Labels section ---
    const tagsSection =
        tags?.length || labels?.length
            ? `
        <div style="display: flex; flex-direction: column; gap: 0.375rem;">
            <p style="${sectionTitleStyle}">TAGS &amp; LABELS</p>
            <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                ${tags?.length ? renderTags(tags) : ''}
                ${labels?.length ? renderLabels(labels) : ''}
            </div>
        </div>
        ${sectionDivider}`
            : '';

    // --- Partner Metadata section ---
    const metadataSection =
        partnerMetadata && Object.keys(partnerMetadata).length
            ? `
        <div style="display: flex; flex-direction: column; gap: 0.375rem;">
            <p style="${sectionTitleStyle}">PARTNER &amp; SYSTEM METADATA</p>
            ${printMetaDataOfPartnerSystem(partnerMetadata)}
        </div>`
            : '';

    return `<main id="opd-slip-body" style="padding: 0.75rem 1rem 1.5rem 1rem; background: #ffffff; font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;">
        <div style="display: flex; flex-direction: column; gap: 0.625rem;">

            <!-- Section 1: Patient & Appointment Details -->
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
                <p style="${sectionTitleStyle}">PATIENT &amp; APPOINTMENT DETAILS</p>
                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                    ${buildRow(patientRow1Items)}
                    
                </div>
            </div>
            ${sectionDivider}

            <!-- Section 2: Additional Details -->
            ${
                additionalDetailsOfPatient.length > 0
                    ? `
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
                <p style="${sectionTitleStyle}">ADDITIONAL DETAILS</p>
                ${buildThreeColRows(additionalDetailsOfPatient)}
            </div>
            ${sectionDivider}`
                    : ''
            }

            <!-- Section 3: Tags & Labels -->
            ${tagsSection}

            <!-- Section 4: Services -->
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
                <p style="${sectionTitleStyle}">SERVICES</p>
                <div style="display: flex; gap: 0.25rem; flex-wrap: wrap; align-items: center;">
                    ${servicesPills}
                </div>
            </div>

            <!-- Section 5: Partner & System Metadata -->
            ${metadataSection ? `${sectionDivider}${metadataSection}` : ''}

        </div>
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
        <footer id="opd-slip-footer" style="text-align: center; padding: 0.8rem 2rem 0; font-size: 0.5rem; color: black; border-top: 1.6px solid #e8e8e8; background: #ffffff; letter-spacing: 0.03em; position: fixed; bottom: 1.5rem; left: 0; right: 0;">
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

export const renderTags = (tags: string[]): string => {
    if (!tags.length) return '';
    return `<div style="display: flex; align-items: center; height: 0.875rem;">
        <span style="font-size: 0.375rem; color: rgba(0,0,0,0.5); width: 1.875rem; flex-shrink: 0;">Tags:</span>
        <div style="display: flex; flex: 1; gap: 0.25rem; flex-wrap: wrap; align-items: center;">
            ${tags
                .map(
                    (t) =>
                        `<div style="background: rgba(0,0,0,0.05); border-radius: 0.125rem; padding: 0.188rem 0.625rem; display: flex; align-items: center; justify-content: center; height: 100%;"><span style="font-size: 0.4375rem; color: rgba(0,0,0,0.5); white-space: nowrap;">${t}</span></div>`,
                )
                .join('')}
        </div>
    </div>`;
};

export const renderLabels = (labels: string[]): string => {
    if (!labels.length) return '';
    return `<div style="display: flex; align-items: center; height: 0.875rem;">
        <span style="font-size: 0.375rem; color: rgba(0,0,0,0.5); width: 1.875rem; flex-shrink: 0;">Labels:</span>
        <div style="display: flex; flex: 1; gap: 0.25rem; flex-wrap: wrap; align-items: center;">
            ${labels
                .map(
                    (l) =>
                        `<div style="background: rgba(0,0,0,0.05); border-radius: 0.125rem; padding: 0.188rem 0.625rem; display: flex; align-items: center; justify-content: center; height: 100%;"><span style="font-size: 0.4375rem; color: rgba(0,0,0,0.5); white-space: nowrap;">${l}</span></div>`,
                )
                .join('')}
        </div>
    </div>`;
};

export const printMetaDataOfPartnerSystem = (data: Record<string, string>): string => {
    const entries = Object.entries(data);
    if (!entries.length) return '';

    return `<div style="display: flex; flex-wrap: wrap; gap: 0.75rem 1rem;">
        ${entries
            .map(
                ([k, v], index) => `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    ${
                        index > 0
                            ? `<div style="width: 0.047rem; background: rgba(0,0,0,0.1); align-self: stretch; border-radius: 6.25rem; flex-shrink: 0;"></div>`
                            : ''
                    }
                    <div style="display: flex; gap: 0.5rem; align-items: center; max-width: 10.625rem;">
                        <span style="font-size: 0.375rem; color: rgba(0,0,0,0.5);">${k}:</span>
                        <span style="font-size: 0.4375rem; font-weight: 500; color: #000000; white-space: nowrap;">${v}</span>
                    </div>
                </div>`,
            )
            .join('')}
    </div>`;

    // --- old logic (3-per-row with manual chunking) ---
    // const rows: string[][] = [];
    // for (let i = 0; i < entries.length; i += 3) {
    //     rows.push(
    //         entries.slice(i, i + 3).map(
    //             ([k, v]) =>
    //                 `<div style="display: flex; gap: 0.5rem; align-items: center; flex: 1;">
    //             <span style="font-size: 0.375rem; color: rgba(0,0,0,0.5);">${k}:</span>
    //             <span style="font-size: 0.4375rem; font-weight: 500; color: #000000; white-space: nowrap;">${v}</span>
    //         </div>`,
    //         ),
    //     );
    // }

    // return rows
    //     .map((cols) => {
    //         const cells: string[] = [];
    //         cols.forEach((col, i) => {
    //             if (i > 0) {
    //                 cells.push(
    //                     `<div style="width: 0.0625rem; background: rgba(0,0,0,0.1); align-self: stretch; border-radius: 6.25rem;"></div>`,
    //                 );
    //             }
    //             cells.push(col);
    //         });
    //         return `<div style="display: flex; align-items: center; height: 0.875rem; gap: 1rem;">${cells.join(
    //             '',
    //         )}</div>`;
    //     })
    //     .join('');
};
