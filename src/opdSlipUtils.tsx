
import { getHeaderForReceipt, ReceiptPdfConfig } from './ReceiptUtils';

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
    age?: number;
    gender?: string;
    uhid?: string;
    time?: string;
    date?: string;
    doctor_name?: string;
    token?: string;
    services: OpdSlipService[];
    payment_status?: string;
}

export interface OpdSlipFooterData {
    created_by?: string;
    created_at?: string;
}

export const getHeaderForOpdSlip = (data: OpdSlipHeaderData): string => {
    return getHeaderForReceipt(data);
};

export const getPatientDetails = ({
    name,
    gender,
    uhid,
    age,
}: {
    name: string;
    age?: number;
    gender?: string;
    uhid?: string;
}) => {
    return [name, gender, age, uhid].filter(Boolean);
};

export const getBodyForOpdSlip = (data: OpdSlipBodyData): string => {
    const { name, gender, time, doctor_name, token, services, payment_status, age, uhid } = data;

    return `
        <main id="opd-slip-body" style="padding: 3rem 2.5rem; background: #ffffff; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;">

            <!-- Patient Section -->
            <section style="margin-bottom: 3rem; padding-bottom: 2.5rem; border-bottom: 2px solid #e8e8e8;">
                <p style="font-size: 1rem; letter-spacing: 0.15em; color: #000000; text-transform: uppercase; font-weight: 700; margin: 0 0 0.6rem 0;">PATIENT DETAILS</p>
               <div style="
    font-size: 1rem;
    color: #2a2a2a;
    margin: 0;
    font-weight: 500;
    line-height: 1.4;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
">
    ${getPatientDetails({ name, gender,  age, uhid })
        .map(
            (item, index, arr) => `
            <span style="display: flex; align-items: center;">
                <span>${item}</span>
                ${
                    index !== arr.length - 1
                        ? `<span style="margin: 0 1.2rem; color: #999;">|</span>`
                        : ''
                }
            </span>
        `,
        )
        .join('')}
</div>

            </section>

            <!-- Appointment Details Section -->
            <section style="margin-bottom: 3rem; padding-bottom: 2.5rem; border-bottom: 2px solid #e8e8e8;">
                <p style="font-size: 1rem; letter-spacing: 0.15em; color: #000000; text-transform: uppercase; font-weight: 700; margin: 0 0 0.8rem 0;">Appointment Details</p>
                <div style="display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 1.8rem; margin-bottom: 0; align-items: start;">
                    ${
                        time
                            ? `<div style="min-width: 0;">
                            <p style="font-size: 0.75rem; letter-spacing: 0.08em; color: #999999; text-transform: uppercase; font-weight: 600; margin: 0 0 0.5rem 0;">DATE & TIME</p>
                            <p style="font-size: 1rem; color: #2a2a2a; margin: 0; font-weight: 500; line-height: 1.4;">${time}</p>
                        </div>`
                            : '<div></div>'
                    }
                    <div style="color: #cccccc; font-size: 1.5rem; line-height: 1; padding-top: 1.5rem;">|</div>
                    ${
                        doctor_name
                            ? `<div style="min-width: 0;">
                            <p style="font-size: 0.75rem; letter-spacing: 0.08em; color: #999999; text-transform: uppercase; font-weight: 600; margin: 0 0 0.5rem 0;">DOCTOR</p>
                            <p style="font-size: 1rem; color: #2a2a2a; margin: 0; font-weight: 500; line-height: 1.4;">${doctor_name}</p>
                        </div>`
                            : '<div></div>'
                    }
                    <div style="color: #cccccc; font-size: 1.5rem; line-height: 1; padding-top: 1.5rem;">|</div>
                    ${
                        token
                            ? `<div style="min-width: 0;">
                            <p style="font-size: 0.75rem; letter-spacing: 0.08em; color: #999999; text-transform: uppercase; font-weight: 600; margin: 0 0 0.5rem 0;">TOKEN</p>
                            <p style="font-size: 1.5rem; color: #000000; margin: 0; font-weight: 700; line-height: 1.2;">${token}</p>
                        </div>`
                            : '<div></div>'
                    }
                </div>
            </section>

            <!-- Services Section -->
            <section style="margin-bottom: 3rem; padding-bottom: 2.5rem; border-bottom: 2px solid #e8e8e8;">
                <p style="font-size: 1rem; letter-spacing: 0.15em; color: #000000; text-transform: uppercase; font-weight: 700; margin: 0 0 0.8rem 0;">Service Details</p>
                
                ${
                    services.length > 0
                        ? `<div style="
                          font-size: 1rem;
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
                          font-size: 1rem;
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
                <p style="font-size: 1rem; letter-spacing: 0.15em; color: #000000; text-transform: uppercase; font-weight: 700; margin: 0 0 0.8rem 0;">PAYMENT Details</p>
                <p style="font-size: 1rem; color: #2a2a2a; margin: 0; font-weight: 500; line-height: 1.5;">
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
    ]
        .filter(Boolean)
        .join(' | ');

    return `
        <footer id="opd-slip-footer" style="text-align: center; padding: 2rem 2.5rem; font-size: 0.8rem; color: black; border-top: 2px solid #e8e8e8; background: #ffffff; letter-spacing: 0.03em;">
            <p style="margin: 0; line-height: 1.6; font-weight: 400;">${footerParts}</p>
        </footer>`;
};
