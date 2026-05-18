import React from 'react';
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
    clinicName?: string;
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

// --- Shared style objects ---
const sectionTitleStyle: React.CSSProperties = {
    fontSize: '0.438rem',
    fontWeight: 500,
    color: 'rgba(0,0,0,0.5)',
    letterSpacing: '0.03125rem',
    textTransform: 'uppercase',
    margin: 0,
    lineHeight: 'normal',
};

const itemKeyRow1Style: React.CSSProperties = {
    fontSize: '0.5rem',
    fontWeight: 500,
    color: 'rgba(0,0,0,0.6)',
    letterSpacing: '0.03125rem',
    textTransform: 'uppercase',
    margin: 0,
    lineHeight: 'normal',
};

const itemValueRow1Style: React.CSSProperties = {
    fontSize: '0.625rem',
    color: 'black',
    fontWeight: 600,
    letterSpacing: '0.0125rem',
    margin: 0,
};

const tokenItemValueRow1Style: React.CSSProperties = {
    fontSize: '0.94rem',
    color: 'black',
    fontWeight: 700,
    letterSpacing: '0.0125rem',
    margin: 0,
    lineHeight: 1,
};

const valueStyle: React.CSSProperties = {
    fontSize: '0.5rem',
    fontWeight: 700,
    color: '#000000',
    margin: 0,
};

const dividerStyle: React.CSSProperties = {
    width: '0.047rem',
    background: 'rgba(0,0,0,0.1)',
    alignSelf: 'stretch',
    borderRadius: '6.25rem',
    flexShrink: 0,
};

const Divider = () => <div style={dividerStyle} />;

const SectionDivider = () => (
    <div style={{ width: '100%', height: '0.0625rem', background: 'rgba(0,0,0,0.1)', borderRadius: '6.25rem' }} />
);

const fixedWidthItems = ['GENDER', 'AGE', 'TOKEN'];
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

export const renderTags = (tags: string[]): JSX.Element | null => {
    if (!tags.length) return null;
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '0.875rem' }}>
            <span style={{ fontSize: '0.438rem', color: 'rgba(0,0,0,0.5)', width: '1.875rem', flexShrink: 0, lineHeight: '0.875rem' }}>
                TAGS:{' '}
            </span>
            <div style={{ display: 'flex', flex: 1, gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {tags.map((t, i) => (
                    <div
                        key={i}
                        style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '0.125rem', padding: '0.188rem 0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
                    >
                        <span style={{ fontSize: '0.5rem', color: 'rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>{t}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const renderLabels = (labels: string[]): JSX.Element | null => {
    if (!labels.length) return null;
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '0.875rem' }}>
            <span style={{ fontSize: '0.438rem', color: 'rgba(0,0,0,0.5)', width: '1.875rem', flexShrink: 0, lineHeight: '0.875rem' }}>
                LABELS:{' '}
            </span>
            <div style={{ display: 'flex', flex: 1, gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {labels.map((l, i) => (
                    <div
                        key={i}
                        style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '0.125rem', padding: '0.188rem 0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
                    >
                        <span style={{ fontSize: '0.5rem', color: 'rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>{l}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const printMetaDataOfPartnerSystem = (data: Record<string, string>): JSX.Element | null => {
    const entries = Object.entries(data);
    if (!entries.length) return null;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1rem' }}>
            {entries.map(([k, v], index) => (
                <div
                    key={index}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        ...(index < entries.length - 1
                            ? { borderRight: '0.047rem solid rgba(0,0,0,0.1)', paddingRight: '0.5rem' }
                            : {}),
                    }}
                >
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', maxWidth: '10.625rem' }}>
                        <span style={{ fontSize: '0.4375rem', color: 'rgba(0,0,0,0.5)' }}>{k}:</span>
                        <span style={{ fontSize: '0.5rem', fontWeight: 500, color: '#000000', whiteSpace: 'nowrap' }}>{v}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const getBodyForOpdSlip = (data: OpdSlipBodyData): JSX.Element => {
    const {
        name,
        gender,
        time,
        doctor_name,
        clinicName,
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

    const patientRow2Items = [
        age ? { label: 'AGE', value: age } : null,
        gender ? { label: 'GENDER', value: gender } : null,
        patient_mobile ? { label: 'MOBILE', value: patient_mobile } : null,
        uhid ? { label: 'TOKEN', value: uhid } : null,
    ].filter(Boolean) as { label: string; value: string }[];

    const hasFixedCols = !!(time || payment_status || token);
    const hasMetadata = !!(partnerMetadata && Object.keys(partnerMetadata).length > 0);
    const hasTagsOrLabels = !!(tags?.length || labels?.length);

    return (
        <main
            id="opd-slip-body"
            style={{
                padding: '0.75rem 1rem 1.5rem 1rem',
                background: '#ffffff',
                fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>

                {/* Section 1: Patient & Appointment Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <p style={sectionTitleStyle}>PATIENT &amp; APPOINTMENT DETAILS</p>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>

                        {/* Fluid col: Name */}
                        {name && (
                            <div style={{ flex: '1 1 0%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    <p style={itemKeyRow1Style}>NAME</p>
                                    <p style={itemValueRow1Style}>{name}</p>
                                </div>
                                {patientRow2Items.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap', height: 'fit-content', overflow: 'hidden' }}>
                                        {patientRow2Items.map((item, i) => {
                                            const cell = (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: fixedWidthItems.includes(item.label) ? '1rem' : '4rem', maxWidth: '7rem' }}>
                                                    <p style={valueStyle}>{item.value}</p>
                                                </div>
                                            );
                                            if (i === 0) return <React.Fragment key={i}>{cell}</React.Fragment>;
                                            return (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '-0.547rem' }}>
                                                    <Divider />
                                                    {cell}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Divider between fluid cols */}
                        {name && (doctor_name || clinicName) && <Divider />}

                        {/* Fluid col: Doctor/Clinic */}
                        {(doctor_name || clinicName) && (
                            <div style={{ flex: '1 1 0%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    <p style={itemKeyRow1Style}>{doctor_name ? 'DOCTOR' : 'CLINIC'}</p>
                                    <p style={itemValueRow1Style}>{doctor_name || clinicName}</p>
                                </div>
                                {doctor_name && (
                                    <div style={{ display: 'flex', alignItems: 'center', height: '0.5625rem' }}>
                                        <p style={valueStyle}>{clinicName}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Fixed cols section — leading Divider separates fluid from fixed */}
                        {hasFixedCols && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', alignSelf: 'flex-start' }}>
                                <Divider />
                                {time && (
                                    <div style={{ minWidth: '4.688rem', maxWidth: '13rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                        <p style={itemKeyRow1Style}>DATE &amp; TIME</p>
                                        <p style={itemValueRow1Style}>{time}</p>
                                    </div>
                                )}
                                {time && payment_status && <Divider />}
                                {payment_status && (
                                    <div style={{ minWidth: '4.688rem', maxWidth: '13rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                        <p style={itemKeyRow1Style}>PAYMENT STATUS</p>
                                        <p style={itemValueRow1Style}>{payment_status}</p>
                                    </div>
                                )}
                                {!!(time || payment_status) && !!token && <Divider />}
                                {token && (
                                    <div style={{ minWidth: '4.688rem', maxWidth: '13rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                        <p style={itemKeyRow1Style}>TOKEN</p>
                                        <p style={tokenItemValueRow1Style}>{token}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <SectionDivider />

                {/* Section 2: Additional Details */}
                {additionalDetailsOfPatient.length > 0 && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                            <p style={sectionTitleStyle}>ADDITIONAL DETAILS</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1rem' }}>
                                {additionalDetailsOfPatient.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {index > 0 && <Divider />}
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', maxWidth: '10.625rem' }}>
                                            <span style={{ fontSize: '0.375rem', color: 'rgba(0,0,0,0.5)' }}>{item.label}:</span>
                                            <span style={{ fontSize: '0.4375rem', fontWeight: 500, color: '#000000', whiteSpace: 'nowrap' }}>{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <SectionDivider />
                    </>
                )}

                {/* Section 3: Tags & Labels */}
                {hasTagsOrLabels && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {tags?.length ? renderTags(tags) : null}
                                {labels?.length ? renderLabels(labels) : null}
                            </div>
                        </div>
                        <SectionDivider />
                    </>
                )}

                {/* Section 4: Services */}
                {services.length > 0 && (
                    <>
                        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'flex-start' }}>
                            <p style={{ ...sectionTitleStyle, lineHeight: '0.875rem' }}>SERVICES: </p>
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                {services.map((s, i) => (
                                    <div
                                        key={i}
                                        style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '0.125rem', padding: '0 0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.125rem', minHeight: '0.875rem' }}
                                    >
                                        <span style={{ fontSize: '0.5rem', color: 'rgba(0,0,0,0.5)' }}>{s.service_name}</span>
                                        <span style={{ fontSize: '0.5rem', color: '#000000', paddingTop: '0.063rem' }}>₹{s.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {hasMetadata && <SectionDivider />}
                    </>
                )}

                {/* Section 5: Partner & System Metadata */}
                {hasMetadata && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        <p style={sectionTitleStyle}>PARTNER &amp; SYSTEM METADATA</p>
                        {printMetaDataOfPartnerSystem(partnerMetadata!)}
                    </div>
                )}

            </div>
        </main>
    );
};

export const getFooterForOpdSlip = (data: OpdSlipFooterData): JSX.Element => {
    const { created_by, created_at } = data;

    const footerParts = [
        'Valid only for this visit',
        created_by ? `Created by: ${created_by}` : undefined,
        created_at ? `Created at: ${created_at}` : undefined,
    ].filter(Boolean) as string[];

    return (
        <footer
            id="opd-slip-footer"
            style={{
                textAlign: 'center',
                padding: '0.8rem 2rem 0',
                fontSize: '0.5rem',
                color: 'black',
                borderTop: '1.6px solid #e8e8e8',
                background: '#ffffff',
                letterSpacing: '0.03em',
                position: 'fixed',
                bottom: '0.5rem',
                left: 0,
                right: 0,
            }}
        >
            <div
                style={{
                    margin: 0,
                    lineHeight: 1.6,
                    fontWeight: 400,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1.3rem',
                }}
            >
                {footerParts.map((item, index, arr) => (
                    <React.Fragment key={index}>
                        <span>{item}</span>
                        {index !== arr.length - 1 && <span style={{ color: '#cccccc' }}>|</span>}
                    </React.Fragment>
                ))}
            </div>
        </footer>
    );
};

export const getHeadCssForOpdSlip = (pageSize: TPageSize): JSX.Element => {
    const rootFontSize = pageSize === 'A5' ? '11px' : '16px';
    return <style>{`html { font-size: ${rootFontSize}; }`}</style>;
};
