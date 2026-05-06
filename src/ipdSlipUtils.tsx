import { getHeaderForReceipt, ReceiptPdfConfig, TPageSize } from './ReceiptUtils';

export interface IpdSlipHeaderData {
    doctorName: string;
    headerText: string;
    clinicName: string;
    clinicAddress: string;
    config: ReceiptPdfConfig;
}

export interface IpdSlipBodyData {
    name?: string;
    age?: string;
    sex?: string;
    uhid?: string;
    ipid?: string;
    ipd_id?: string;
    ward_bed?: string;
    rate_plan?: string;
    relationship_with_patient?: string;
    phone_number?: string;
    department_name?: string;
    doctor_name?: string;
    attendee_details?: string;
    clinicName?: string;
    admission_date_time?: string;
}

export interface IpdSlipFooterData {
    created_by?: string;
    created_at?: string;
}

export const getHeaderForIpdSlip = (data: IpdSlipHeaderData): string => {
    return getHeaderForReceipt(data);
};

export const getBodyForIpdSlip = (data: IpdSlipBodyData): string => {
    const {
        name,
        age,
        sex,
        uhid,
        ipid,
        ipd_id,
        ward_bed,
        rate_plan,
        relationship_with_patient,
        phone_number,
        department_name,
        doctor_name,
        attendee_details,
        clinicName,
        admission_date_time,
    } = data;

    const sectionTitleStyle =
        'font-size: 0.438rem; font-weight: 500; color: rgba(0,0,0,0.5); letter-spacing: 0.03125rem; text-transform: uppercase; margin: 0; line-height: normal;';
    const itemKeyRow1 =
        'font-size: 0.5rem; font-weight: 500; color: rgba(0,0,0,0.6); letter-spacing: 0.03125rem; text-transform: uppercase; margin: 0; line-height: normal;';
    const itemValueRow1 =
        'font-size: 0.625rem; color: black; font-weight: 600; letter-spacing: 0.0125rem; margin: 0;';
    const valueStyle = 'font-size: 0.5rem; font-weight: 700; color: #000000; margin: 0;';
    const dividerStyle =
        'width: 0.047rem; background: rgba(0,0,0,0.1); align-self: stretch; border-radius: 6.25rem; flex-shrink: 0;';
    const sectionDivider =
        '<div style="width: 100%; height: 0.0625rem; background: rgba(0,0,0,0.1); border-radius: 6.25rem;"></div>';
    const compactValueStyle = 'font-size: 0.5rem; font-weight: 700; color: #000000; margin: 0;';
    const detailLabelStyle = 'font-size: 0.4375rem; color: rgba(0,0,0,0.6); line-height: 1;';
    const detailValueStyle = 'font-size: 0.5rem; font-weight: 600; color: #000000; line-height: 1;';
    const detailPairs = [
        { label: 'IPD ID', value: ipd_id || ipid || '' },
        { label: 'Ward/Bed', value: ward_bed || '' },
        { label: 'Rate Plan', value: rate_plan || '' },
    ].filter((i) => Boolean(i.value));

    const patientMeta = [
        age ? `${age} Y` : '',
        sex || '',
        phone_number || '',
        [uhid, ipid].filter(Boolean).join(' | '),
    ]
        .filter(Boolean)
        .join(' | ');

    const fluidCols = [
        name
            ? `<div style="flex: 1 1 0%; min-width: 0; display: flex; flex-direction: column; gap: 1rem;"><div style="display: flex; flex-direction: column; gap: 0.35rem;"><p style="${itemKeyRow1}">NAME</p><p style="${itemValueRow1}">${name}</p></div></div>`
            : null,
        doctor_name
            ? `<div style="flex: 1 1 0%; min-width: 0; display: flex; flex-direction: column; gap: 1rem;"><div style="display: flex; flex-direction: column; gap: 0.35rem;"><p style="${itemKeyRow1}">DOCTOR</p><p style="${itemValueRow1}">${doctor_name}</p></div>${clinicName ? `<div style="display: flex; align-items: center; height: 0.5625rem;"><p style="${valueStyle}">${clinicName}</p></div>` : ''}</div>`
            : null,
        department_name
            ? `<div style="min-width: 4.688rem; max-width: 13rem; display: flex; flex-direction: column; gap: 0.35rem;"><p style="${itemKeyRow1}">DEPARTMENT</p><p style="${itemValueRow1}">${department_name}</p></div>`
            : null,
    ].filter(Boolean);

    const fixedCols = [
        admission_date_time
            ? `<div style="min-width: 4.688rem; max-width: 13rem; display: flex; flex-direction: column; gap: 0.35rem;"><p style="${itemKeyRow1}">DATE OF ADMISSION</p><p style="${itemValueRow1}">${admission_date_time}</p></div>`
            : null,
    ].filter(Boolean);

    const fixedColsSection = fixedCols.length
        ? `<div style="display: flex; align-items: flex-start; gap: 0.45rem; align-self: flex-start;"><div style="${dividerStyle}"></div>${fixedCols.join(`<div style="${dividerStyle}"></div>`)}</div>`
        : '';

    return `<main id="ipd-slip-body" style="padding: 0.75rem 1rem 1.5rem 1rem; background: #ffffff; font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;">
        <div style="display: flex; flex-direction: column; gap: 0.625rem;">
            <div style="display: flex; flex-direction: column; gap: 0.375rem;">
                <p style="${sectionTitleStyle}">PATIENT &amp; ADMISSION DETAILS</p>
                <div style="display: flex; align-items: flex-start; gap: 0.45rem;">
                    ${fluidCols.join(`<div style="${dividerStyle}"></div>`)}
                    ${fixedColsSection}
                </div>
                ${patientMeta ? `<div style="display: flex; align-items: center; min-height: 0.5625rem;"><p style="${compactValueStyle}">${patientMeta}</p></div>` : ''}
                ${detailPairs.length
                    ? `<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    ${detailPairs
                        .map(
                            (item) =>
                                `<div style="display:flex; gap:0.3rem; align-items: baseline;"><span style="${detailLabelStyle}">${item.label}:</span><span style="${detailValueStyle}">${item.value}</span></div>`,
                        )
                        .join('')}
                </div>`
                    : ''}
            </div>
            ${sectionDivider}
            ${(relationship_with_patient || attendee_details)
                ? `<div style="display: flex; flex-direction: column; gap: 0.375rem;">
                <p style="${sectionTitleStyle}">ADDITIONAL DETAILS</p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    ${attendee_details ? `<div style="display:flex; gap:0.3rem; align-items: baseline;"><span style="${detailLabelStyle}">Attendee details:</span><span style="${detailValueStyle}">${attendee_details}</span></div>` : ''}
                    ${relationship_with_patient ? `<div style="display:flex; gap:0.3rem; align-items: baseline;"><span style="${detailLabelStyle}">Relationship with patient:</span><span style="${detailValueStyle}">${relationship_with_patient}</span></div>` : ''}
                </div>
            </div>`
                : ''}
        </div>
    </main>`;
};

export const getFooterForIpdSlip = (data: IpdSlipFooterData): string => {
    const { created_by, created_at } = data;

    const footerParts = [
        created_by ? `Created by: ${created_by}` : undefined,
        created_at ? `Created at: ${created_at}` : undefined,
    ].filter(Boolean) as string[];

    return `
        <footer id="ipd-slip-footer" style="width: 100%; text-align: center; padding: 0.8rem 2rem 0; font-size: 0.5rem; color: black; border-top: 1.6px solid #e8e8e8; background: #ffffff; letter-spacing: 0.03em;">
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

export const getHeadCssForIpdSlip = (pageSize: TPageSize): string => {
    const rootFontSize = pageSize === 'A5' ? '11px' : '16px';
    return `<style>html { font-size: ${rootFontSize}; }</style>`;
};

