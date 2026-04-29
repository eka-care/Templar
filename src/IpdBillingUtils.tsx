import moment from 'moment';
import type {
    ApiReceiptPdfConfig,
    Data,
    DocProfileResponse,
    Receipt,
    Service,
} from './ipdBillingTypes';
import { formattedNumber, getAgeString, getIpdConfig } from './ipdBillingHelpers';
import {
    ReceiptPdfConfig,
    TPdfObject,
    getDefaultPdfConfigForReceipt,
    getHeaderForReceipt,
    getFooterForReceipt,
    getPdfCssForReceipt,
} from './ReceiptUtils';

export type IpdPdfType = 'bills' | 'receipts';

export interface GenerateIpdBillingPdfInput {
    apiConfig?: ApiReceiptPdfConfig;
    docProfile: DocProfileResponse;
    item: Data;
    type: IpdPdfType;
    services?: Service[];
    receipts?: Receipt[];
    totalBilled?: number;
    totalPaid?: number;
}

const buildConfig = (apiConfig?: ApiReceiptPdfConfig): ReceiptPdfConfig => {
    const d = getDefaultPdfConfigForReceipt();
    if (!apiConfig) return d;
    return {
        owner_id: apiConfig.doctor_oid || d.owner_id,
        clinic_id: apiConfig.clinic_id || d.clinic_id,
        page_size: apiConfig.page_size || d.page_size,
        margins: {
            top: apiConfig.margins?.top ?? d.margins.top,
            bottom: apiConfig.margins?.bottom ?? d.margins.bottom,
            left: apiConfig.margins?.left ?? d.margins.left,
            right: apiConfig.margins?.right ?? d.margins.right,
        },
        heights: {
            header: apiConfig.heights?.header ?? d.heights.header,
            footer: apiConfig.heights?.footer ?? d.heights.footer,
        },
        flags: {
            print_header: apiConfig.flags?.print_header ?? d.flags.print_header,
            print_footer: apiConfig.flags?.print_footer ?? d.flags.print_footer,
            print_uhid: apiConfig.flags?.print_uhid ?? d.flags.print_uhid,
            print_receipt_number: apiConfig.flags?.print_receipt_number ?? d.flags.print_receipt_number,
            discount_column:
                (apiConfig.flags?.discount_column as 'ALWAYS' | 'IF_APL') ?? d.flags.discount_column,
            quantity_column:
                (apiConfig.flags?.quantity_column as 'ALWAYS' | 'IF_APL') ?? d.flags.quantity_column,
            print_paymode_split: apiConfig.flags?.print_paymode_split ?? d.flags.print_paymode_split,
            print_transaction_id:
                apiConfig.flags?.print_transaction_id ?? d.flags.print_transaction_id,
            print_amount_in_words:
                apiConfig.flags?.print_amount_in_words ?? d.flags.print_amount_in_words,
            bill_created_at: apiConfig.flags?.bill_created_at ?? d.flags.bill_created_at,
            date_and_time: apiConfig.flags?.date_and_time ?? d.flags.date_and_time,
            print_bill_created_by: (apiConfig.flags?.print_bill_created_by ?? d.flags.print_bill_created_by) as false,
        },
        header_image_url: apiConfig.header_image_url,
        footer_image_url: apiConfig.footer_image_url,
    };
};

export const getBodyForIpdBilling = ({
    item,
    type,
    services = [],
    receipts = [],
    totalPaid,
    config,
    doctorNameFromProfile,
}: {
    item: Data;
    type: IpdPdfType;
    services?: Service[];
    receipts?: Receipt[];
    totalPaid?: number;
    config: ReceiptPdfConfig;
    doctorNameFromProfile?: string;
}): string => {
    const { patient } = item;
    const { profile, formData } = patient;
    const { personal } = profile;
    const { name, gender, age, phone } = personal;

    const ageString = getAgeString(
        { age: age?.value, month: age?.month, dob: age?.dob },
        undefined,
        '',
    );
    const genderText = gender ? gender.charAt(0).toUpperCase() : '';
    const phoneText = phone ? `${phone.c || ''}${phone.n || ''}` : '';
    const uhid = formData?.find((fd) => fd.key === 'uhid')?.value?.toString() || '';
    const patientIntro = [
        name,
        genderText,
        ageString,
        phoneText,
        config.flags.print_uhid && uhid ? uhid : undefined,
    ]
        .filter(Boolean)
        .join(' | ');

    const ipdConfig = getIpdConfig();
    const beds = ipdConfig?.beds || [];
    const rooms = ipdConfig?.rooms || [];
    const bedName = item.bed ? beds.find((b) => b.id === item.bed)?.name || '' : '';
    const roomName = item.bed
        ? rooms.find((r) => r.id === beds.find((b) => b.id === item.bed)?.room)?.name || ''
        : '';
    const wardBed =
        roomName && bedName ? `${roomName} / ${bedName}` : roomName || bedName || '';

    const ipid = item.ipid || '';
    const admissionDate = item.date ? moment(item.date).format('DD-MM-YYYY HH:mm') : '';
    const dischargeDate = item.dischargeDate
        ? moment(item.dischargeDate).format('DD-MM-YYYY HH:mm')
        : '';
    const doctorName = doctorNameFromProfile || '';
    const departmentName = item.department?.name || '';
    const ratePlanName = item.rateplan?.name || '';

    const detailItem = (label: string, value: string) =>
        `<div style="margin-bottom:6px; font-size:0.75rem; line-height:1rem;">
            <span class="bold">${label}: </span><span>${value}</span>
        </div>`;

    const leftDetails = [
        ipid ? detailItem('IPD ID', ipid) : '',
        wardBed ? detailItem('Ward/Bed', wardBed) : '',
        departmentName ? detailItem('Department', departmentName) : '',
    ].filter(Boolean).join('');

    const rightDetails = [
        admissionDate ? detailItem('Admission Date', admissionDate) : '',
        item.status === 'DC' && dischargeDate ? detailItem('Discharge Date', dischargeDate) : '',
        doctorName ? detailItem('Doctor', doctorName) : '',
        ratePlanName ? detailItem('Rate Plan', ratePlanName) : '',
    ].filter(Boolean).join('');

    const isBills = type === 'bills';

    let tableHeader = '';
    let tableRows = '';
    let summaryRows = '';
    let pricingBox = '';

    if (isBills) {
        const { discount_column, quantity_column } = config.flags;
        const hasDiscount = services.some((s) => (s.discount || 0) > 0);
        const hasQtyGt1 = services.some((s) => (s.qty || 0) > 1);
        const showDiscount = discount_column === 'ALWAYS' || (discount_column === 'IF_APL' && hasDiscount);
        const showQty = quantity_column === 'ALWAYS' || (quantity_column === 'IF_APL' && hasQtyGt1);

        // Widths always sum to 100%:
        // seq(5) + service + qty? + mrp + discount? + amount + date(18)
        const qtyW = showQty ? 6 : 0;
        const discW = showDiscount ? 13 : 0;
        const remaining = 100 - 5 - qtyW - discW - 18;
        const serviceW = Math.round(remaining * 0.45);
        const mrpW = Math.round(remaining * 0.27);
        const amountW = remaining - serviceW - mrpW;

        tableHeader = `<tr>
            <th class="text-align-left" style="width:5%"></th>
            <th class="text-align-left" style="width:${serviceW}%">Service</th>
            ${showQty ? `<th class="text-align-right" style="width:${qtyW}%">Qty</th>` : ''}
            <th class="text-align-right" style="width:${mrpW}%">MRP</th>
            ${showDiscount ? `<th class="text-align-right" style="width:${discW}%">Discount (%)</th>` : ''}
            <th class="text-align-right" style="width:${amountW}%">Amount</th>
            <th class="text-align-right" style="width:18%">Date</th>
        </tr>`;

        tableRows = services
            .map(
                (s, i) => `<tr>
                <td class="text-align-left">${String(i + 1).padStart(2, '0')}</td>
                <td class="text-align-left">${s.name || '-'}</td>
                ${showQty ? `<td class="text-align-right">${s.qty || 0}</td>` : ''}
                <td class="text-align-right">&#8377;${formattedNumber(s.mrp || 0)}</td>
                ${showDiscount ? `<td class="text-align-right">${s.discount || 0}%</td>` : ''}
                <td class="text-align-right">&#8377;${formattedNumber(s.amount || 0)}</td>
                <td class="text-align-right">${s.date ? moment(s.date).format("DD MMM'YY") : '-'
                    }</td>
            </tr>`,
            )
            .join('');

        const totalMrp = services.reduce((acc, s) => acc + (s.mrp || 0), 0);
        const totalAmount = services.reduce((acc, s) => acc + (s.amount || 0), 0);
        const lineItemDiscount = totalMrp - totalAmount;
        const totalPayment = totalPaid || 0;
        const amountDifference = totalAmount - totalPayment;
        const isAmountDue = amountDifference > 0;

        pricingBox = `
        <div style="
            border: 1px solid #e4e5ed;
            border-radius: 8px;
            padding: 12px 20px;
            margin-top: 1rem;
        ">
            ${lineItemDiscount > 0 ? `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <p style="text-transform:uppercase; font-size:0.6875rem; font-weight:700; margin:0;">Total MRP:</p>
                <p style="font-size:0.8125rem; margin:0;">&#8377;${formattedNumber(totalMrp)}</p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <p style="text-transform:uppercase; font-size:0.6875rem; font-weight:700; margin:0;">Line Item Discount:</p>
                <p style="font-size:0.8125rem; color:#2da56a; margin:0;">&#8377;${formattedNumber(lineItemDiscount)}</p>
            </div>` : ''}
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <p style="text-transform:uppercase; font-size:0.6875rem; font-weight:700; margin:0;">Total Amount:</p>
                <p style="font-size:0.8125rem; margin:0;">&#8377;${formattedNumber(totalAmount)}</p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <p style="text-transform:uppercase; font-size:0.6875rem; font-weight:700; margin:0;">Total Paid:</p>
                <p style="font-size:0.8125rem; margin:0;">&#8377;${formattedNumber(totalPayment)}</p>
            </div>
            <div style="border-top:1px solid #e4e5ed; margin:10px 0;"></div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <p style="text-transform:uppercase; font-size:0.6875rem; font-weight:700; margin:0;">
                    ${isAmountDue ? 'Amount Due:' : 'Amount Overpaid:'}
                </p>
                <p style="font-size:0.8125rem; font-weight:700; color:${isAmountDue ? '#e75858' : '#2da56a'}; margin:0;">
                    &#8377;${formattedNumber(Math.abs(amountDifference))}
                </p>
            </div>
        </div>`;
    } else {
        tableHeader = `<tr>
            <th class="text-align-left" style="width:7%"></th>
            <th class="text-align-left" style="width:18%">Receipt ID</th>
            <th class="text-align-left" style="width:20%">Date</th>
            <th class="text-align-left" style="width:15%">Payment Mode</th>
            <th class="text-align-right" style="width:25%">Amount Paid</th>
            <th class="text-align-right" style="width:15%">MRP</th>
        </tr>`;

        tableRows = receipts
            .map((r, i) => {
                const paymentMode =
                    r.receipt_payment
                        ?.map((p) => p?.paymode?.replace(/_/g, ' ')?.toLowerCase())
                        ?.join(', ') || '-';
                const mrp = r.receipt_sku?.reduce((acc, cur) => acc + cur.amount, 0) || 0;
                return `<tr>
                    <td class="text-align-left">${String(i + 1).padStart(2, '0')}</td>
                    <td>${r.receipt_id || '-'}</td>
                    <td>${r.created_at ? moment(r.created_at).format("DD MMM'YY") : '-'}</td>
                    <td>${paymentMode}</td>
                    <td class="text-align-right">&#8377;${formattedNumber(r.net_amount || 0)}</td>
                    <td class="text-align-right">&#8377;${formattedNumber(mrp)}</td>
                </tr>`;
            })
            .join('');

        const totalPaidReceipts = receipts.reduce((acc, r) => acc + (r.net_amount || 0), 0);
        const totalMrpReceipts = receipts.reduce(
            (acc, r) => acc + (r.receipt_sku?.reduce((s, cur) => s + cur.amount, 0) || 0),
            0,
        );
        summaryRows = `<tr class="grand-total">
            <td colspan="3"></td>
            <td class="text-align-left">Total Paid:</td>
            <td class="text-align-right">&#8377;${formattedNumber(totalPaidReceipts)}</td>
            <td class="text-align-right">&#8377;${formattedNumber(totalMrpReceipts)}</td>
        </tr>`;
    }

    return `<div id="main">
    <div class="invoice-header">
        <div class="invoice-header--top">
            <div class="invoice-header--left">
                <div><span class='bold'>Billed To: </span><span>${patientIntro}</span></div>
            </div>
            <div class="invoice-header--right">
                ${config.flags.bill_created_at ? `<div>
                    <span class='bold'>Bill Creation Time: </span>
                    <span>${moment().format('DD MMM YYYY, hh:mm A')}</span>
                </div>` : ''}
            </div>
        </div>
    </div>

    ${leftDetails || rightDetails
            ? `<div style="display:flex; gap:24px; margin-bottom:1.5rem;">
            <div style="flex:1;">${leftDetails}</div>
            <div style="flex:1; text-align:right;">${rightDetails}</div>
        </div>`
            : ''
        }

    <table style="table-layout: fixed; width: 100%;">
        <thead>${tableHeader}</thead>
        <tbody>
            ${tableRows}
            ${summaryRows}
        </tbody>
    </table>
    ${pricingBox}
</div>`;
};

const renderIpdBillingPdf = async (
    headHtml: string,
    headerHtml: string,
    contentHtml: string,
    footerHtml: string,
    config: ReceiptPdfConfig,
): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.pagify.render({
        head_html: headHtml,
        header_html: headerHtml,
        body_html: contentHtml,
        footer_html: footerHtml,
        page_size: config.page_size,
        margin_left: '0cm',
        margin_right: '0cm',
        header_height: `${config.heights.header}cm`,
        footer_height: `${config.heights.footer}cm`,
        onPdfReady: async (blobUrl: string) => {
            window.open(blobUrl);
        },
    });
};

export const generateIpdBillingPdf = async (input: GenerateIpdBillingPdfInput): Promise<void> => {
    const {
        apiConfig,
        docProfile,
        item,
        type,
        services = [],
        receipts = [],
        totalPaid,
    } = input;

    const config = buildConfig(apiConfig);

    const doctorName = [
        'Dr.',
        docProfile.profile.personal.name.f,
        docProfile.profile.personal.name.l,
    ]
        .filter(Boolean)
        .join(' ');

    const headerText = docProfile.profile.professional.header_text || '';
    const clinics = docProfile.profile.professional.clinics || [];
    const matchedClinic =
        clinics.find((c) => c._id === config.clinic_id) || clinics[0];
    const clinicName = matchedClinic?.name || '';
    const clinicAddress = [matchedClinic?.address?.line1, matchedClinic?.city_name]
        .filter(Boolean)
        .join(', ');

    const pdfObjForFns = {
        config,
        ref_trx_id: undefined,
        billCreatedBy: doctorName,
    } as unknown as TPdfObject;

    const headHtml = getPdfCssForReceipt(pdfObjForFns);
    const headerHtml = getHeaderForReceipt({
        doctorName,
        headerText,
        clinicName,
        clinicAddress,
        config,
    });
    const footerHtml = getFooterForReceipt({ config, data: pdfObjForFns });
    const contentHtml = getBodyForIpdBilling({
        item,
        type,
        services,
        receipts,
        totalPaid,
        config,
        doctorNameFromProfile: doctorName,
    });

    await renderIpdBillingPdf(headHtml, headerHtml, contentHtml, footerHtml, config);
};
