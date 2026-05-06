import { getHeaderForReceipt, ReceiptPdfConfig, TPageSize } from './ReceiptUtils';

export interface IpdSlipHeaderData {
    doctorName: string;
    headerText: string;
    clinicName: string;
    clinicAddress: string;
    config: ReceiptPdfConfig;
}

// Keeping body payload intentionally flexible for now.
// We'll evolve it once IPD slip body HTML is implemented.
export type IpdSlipBodyData = Record<string, unknown>;

export interface IpdSlipFooterData {
    created_by?: string;
    created_at?: string;
}

export const getHeaderForIpdSlip = (data: IpdSlipHeaderData): string => {
    return getHeaderForReceipt(data);
};

export const getBodyForIpdSlip = (): string => {
    return `<div>ipd slip body</div>`;
};

export const getFooterForIpdSlip = (data: IpdSlipFooterData): string => {
    const { created_by, created_at } = data;

    const footerParts = [
        created_by ? `Created by: ${created_by}` : undefined,
        created_at ? `Created at: ${created_at}` : undefined,
    ].filter(Boolean) as string[];

    return `
        <footer id="ipd-slip-footer" style="text-align: center; padding: 0.8rem 2rem 0; font-size: 0.5rem; color: black; border-top: 1.6px solid #e8e8e8; background: #ffffff; letter-spacing: 0.03em; position: fixed; bottom: 0.5rem; left: 0; right: 0;">
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

