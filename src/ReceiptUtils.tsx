export type TPdfObject = {
    config: ReceiptPdfConfig;
    receipt_id: number;
    uhid: string;
    visit_date: string;
    doctor: DoctorProfile;
    clinicData: ClinicsEntity;
    mobile: string;
    name: string;
    patient_dob?: string;
    receipt_amount: number;
    receipt_number: string;
    business_receipt_number?: string;
    additional_discount_amount: number;
    additional_discount_type: discount_type;
    additional_discount_value: number;
    net_amount: number;
    receipt_sku: (receipt_sku & {
        sku_item: sku_item;
    })[];
    receipt_payment: receipt_payment[];
    amount_due: number;
    receipt_type: receipt_type;
    ref_trx_id?: string;
    ageInM?: number;
    gender?: string;
    payment_status: string;
    bill_created_at?: string;
    receiptAmountinWords?: string;
};
export type TPageSize = 'A4' | 'A5';
export enum DateAndTimeConfigForReceipt {
    DATE_ONLY = 'date_only', // default
    DATE_AND_TIME = 'date_and_time',
    EXTENDED_DATE_AND_TIME = 'extended_date_and_time',
}

export interface ReceiptPdfConfig {
    owner_id: string;
    clinic_id: string;
    page_size: TPageSize;
    margins: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    heights: {
        header: number;
        footer: number;
    };
    flags: {
        print_header: boolean;
        print_footer: boolean;
        print_uhid: boolean;
        print_receipt_number: boolean;
        discount_column: 'ALWAYS' | 'IF_APL';
        quantity_column: 'ALWAYS' | 'IF_APL';
        print_paymode_split: boolean;
        print_transaction_id: boolean;
        print_amount_in_words: boolean;
        bill_created_at: boolean;
        date_and_time: DateAndTimeConfigForReceipt;
    };
    header_image_url?: string;
    footer_image_url?: string;

    constraints?: {
        require_uhid: boolean;
        require_receipt_number?: boolean;
    };
}
export type receipt_type = 'INCLINIC' | 'EKAPREPAID' | 'REFUND' | 'DUE_PAYMENT' | 'CREDIT_NOTE';
export type discount_type = 'AMOUNT' | 'PERCENT';
export type paymode_type = 'CASH' | 'CARD' | 'UPI' | 'WALLET' | 'INSURANCE' | 'OTHER';

export interface sku_item {
    sku_id: number;
    service_name: string;
    price: number;
}

export interface receipt_sku {
    receipt_sku_id: number;
    receipt_id: number;
    sku_id: number;
    sku_item?: sku_item;
    quantity: number;
    amount: number;
    discount_value: number;
    discount_type: discount_type;
    discount_amount: number;
    net_amount: number;
    paymode?: paymode_type | null;
}

export interface receipt_payment {
    receipt_payment_id: number;
    receipt_id: number;
    paymode: paymode_type;
    amount: number;
}

export interface DoctorProfile {
    doctor_id: string;
    name: string;
    qualification?: string;
    specialization?: string;
    registration_number?: string;
    onboardedFor: ('HXNG' | 'HELB' | 'PASS')[];
    bid: string;
    clinicObject: ClinicsEntity;
    headerText: string;
}

export interface ClinicsEntity {
    clinic_id: string;
    name: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
    email?: string;
}

export const getHeaderForReceipt = ({
    doctorName,
    headerText,
    clinicAddress,
    clinicName,
    config,
}: {
    doctorName: string;
    headerText: string;
    clinicName: string;
    clinicAddress: string;
    config: ReceiptPdfConfig;
}): string => {
    const { header_image_url, heights } = config;
    const { header } = heights;
    if (header_image_url) {
        return `
        <div style="
          width: 100%;
          height: ${header}cm;
          background-image: url('${header_image_url}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        "></div>
      `;
    }

    return `<div id="header" title="header">
  <img
    src="data:image/png;base64,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"
    width="60"
    height="60"
  />
  <div class="clinic">
    <div class="clinic-details">
      <div class="clinic-details__name text-align-left">
        ${clinicName}
      </div>
      <div class="clinic-details__address text-align-left">
        ${clinicAddress}
      </div>
    </div>
    <div class="clinic-doctor">
      <div class="clinic-doctor__name">${doctorName}</div>
      <div class="clinic-doctor__speciality">${headerText}</div>
    </div>
  </div>
</div>
`;
};

export const getFooterForReceipt = ({
    config,
    data,
}: {
    config: ReceiptPdfConfig;
    data: TPdfObject;
}): string => {
    const { footer_image_url, heights, flags } = config;
    const { footer } = heights;
    const { ref_trx_id } = data;

    return `<div title="footer" id="footer">
  ${
      ref_trx_id && flags.print_transaction_id
          ? `<p class="footer_trx_id"><span class="title">Payment ID: </span>${ref_trx_id}</p>`
          : ''
  }
  ${
      footer_image_url
          ? `
    <div style="
      width: 100%;
      height: ${footer}cm;
      background-image: url('${footer_image_url}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    "></div>
  `
          : `
        <div class="powered-by">
          <span>Powered by </span>
          <span>
            <img
              height="22"
              width="72"
              src="data:image/png;base64,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"
            />
          </span>
        </div>
      `
  }
</div>`;
};

export const getBodyForReceipt = ({ data }: { data: TPdfObject }): string => {
    const {
        receipt_number,
        receipt_sku,
        config,
        visit_date,
        receipt_payment,
        net_amount,
        additional_discount_type,
        additional_discount_value,
        amount_due = 0,
        business_receipt_number,
        payment_status,
    } = data;
    const { flags } = config;
    const { print_receipt_number, print_paymode_split, discount_column, quantity_column } = flags;

    const discountPresentInSku = receipt_sku.reduce(
        (acc, sku) => acc || sku.discount_amount > 0,
        false,
    );

    const subTotal = receipt_sku.reduce((acc, sku) => acc + sku.net_amount, 0);

    const isQtyGreaterThanOne = receipt_sku.reduce((acc, sku) => acc || sku.quantity > 1, false);

    const _showDiscount =
        discount_column === COLUMN_STATE.ALWAYS
            ? true
            : discount_column === COLUMN_STATE.IF_APL && discountPresentInSku
            ? true
            : false;
    const _showQuantity =
        quantity_column === COLUMN_STATE.ALWAYS
            ? true
            : quantity_column === COLUMN_STATE.IF_APL && isQtyGreaterThanOne
            ? true
            : false;

    const colSpan =
        _showQuantity && _showDiscount
            ? 5
            : (_showDiscount && !_showQuantity) || (!_showDiscount && _showQuantity)
            ? 4
            : 3;

    const showAmountDue = !!amount_due && amount_due > 0;
    const showAdvancePayment = !!amount_due && amount_due < 0;

    return `
  <div id="main">
  <div class="invoice-header">
  <div class="invoice-header--top">
  <div class="invoice-header--left">
    ${
        print_receipt_number && (business_receipt_number || receipt_number)
            ? `<div class="invoice-header__number">
          <span>Receipt No: </span>
          <span>${business_receipt_number || receipt_number}</span>
        </div>`
            : ''
    }
  </div>
  <div class="invoice-header--right">
    <div>
      <span class='bold'>Visit Date: </span>
      <span>${visit_date}</span>
    </div>

    ${
        config?.flags?.bill_created_at
            ? `<div>
      <span class='bold'>Bill Creation Time: </span>
      <span>${data?.bill_created_at}</span>
    </div>
    
    `
            : ''
    }

  </div>
  </div>
  <div class="invoice-header--bottom">
    <div>
      <span>Billed To: </span>
      <span>${getPatientIntroForReceipt(data)}</span>
    </div>
  </div>
</div>
    
  <table style="table-layout: fixed; width: 100%;">
    <thead>
      <tr>
        <th class="text-align-left" style="width: 9%;">S. No</th>
        <th class="text-align-left" style="width: 40%;">Service</th>
        ${_showQuantity ? '<th class="text-align-right" style="width: 9%;">Qty</th>' : ''}
        <th class="text-align-right" style="width: 14%;">Amount</th>
       ${_showDiscount ? '<th class="text-align-right" style="width: 14%;">Discount</th>' : ''}
        <th class="text-align-right" style="width: 14%;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${receipt_sku
          .map(
              (sku, idx) => `<tr>
        <td class="text-align-left">${(idx + 1).toString().padStart(2, '0')}</td>
        <td class="text-align-left">${sku.sku_item.service_name}</td>
        ${
            _showQuantity
                ? `<td class="text-align-right">
              ${sku.quantity.toString().padStart(2, '0')}
            </td>`
                : ''
        }
        <td class="text-align-right">Rs. ${sku.sku_item.price.toLocaleString('en-IN')}</td>
       ${
           _showDiscount
               ? `<td class="text-align-right">${
                     sku.discount_type === 'AMOUNT' ? sku.discount_value : `${sku.discount_value}%`
                 }</td>`
               : ''
       }
        <td class="text-align-right">Rs. ${sku.net_amount.toLocaleString('en-IN')}</td>
      </tr>`,
          )
          .join('')}
        <tr>
          <td colspan=${colSpan}>Sub-Total</td>
          <td class="text-align-right">${subTotal}</td>
        </tr>
       ${
           additional_discount_value > 0
               ? `<tr>
          <td colspan=${colSpan}>Additional Discount</td>
          <td class="text-align-right">${
              additional_discount_type === 'AMOUNT'
                  ? additional_discount_value
                  : `${additional_discount_value}%`
          }</td>
        </tr>`
               : ''
       }
        <tr class="grand-total">
          <td colspan=${colSpan}>Grand Total</td>
          <td class="text-align-right">Rs. ${(net_amount + amount_due).toLocaleString('en-IN')}</td>
        </tr>
        ${
            config?.flags?.print_amount_in_words
                ? `<tr class="amount-in-words">
        <td colspan=${colSpan + 1} style="padding-top: 0.5rem; font-size: 0.75rem;">
          <span class='bold'>Amount in words:</span> ${data?.receiptAmountinWords}
        </td>
      </tr>`
                : ''
        }
        ${
            print_paymode_split
                ? `<tr>
                <td colspan=${colSpan + 1} style="padding: 0;">
                  ${receipt_payment
                      .map(
                          (rp) =>
                              `<div class="paymode-card">
                    <div class="paymode-card--left">
                      <div class="paymode-card__svg">
                        <svg
                          width="14"
                          height="15"
                          viewBox="0 0 14 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 0.75C3.11719 0.75 0 3.89453 0 7.75C0 11.6328 3.11719 14.75 7 14.75C10.8555 14.75 14 11.6328 14 7.75C14 3.89453 10.8555 0.75 7 0.75ZM10.1445 6.54688L6.64453 10.0469C6.50781 10.2109 6.31641 10.2656 6.125 10.2656C5.90625 10.2656 5.71484 10.2109 5.57812 10.0469L3.82812 8.29688C3.52734 7.99609 3.52734 7.53125 3.82812 7.23047C4.12891 6.92969 4.59375 6.92969 4.89453 7.23047L6.125 8.43359L9.07812 5.48047C9.37891 5.17969 9.84375 5.17969 10.1445 5.48047C10.4453 5.78125 10.4453 6.24609 10.1445 6.54688Z"
                            fill="#3E445C"
                          />
                        </svg>
                      </div>
                      <div class="paymode-card__title">${
                          payment_status === 'success' ? 'Paid' : 'Pending Payment'
                      } Via ${rp.paymode
                                  .split('_')
                                  .map((c) => `${c[0]}${c.slice(1).toLowerCase()}`)
                                  .join(' ')}</div>
                    </div>
                   <div class="paymode-card__amount">Rs. ${rp.amount.toLocaleString('en-IN')}</div>
                        </div>`,
                      )
                      .join('')}
                  </td>
              </tr>`
                : ''
        }
        ${
            showAmountDue
                ? `<tr >
            <td colspan=${colSpan + 1} style="padding: 0;">
            <div class="paymode-card">
                    <div class="paymode-card--left">
                      <div class="paymode-card__svg">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512">
                          <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z"/>
                        </svg>
                      </div>
                      <div class="paymode-card__title">Pending Dues</div>
                    </div>
                    <div class="paymode-card__amount">Rs. ${amount_due.toLocaleString('en-IN')}
                     </div>
                     </div>
                  </td>
            </tr>`
                : ''
        }
        ${
            showAdvancePayment
                ? `<tr >
            <td colspan=${colSpan + 1} style="padding: 0;">
            <div class="paymode-card">
                    <div class="paymode-card--left">
                      <div class="paymode-card__svg">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          height="1em" 
                          viewBox="0 0 320 512">
                          <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z"/>
                        </svg>
                      </div>
                      <div class="paymode-card__title">Advance Deposit</div>
                    </div>
                    <div class="paymode-card__amount">Rs. ${Math.abs(amount_due).toLocaleString(
                        'en-IN',
                    )}
                     </div>
                     </div>
                  </td>
            </tr>`
                : ''
        }
    </tbody>
  </table>
 
</div>
    `;
};

export const getBodyForPaymentNoteForReceipt = ({ data }: { data: TPdfObject }): string => {
    const {
        name,
        mobile,
        receipt_number,
        uhid,
        config,
        visit_date,
        receipt_payment,
        net_amount,
        business_receipt_number,
    } = data;

    const { flags } = config;
    const { print_uhid, print_receipt_number, print_paymode_split } = flags;

    return `
    <div id="main" class="main-payment-note">
      <p class="title">Payment Note</p>
      <div class="invoice-header">
        <div class="invoice-header--top">
          <div class="invoice-header--left">
            ${
                print_receipt_number && (business_receipt_number || receipt_number)
                    ? `<div class="invoice-header__number">
            <span>Receipt No: </span>
            <span>${business_receipt_number || receipt_number}</span>
          </div>`
                    : ''
            }
          </div>

      <div class="invoice-header--right">
      <div>
            <span class="bold">Visit Date: </span>
            <span>${visit_date}</span>
          </div>

          ${
              flags?.bill_created_at
                  ? `<div>
                      <span class="bold">Bill Creation Time: </span>
                      <span>${data?.bill_created_at}</span>
                  </div>`
                  : ''
          }
      </div>
        </div>
        <div class="invoice-header--bottom">
          <div>
            <span>Billed To: </span>
            <span>${getPatientIntroForReceipt(data)}</span>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th class="text-align-left">S. No</th>
            <th class="text-align-left">Service</th>
            <th class="text-align-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-align-left">1</td>
            <td class="text-align-left">Clearance of past dues</td>
            <td class="text-align-right">Rs. ${net_amount.toLocaleString('en-IN')}</td>
          </tr>
          <tr class="grand-total">
            <td colspan=2>Grand Total</td>
            <td class="text-align-right">Rs. ${net_amount.toLocaleString('en-IN')}</td>
          </tr>
             ${
                 config?.flags?.print_amount_in_words
                     ? `<tr class="amount-in-words">
        <td colspan=3 style="padding-top: 0.5rem; font-size: 0.75rem;">
          <span class='bold'>Amount in words:</span> ${data?.receiptAmountinWords}
        </td>
      </tr>`
                     : ''
             }
        
          ${
              print_paymode_split
                  ? `<tr>
                    <td colspan=3 style="padding: 0;">
                    ${receipt_payment
                        .map(
                            (rp) =>
                                `<div class="paymode-card">
                  <div class="paymode-card--left">
                    <div class="paymode-card__svg">
                      <svg
                        width="14"
                        height="15"
                        viewBox="0 0 14 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 0.75C3.11719 0.75 0 3.89453 0 7.75C0 11.6328 3.11719 14.75 7 14.75C10.8555 14.75 14 11.6328 14 7.75C14 3.89453 10.8555 0.75 7 0.75ZM10.1445 6.54688L6.64453 10.0469C6.50781 10.2109 6.31641 10.2656 6.125 10.2656C5.90625 10.2656 5.71484 10.2109 5.57812 10.0469L3.82812 8.29688C3.52734 7.99609 3.52734 7.53125 3.82812 7.23047C4.12891 6.92969 4.59375 6.92969 4.89453 7.23047L6.125 8.43359L9.07812 5.48047C9.37891 5.17969 9.84375 5.17969 10.1445 5.48047C10.4453 5.78125 10.4453 6.24609 10.1445 6.54688Z"
                          fill="#3E445C"
                        />
                      </svg>
                    </div>
                    <div class="paymode-card__title">Paid Via ${rp.paymode
                        .split('_')
                        .map((c) => `${c[0]}${c.slice(1).toLowerCase()}`)
                        .join(' ')}</div>
                  </div>
                  <div class="paymode-card__amount">Rs. ${rp.amount.toLocaleString('en-IN')}</div>
                </div>`,
                        )
                        .join('')}
                  </td>
                </tr>`
                  : ''
          }
        </tbody>
      </table>
    </div>
  `;
};

export function getPatientIntroForReceipt(data: TPdfObject): string {
    const { name, gender, ageInM, mobile, uhid, config } = data;
    const { flags } = config;
    const { print_uhid } = flags;

    const ageInYears = ageInM ? Math.floor(ageInM / 12) : undefined;
    return [
        name,
        gender,
        ageInYears ? `${ageInYears} Year${ageInYears > 1 ? 's' : ''}` : undefined,
        mobile,
        print_uhid && uhid ? uhid : undefined,
    ]
        .filter(Boolean)
        .join(' | ');
}

export const getPdfCssForReceipt = ({ config, ref_trx_id }: TPdfObject): string => {
    const { margins, heights } = config;
    const { header, footer } = heights;
    const { bottom, top, left, right } = margins;

    return `
  <style>
  @import url(https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap);
  :root {
    --bright-blue: #215fff;
    --white: #ffffff;
    --neutral-50: #f4f6f9;
    --neutral-100: #e4e5ed;
    --neutral-600: #727da8;
    --neutral-900: #3e445c;
    --page-margin-top: 0cm;
    --page-margin-bottom: 0cm;
    --page-margin-left: 0cm;
    --page-margin-right: 0cm;
  }
  
  *,body {
    margin: var(--page-margin-top) 0 var(--page-margin-bottom) 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Lato", sans-serif;
    font-style: normal;
    font-weight: 400;
  }
  </style>
<style>

.main-payment-note{
  padding: 16px 0px 16px 0px;
  display: flex;
  flex-direction: column;
}

.main-payment-note .title{
  color: #000;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Lato;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  text-decoration-line: underline;
  text-align:center;
  margin-bottom: 16px;
}

#header {
  background-color: #3e445c;
  padding-top: 1.1875rem;
  padding-bottom: 1.1875rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: ${header}cm;
}

#header img {
  margin-right: 1rem;
}

.clinic {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.clinic-details__name {
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.5rem;
}
.clinic-details__address {
  margin-top: 0.1875rem;
  font-size: 0.625rem;
  line-height: 0.875rem;
}

.clinic-doctor__name {
  font-weight: 700;
  font-size: 0.8125rem;
  line-height: 1.125rem;
}
.clinic-doctor__speciality {
  margin-top: 0.1875rem;
  font-size: 0.625rem;
  line-height: 0.875rem;
}

#main {
  padding: ${top}cm ${right}cm ${bottom}cm ${left}cm;
}


.invoice-header{
  margin-bottom: 1.5rem;
}

.invoice-header__number{
  font-weight: 800;
  font-size: 1.125rem;
  line-height: 1.5rem;
}

.bold{
font-weight: 700
}

.invoice-header--top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;

}

.invoice-header--left {
  flex: 0 0 auto;
}

.invoice-header--right {
  flex: 0 0 auto;
  display: flex;
  gap: 0.2rem;
  flex-direction: column;
  align-items: flex-start;
  text-align: right;
}

.invoice-header--top, .invoice-header--bottom{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
}

.invoice-header--top>div>span:first-child, .invoice-header--bottom>div>span:first-child{
  font-weight: 700;
}


table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  border-top: 1px solid #e4e5ed;
  border-bottom: 1px solid #e4e5ed;
  color: #727da8;
}

tbody {
  border-bottom: 1px solid #e4e5ed;
}

th {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.125rem;
}

.text-align-left {
  text-align: left;
}
.text-align-right {
  text-align: right;
}

td {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  font-size: 0.8125rem;
  line-height: 1.125rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  text-transform: capitalize;
}

.grand-total {
  background: #e4e5ed;
}

.grand-total td {
  font-weight: 700;
  font-size: 0.8125rem;
  line-height: 1.125rem;
}


.paymode-card {
  margin-top: 1.4375rem;
  border-radius: 0.25rem;
  border: 1px solid #e4e5ed;
  padding: 0.5rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items:center;
}

.paymode-card--left {
  display: flex;
  flex-direction: row;
  align-items:center;
}

.paymode-card__svg {
  margin-right: 0.5rem;
}

.paymode-card__title {
  font-size: 0.8125rem;
  line-height: 1.125rem;
}

.paymode-card__amount {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.25rem;
}

#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction:column;
  height: ${footer + (ref_trx_id ? 0.846 : 0)}cm;
}

#footer > span {
  font-size: 0.8125rem;
  margin-right: 0.125rem;
} 

#footer .powered-by {
  display:flex;
  align-items: center;
  align-self:center;
  justify-self:center;
}

#footer .footer_trx_id {
  align-self: flex-end;
  padding-left: ${left}cm;
  padding-right: ${right}cm;
  padding-bottom: 16px;
  font-size: 0.8125rem;
}

#footer .footer_trx_id .title {
  font-weight: 600;
}

</style>`;
};

export enum COLUMN_STATE {
    ALWAYS = 'ALWAYS',
    IF_APL = 'IF_APL',
}
export const getDefaultPdfConfigForReceipt = (): ReceiptPdfConfig => {
    return {
        owner_id: '',
        clinic_id: '',
        page_size: 'A4',
        margins: {
            top: 0,
            bottom: 0,
            left: 0.6,
            right: 0.6,
        },
        heights: {
            header: 2.592917,
            footer: 1.534583,
        },
        flags: {
            print_header: true,
            print_footer: true,
            print_uhid: true,
            print_receipt_number: true,
            discount_column: COLUMN_STATE.ALWAYS,
            quantity_column: COLUMN_STATE.ALWAYS,
            print_paymode_split: true,
            print_transaction_id: false,
            date_and_time: DateAndTimeConfigForReceipt.DATE_ONLY,
            print_amount_in_words: false,
            bill_created_at: false,
        },
    };
};
