import moment from 'moment';

import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';
import React, { Fragment } from 'react';

import {
    GeniePadElementsSettingItem,
    LocalTemplateConfig,
    SectionNameConfig,
    DFormEntity,
    DoctorProfile,
    InjectionsEntity,
    Flavour,
} from './types';
import {
    DEFAULT_CONFIG_ELEMENT_IN_DOUBLE_COLUMNS,
    IGNORE_CONFIG_KEYS,
    TEETH_TO_NAME,
} from './defaults';
import {
    RenderPdfPrescription,
    TemplateV2,
    ColumnConfig,
    SpacingBetweenSections,
    SeperatorType,
    TemplateConfig,
} from './RenderPdfPrescription';
import { getColumns, rxKeyToHeadingMap, buildFollowUpLabel } from './utils';

import { padElements } from './padElementConfig';
import { formatDateInTimeZone } from './dateutils';

const Utility = {
    parseHTMLToStringForPipeSeperated: (html: string): string => {
        throw Error('Not implemented');
    },
};

let utility: typeof Utility = Utility;

export const setTemplarUtility = (u: typeof Utility): void => {
    utility = u;
};

export const HEADER_CONTAINER = 'header_container';
export const FOOTER_CONTAINER = 'footer_container';
const NO_HEADER = 'no-header';
export const NO_FOOTER = 'no-footer';

const fontSizeAccortingToType = {
    compact: '14px',
    normal: '16px',
    spacious: '18px',
    'extra-large': '20px',
};

const spacingAccortingToType = {
    compact: '',
    normal: 'space-y-2',
    spacious: 'space-y-4',
    'extra-spacious': 'space-y-8',
};

export const fontFamily = {
    en: "'Poppins', sans-serif",
    hi: "'Poppins', sans-serif",
    gu: "'Poppins', sans-serif",
    te: "'Hind Guntur', sans-serif",
    mr: "'Poppins', sans-serif",
    kn: "'Baloo Tamma 2', cursive",
    pa: "'Poppins', sans-serif",
    bn: "'Poppins', sans-serif",
    ta: "'Hind Madurai', sans-serif",
    ml: "'Poppins', sans-serif",
    as: "'Poppins', sans-serif",
};

export const getHeadHtml = (
    language: keyof typeof fontFamily | undefined,
    sizeType: 'extra-large' | 'compact' | 'spacious' | 'normal',
    showPageBorder?: boolean,
    fontsUrl: string = '',
): string => {
    return `
    
    ${fontsUrl || ''}
    
    <style>      
            ${
                !fontsUrl
                    ? "@import url('https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@100;200;300;400;500;600;700;800&family=Baloo+Tamma+2:wght@400;500;600;700;800&family=Hind+Guntur:wght@300;400;500;600;700&family=Hind+Madurai:wght@300;400;500;600;700&family=Mukta+Mahee:wght@200;300;400;500;600;700;800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Rasa:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');"
                    : ''
            }

            *,
            ::before,
            ::after {
                box-sizing: border-box;
                margin: 0px;
                padding: 0px;
            }
            .toDate{
                white-space: nowrap;
            }
            .fromDate{
                white-space: nowrap;
            }

            html{
                font-size: ${fontSizeAccortingToType[sizeType] || '16px'};
            }
            
            body {
                font-family: ${language ? fontFamily[language] : "'Poppins', sans-serif"};
            }
            
            .flex {
                display: flex;
            }
            
            .justify-between {
                justify-content: space-between;
            }
            
            .items-start {
                align-items: flex-start;
            }
            
            .border-b {
                border-bottom: 1px solid;
            }
            
            .border-darwin-neutral-1000 {
                --tw-border-opacity: 1;
                border-color: rgba(0, 0, 0, var(--tw-border-opacity));
            }
            
            .pb-8 {
                padding-bottom: 0.5rem;
            }
            
            .px-16 {
                padding-left: 1rem;
                padding-right: 1rem;
            }
            
            .mb-16 {
                margin-bottom: 1rem;
            }
            
            .space-x-32> :not([hidden])~ :not([hidden]) {
                --tw-space-x-reverse: 0;
                margin-right: calc(2rem * var(--tw-space-x-reverse));
                margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));
            }
            
            .w-64 {
                width: 4rem;
            }
            
            .h-64 {
                height: 4rem;
            }
            
            .body-1 {
                font-size: 0.85rem;
                line-height: 1.25rem;
            }
            
            .text-docM-purple-400 {
                --tw-text-opacity: 1;
                color: rgba(117, 72, 200, var(--tw-text-opacity));
            }
            
            .bold {
                font-weight: 700;
            }
            
            .flex-col {
                flex-direction: column;
            }
            
            .items-end {
                align-items: flex-end;
            }
            
            .font-900 {
                font-weight: 900;
            }
            
            .text-left {
                text-align: left;
            }
            
            .italic {
                font-style: italic;
            }
            
            .text-14 {
                font-size: 0.875rem;
                line-height: 1.25rem;
            }
            
            .font-700 {
                font-weight: 700;
            }
            
            .text-darwin-neutral-1000{
                --tw-text-opacity: 1;
                color: rgba(0, 0, 0, var(--tw-text-opacity));
            }
            
            .text-11 {
                font-size: 0.68rem;
                line-height: 1rem;
            }
            .text-10{
                font-size: .625rem;
                line-height: .75rem;
            }
            .text-9{
                font-size: .5625rem;
                line-height: .75rem;
            }
            .pb-24 {
                padding-bottom: 1.5rem;
            }
            
            .flex-wrap {
                flex-wrap: wrap;
            }
            
            .break-all {
                word-break: break-all;
            }
            
            .space-x-8> :not([hidden])~ :not([hidden]) {
                --tw-space-x-reverse: 0;
                margin-right: calc(0.5rem * var(--tw-space-x-reverse));
                margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
            }
            
            .ml-8 {
                margin-left: 0.5rem;
            }

            .space-x-5> :not([hidden]) ~ :not([hidden]) {
                --tw-space-x-reverse: 0;
                margin-right: calc(0.3125rem * var(--tw-space-x-reverse));
                margin-left: calc(0.3125rem * calc(1 - var(--tw-space-x-reverse)));
            }
            
            .space-x-4> :not([hidden])~ :not([hidden]) {
                --tw-space-x-reverse: 0;
                margin-right: calc(0.25rem * var(--tw-space-x-reverse));
                margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));
            }

            .uppercase {
                text-transform: uppercase;
            }
            
            .text-darwin-accent-symptoms-blue-800 {
                color: rgb(1,111,191);
            }
            
            .list-disc {
                list-style-type: disc;
            }
            
            .ml-36 {
                margin-left: 2.25rem;
            }
            
            .space-y-2> :not([hidden])~ :not([hidden]) {
                --tw-space-y-reverse: 0;
                margin-top: calc(0.125rem * calc(1 - var(--tw-space-y-reverse)));
                margin-bottom: calc(0.125rem * var(--tw-space-y-reverse));
            }
            
            .pl-16 {
                padding-left: 1rem;
            }
            
            .text-darwin-primary-900 {
                --tw-text-opacity: 1;
                color: rgba(0, 54, 122, var(--tw-text-opacity));
            }
            
            .tiny-mce {
                text-align: left;
                width: 100%;
                text-align: left;
                vertical-align: top;
              }
              .tiny-mce ul br{
                display: none; 
             }
              .tiny-mce .tox-editor-header {
                padding: 2px 0 2px 0 !important;
                border-width: 1px !important;
              }
              
              .tiny-mce body {
                margin: 0 !important;
              }
              .tiny-mce .tox-tinymce {
                border: 1px solid #dadee3;
              }
              
              .tiny-mce .tox-tinymce svg {
                transform: scale(1.3);
                transform: scale(1.25);
              }
              
              .tiny-mce .tox-editor-header * {
                margin: 0 !important;
              }
              
              .tiny-mce .container {
                background-color: #fafafa;
                margin: -20px -20px 0 -20px;
                padding: 20px;
              }
              .tiny-mce p {
                margin: 0 0 !important;
              }
              
              .tiny-mce ul,
              .tiny-mce ol {
                padding-left: 12px;
                display: table;
              }
              .tiny-mce ul {
                list-style: disc;
              }
              .tiny-mce ol {
                list-style: decimal;
              }
              .tiny-mce a {
                text-decoration: underline;
              }
              
              .tiny-mce textarea {
                display: none;
              }
              
              .template-list .tiny-mce {
                min-height: fit-content;
                max-height: fit-content;
                padding: 0;
              }

              .tiny-mce li {
                margin-left: 1.5rem;
              }
              li::marker{
                font-size: 0.9rem;
              }
              
              .tiny-mce [contenteditable]:focus {
                outline: 0px solid transparent !important;
              }
              .tiny-mce .tox-tinymce-inline {
                position: absolute;
                top: -2.2rem;
              }
            
            .text-13 {
                font-size: 0.85rem;
                line-height: 1.25rem;
            }
            
            .mt-8 {
                margin-top: 0.5rem;
            }
            
            .mb-12 {
                margin-bottom: 0.75rem;
            }

            .mb-4 {
                margin-bottom: 0.25rem;
            }
            
            .text-center {
                text-align: center;
            }
            
            .text-docM-purple-400 {
                color: rgb(99,19,196)
            }
            
            .underline {
                text-decoration: underline;
            }
            
            .border-collapse {
                border-collapse: collapse;
            }
            
            .border {
                border: 1px solid;
            }
            
            .border-darwin-neutral-200 {
                --tw-border-opacity: 1;
                border-color: rgba(204, 207, 219, var(--tw-border-opacity));
            }
            
            .w-full {
                width: 100%;
            }
            
            .border-docM-purple-400 {
                --tw-border-opacity: 1;
                border-color: rgba(117, 72, 200, var(--tw-border-opacity));
            }
            
            .bg-docM-purple-100 {
                --tw-bg-opacity: 1;
                background-color: rgba(230, 220, 253, var(--tw-bg-opacity));
            }
            
            .p-4 {
                padding: 0.25rem;
            }
            
            .font-400 {
                font-weight: 400;
            } 
            
            .whitespace-nowrap {
                white-space: nowrap
            }

            .w-60p{
                width: 60%;
            }

            .px-12{
                padding-left: 0.75rem;
                padding-right: 0.75rem;
            }

            .space-y-6 > :not([hidden]) ~ :not([hidden]){
                --tw-space-y-reverse: 0;
                margin-top: calc(0.375rem * calc(1 - var(--tw-space-y-reverse)));
                margin-bottom: calc(0.375rem * var(--tw-space-y-reverse));
            }
            .space-y-12 > :not([hidden]) ~ :not([hidden]){
                --tw-space-y-reverse: 0;
                margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
                margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
            }
            .space-y-8 > :not([hidden]) ~ :not([hidden]){
                --tw-space-y-reverse: 0;
                margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
                margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
            }
            .space-y-4 > :not([hidden]) ~ :not([hidden]){
                --tw-space-y-reverse: 0;
                margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
                margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
            }
            .space-y-2 > :not([hidden]) ~ :not([hidden]){
                --tw-space-y-reverse: 0;
                margin-top: calc(0.125rem * calc(1 - var(--tw-space-y-reverse)));
                margin-bottom: calc(0.125rem * var(--tw-space-y-reverse));
            }
            .hidden{
                display: none;
            }
            .text-right{
                text-align: right;
            }

            .w-40p{
                width: 40%;
            }
            .text-13{
                font-size: .8125rem;
                line-height: 1.25rem;
            }

            .text-28 {
                font-size: 1.75rem;
                line-height: 2rem;
            }

            .mt-28 {
                margin-top: 1.75rem;
            }

            .pb-20{
                padding-bottom: 1.25rem;
            }

            .pb-16{
                padding-bottom: 1rem;
            }

            .pb-12{
                padding-bottom: 0.75rem;
            }

            .medication-title-color{
                background: rgb(228,222,235);
            }

            .medication-table-border-color{
                border-color: rgb(128,100,162);
            }
            .text-darwin-neutral-900 {
                color: rgb(88,88,88);
            }

            .prescription-title-color{
                color: rgb(111,47,159);
            }
            .w-72{
                width: 4.5rem;
            }
            .max-w-92{
                max-width: 5.75rem;
            }
            .object-fit-contain{
                object-fit: contain;
            }
            .h-60{
                height: 3.75rem;
            }
            .py-4{
                padding-top: 0.25rem;
                padding-bottom: 0.25rem;
            }
            .dyform-title-color{
                color: rgb(0,31,95);
            }

            .header-bottom-border{
                border-color: rgb(6,6,6);
            }

            .pb-4{
                padding-bottom: 0.25rem;
            }
            .pt-8{
                padding-top: 0.5rem;
            }
            .pt-1{
                padding-top: 0.0625rem;
            }
            .relative{
                position: relative;
            }
            .absolute{
                position: absolute;
            }
            .z-1{
                z-index: -1;
            }
            .top{
                top: 0;
            }
            .left{
                left: 0;
            }
            .right{
                right: 0;
            }
            .bottom{
                bottom: 0;
            }
            .pagedjs_page{
                border:  ${showPageBorder ? `1px solid black` : ''};
            }
            .pagedjs_sheet{
                background-color: rgba(255, 255, 255, 1);
                box-shadow: 0 4px 6px rgba(128, 128, 128, 1);
            }
            .whitespace-preline{
                white-space: pre-line;
            }
            .justify-center{
                justify-content: center;
            }
            .justify-end{
                justify-content: flex-end;
            }
            .items-center{
                align-items:center;
            }
            .whitespace-nowrap {
                white-space: nowrap;
            }
            .w-200{
                width: 12.5rem;
            }
            .max-w-200{
                max-width: 12.5rem;
            }
            .h-120{
                height:7.5rem;
            }
            .mb-4{
                margin-bottom: 0.25rem;
            }
            
            input[variable=\"ptSign\"] {
                color: transparent;
                height: 56px;
                background-color: white;
            }       
    
            .cursor-pointer {
                cursor: pointer;
            }
            .bg-darwin-neutral-500{
                --tw-bg-opacity: 1;
                background-color: rgba(141, 149, 181, var(--tw-bg-opacity));
            }
            .w-1{
                width: .0625rem;
            }
            .py-12{
                padding-top: 0.75rem;
                padding-bottom: 0.75rem;
            }
            .w-2{
                width: 0.125rem;
             }
            .w-50p{
                width: 50%;
            }
            .pr-16{
                padding-right: 1rem;
            }
            .pl-16{
                padding-left: 1rem;
            }
            .bg-darwin-neutral-1000{
                --tw-bg-opacity: 1;
                background-color: rgba(0, 0, 0, var(--tw-bg-opacity));
            }
            
            ul ul {
                 padding-left: 1.5em; /* or 20px */
            }

            li {
                display: list-item !important; /* force it back */
            }

           .pagedjs_margin.pagedjs_margin-bottom-center{
            display: flex;
            align-items:flex-start !important; }
        </style>`;
};

export const getCustomHeaderHtml = (
    render_pdf_config: TemplateConfig,
    ptFormFields?: DFormEntity[],
    rxLocalConfig?: LocalTemplateConfig,
    header_img?: string,
    d?: RenderPdfPrescription,
    config?: TemplateV2,
): JSX.Element => {
    return (
        <>
            {render_pdf_config?.header_img === 'no-header' &&
            render_pdf_config?.floating_patient_details ? (
                <div style={{ height: render_pdf_config?.header_height || 'auto' }}>
                    <div
                        style={{
                            display: 'flex !important',
                            flexDirection: 'column',
                            justifyContent: 'flex-end !important',
                            marginTop: render_pdf_config?.header_top_margin,
                            // marginBottom: render_pdf_config?.header_bottom_margin,
                            marginLeft: render_pdf_config?.header_left_margin,
                            marginRight: render_pdf_config?.header_right_margin,
                            border:
                                rxLocalConfig?.header_border && header_img ? '1px solid black' : '',
                        }}
                    >
                        {rxLocalConfig?.header_border && (
                            <div className="border-b border-darwin-neutral-500"></div>
                        )}

                        {rxLocalConfig?.header_border && (
                            <div className="border-b border-darwin-neutral-500"></div>
                        )}
                    </div>
                    <div id={HEADER_CONTAINER}>
                        <div>
                            {render_pdf_config?.floating_patient_details &&
                                config &&
                                d &&
                                getRepitivePtDetails(d, config, ptFormFields)}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ height: render_pdf_config?.header_height || 'auto' }}>
                    {rxLocalConfig?.header_border && (
                        <div className="border-b border-darwin-neutral-500"></div>
                    )}
                    <div
                        style={{
                            marginTop: render_pdf_config?.header_top_margin,
                            // marginBottom: render_pdf_config?.header_bottom_margin,
                            marginLeft: render_pdf_config?.header_left_margin,
                            marginRight: render_pdf_config?.header_right_margin,
                            border:
                                rxLocalConfig?.header_border && header_img ? '1px solid black' : '',
                            // height: render_pdf_config?.header_height || 'auto',
                            // backgroundColor: 'black',
                        }}
                        id={HEADER_CONTAINER}
                    >
                        {header_img && <img src={header_img} width={'100%'} />}
                    </div>

                    {rxLocalConfig?.header_border && (
                        <div className="border-b border-darwin-neutral-500"></div>
                    )}
                    <div
                        style={
                            {
                                // marginLeft: `-${render_pdf_config?.margin_left}`,
                                // marginRight: `-${render_pdf_config?.margin_right}`,
                            }
                        }
                    >
                        {render_pdf_config?.floating_patient_details &&
                            config &&
                            d &&
                            getRepitivePtDetails(d, config, ptFormFields)}
                    </div>
                </div>
            )}
        </>
    );
};

export const getCustomFooterHtml = (
    docProfile: DoctorProfile,
    d: RenderPdfPrescription,
    rxLocalConfig?: LocalTemplateConfig,
    footer_top_margin?: string,
    footer_bottom_margin?: string,
    footer_left_margin?: string,
    footer_right_margin?: string,
    footer_img?: string,
    show_signature?: boolean,
    show_name_in_signature?: boolean,
    show_signature_text?: boolean,
    show_page_number?: boolean,
    show_prescription_id?: boolean,
    show_not_valid_for_medical_legal_purpose_message?: boolean,
    show_eka_logo?: boolean,
    attachment_image?: string,
    footer_doctor_name_color?: string,
    isHideFooterDetails?: boolean,
    isHideFooterImage?: boolean,
    show_approval_details?: boolean,
    footer_height?: string,
    floating_footer?: boolean,
): JSX.Element => {
    const timeZoneInfo =
        d?.timeZone === 'Asia/Calcutta' || d?.timeZone === 'Asia/Kolkata'
            ? ''
            : getTimeZoneInfo(d?.timeZone)?.abbreviation;

    return (
        <>
            {rxLocalConfig?.footer_border && (
                <div className="border-b border-darwin-neutral-500"></div>
            )}
            <div
                style={{
                    marginTop: footer_top_margin,
                    paddingTop: '1cm',
                    // marginBottom: footer_bottom_margin,
                    marginLeft: footer_left_margin,
                    marginRight: footer_right_margin,
                    border:
                        rxLocalConfig?.footer_border &&
                        (show_page_number ||
                            show_prescription_id ||
                            show_signature ||
                            show_name_in_signature ||
                            show_signature_text ||
                            footer_img)
                            ? '1px solid black'
                            : '',
                    height:
                        footer_height?.trim() && !isNaN(parseFloat(footer_height))
                            ? parseFloat(footer_height) + 1.3 + 'cm'
                            : footer_height || 'auto',
                }}
                id={FOOTER_CONTAINER}
                className="flex flex-col cursor-pointer"
            >
                {isHideFooterDetails ? null : (
                    <>
                        <div className="text-11 flex justify-between items-end">
                            <div className="text-left">
                                {show_not_valid_for_medical_legal_purpose_message && (
                                    <p className="text-darwin-neutral-900">
                                        Not valid for Medico Legal Purpose
                                    </p>
                                )}
                                {show_page_number && (
                                    <p
                                        className="bold text-darwin-neutral-1000"
                                        id="page-number"
                                    ></p>
                                )}
                                {show_prescription_id && (
                                    <p className="text-darwin-neutral-900 text-9">{d?.id || ''}</p>
                                )}
                                {show_eka_logo && (
                                    <img
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAABeCAYAAACHKRm4AAAMPmlDQ1BJQ0MgUHJvZmlsZQAASImVVwdYU8kWnluSkEBooUsJvQkiNYCUEFoA6UWwEZIAocQYCCJ2dFHBtYsFbOiqiGIHxI4oFhbF3hdEVJR1sWBD5U0K6LqvfG++b+797z9n/nPm3LnlAKB2miMS5aDqAOQK88WxIQH0cckpdNIzgAIEaAAALDjcPBEzOjoCYjB0/nt7fwvawnbdQar1z/H/2jR4/DwuAEg0xGm8PG4uxIcBwCu5InE+AEQpbz4tXyTFsAMtMQwQ4kVSnCHHlVKcJsf7ZTbxsSyImwFQUuFwxBkAqF6FPL2AmwE1VPsgdhLyBEIA1OgQ++bmTuFBnAqxDbQRQSzVZ6T9oJPxN820YU0OJ2MYy9cia0qBgjxRDmf6/5mO/91ycyRDPqxgV8kUh8ZK1wzzdid7SrgUq0DcK0yLjIJYE+KPAp7MHmKUkikJTZDbo4bcPBbMGdCB2InHCQyH2BDiYGFOZISCT0sXBLMhhjsELRTks+Mh1oN4ET8vKE5hs0U8JVbhC61LF7OYCv4CRyzzK/X1SJKdwFTov8nksxX6mGpRZnwSxBSILQoEiZEQq0LsmJcdF66wGVOUyYocshFLYqXxW0AcyxeGBMj1sYJ0cXCswr40N29ovdiWTAE7UoEP5mfGh8rzgzVzObL44Vqwq3whM2FIh583LmJoLTx+YJB87dhzvjAhTqHzUZQfECufi1NEOdEKe9yMnxMi5c0gds0riFPMxRPz4YaU6+PpovzoeHmceFEWJyxaHg++HEQAFggEdCCBPQ1MAVlA0NZb3wuv5CPBgAPEIAPwgYOCGZqRJBsRwmMcKAJ/QsQHecPzAmSjfFAA+a/DrPzoANJlowWyGdngKcS5IBzkwGuJbJZw2FsieAIZwT+8c2DnwnhzYJeO/3t+iP3OMCEToWAkQx7pakOWxCBiIDGUGEy0xQ1wX9wbj4BHf9idcQbuObSO7/aEp4R2wmPCTUIH4e5kQbH4pyjHgg6oH6zIRdqPucCtoKYbHoD7QHWojOvgBsABd4V+mLgf9OwGWZYibmlW6D9p/20FP9wNhR3ZiYySdcn+ZJufZ6raqboNq0hz/WN+5LGmDeebNTzys3/WD9nnwXP4z5bYIuwQ1oKdwS5ix7F6QMdOYQ1YK3ZCiod31xPZ7hryFiuLJxvqCP7hb+jOSjOZ51Tj1OP0RT6Wzy+UvqMBa4pouliQkZlPZ8IvAp/OFnIdR9KdnZxdAJB+X+Svr7cxsu8GotP6nZv/BwA+pwYHB49958JOAXDAAz7+R79zNgz46VAG4MJRrkRcIOdw6YEA3xJq8EnTB8bAHNjA9TgDd+AN/EEQCANRIB4kg0kw+ky4z8VgGpgJ5oESUAaWgzVgA9gMtoFdYC84COrBcXAGnAeXwVVwE9yHu6cbvAR94D0YQBCEhFARGqKPmCCWiD3ijDAQXyQIiUBikWQkFclAhIgEmYnMR8qQlcgGZCtSjRxAjiJnkItIO3IX6UR6kDfIZxRDVVAt1Ai1QkehDJSJhqPx6EQ0A52KFqEL0KXoOrQK3YPWoWfQy+hNtAN9ifZjAFPGdDBTzAFjYCwsCkvB0jExNhsrxcqxKqwWa4T3+TrWgfVin3AiTsPpuAPcwaF4As7Fp+Kz8SX4BnwXXoc349fxTrwP/0agEgwJ9gQvApswjpBBmEYoIZQTdhCOEM7BZ6mb8J5IJOoQrYke8FlMJmYRZxCXEDcS9xFPE9uJXcR+EomkT7In+ZCiSBxSPqmEtJ60h3SKdI3UTfqopKxkouSsFKyUoiRUKlYqV9qtdFLpmtIzpQGyOtmS7EWOIvPI08nLyNvJjeQr5G7yAEWDYk3xocRTsijzKOsotZRzlAeUt8rKymbKnsoxygLlucrrlPcrX1DuVP6koqlip8JSmaAiUVmqslPltMpdlbdUKtWK6k9NoeZTl1KrqWepj6gfVWmqjqpsVZ7qHNUK1TrVa6qv1MhqlmpMtUlqRWrlaofUrqj1qpPVrdRZ6hz12eoV6kfVb6v3a9A0RmtEaeRqLNHYrXFR47kmSdNKM0iTp7lAc5vmWc0uGkYzp7FoXNp82nbaOVq3FlHLWoutlaVVprVXq02rT1tT21U7UbtQu0L7hHaHDqZjpcPWydFZpnNQ55bOZ10jXaYuX3exbq3uNd0PeiP0/PX4eqV6+/Ru6n3Wp+sH6Wfrr9Cv139ogBvYGcQYTDPYZHDOoHeE1gjvEdwRpSMOjrhniBraGcYazjDcZthq2G9kbBRiJDJab3TWqNdYx9jfOMt4tfFJ4x4TmomvicBktckpkxd0bTqTnkNfR2+m95kamoaaSky3mraZDphZmyWYFZvtM3toTjFnmKebrzZvMu+zMLEYazHTosbiniXZkmGZabnWssXyg5W1VZLVQqt6q+fWetZs6yLrGusHNlQbP5upNlU2N2yJtgzbbNuNtlftUDs3u0y7Crsr9qi9u73AfqN9+0jCSM+RwpFVI287qDgwHQocahw6HXUcIxyLHesdX42yGJUyasWollHfnNyccpy2O90frTk6bHTx6MbRb5ztnLnOFc43XKguwS5zXBpcXrvau/JdN7necaO5jXVb6Nbk9tXdw13sXuve42HhkepR6XGbocWIZixhXPAkeAZ4zvE87vnJy90r3+ug11/eDt7Z3ru9n4+xHsMfs31Ml4+ZD8dnq0+HL9031XeLb4efqR/Hr8rvsb+5P89/h/8zpi0zi7mH+SrAKUAccCTgA8uLNYt1OhALDAksDWwL0gxKCNoQ9CjYLDgjuCa4L8QtZEbI6VBCaHjoitDbbCM2l13N7gvzCJsV1hyuEh4XviH8cYRdhDiicSw6NmzsqrEPIi0jhZH1USCKHbUq6mG0dfTU6GMxxJjomIqYp7GjY2fGtsTR4ibH7Y57Hx8Qvyz+foJNgiShKVEtcUJideKHpMCklUkd40aNmzXucrJBsiC5IYWUkpiyI6V/fND4NeO7J7hNKJlwa6L1xMKJFycZTMqZdGKy2mTO5EOphNSk1N2pXzhRnCpOfxo7rTKtj8viruW+5PnzVvN6+D78lfxn6T7pK9OfZ/hkrMroyfTLLM/sFbAEGwSvs0KzNmd9yI7K3pk9mJOUsy9XKTc196hQU5gtbJ5iPKVwSrvIXlQi6pjqNXXN1D5xuHhHHpI3Ma8hXwv+yLdKbCS/SDoLfAsqCj5OS5x2qFCjUFjYOt1u+uLpz4qCi36bgc/gzmiaaTpz3szOWcxZW2cjs9NmN80xn7NgTvfckLm75lHmZc/7vdipeGXxu/lJ8xsXGC2Yu6Drl5BfakpUS8Qltxd6L9y8CF8kWNS22GXx+sXfSnmll8qcysrLvizhLrn06+hf1/06uDR9adsy92WblhOXC5ffWuG3YtdKjZVFK7tWjV1Vt5q+unT1uzWT11wsdy3fvJayVrK2Y13Euob1FuuXr/+yIXPDzYqAin2VhpWLKz9s5G28tsl/U+1mo81lmz9vEWy5szVka12VVVX5NuK2gm1Ptydub/mN8Vv1DoMdZTu+7hTu7NgVu6u52qO6erfh7mU1aI2kpmfPhD1X9wbubah1qN26T2df2X6wX7L/xYHUA7cOhh9sOsQ4VHvY8nDlEdqR0jqkbnpdX31mfUdDckP70bCjTY3ejUeOOR7bedz0eMUJ7RPLTlJOLjg5eKroVP9p0eneMxlnupomN90/O+7sjeaY5rZz4ecunA8+f7aF2XLqgs+F4xe9Lh69xLhUf9n9cl2rW+uR391+P9Lm3lZ3xeNKw1XPq43tY9pPXvO7duZ64PXzN9g3Lt+MvNl+K+HWndsTbnfc4d15fjfn7ut7BfcG7s99QHhQ+lD9Yfkjw0dVf9j+sa/DveNEZ2Bn6+O4x/e7uF0vn+Q9+dK94Cn1afkzk2fVz52fH+8J7rn6YvyL7peilwO9JX9q/Fn5yubV4b/8/2rtG9fX/Vr8evDNkrf6b3e+c33X1B/d/+h97vuBD6Uf9T/u+sT41PI56fOzgWlfSF/WfbX92vgt/NuDwdzBQRFHzJH9CmCwo+npALzZCQA1GQAarM8o4+X1n6wh8ppVhsB/wvIaUdbcAaiF/+8xvfDv5jYA+7fD8gvqq00AIJoKQLwnQF1chvtQrSarK6WNCOuALUFf03LTwL9p8przh7h/PgOpqiv4+fwv2xJ8N4Qfg4sAAACKZVhJZk1NACoAAAAIAAQBGgAFAAAAAQAAAD4BGwAFAAAAAQAAAEYBKAADAAAAAQACAACHaQAEAAAAAQAAAE4AAAAAAAAAkAAAAAEAAACQAAAAAQADkoYABwAAABIAAAB4oAIABAAAAAEAAAEioAMABAAAAAEAAABeAAAAAEFTQ0lJAAAAU2NyZWVuc2hvdHpsA0AAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAHVaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjk0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjI5MDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlVzZXJDb21tZW50PlNjcmVlbnNob3Q8L2V4aWY6VXNlckNvbW1lbnQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpT+GR4AAAAHGlET1QAAAACAAAAAAAAAC8AAAAoAAAALwAAAC8AACiNA6ESqgAAKFlJREFUeAHs3dmTX8d1H/AezGAb7IONALgAIAmRFMFdNLWapCJZliXLTuTESZxK3vKQ5zzlLf9AqvKaVCVVTsplOSU5cizJEiVRsihRgrgC3EQCBIh9XwcDYLacT985xMVPAw5WAkP9Gui593dv9+nTfft87+nTp/v2jEco3dBtgW4LdFvgBrZATxeIbmDrd4vutkC3BWoLdIGo2xG6LdBtgRveAl0guuGPoMtAtwW6LdAFom4f6LZAtwVueAvcFEDEXj4yGnFkrAyPOB8ro2MR49rYWBPjUpGu/g7zemNj74kGbGztPT09Jf6XGfFnxoyIzmeIM0pfb0/p7Z1RZvZNxJkzSq8E3dBtgStogabvZR8s0e+avpTHTpLSi533O3935vtd+n2TAFEpx0+dK8dOnC1HT8Tx5NlycnC4DJ0ZLWfOjpSz50YjjpVzcTwTx7PnRgKwxt5/uDClAZreCjqzZ80os2f3ljkR++fOLPPm9pXFC2aVJQtnR5xVBhbNiet9v0vPuVvXa9gCo6Oj8ZJsohddb29vfeEBlk5wAUBj9aU6+v69TCdvZ/pryOa0InVTANGR42fL/kNDZf/h02XX/tNl38HT5fCxM+X4yXMVkAaHhsvpoZFyOoDp1Gnnw+XscKhIE4F2U7Wd0HTmzu4rc+f0lfn9vRFnlkULZgfwzC4rl80tq5f3l9Ur+8utK+eXNSvn1TxJo3vstsCltsDIyEg5c+ZMaPAjFYBmzZpV+vr6KiB1AgsQkk5MrSiBK4+XWu5HOd2HCkTxcggNZ7QMRTx7bjjOx6omdOAwEBoqBw+fKfsOnS4Hj54JzehsORVaEc3o9JnUjkbL8Gi8dXpnxZuERkMlbtTeMj4ap6NlfGy40Ij65wKiWWXBPGA0qyxbPKesGJhTbgkwWhNgtHrFvKohzZoVb7MgMytAbF4AV3+AGFDrhm4LXKwFgNCpU6cqGM2cGRr3vHllzpw5k2pFgEj6c+fOVSBKDQpwyQuMuiEkOVD6Q3NoNJzaH0Cz79CZsvvAYNlz4FRoP0Pl0NGzVQM6EcMzWs/QmXjjxDDs3DDACvAZHm+GYoUqGw9uBhBybpzuMfrDiNTE8QCkGT3jFZBmB9DUIdqcmfW4YF5fGVg4pyxdMqcC0fz4DahWDMwt625dWG5fNa9qUqh2hnyjdV7v/v7dagEgdOTIkTI4OFgBaPHixWX+/PlVK9ISba3IEO706dNlaGioDucAT4LQ7NmzC22qGz5kINp7cLBs23WybH3veHlr2/HyznsnYig2WI4cC+3n9EgFHg+Fsfk8Pl54fmkP7Ty2TtgRI1tDhy2JxjS/HwCxGcWwbencsnbNgrLxYwPl43ctjt/9dXjHyN0N3RbobIETJ06Uffv2Fcf+/v6yYsWKsnDhwqrhtEFIPkOykydPVtACSoCIJgSE5O0CUdO611Ujoq0Mhm2HEfrAkaHy3t5T5d0Aoh27T5XtuxsQOnjkTGg/ARN1uNU7AUB1iiw4DAKh5YyPjVTwMHzqi2GToZQH3mhEhmahD8Wf0IKbGbeYbaN9mWmrQzjDuJ7GMFgBbjzG6zGEmzOrpyycPzNsSGE/WtFfNqxdVD62flFZE+fAaMmiWWXhvNlVkzoPaE3DXa+/qXXlcbJyzoN00w6TpbnYtczbKTCZPsvNY16/XsfkB/3JeEo+8ng1fExV1qXSPn78eNmzZ08FGMOy5cuXF1oRgOmsQwIRMDJMS43IUA4QAaQPCslzJ90PyjMd711XIDoXBmXAs/k3h8sbW49VINobhmhDsROnzlZbkWFYqUDRgEX8ON+OEGZ8uMzsHS3LYii1cP6sAKTeOvWeU/MeVAKQoZwyzbSdDrq0rJHR3gA5D5vdB2gBuSizxtHoPL0V5BaGLUkZK5f1lztWzy8fW7eo3HX7ojBszysrQmNSbjtcC8Fo02uf67CCzjdZB3Q/O+jl2BiatmpoX2zGJtNc7H7yeTn1T14nq0uWh+5kdcm8Wd7FaCRfk913r13OVHVLWnnU3ugmbUC0d+/e94GIRrRo0aI65Mo0mRcQ0ZwM42hE7WHZ3LnRr6YAInmEy+U5y58ux+sCRLSRczHNfihmvra8faT87IV95ZU3D9dh2NGYIYvZ9wgMPIQi/SuaY3a89PuZEwCwNAzNtyybUwbiCBD6YnjVG8OmRiMq8YD5H0UMW9KZIG5WbXBoNNwAzpUjx8+EwXukpmlrNTCuhtCUhJ6wMdG2gB3wuf/uJTXeHVrSnbctivLn1iFjTXwd/6j/xYSGQGQ8304BzBPTx5Ox1aaXeVOoMl8Kj7QERzqB0HQKgHtJU77O+20eMq2jtG2gcS3vJ70sD80M7mW65Nv99nXnQpsf5xnkJ9COQpvOVPy38+FPACz79++vBuvUiC51aKY8mpMhGa2oc2iWdVCOssW8pv3a9ZImgzaQ1lEZH1SvzHMzHa85EPH9MQzbsedk2bbzRHkzbEGvbz1azw+HLWi8xMOsxmZAFA03OhwzXDOqwZi/z7zw++Hj49z0+4KJKfjFC+M8tBYaTDotZl/TvzhBjow0GhHN6MyZsXJikG9S45dktq4BqdHqq3To6FD8Bn6pidG+glBoYIDv1lvmlXVhNzJc+3iA0p2hHS0PgzbNKcu9Hg8yO1QCQnYu18UUyhQqwpFRB09hyU48PDxcwQW9zpAdvG00ZVQ1y6MsguIemjq2gN7Zs2crzczvPiFRvpCCjwfnYgqgtGgow1FIgFJm/lZuagvoZHtkG2T9/BbREAm2iDf0zVZJm+kcM+AFz9luKeTyZcxy3ZPeMY3V6sBIvWzZsqoRZf2TjnLkTxtRPgNtkWU74il5TP6lkb6dJ+soj9gOeGEURwcftC1HdNBv89TOd7OcX1Mg4nRIwN8I4Pn5SwfKS28cipmx0zEMO1dtRe731A4dnZomogPNGKk2mdtWza9aB9vM8qVzyvIlc2OoNLssjhmuubMbDag38squUc+/74JMtGbT0Rpbkb7GS5ubgLLF46eGq62Kv9LbOwDk0bI3ZuzqsBA1BCfsUTPDFmUK32za+lsXlAc/tqwasoHS+tsW1Cn+9gO8lg8arRQCQpQCq4NlZ0rhxkN2aB04p5GlAxai/I5oCjqzzomeTu7c23zBggX13Nve0AMfhExEW6dGFz2CBbCSnvvsHTq/NMpq853pABt+3VMOGsoHOI5Zb2kMdfDl3HVtIea5I/4T5KTLNsCLYDgENKTDlzLUS92FFNgEXL/dJ9DqmIDrmvzKQMN19/GDRzaiHJqhK20GZScf8uE36XkW0uJHfVzHi+eorPZ16aTHo/pJ1w6e2eHDh2vbyr9kyZKaLstop70Zz68ZEHE0PBT+PwzSL79xuDz7y73lhdcPheOh2Soq8cSbKM4Nq2b2NdPqtA82GQJ+W0yd8++5Jew0hkKm1E29X00w/X+SZnQSf0MVGF97+2jYrY4Er4PhNMlWxXvbmxuPQCkM2zPi7R4a25IFM2ImbUl5IMDogXsGApQGyu3B7/VaIqKjprARVJ2Y4OqkKQjOM2obwkEIU3hda3d+9NDVmXVkgYAQDNcIE2MrOseOHfstIEqjqvuENKeu0UQPkAAsdKTBNwBQrqCMBAqCkYKuXn4DMPn8xpO0+EkDMF4JvXvySkdIlS+fmPTxKroHLACec/dF7YZe8p4g1BZueY4ePVrLSf6Voa6O+EAbHQDethFlekcBn9JqD3XIshNYHPN5481zTG1Gfny6jo6grbUzsJFXcB8IGS5q+wRHz0T74vlmD1cNRIZEZsZ2xzT86+8cLVt+c7S8EdrGW++GQS/8hXp6IXcIeHU2DGNd73hdZsGz+Y7VC6o9ZvXKudVIvLz69jBKz4wlGbNjCv3qQCgb35o1xmuAZAkJg/mufacinq5882miKRlSDp2NXDOo9vH2jNm6nvGzFRRN7z+wYaA8ev/yMGTHFH8ApWEaV4NrGXQ8HVNn16l0Yuc6VAqLDiidzilNCvTAwEBZunRp7ZgARZRO5xYJYnZeQiGv+4QxtRnXROkInuuijp8gotPjS/muyQ8EAYd8hM4b2n3louO63xkJJAFKIHNfPdVFaJeZeRMAsr5oE8wUNgInZvpsG7+lk965svGRbSgPoVVH53jXdtLJp35tIAOGgAo/gIhGRPjVRVBGBjS0RwKzMtUbPekdXZNObL80tIGypc8XEn48Z+2NV8GzxO+hQ/HiD57wAhz1F20zHcJVAdFoaBA8nw/E0ozXY1bsJ7/aW55/5UAI+uD7GkYPexAnxGp/GakgZBj2yH1Ly+MPrAhNKN7GMQRiF2KINiSibTAcXyutI55jTOV7qzBqxzEe/HDYkQ4fO1fe2n6sgueb245VW9bOAKee3rkTwBl+BZG5J5wjDdM2rF1cHr1vebl/w5Jyz/rFddh2rdes6ZQJRAQugUgHpG4TGJ1X59QBaSeAwW+2CkLhXKd0XVodN7ULnVIZaBMoNPxO4cljdl6/CYPOTZAJN9r4IjiEIXnDn/SElGDgg6AScGlzOEY4ElTxJwqESAQSgnQigVUOnoGENIRUndCXRlnySSNqQ2UmHTyoB/6kdV/9EyDcJ9xoqZsoqLfr6ogHZajHgQMHahr52n5E8rTbEA9oAZI2P+ipg6P0noFnoe1Ev9svFs/Zdc/AM3YPr+ohX/KMP23iPvrTJVwVEFn/RZv4TQjzy28cKT/99d7y8ptHwxY9L3AnxrxjoV7EQ6c10G6WxmLTVeGjc2eAzycChD5x/7LqSHgjl1Rs3x3uBTGzZ7hmZu+NAKSDoRlNyELocjlMG45lIjPLfXcuiaHaQHnk48vKw/cOhFF7/jV91oRExxIJPUEheASXtgOIMkhLIKjkOiQgIhSuu6bz6ui33HJLvZf5HJM+2im48hFWeQTXdWy/CaSO7RqBwFcKFqDQ8QERGu4DQQLmurzKcY0QEybCnaBKwOVLoUKXIAruSQ+slJ1ARNjUFxC0A/qEUnlCApn2Q8dvQVnAAT3n6oamclwXpVUnER8Z0Dd9ryzlt43VbRCSvg1E2lLQXsqTF08ZpPU8OUs6X7lyZX127rvuBSAvIALCePIc1VV0LqCbL456YRr8uSogslh10+YD5bkX91eby9s7jseUfQxnYjgW/SpevTHeDx8ga7wMxcxCmQ6nBa0LI/BtIcRmwm5kMGQzrDTL99a7x6rH97sBTgDqQKx9e98HKWbTemeMViP62jXzyxMPriyf/cQtdVZtUUz5N46W51XyK60TAdQJdawEIoJCkAh1p+DpnDqpTqhzEho0UugTiIBYO2QZhJvQORIi9AEEYCBwtAadH3DgQT4ghDd8ES7Cm2XLl9oYQQGM7qGPT5qS9ARFWQkMeM66o4EX99BQvt/qiCdHedUJT+2QwyrtlzSUhwahRw99fONfOufupcbkmqh8vIvtoP6ASFnKBwzaJ/lsp9VeeNbGylE+fpSlneXJgC8vELTx5gWyatWqWo+DBw/WF4v8njHQlD6fg3P8ou2ZAzrn0yVcMRAx7Fqi8b2f7SzfeXZneTuWbQyGA6EGqYZe0+IhvAMLe8u9dy6uBt/7w8ay8e6BMEovqBpS9K06FX+jG4sPkpX+tLt3d50I7ehY+cXLwDXsAGlsN7TEcITFC/oqEH3+k6vKg/csq17Zi+aHDSJm2642EMYUEMKgA/ut4+qAbY1I2hyaSdMGEUJCYOQDBkCMYGYgIARaGdIBHIHQEaqkjY4OruOjLyirHQmH+8DF8wdE+CII3ur4Vg4Boy1Jrx54cy5PO+ITMIjKTr7b7QEA0G0DEUEn9MBOWkF+ZYhJS90EdF1vH/GhbUQgoV54lS4DTai9xONygUi9EiwcM+AL4KRG5LkBI3xrNxGv6gxo8AiIPEd0XNem+M56J+2b/XjZQBTPqU6HWy3PP+gHz+0uz/5qTzl83MM1/o6ZkkjErkLbuev2heXh+5aFwC6tQxpT4BcTWJuj2XPoXAADe07dGC1oNbNZTVN6EGbd+uLh1H2HqoPjeQG71AbX4dBqB/au3bEQl+/Tz1/cV158/UjMssUUcMwIVteD8NBm8xobOR2G68Xls48GEMXw7J4wXrN7Wbl/tUFnJOQ6Fy0CQPit4wGJBAPlqAOB13mlITQiGoTxcoFIewAs5RBqgKLzK0e5Onp28BRY5TonAHiUD3gRVgKRIEhgCBh+CTXhlr4t4Nl2ypCXwOIJfXVKIFKG8i4GRMpPDQ99ESh2agh5PfuBMrL9lSH9xYCoPTRrA5E6JD3n2sdzSI0o65bAoY4Zss1pRc4N+QARPtDQpvjDNzpoa1fXPBvPzbGznkn/Zj5eERCZ+v7lqweqTeW1mCnbtjPG5CMx9uYbFDNNfIMsi7gtnALvDw3osZhpYltZFVPzi2JG7GKhMXyHMTQcH5uV+IYosQI/DMuAyQPm0NhsdDazTvWvWm61/OQAoAO3O8XFys3r1qudCH8j4FON1+8cqzOAZgP3HDRMa4x/46NDUbf+6nlNw/vEA8tjen9pNbonrSs9piAkEKXqTWgJnmM7AIu0EemIgAQN1wmkDk8r0anbbaGjo01gCQkh18GVIXrbGt6J0gIGtEQ8+J28up+h8y2dQqqc1IgISttGRKjwJuYzc030G01Ch8c2ME8GROpCYKWVFw28Ai4xaWY5WaY6ZDl41f7y4VO7tgOty1oz7UvwtW8OzaRrt3MnEGlj4IMX4N4GDeV7qRjCalvPDG3p1SefF97QdZQHTYCZQ/d2+W2+b+bzywYiHsr/8Nyu8q3vbw+HxYN13yAzUWPj0ZHS9yaGY7SEjTEUa3xvltYtNi62mr26AMSwzj5E1qaxz9ibyE6NXAMYxQ2fop/GkK6vzrytin2FNsTM1cfWLqwLVO0ldKF+c+XNbo0anyM+UZtePVi+//Nd1Rjf0xf2iFij1jN+rs6i8Xe6N3h4+onV5anfW13Xql15qU3OFO4EIoKns02mARAmnRYQSUPoRdddAyI6Ma1EpyaEGdBHWwcneDq2+4TbECvBjAYjjc5NaAgPoQNGrik3eSUofiufcCR40n7cwyvhTQF3HX9+t3lLHh0TIJLPbI+kDQgy4Nn9BFZ5U/AJKt5TSPEoOEonpnDLr03wlOCe+eRRB6DqiKb21W4JKu20bSDSNtIkMOLdeQZlembaXF3YwNDWRoI2wBtt1xFtwX3PJIGoXpxmfy4biHbtGyzf/vGO8jff2xZ+Q8frUGW8LiBtHqwNyQzHaEEPxxT9PeuXxDT3wt/SWgzDhmOBKt8euzEeiFX4vLB3hpMhHx+G8NSKgB+wa4Ao7BUx5GMAX7smjN7hCGnlPE9s28DOj3vXYnMzi2e5JXBH+NtndpTnXtoXPkagLoagE06Zlp9siMWxX3ny9vLHT99RHTGv9vkTDIItEl4dzrkOCyDaqreOqFPm8AnYiGiknYYgyieiQUiyDPTR0OkFHToFltAkbQLiN8EkeAREOrQIsPu0EIIpHTqAAq/KBaLqgE/ahHyuSSfiK4EIb3iWxjW8oSm/crSH32gDCfxkkDbbjdA6x18CKJ6ynKxztodjlqUehkKCehJyfOJLGnUF9HhJIMLLZECEV3VGzzkabTBSdzTxiV9A6rngJ0Ew6UqHFrDCY9ZNW2pnYKiO0zFcEhDpHMCAhsJA/UzYhb7z051l5/4wCIZR2jR9OEpXgLC3j+HYpx9dWR77+PJCc7FmLNr1gmAYBmx2BugYBr0Zfkh7YsmFLUOAkzVrZ4c5noVqHpEfkIdDq2JjAjbNVrCzqsMhl4C77lhU7oiZOY6Sixecf9MoWB3kv5ygzpu2HCjf+sH2cE3YV3ePBJ4CWxGP8bWr55V//qX15c//6M46M3g59CdLm8JAkHRKnd5RB9bJDI2cq48ISEQdWsfVIQUdNoFBveVJIfA7hRsNNHXmHHYRuhSgLB8/0hJMYKcc9PALIACfKJ80eKHxoIs3QkPARAKXIIFGAhFaygAWCVRtMEogUl9A1KkByIuG+9ISfm3negJe8qyNCHhG97PeCcB41CbKwmMCAprSaBN1zOGn++i3Q7aj5+EcL4J00uezyHvZHuqfYJ7gKZ86Gb4pHy3p8AcQPRP8TsdwiUBU6n7ShkxAwzqyn7+0L2w5YRsgkKPnAhh66nT83QEGD4Um9JlHbqlDs8mGY4ZZ9qU2Tc4R8tebD4W96VAIeryh417ARjRyjrWbBzdZ4/LxERbN76s2KMsvzMyx19x1x8Jr4hD5yltHyv995t3y4zDI7479tE33W+Xf08djfEYZmD9S/tVX7i7/9k/urgbrytBV/EkgIgQ6HTDRiQWdjLBkZ9aJdVJCokPqjDql6wSewLSF3/UUPB0fOMifnVjHT+FwT35v/aSFN4IHiIBNBgJp2CXK580sTQpwCqd7QCLrhb6AB2myXniQV0x+lK0c/CQQKUeazoAOINJ2gFRbot8uI9tCm4rqpf7KobnROtCQLkHIEQ3l4119tB1A1B7uS98OCUTJN/r4E/NcGjTRxgcNLNsu6580lZtDXGUpP3nHPx6mY7gkIFKx32w/HtrBwfJKrCOztcdb8XtwKBo9lkOYpl80b7w8FDNjj92/IoDA2qyB0IbOq83txmH3sUfRpi2HyuYQdHsVsQ2NjGtEDzLBJx9q/k4qfrNJMVLHW3lkMOxE4fkcIHhfrAuzDMNOi2w4VvN39I0k8ltHnaOzI/Et+j//8G750fO7Q3sbbAERG0ksjO0fLv/6K3eVf/enG64pEKXQESSdmLCmloBHndhRxwNOhMn97Ig6NxpiaiHqp2OnQKLhd7550XBPSNAgjElHemm9eR0zKCu1CGlSI2rTy3ZFlzABI3xJr25Ctj+esj4piNLJK4+jOitHuskCnpQhOke7HdRTudl+6qP9BMCv3dU7eZIWL47KB27uyZdAkPXIuqIlrTZMvv0Wsj7tI54Ai3rhBb02LfnQMSwEsu6nFqwd1CWfn7TTKVwyED3/yv7y3Z/sLL/afDD2FToVQ6gYEtSN7OfGA4mpxoVj5Q8+c1v5wqfXVCc/q+jNbk0WbJb/zPN7yt8/u6M6QtY9imLIk8ASrW/sE1nZCi5UdZuNzWhNzRCpak91ps4attnVU/vR8HrmLsBVwBqxTqfJ7FydvDV99UIwAkR//Z1t5fthoLetrUW0IRMTjo6lrFjSU/7ll+8q/+Zrd9etQzppXu5vHdPbUUcnsECIQOhkOqiOKmSH1hnFFBIdUf1EadAjiM5dy5AdPPPKL29ez/xJI/NLBwTky6AM/Kbgup9pkl6mRRc/6pgAkXxJiwcR/Tx3XRrlZHRPm7T5yDIcpcsysg55v11OlpHtJ418onyiIE/ylLw4ypcRrc4gTdJJWq7l9TyXL+uU9VKmkEfngIhGBPiBFW2MBiWP0E5bL0yTP5cERGw0P3huZ/nGd98N4+3+unC0AgCgsPvh2Gh4Tc8pX/+DdeWrT91Rhb/TV6hp8BgyxNBma+xT9O0f7Sjf/MG2sudQIxzjY7HYMR7QRNtr0nreNOx5AYok9SG63tDU0qkdxZqw+VbLx/CsztgtrZoZT+4rXZv669ACv/HdbeWZX+yuNiI2q1qiIWl09nW3zi9/FvW+ljYiQkCwvUmBkd/evN5+CUTqTti0w2QCUJmc5E9bkOVt2neShB/SpayH4i63LpfKYtNPGuGX52LgNRk97SW/oJ2vZXsBJrTRvdRnqD+wEdH0AJEhMCCa7mFKICJ4djn8fhio//o7W6tGVHrs2xILCsNY68H4Egb7zJ9+YV350mdvq5/u6WwYTonNNiGD5bV3jtQFss9u2lOGhqn4IVQjQ2HTiT1wwidIXBL7EA3EntEWm+b2sGbOjscWszZYo0X55BC/n+o2YJgWD9Vq+VXLm83wbd/x2MYV1X7EiE4zCnYvCDrCZJ2L5sNmBYj+/tn3qk3s6Imos/y8rOME2LJF/dOo9z/74ro6e3cB8Sv4gR8glBqGNyDNQadjE3G8mcLF2u9m4vFG8XIt2wYgAi4vJ8Myx86X042q57Uod0ogsg6L0D+7aW+dPdoSTn6NFmTt1Vh14rOH0IOxV88XPrWmfDqM1GazOoNZL7YlSydeiQWyvLIZv88Oh4pv+BV2JpvZm2W7bVWzMNYKd7Nglk/M7KNNjVbfHhuv2dyM3QqN8Z5mqxELbW03wvPaFh12Vcxhmq07aEb9HVuLhNxHuBCMGMx37DlVtzJ5IYDo5y/tD/A8GkNRw54A32JKOKbFowwr8r/y1O11Cp9N6mqDDgd4Eoh0OB3QUMebT+frht+tFmj3CdpxDoENx9inbraX05U8nSmBaFPYhPjzWNhqXdm2XeHjEMMxM2VzZo1NbDS/uA6BPvnQyjpT1jksw5jh3c9e2Fv+7sfvxULZWE8T3zdjtI7dXUMjMRUesy3hCMkD2/R/XZcW222Ylp8V3tQZAOPLsUqed/fLsQMkgDhwmBtBqCo0lQC19x0rF/TWNW4bN8QQbWJTM8A21fYiPKtfDSO6Dd7QN7PHf8qXRqoWWEaqhzhP8cahcU158vFY4R6+TFcbvEV1trSjtIHoo9LprraNftfyAyIvpuwXfhvKAaI0Uk/3NpkSiL71zPYAorPVs/gfw5dm14HwsrW6PrSPeXNGy8NhFH78AQDU7NFzsd0LAdE/BJD91f/bWu1MNrSniVTgiP2KxsPOtHbNvOqh/LmJVe1m3ToN3rQVHs9bw5/pxdgB8qWIvpVm646hs6HZmMWrGlY44PXEVgoxJLMDJC9vs2mAw5c6JltqYk2ZzxvZReCFmNF7OVwKaEY8vnlb98wIexheY4nH+rANPRJr6DbGDOHD9zZ0beh2tQEQ6Wi0IGAkupZG4jRKXm053fzTpwVSI0qbkv6QdiX94VLtSzdzjacEov/6l1tiicVo3SLjxVjSse9Q+GT0NTNli/pHy9O/tyZmym5t7DCxayEBn2zXQgDyd+GR/T+++VbYmWKvmgCM8bGJjcdmhMYTGtGD4f/zZ3+4bsphjiUhZt4M717YQmtpXABs/Vr9e0IzaoZphlzj9csc/JsM0/gYGfLx/m5vQ4smFwJ+Ulbfv/Dagbo3EXtULrqlCeJ7bPhUrL5fXv7w92+vG6UZSg7EXkuTaYJX+vB1tgQlNNKQO5k960rL6OabHi2gHwjZJ5JrfSFjXpuuxymB6D/9l03Vq3p77Ndjw/lDx8I4XHcwjEV5i8bLV5+8o3zt83fUpRxsQ/mZn84GAUS0q//2jTfL5ncCMMK4zEANgHhns7vYtfEvvrah/EnQu5SV7Ntiyw7Dptdiuw7r3gyjDh7h+9GU3gPggrb1YUsXcXq0HcnScLgcqD5P9kiyKRugsZuA4d6Lrx2uAIfWrnBgrBpW8Gjb2Dr8C04NIT//xJqo99rQhmKxaxjW4wtHkwJwZzt0f3dboNsCv90CUwLRf/jPz1UgYjch+MdONhufAZDVy/rK17+4vnz9S+uqz85vkz9/BRB98wfby3//mzfK5q3W0gCiQTBfQcnQ7J71MQP1xbXly5+7vQ6n2rah85TOnxlKsTXRZF5980h5NYDEJ4x2x5q102cCjQzThNC8ZsZe2b4KcnvdpnZ5XTHvfG5szm9d2Z6Dg3U4ZpaMAdzat/NDPTQa4/zSxbPrRv9PfmJ1+fwn11QAZkj/MIM344epGX3Y5X2Ybdkt6+ZogSmB6C/+449j2UUzlW3jsJOD8VmbOqwaCTtJf/kXX74z1lqZup7cizqrCYj+9oc7KhC98ptYUMhAHbaWBojYVsbis0Kzyz/55OryZKxkN5TiFNnpjJj08mg2jn3IDNqW2O51C63m9cOxfORUtWUF2jXDtIkMC2M5CHvRYx9fUW6PnRbnzu4LIBqtG+q/+FrYnMIAzs0gKjnBW2pVtorti03emq1iH9u4PIZlSy/qPZ78fRSOXSD6KDzFm7sOUwLRH/3779WPFx4JW8nB2BpjKD5cSEj5/BjqACI+NAOLJne1z+pfCESxdoovEiCKUIc/YbheFn5Zn31sVfnMo7fUbURoLD4D3fn27xQMv82mWZBrSPWr2LrDEhJaTV2kaibNEC2GauOjZ8vtsZeQ2Tlf4vAl2eGwD/kMNvuQ/bd7wgZG46vDsap9NJvnN3am85vn2/p2MleFrPPNfGT4NAtjNoavkuhaGsXNxnAVMDXc2f43c726vE3PFpgSiD7559+uNhQr4o/HNL4PF/octNXthPmPw57z1afWht1kYhh0kXbIoRkb0RZDM57JFYgMoRoQWzDnXPVD+vQjK+v2sqbu+eZciiBYKW87EbYsU+8+a2T2y3Dy1OkYOtkrKbQuQDS/vze2DZkT2lbsNR0+R7Qqex75RPbRWLrSbHUbmtDEJm8r44OPVvRXTSo0IXst1a++hmF+KleAizTHDb0MuC0dsbiTl+62bdvK9u3bqxc3FwGbcdkref369eXWW2+t4HRDGe4W/pFvgSmB6N4vf6Maf32EkLCbEfMJHR8/BERf+uyt1VZyKRqRWbP/+a23yy9fORjDpolZszD+NhrRWFkSH6j41MMryxMPhTd0eEUDIsOzTm/oD3oqwIjNyKLcl147WH4RZb3zXuyBU5ei+LKIPWEsi4hYCbNsx3KR+Fe3pg1QCoYaMAqtyJ7beOGLxGnTGjaa2nQEoGw3QGR1+a5du8rbb79dnn/++bJp06YKTLa02LBhQ7nvvvvKE088UR544IGPhMNc1r17vDlbYEoguuPpv6qcW/IQJtIQ3vxA4vzqLPh02HQ+F8Mp3yb7oGB6nIey5RIvhaOg6Xc0m21gY1+VMBrTOh7fuKx+auiu8IrmR7Qkvnl/KRpRlh0yFjaj2GAtvk/26luHoswDdTbMxxPtOz0Sy0Qq0FQQYmQWgZFgyjyGnhF5TnNFuDOm+R++t1lE23hnX99PTjd8XN+/gMgKbprQ66+/Xn70ox+Vn/70pxWcaEIbN24sjzzySHnyySfL448/3vXmvr6Po0s9WmBKIFr9uf8dwsnJTmq2obG6HzUnQWu5fj9mj54Ij+rJHATbLWyK3CZovgBryPRWbFBvPyJfz5g1MzZtDz8cn+mxNsx2Iva8NoV/Jb45hoE+Jb1jz2AYsMPPKIzYjNnvxJdGDh6NoZcPPlbQSQCKqgEmdqQI1qs1nz+KOoaXt2+YcYQ0TGQTuhwNrRK8yf54nrY63bp1a9myZUt55pln3geiNWvWlAcffLA8+uij5emnn+4C0U327D6q7EwJRCs//ZdN3avBN7ZCCCO19WB3xhat99+9tHzqER9KXFE/E/1BjaTzW7RqWYdN0X61eX91RrQ3tKGeWbd1t82vXsqGfFcCQJ3l2wHSVDzwMy3/XHyZ493djQ9TY4iGrhk6V/AvqcOwuu92LOi13e1kjpqZezodE4gMywDRD3/4w/eBiE3ooYceqkD01FNPdYFoOj3YaczrJQDR/2qq9z4QmWbvj1XnnAMXBxCtrN7Fl7O8AUC8EPYbG9ObKp8Xq+1Xr+yvQzNaliFaOxCcqYZn0gjtdPyDfKeM0+MvY/uSf3xhf2MvCsN143ndzADKY0jGH4jR3R5GHBUfjCGZPY3YqjodLBU3XTUjbeUrFIBo8+bNFYh+8pOf1D1uVq9eXYHoscce62pE7U7YPb+uLXBDgOjoiXN1yMTv59jxc2GD6I2hWH9ZHdt3EPxOn6RLAyLtdCFgWa3/ZmxsZirf2rFfBvBV/yI+TBMb/ucM2fjomdjYrD/8lxYWtiBGaT5DeJls2PlRAKJ33nnnAiAyi2ZoRiMCRF2N6LrKXpd4qwX+PwAAAP//N317KwAAMu1JREFU7d3nk11H1S7wnpFGGuVRztZIshzkKGfjJGPjhAGbFwzcl1wFVRTFJz5x/4j75X4BiksowgWMCSbYgI3lbMtJclSwLdnKOecJd/36qMXx8UTNyOKWT5e2zplz9u5evfZaTz9rde8+DZ1RUg9l6jU/r3zb0JgaGhrSkMbONH3yyDR/9ph0/oKJ6SOXTEmXnz8ljR3d1EMtKWnm6LGOtP/gsbR915H05rt70pr1e9O+/W1p+LDG1DJ2WK53QWtLmjNjTGoa2tBjfX35cuPWA+mVVbvS8hU749WxPW3afiT6MSTkaQ+hOlKK98q40UPSeWe2pIvPnZTOnDMutc4cnaZNGpkmjGtOI4YPScOaGlNj48Bl6ovcfT2np1vnXnVXXLdp06a0evXq9Morr6SHH344PfbYY2nnzp1p1qxZ6eKLL06XXnppuvHGG9MVV1yRRowY0V1V+b7WftlT29Xnnqz81XUM1vvBlqWn+sjcVx05t7aurq6tPac/bXR1reuVrtqqfDO4/zeEED0C0cwbfpkV0R5+G1JlIJoycUSAxehw3PHphstnpKsunhqO3DMQdXR0pnWb96c339mb3tm4L63bdDBt3XkoHTrcpto0emRTmjVtVLronIkBcOPTxJbmAKOTc/4Dh9oC7A4F2O1Ny17fmV5dvTO9HaC3advBtGf/sdTQWJG1s6MtQKYxTRrfHP0ZlS4+Z1JaGH0aM6opqeNgyEauKROa0+QJIwKUhqdxY4aFDrp38sG9Pd3X1tHRkY4cOZKOHj2a2trakr8ZzdChQ9OwYcPSyJEju73YLd+4cWN68803BwRE2tX+sWPHTsgwZMiQ1NzcnI/GxsZuZSCvaw8dOpT70R4G5lqyDx8+PI0aNarba0/mC33uzqnIcvDgwXTgwIHcD3KQochCp/0t7o06y/3RvnroptStnZ4KuRx0Q8feF9lqZdLe3r17c3vl/nt1vn5313dyFTsqbTiXjGRtaurZr3uSvz/f9QpErTf93wCiFGymPXV0NqTGhs40PtjLzKkVIPro1TPS9ZdNTy3hoD2V9gCiZ5dvTf98ckN6eeWOtG3X4QxCh4+2pWNtnZlxzJ89Nt1wxfR0zSXT0hnTRwW4hTKCjXRXKFGpVvKxto60dsP+tGrt7vRqsKEXX9+WVq7Zk3btDacNRhb3MkhQyNowNHW2H0qtAUCA7+y549IFZ09Is6aOSTt2H0qPP785mNSOaH9oOmdeSwaoM88Ym+bHMWrEew2zJyPvTvaBfs5pGN7+/fuzwTNWjs+AxowZkyZPnpzfd9UOeQcKRJyCDHv27MntM2YyaH/ChAn56MmIAZBrsbDdu3dnByqyjxs3Lk2ZMqVb+bvqU2+f9XSP9GPr1q1py5Yt6fDhw7ndsWPHZj22tLTk12ob60tb27dvT9u2bcv3iG7oi2Orz6H+nsCWvIDBtQ4yAjV1jB8/Po0ePfo9Ymjr3XffTfv27ct1T506Nb/SKdDqblDQX/p3nXuiTeeSz33UTlf3sSd9vkewPv7RKxCdc/tvE3c/fKQtDsbekEaGI04JhrBw/vh023Wz0k1Xz8xsoac229o704OPr0u/+vPq9HQA0sHDgQhRhEkNQ4YH2LWnyeM6023Xzs71LWgNY4w2sJP+FOHYq6t3pWVvCMV2ZDa0cdvhzIIwoECfaLQyUo8f2xQsaEK68sIpaf6csWnmlFB6sDBM6g//XJsef2FTAGQlZFt07uQAqvFx/sR0RrDBD5IVuekOjs4oGQ5D37VrVzZ0RoqdGP2Koc6cOTNNnz49G3sxwuJM6jrZ0IyhMlgAWJzNe47G4IGI8E77nEDxXemD6wGQa3fsiAEpHAgY6ZfzXT9x4sQ0Y8aMNG3atOwIZfQv/eiPPdSeSw7ycGqMhQPSJ2B26Fs1YBRQBe4+xzKqHbu6X/rGsfVv8+bNWcfq9lkBIvVNmjQpH8AWKKmztrjXBhrXO+iIvABi7ty5WT/04TN28M4776S33nor90f9zgFGBUgL+yJvuYfsxrXugzYKg3Ou+6AeoOe9/rs/hWHVyjvQv3sFokV33xdMqDMdPNSe8zvxNsAoZQZ03pkT0idvmpM+ceOcXhkRpnL/v95JP75vZXr+tZ0BPs1hoccgUeACg+1I40YeTTcHqH30qpmZocwIYGgZ0/QextNdh4VSW3cIx/akF17dnpavjHBs3d60efvBdORYCHw8HEsdR9LI5sbIR41Ic2eOTZeeNzEzISGY3JVrMKgXXtseOaz90VxnmjqpOXJiY9MFZ01Il50/OWRric8qIPlBABLjARxCqTVr1mQjZzwMnjFxYoYOaDgLYwcGra2t6Ywzzkhz5szJRlkcudR3MjkibTJ4crz99ttp3bp12YCNnIBPe+edd15asGBBzi2Ri0MxeKyDgxYnBUIcAJABUiOvehg+RgeIZs+enebPn59fe2IQXdmFfhbwLd8DGk6LPZCDDAVQ6ZQuAY22OF8BDvLoH+fmoMCSrtVXANU9AmaYlb4CD31TpwJw9M+1+kVH7pE6tVMNSMCLnO45WdeuXZvvN4C/4YYbso7VLce3YsWKfK72AZhzzj777Kw3bbj/pW4AXAYh99F78rtH+lI9oJX7QFZ1lMHN59WlKz1Xf9+X970C0XX/fX8SVu3dfzTt2Xc0wptAomAUktYL57eke26flz5z67xeGREg+tPD76T/87sV6aUVewIYhgU5ORwyhrHEe6+TWxoi5zQ9wrMZ6axgRLOnjc5hYK0x1XY8xMuJ7zfe2p1eCzb0wmvb0utvBdLv5qBRdaR0chsNTTkcmztzZLrigilp4YKWdFGEY5LjQreHnt6YHnxsXeST9qV9B47FTRXHBYhFUlsyfUEksS87b0o6/6zxOVybO2vM+8K0vii9v+cAm5deein9/e9/T08//XTasGFDHvmMYEY3+lC8FlbCaebGqCjxfP3116dFixadSDo7rxhjf5PVHOLRRx9NS5cuTa+++moGJDIAoIsuuihdeOGFOcF9/vnn5zwVh9IW0Fq+fHl67bXXslNxWI7K+IGV4j4DI8lxOS4Or56bb745XXvttRkICpjmC3r5r9ZOnA58JOafeeaZ7OTr16/PQFTAkCMrhV0CDiDBERcuXJjOPffcdNZZZ6Uzzzwzsw19AAQO+nAADo4NgDi+OvXNQX4AN2/evHTJJZdknQFudWIfpZDnxRdfzPfbPVIv0HTeF77whXTNNdcksv/5z39Ojz/++Ak2R3dkpTf34sorr8z3vuQMga66/vWvf+W6DSQFhIotkZHu3AsAfM455+S6LrjggiwzcKsuXem5+vu+vO8ViD7xrQcDJTvTzj1H0pYdB9OhI4AjHLqjPc2bNSqAaG6657a5OWfUU4OA6I8BRD+69420fNW+sLoKKESPKzmbcPbpk5oiLJuR80Rnx+zZ1EnyRD2HZpLgW4IJmRV76fUdGYCA0botByvgE6FYDsmycJ2RBB+eLlk4OV172dTMcM6KkGxCJMY3xPn3/X1NujeOt4JVVQBIXyMfFPmk1Hk0TWppyuEoJnhJMKlLz5uUZkwZ3KRqtQ4ZMSNhcE899VT605/+lB3IZwCnhAichjE434jmcwaJ+jP2j3/84xmMsKRyrlF71apV6eWXX+5y1uyyyy5LH/3oRzOolBALaDz33HPpr3/9a3ryySfz9ZyDwXImzqE9M25GZIyBrBxTOwDg+eefz/3BrIAU51Q/4yd7cQZ6UC+H+uQnP5luu+22PMILTYo81brqy3vtLVu2LD3wwAMZTDFCeijgoz3MgS4Lw1QvXbYGc6ETB5kAkrDHoKBPQOOFF17IYOszdaiLvgt4uj/6p7hWPQYIM5MAA7jRh0JvdPzQQw9lnRuIgBP29NnPfjZdffXVue2//OUv2SbUrWgTyAENA4N74n4AVMxHn8n5z3/+Mz377LP5M/KRU9vFPtxreqFrjMj9VN91112X6wNQg1l6BaKv/89H05FIKG/ZEVQxZrv2Hgh0F0pl4BiS7rppbrr7ltZ0djCY4cMqDlGUWS1oBqKH1gYjWpmWrdybQyXJ4qioUl+EZnOmDUt3f2xuuuOGMwLkRkcuqimS45UbU11XeX/wcHvaHDNhb0U49WKEUhLTEtXCscNxX3JSOgWjiRCweVh7JKJHJwnnixdWQES4NX3yqLgBKc+yLVm6OZLp6zOYrdt8IOqIL46ztdRxNA0d0pEmxszZvLjumkXT0o1XVZibsE7pQdQicr9eGQ4D5PwYCMPBLoyoHAGweM+BOLEwx4hnlDbyM06j16233poWL16cjUnuhbEKHVauXJkdp6vpe87hOq+KXIrzASJmRi5gAmywL+dhXpyrtbU1swjOSBZhnD64zmvJdXBGByYAPNVX5Ccf+dWtXvKrW5gmZOvKxrpTLgBSL0AEGNgAZ8TK6E2hS7rCwjgjwCAnPQIAeuP8Dk6pj5yUY2Mk+oVpCHcwWPVwYMAJyOiCDHSoXfJzZv35yEc+kj72sY9lUDJ4KPQNiP7xj39koMOK3F+yAQRgox3tkRFwFhY5N5gw+8BkAB2Aw84wUkxQXQYGgFlAVtjFltgGnZCVrZHDtT7XZ8BGB+Qmv2v6cy9y57r4r1cg+t7/WpqT1EBI7mT77qOV/E4A0cSxnemWa2YHcMxO58bM0vhxlTU3Xa23AUR/WfJu+snvV8bs2bYMEp1yRFEkqwHb/FnD0xc/eWa6++bWWMPTO9NYEyHU6xGOvRps6MXXt6fX3tyZ8zwBbbm+zGYASbQza8rwdOVFk/PyAFP01kFhXGUmfv/BtrT6nT05ub38je3p2Ze3pVXv7AvZYg1NXJ9lDeNRJLmvu3RaBswLI7STVB/RHAxlSOX7fNIg/Cc/cO+996a//e1vOaSRZ1GEW3fccUcemRguIOJsRndOL0xgcJxEWMHQjWSMEl3nJADi9ddfzwyhKyAyQt9+++25DSMjwwWGQsMnnngih1dyBZzS6KsNBwfhLAoDBqZyHa7FRDASxs9JOAhnBSyACPiU3JMQDnAAOk6FaWEj2hAi9cf4yUB+4OkAQkJF8skFaV/9V111VXY2AOM7zkgO8gNLDkgvQh8AqvheqArg1kbY6hr3o+gFkAIjOvR9Aa3CxDiyPn3qU5/Kr3RCJiDjHmIuZAZgmLF69B3DoUev6nCUnA753AfgWmR1Lf0/+OCDue8Yl36SU9gL3LAtdRoAhGwYMxsCYGTXFnZFXnZkYFB/YXxZISf5X69A9L9/8VokqtvSird3RW5nR6zFiQWBEs0R8owd2ZEdcvGVM2IK3NR3LACMMKerBK5Zs78/sS7d+8Ca9MzyLWn3Pgm8BnzoRH2t04el/7plbvr44kiwRt7GIkJKLw4uDFPUtS3WIL32ZsgkHIvXFWt2BxsK4BgawBGgloEjXoGicOyCsyamay+dGkA0IdjW2LwuyAxZKab2d+w+nNYHE3p19Y70xAtbMrhZZtAWINoZSxcwLGFpR9vBdOnCCemmSKovihBNfRY/9rTUoLTT11cjKPbxk5/8JN1///05P+BaDiBkuueee7JBACKOD4g4HINhuMIn16uHsXE0BmSRIiPFPozgzq0FIkbJ4G666aZsbM5VFycqeR4jJQaBrWBD6meYgKMUzmwUN7JqC4AxbI5ZEtqAqPSBEwMIzq0tzl1YkfMBAQAGBv0BIiM/FrRkyZIsP6fGcshqZAeKQE4/OJbPCxABa+AIHOhFHzEBDEHRH2yI0wIXIQ1mIpfjXCAHIACIgUWoJUQ1WJSBhVPffffdWZdA1jXYWAEi4E1m/aCPUrA09xYDMuAACoDpcwCoXQCF4WjvD3/4QwYjenauvJ77jI3pv3YLCOsLed1v4OXeaZuu6Onyyy/PAEb2DwSI/hDh1L4DR2M6fEdeW7NuS8T1AUTyLqOa29OimM6+6qKpJxK4s6d3PbXdFonfp17akh54bF2ekdqw5UAGo7b2ABuspbMtTR4/NOqaEgskp+TEsGS1xYZCH2QEq5Iw37jtUE5Ov7JyV6xJ2p4BaOvOWJd0JGaO1GW1dADlsCHHYoX0mKgrZryCuVyyMFZNR2hmsaQwsroAOWC0N/oqvFsWrEifzcK9u3F/2rUvFl4CYOB5fP0RNlSpN2beAujGja4YZ3W9/X3PYN1w7IDz//KXv8xAAWgwGYYKIBguJlJbOBBw+e1vf5vBiEFxLA4GhD73uc9lZsQRsYQSqhjVsSTAwLg4PuN0HeoPrIQK2AEH4pho+l133ZUBwnWFJRSZOAC5gZb+uFYbHJWjGIE5DmcBLFiAthg/p+EAruX0QA+rkx8RpvXH+AEJZimfAhALAABkoM6xOBjH5NAYjdCMPOQms884KtDU99I+8AcQnLs6r+K8AkIlUUwOAMup6V2I5F7rG4ClT6yVXO6jULyEwYBEO3SqffpjC8DZK9AxIAGSAkDuQ7VOJba1LYwr4FsABeusLe6de/GLX/wi648tsUG2gT3KPRrcCgOuvb4/f/fKiJ5/dVusRj6ann5pa3og1gG9te7AcSCKxVVNHRUnDye8IGaSLj1vcjo3ZtKqmUYRxsyb9T1PvbQ5vRyPXLzx9u6cczqUiVHklgDbiIY8UyZ3YxGhVdbejx83LK/nOXjoWFofSWUzYivf3pNDsVVrI1yMafeMVMGAAoni3/AMRNMmBbDFGqHLLojM/7xxUde4NDVWhXcVOhY5vWJGwr4VEYoui7xTDtPW7g22ZclBUON0LK+wnhZT+OfOG5/XPS2OhZhAc6DFzZcAxmyEQRLUwho3m/EwVA5pJonjdFXQcI7HmcvIi4Xccsst6Vvf+lYeeTmNkZZDFEbEqeQKGDZnECZwTCGScyRlyQfYfC90A2yMubuCkTF8AOvwnhMLxfSpOHS5HkCSCwADUyCgGOVNW3/pS1/Kuava68r1Xb3SwY9//OOsE3otBZv74he/mAEaaAA8gAMUyVl9+EybtTI7Bzh41VfnOZzn8L4U+hUWYlAl58e56dIgwbnpkv7pqgCRazAzuSUyGhyAAQB1nQFJSEUO1wEjBQgBP9eqwz0ELGwBgOl/CdcNCl0VQEx3P/3pTzP7U3dra2sGIIMCO9TPgZZegcgCQTNmjyzdlGeVVqyJGa9GDnkkNQ1pD8cemUxjYwQ3XDE1XR7T4iMjX1JbrEXCLFYEAFnx/FwA3LIV2wPk4swAj85IBjfFZWbJJo23xmdMXq8zJ149VuHZMwsqN0Zy+s0AH2HY2qhvfTw2kuUJeEidcjnBhCKkA17yVlZpm+FS3+QJI/N31bKFWFEqBlQ+x46A0bubDqSlr2xNDz21PrM4yetsbKk9wsXGLJdlBkLJO+MQng20MB7OwnkYomQl4+G4gMHIhfLLE2EhjMDoqRgpGb7rGd2SJUtyyAB0FMnn7373u5mKAxQOz0CFLUZqAIihzA2qb0R3MHChFefxSo4CiNiEOo3OpdCPUu2A5bvqV46rrxiBQx98RtY33ngj/fGPf8yMTminAERO97WvfS0DYH+ACNj+4Ac/yMBW6uPQWMg3vvGN7Ez+7k8poNPdNRgVHZdZMv2jP/dV6En3gJ2jAxZ5GsACjISA6q8GIkzO9UIqwIOtOheYGDy6KtrEutTjPmPYQjx1ACBhGZvSPqbj3pJX284BygYhg6H0AEamaI+8QNxg9IEAEQDZEXkSbOgX97+ZXl5lxituWgBRQzikEGdShDrYC4e88crpkcytIHK1ctgnZrUlZrRWBbt46KkNsW5nfdqxN/I0MCTWFMU4lIHCbJkwx7NdHqZtHmaJeiU35KFZwJjXNcVzYwciydwwJEaxkCkbR8fBHH6dG6u+z4t1Qos8xBrhGHADULWlJ4MCRhjhXyPJ/mSElWbjLGWolMaoryEBortunhO5rXkxlT9wIJJEZKwFJIRDHJOTCmEshuOUjgI8RkGF4XBQOR1hECPiDKVgUt/73vey8TBSIRwDBViAyOgMQICRcMLox8jIJGRSGC5mxRABohxLCT1KO3SqdAdG5CWbEV6YpP4yOwOcMDpyCR0LiHKUxRGSffWrX+0XEOmnXMuPfvSjzBDVr6gPEH3961/PTCt/2I//urMb+gZ2DvdB37A8r4CeM0sEy4XJL/kOwwAqwEWoAyToDoAIT4su3AP337nCOHk5A1J3bEaeCfNyb91r+jRI0b88l+uwI6CD5WqTnSmA2b3XB/kvzKoU1wLAL3/5yzk8+0CASONyM397LIDoT6uzQ3Z0xnNakdOJ/8LagmYP6cwPwFplfes1s+I5sdHhpGhpEd2pQdHj9MMx5b4m2IyFg/c/8k6eiSs5ncrZ2Mn7jZiSioFX7Lxi7Pl9DsdiCj3+mNTSmHNW8kz9Ccf+Lel73y2LBP39sf7pkaUbciLbCm5+b0aus7M9mNbo9Nlb56bPf3x+rKXqfabvvbW//y8GzGAYH+MxajKEAjbliu6c3PdFT+Xc8motDkaETlczIslTRwGbcn5Xryi9cAwbwsiAIQDsSyEX5+CIRmZOIbdSHNZ3gEI4BozII9xQOA0gYvz60Rsj0paDPjn0TyO0kCMpwIYFGM3Vp0+DUfQFa8FyAGz1QQ79cvgc6Jf+zQ0GKiTDUArA6F8BIjbAJlxDD5ghXQjP5Je6AyLgJ7zHeLFqdkSvhaWVPvfVlpyHIWPABqLPf/7zmV1/YEBE4Mee35Sfv5IvwQzkazpTgE2jxY3HIrczIs+gXR8roz1A6qHY7hYjYkVLX9keye9NeeZL4hr7ONomvo54MyNYsJfjr/kFbYoWK04WqB1G5m9JaczM82+YmWfUTNNjQpVw7P1MSB1dKb9St2b/jaCm9D139vAzGyK0jBXXwcCOxeryvOQgJJgyviF94Y4z05c+tSDvHhAfDagwWEbD+AoQmb0ARIwAKzJ6eV/yGeQusmucYRjRHCXcARiMB4gYSUuyWhsS1UbNAkTqd21hWJzX+Yqw4BOf+EQeEc0MMUrnd1XILOwCMPrFUbWBDRlhvQeIZHduOR8wYUsc72SBSL8dHL8AkWQ1eRRMDiMCRJjIyRZ9k/sBPvqFiZbENYfHyBz6WZiR/jlH//QZEJHBfXGPAFItELEJbdC3yQpgBIjklzCUrgogEo4BIgwb+NMrnZpYcLjPQrJaYC82xZbYgXtc7AJjZgcGIwBae21XsvT2Wa85olKBfX2eeHFTni5fGVPl70R+Ji/4i1XH8jv28xECeRB2USStrwowkGjuqhwKVmSVtjyPdUDPLNsaIdDWtGOPxZLHR9cTYFBhPgEPNVX5PMAqEtTDh8a0YuSDzGLlJ+UjYd4az5GZHesqHKup6MSfGdtq8kUegP39P9acACLrjTzm0jB0ZAascSOPpf++88z01bvPSmYMB1oYqRyCvAZWZERD4RmEUZzRei1xvc8ZFqdjPEDUwbh85zMOwZhaW1vzjJjcD+cR8jHwRx55JAMRQxeOMXbGJgwAeOVcI7mQUOhQwgihhDCnq8L5AAGWoA9GdWEnZ/A5uQAreYQIBdDooDzPVoCjv4yIPjg5mXsCoq985SvZ8buSvy+fAR/3SS6msDzyc3B9ErYaBOhVf31HJroWpvnMfalmRF0BUWFEkuoAoAARQKW/ropwV1hqoCmhmTbpXFgtKU6vAMl9Zi/FjtiNAmR8XuyJbemL64Tp1ipVD9xdydGXz/oERJK3WMvKSBJbu/N8sBmrmHfsCdocDAYjikgsJ2/lSSSsb79+drr64qkn1gBVC1NB2xTbgLTnRYSSwQ8/szE/cCr0EcJ5zqviVNVXIkIVBfnOWzN09jEy7X/1oimRs2kJdjYq56l6mx17b81d/1UdmnkM5EAwQdFCnkELIJwwui39jzsXpK/ctWBQgMgohkIzbAniJZG/YeAMheGYWi+JRgYMYIy4DKi2FF15pS+5gDLFbjQu7RgxhWZGaUBjlBV2eQVIgMO0r4SpwgglrD8W608sxCNXV0VfMB+AB1jlu4Csz8nNIRgycFUnx2X0gA9A0kEJpXwvHOkuNCt9LU7hb0dPoZkQDxCdbGimfjkYC04NGO4T0AUuwMH9IXcBWgMGAKZ7gLA2QlP9c15fgUh9QKgAETDwWVcFAyt694pla9PAgXk5hHZlUHNPyqBWW1/RLzujY2Dk/tXmB2uv6+vffQKi0PfxnRUP53U1S5ZuTP96Jh5kjCnuBowowiPMhONLMF949sRYcT0zz1jJm9Tu31MtnJDMDoovxcpoLEsiet/BozkJbWMy+akKKAUyBwEaEv9hOeq0c2LL2OZIEo+IxPSEvHRgZiyqtI9R7RICiixGWt1+d++1uz2S9B6gfeCx9XkRpmfaJKtzXTlH1JFzRPfcNi997o55g5IjkiNB7zlvyRFwSCOsGTMgJOmMnjOgkynkBy5CPuBihg0QAQBGrR0L5YzMAMmob4EkMDKaM1gzJ5wBEJntwZ58Xl2M+kZk4YHQwKguHLPORRucSD1GeQAJKBU5JDIZyY3qCrlM3wOO2hwR5+DQXgG20bsUIA0kJKt///vfnwA2zijpbuZHvf11KA4LdOjNjJJBg/4UfaE/rIP+tIXtubf6BpwNAqbV6dMyDDrEMuWIemJE/QEiYWOZugdEwm+MlJ4Lo9WWo7ulIEWP5ZXtOBT+1B+fKnV09donICoXYkZ2WfzHk+vzk/TYkee9pGpCovjXGI9MtEeINi4zlMvz+p2YDo7nxsrzWKWu8moRoQWTAMhq6U2xWHHjtgNpWzzb5ul5CwyPxTlRfRhYY14aIPdkC1fbc3jo9N+7J8bOfiMiph363kR5aauvr0DoxDNssXL70QDe5bGZW/X0PUAcG3slnRX5sDsX2wplcKbvORQHFppwIFOnjFxpjZHTLIlkswdBGfnJlJ6AyHqdwrq0AzAA4+9+97u8KteIysCFG4zZ9L2VzkIEIR3ALMW55McYACsmACTkQsjP6bAFAIYJuVYo5tzf/OY3eZYLg1B6AiI6MyOFiQDEwvqKHEKn73//+3n6HhtTtAVIJVwxLf2ulr1c29WrkA+gCjeFtUCazFiCewSE6MTBwTk+4CKj8wAyYMCm1AOMzYRhRYMJREJjg4g2sSGPi3h1/7FdgxpWBNjl+05n6RcQERRwPPLshvTnR97NOxhiCabU2zssJPSUeluaMLayq+EFwVIujGl9U/tWOJdHNbrrsEWPG7bsz2C3ZXs4ZKyW3rXH1iMVIMKERofzt4wZHquwh0dINjpPmduiI2Cwu2r7/bl9jTwyYgHmKysrz7FZbV2eibOg0bIC64asVbIx3I3xmMtgLGjkiFiA2Q1AdN999+WRzMguKSkk4kAcGShxYIbFORTvOSSwcI0YH0swInMUI5hzSt4G2yqMiNMLldTLMe688868pgUwAhQO53zGzbEYs7AGIDFqDAAQlMJRf/azn+WFhN5rF50HcKbNhXZkKgWjkUMRlv3qV7/Kfa8GIoCBEQG/kiDVT2EOmTgewMIUyVHOETJ5VMYiT9PmpWAC+sgZhYeYC/lcR5/uhfoBHT0LHYGm+0N/WI2wVhIcWGN6JWx2j9Trs1IAcQmRDC6OUwlE7ABLIxswJieWqU/kAj7YtdXx7ndhtLW2pP90q7Alh3Pp6QNjRIyntjGLEi1I5KQWJVoXdPiY1ZURO8WiwqZ4Sn1y7PPsEQ37Wl9m759IIE+P/FFvj0Ecip0gd0a4tnvfsVgrFPv+BuPCUMgAyCphWVMAQWWdkVBwsAog3BXM7K11+9LSl7fkxLxk9aZgaCd2HeDIseZpxuTmSIyPz9vMWipgaxFb6A60cEaGUJKsmIHnk4CBEZujMXbrODg+cAIymEYJUeRFhF5GYHpjdM4r+RjO5js0ndPXApH6GaZZJaAEdDiNHE8JtTgieTAhDIrjSaLKOZQCAH74wx/mRwTIrwAe58n1eOX86ufczhG2YAxk0h4nUPTb+RY0AjL9cm5Zj4NBcjD9BJCARe4KIJG1AKm6gZaCjWEt+gjgXUceMnJielS/QYHTYU3k4ITuEWBZEjk8K9idQx90AeDI6B5pgw85F3AJUzEhuic/BwecQjPXDSYjYg/6AcwBEVuyhAHYl/5rE7BjY3SnD3RbBjM6APTujc/phx70iy7kEH0+0NJvRhQ6zQzIrNcbb+3JD7I+8uzGSFxXkqX5YdM885TyNq82EzOVjhV56t0CwJ5msoCBUMyDrZ5Pkx9yI5WCwB6qHRorra1utuJ6MBShfvkqzMcWs48/vyV2ktwauz7a5jPHnpUZvcbKPkpnt47NM4MXxob79rw2Y9hd+KnukylGTyGRRW0cTVgBcIRAHAcItEYowDDkOBgPAON4cgNrIzSiGzkYTsboOIdrGJjEsdmUWiDimAwTY/GqTcYLWIrjcSaGrnB6zx195jOfyW2UXA/Hs6L55z//eQY+55KH02F0wI7xK6V+wMhJtSWfUu49o5cXsxJaTof8gApAYmmukZyVbJd7Mr1c5Mds5NuwAaGJowAjcKYbU+GuoUvATpfAXD+BF9ujc6Gqa8gDQOXNPIqC8Sl0oa7CiPQPyJYQiczuq7oL83Af3Rsh62ACURbo+H/64D4AI3otRd8x2pLPAtyA2ABg8gIIsROgSQelf2XixPU+H2jpNxCVBtsDKLCFB59Ylx54dF1aHQ+HWuWcGZQQLRzW9hkTx0WYFnkUyWRbrXLa2dPHxLYZlTxOT/sNlbZO9avQb+ce+y0dCHYnHIsp35e3RngWz5flLW2jX9GX8KIsSsuYoQGuE5M1U3YdsF7JL5vUPkg7ULkZr7ie8wMWf3NYwMDhjEpG05KHEIoBInQfCBil0WjGw9BMtRupGb56JKo5BSDipJybIwIixsnxgQbHVNQtOcvx5EYAXinO/fSnP50ZBmcFjNgE4//1r3+dgaKcq31hC5mMqMKekqTn0BxF3UZyfVKMxGT/5je/mYEIw/D4C3kACzACjJwIYJBfyAEQyALIy7osSVvnAy4MgAzAi3MB7QJE9KhuORZ1AArALKQpDih85tzO0z453Q/tAxd165u69EtdJgkAYembgUG9teuIsE+DkLoBNBYL2DBD/aK/nmbNir690qcwHzMkg5ANkGLL5AWuclUAls2QWXsAE8iTnQ6ANZtgI+TFgE8rEOkcBvHcK9vyU/V2SARMW3ceTY2xFUceyfJmYu3553gkla0r8pth82IvIM+nCd36uzm+dgezSJJv3Howz9itjJBTbsgDr+9u2hePpETeJe+nHS0e3xhtUuSmrFG6LNZKWS5gJ8nxER7aAgRTG8yCAWEGQAhomHlixIzIiIVdMHTGyXmqcxqu5RgFWBiNQ9gFwIx2BYg84Q2MjNDyIM4TsphVkgNimIrvAZfzAQDHVo/CoJ3LSAEGQyUDIJVb4khkLwwHGDF8dQMihz4AWX0zEjsAJqfgBMDuO9/5Tq5fuwVAq5cWkMWzWiXHhT0JRdWJIWIGgEioIneiHuyH/Jimc8mir0I9gKF9jopNAnPJaBMF9AuIADOmoy79I6u+cXD1qs+5XvVPe2Shv9I2JkTn5AVKnFsYJ5TCyuhdGEdfmB4d6ydQBJ69FaxMHRgkYAH49OvzIpu+syfgrC3f6bt7ALT0Sf8NIkDbPdT2YEQkJ82IdNw+RRvioVhPwOdtQuJXL16K3xFrbBqVGYSFjnFnQqmVX/6YEM+gyRMBpMsvnBz7Rk8+nsQeOLXr7UZ09b3lAavjd9Ykpd+IGUAbqwFT4NQWeamgQBGOWektCX8sEuRNwe5aMrtbFLs8YkV2fdS/U1E4A4MAPMCIYXIgbAc7AjylMIbi5IyYURndsBPGY3RmOICJoWEURkbOAFgkXTmFGSdABFAYfDUQaQvLYdDk4IRCHjIqQAzQWb0tCcwh0foitxEeSyuFU5Kbg2J48itGXIAEJDgLJgEMnMNJv/3tb2eA5CTaVzc255X8HInsnHnx4sXZuUuoSF+YEcfGMsgG6LGFortqPcoF6QOWg30AQrrEMMlbQj4P6AJDuinArI/qKs4N/F2nj+6L+ym3BJDIJ2lM18CuAJH+STDTsfsEGM1WAiGHuvoKRHSD8dInvRrUsEKDA1syaJRC12yvFG2SH/hgYkBTX9xv90o/B1oGBETyOTaZ3xr5IlP5j8YT+k/HKmk/ZOh30KR28kxaTOtbZ+RxDMllCxAvsV1r/CKGTcXMenli32+IyR9JSpuqHwyGEQNRJLttPxEzS3EIw8gGhMyO5V0ZV+3O66OA0Obtlf2WyJrDsehEQ/yWmx0A5LtsdWIPIuGmbUWEmB9EEaNzfiM6IPJ3Nb3nSA5GxLCxJKO20RuwlLDDd84DbpyAIwIII6WRr4CXPIcRmrELd0oRLmmbDAWQGLIwg8FyDI+AmBIGCpwc4HG8EuYI8YzCxYABI0Mnp4Pzuq70UT/JDORsCMdhgR8goQ/10g1Hw1zITH7nlzCxyK+PZHGUXBRw9DlgMfI7avWoHiwLCwHmpdADdkgXgIjc+gc0FEBWfS+EbGQEAECG/PIy+k3ucq8MJoW9Ya7uE5BTF6B1b4RlZYawyNPbK2aov+p0kB8wkdt32nVf3B/v2Qv5sCE60C62y04AdbmHvbXb2/cDAiKVc27T9+s2xUZbEZ4tj83EhDdvhVNv2xXbyubQJhCJY8fRFOTCOiBT355HsxhxeoRtfsa6+hdV/WCj7VcHWo4cjc3OYvbNoxnk9Gsdm2NpwIbYidEWJ4BH4t3iRUwo/ziAH2CM5+gsRUgdh7Nslh/knxOyNipYkZyQGcBBGAz61EUMAJU2ojFIxm4Uk+fglEYwhsOpAQJmU/JIHIcBMyosROEo6gBI4n+5APU4BwMADByGwZVrXOccDu8615DJ30Zc5zFaORqAxAlRe/LKNzgXE3O+z8nsGm2SV3sMHvDpF9BznveASOiEmQBYYKFO+sCegCFH0mf1CBkc+sJhSiGn64AbuRzaAUTaAUacq+hRaKUOeij10m8pdKh9fSt1lZBGW/pCJ64nD9nVSX8AmvzCLffIOfpI92TwnX4VWelC20VP6lUXPfe10CO7Uaf63Q+vdODe0qvClgoj1Aa91urAOYNVBgxERRBbfGBCNrJfFosA7cbop57z82ixvUdYUj4VuygoyolNedsW1iJIP2PdGrmjWbEa26MiA00Am3nzgK2ZL8nonbEmiYxCSUsQTMtXnqavzNK5SVnMYHCVXSPbQ77GvPTgwrPN/E3Is392FxgMtlZ015dXIxTHdVTkrPxqB+dh+Iye4aDKjL+8cnSjO6Oh96J7dVTXyQB95jyHa8q11fLVXkce9ZTiOnK4VlvOL+c4Tztk5gxYFCcEQl5dU4y7tOMa75Xquv3tO/0GQIBVO/rOWQGJ86v77JpaefytDjokk/fkKPorr/qkvqIfdSlk0K7r9IczeyVTqUsIw5nJVvpXZHdt0bf6y6Fu39GXV+c7yrlFV/4u99Q1vRX9dahL3YCXzEVusvte/eSttqXudNBbm335ftCAiPB7I0zj+HY29COHflo6P1kfTGN/fOe5tIrSAkljZq0h/rYmp2VMY946pACQPJIN1yZPiG0vx8RTv8M4BycqXaq8BwZDIoxTgM6xCLlCv7lYe2RVtt0bt+2M0T9AyDaz9qCWjPZ4yoFDYkehFUOPI9+kMIwAS8lnD81aFX7BgomRF4qlBzkciwcZa5iavvfHGCoSDt7/DJ5RMR7GMthF/5TB7CPn4gQcfTDr7arvfZW/P3rs7Z67H+oDFJz5VJfe5OlL++pwT4DUqbKl7uQYNCDSADDAMLbvijg0Qp816/fmbWEtfsRCKns+x4kZUQBIGHhMi/uZHmGOdThm0TxHNmZU5e/RI4O6H/98eICDS4ENAJKfGTE8NrMPBdqWZG8AjQWQfv5ISCYUK4fdHeWHyLcnNu7ftfdotB5hSgYi0kfFclmxZe3I5o6YDRsbz65VwMcaIazNoyQe6zhVyWlSnGwZDEPsrm11K4MNGKdS5uq+9Ef+wZRpMOuq7s+pfn865B5UICoKKuzEIxpLYz3O32Kd0XO2+ci/vBpGzeGVbODFyCsflf8lqy1YbB4Wv8Mdj3T4JQ6gBIisYQJEBawobneAkOUEdm4ENoDncIDR0QAl8lQr1/vjvhXNAaA4fBCv0WQk0OMnXhbFqtuLp+YZvvzrJOOa/yMBqOir/lrXwP/PGjglQFQUgoHIxTy9bEv+JVazVHJJQiSAYcbtqIgtT5EHAmSAOg5Sx0MlCWMP0raMianU5sqveUR+PAOGzdB8hhGpa8++2HwqktJACNs5UW+qqTPnrCL3EOxnRHNMdQfLGT0SA4tka4RjclV+hNHjKTMjkW6dUO3Cy2pgK/2tv9Y1UNfAyWnglAIRkgF4zEjZ1XFj7Odjs3vbfZgqF7rtyD/YGLNUOUQKZpJLSW5HBTHtb7ZtaKRyyqMhx8lL3uqj8iBtQ+zuGCFZABD20xG/QRZJqCA4wM37OMprpYFcr323p0+OnxOOGbGcKI/XMwKEfDYlclSWGggTh9lsqV7qGqhr4JRp4JQCUa3UwOjtmFWzdsdjFNYerY8N17AZyWUhl1KJlCrvgQj2USkFqI7/+b6Xct7xszP4vP8zuQ77FZmxs8rbro62tz13vh9fHJ1/JLKWAb2vqfoHdQ3UNTBoGvhAgciaI7NqdjrEivy8EHCyfmd/bIYGkOR37Nx4OHI7RyPHcyRmwiSeg/AEQEkuC7O6YTjH1ypZs+ShWExmeMy4eQbML4F4b8ZL8tvT+7btmBEbqWFDthSxs+Ng/CTQoN2dekV1DXxINPCBAhFmI3/jF1kPH6mAzt74SSCzbKbVt8ZCQ8C0LabcLTw8ELNe+w605XySEM+eR6khpqcDjHLYdfwmZcYU4COfJO/TPPw44OTcT/w0USyOHB8J75b4zXo/KzQtQi8LKL03CyY35CeMhGGD/eDqh8SO6t2sa2BAGvhAgag7SU2lY0pAaEM8gLopDgsQK0nteEYmktu74xw7OR45WskDYVclZLOeSKjVFI+HjIjHRKzIHj1ySCShrUNqihAsZt1i1mtSrEuySNL2tdYsebRkSKzzqJe6BuoaOL0a+I8AopLUtr5HmAZ4hGmH4nkwDEq4ZkGkEK08N2amrKSOPHM6JObdbREreZ3DsVhzZJ3RyOZ4ji22jzUzNiZmxuysOCF+BdZMWB2ETq/x1Vuva6Bo4D8EiGyCFkckrPMapJy4juR1sJ6OOCSx8/vIO/u7MKGcKzLNH0UCWm5aktmCwwo4VT6zHglQWXvkfeXBWuFdUUP9ta6BugZOpwb+I4DodCqg3nZdA3UNnH4N1IHo9N+DugR1DXzoNVAHog+9CdQVUNfA6ddAHYhO/z2oS1DXwIdeA3Ug+tCbQF0BdQ2cfg3Ugej034O6BHUNfOg1UAeiD70J1BVQ18Dp18D/Aza6TYmS4tNYAAAAAElFTkSuQmCC"
                                        className="w-72"
                                    />
                                )}
                            </div>

                            {attachment_image && (
                                <div>
                                    <img
                                        src={attachment_image}
                                        className="max-w-200 h-120 object-fit-contain"
                                    />
                                </div>
                            )}

                            <div className="flex items-end flex-col">
                                {show_signature && (
                                    <img
                                        src={docProfile?.profile?.professional?.signature}
                                        className="max-w-92 h-60 object-fit-contain"
                                    />
                                )}
                                {show_name_in_signature && (
                                    <p
                                        className="bold"
                                        style={{
                                            color: footer_doctor_name_color,
                                        }}
                                    >
                                        Dr. {docProfile?.profile?.personal?.name?.f || ''}{' '}
                                        {docProfile?.profile?.personal?.name?.l || ''}
                                    </p>
                                )}
                                {show_signature_text && (
                                    <span className="whitespace-preline text-right">
                                        {docProfile?.profile?.professional?.signature_text || ''}
                                    </span>
                                )}
                            </div>
                        </div>
                        {show_approval_details ? (
                            <div
                                className="flex justify-between items-center text-9 text-darwin-neutral-900"
                                style={{ marginTop: 2, marginBottom: 2 }}
                            >
                                <span>
                                    PRESCRIPTION AUTHORIZED BY{' '}
                                    {(d.actor?.name || '-').toUpperCase()} ON{' '}
                                    {moment(
                                        formatDateInTimeZone({
                                            timeZone: d?.timeZone || 'Asia/Calcutta',
                                        }),
                                    ).format('DD MMM YYYY hh:mm a') || ''}{' '}
                                    {timeZoneInfo}
                                </span>
                                <span>
                                    (THIS IS A COMPUTER GENERATED REPORT. SIGNATURE IS NOT
                                    REQUIRED.)
                                </span>
                            </div>
                        ) : null}
                    </>
                )}

                {isHideFooterImage ? null : footer_img && <img src={footer_img} width={'100%'} />}
            </div>
            {rxLocalConfig?.footer_border && (
                <div className="border-b border-darwin-neutral-500"></div>
            )}
        </>
    );
};

export const getHeaderHtml = (
    docProfile: DoctorProfile,
    ptFormFields?: DFormEntity[],
    render_pdf_config?: TemplateConfig,
    rxLocalConfig?: LocalTemplateConfig,
    activeClinic?: string,
    d?: RenderPdfPrescription,
    config?: TemplateV2,
): JSX.Element => {
    const clinic =
        docProfile?.profile?.professional?.clinics?.find((clinic) => clinic._id === activeClinic) ||
        docProfile?.profile?.professional?.clinics?.[0];

    return (
        <>
            {render_pdf_config?.header_img === 'no-header' &&
            render_pdf_config?.floating_patient_details ? (
                <div
                    style={{
                        display: 'flex !important',
                        flexDirection: 'column',
                        justifyContent: 'flex-end !important',
                        // border: '1px solid black',
                        marginTop: render_pdf_config?.header_top_margin,
                        // marginBottom: render_pdf_config?.header_bottom_margin,
                        marginLeft: render_pdf_config?.header_left_margin,
                        marginRight: render_pdf_config?.header_right_margin,
                        border:
                            rxLocalConfig?.header_border && render_pdf_config?.header_img
                                ? '1px solid black'
                                : '',
                        height: render_pdf_config?.header_height || 'auto',
                    }}
                >
                    {rxLocalConfig?.header_border && (
                        <div className="border-b border-darwin-neutral-500"></div>
                    )}
                    <div
                        id={HEADER_CONTAINER}
                        className="flex space-x-4 px-12 pt-8 pb-4 flex justify-between border-b header-bottom-border"
                    >
                        <div className="w-60p flex items-start space-x-32">
                            <img
                                src="data:image/png;base64,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"
                                className="w-64 py-4"
                            />

                            <div className="space-y-6 text-left">
                                <p className="body-1 text-docM-purple-400 bold">
                                    Dr. {docProfile?.profile?.personal?.name?.f || ''}{' '}
                                    {docProfile?.profile?.personal?.name?.l || ''}
                                </p>
                                <div>
                                    <p className="whitespace-preline body-1 text-docM-purple-400">
                                        {docProfile?.profile?.professional?.header_text || ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-40p text-right">
                            <p className="body-1 text-docM-purple-400 bold">{clinic?.name || ''}</p>
                            <p className="body-1 text-docM-purple-400">
                                {clinic?.address?.line1 || ''}
                            </p>
                        </div>
                    </div>
                    <div
                    // style={{
                    //     marginLeft: render_pdf_config?.header_left_margin,
                    //     marginRight: render_pdf_config?.header_right_margin,
                    // }}
                    >
                        {render_pdf_config?.floating_patient_details &&
                            config &&
                            d &&
                            getRepitivePtDetails(d, config, ptFormFields)}
                        {rxLocalConfig?.header_border && (
                            <div className="border-b border-darwin-neutral-500"></div>
                        )}
                    </div>
                </div>
            ) : (
                <div style={{ height: render_pdf_config?.header_height || 'auto' }}>
                    {rxLocalConfig?.header_border && (
                        <div className="border-b border-darwin-neutral-500"></div>
                    )}
                    <div
                        style={{
                            marginTop: render_pdf_config?.header_top_margin,
                            // marginBottom: render_pdf_config?.header_bottom_margin,
                            marginLeft: render_pdf_config?.header_left_margin,
                            marginRight: render_pdf_config?.header_right_margin,
                            border: rxLocalConfig?.header_border ? '1px solid black' : '',
                        }}
                        id={HEADER_CONTAINER}
                        className="flex space-x-4 px-12 pt-8 pb-4 flex justify-between border-b header-bottom-border"
                    >
                        <div className="w-60p flex items-start space-x-32">
                            <img
                                src="data:image/png;base64,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"
                                className="w-64 py-4"
                            />

                            <div className="space-y-6 text-left">
                                <p className="body-1 text-docM-purple-400 bold">
                                    Dr. {docProfile?.profile?.personal?.name?.f || ''}{' '}
                                    {docProfile?.profile?.personal?.name?.l || ''}
                                </p>
                                <div>
                                    <p className="whitespace-preline body-1 text-docM-purple-400">
                                        {docProfile?.profile?.professional?.header_text || ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-40p text-right">
                            <p className="body-1 text-docM-purple-400 bold">{clinic?.name || ''}</p>
                            <p className="body-1 text-docM-purple-400">
                                {clinic?.address?.line1 || ''}
                            </p>
                        </div>
                    </div>
                    <div
                    // style={{
                    //     marginLeft: render_pdf_config?.header_left_margin,
                    //     marginRight: render_pdf_config?.header_right_margin,
                    // }}
                    >
                        {render_pdf_config?.floating_patient_details &&
                            config &&
                            d &&
                            getRepitivePtDetails(d, config, ptFormFields)}
                        {rxLocalConfig?.header_border && (
                            <div className="border-b border-darwin-neutral-500"></div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export const getFooter = (
    docProfile: DoctorProfile,
    data: RenderPdfPrescription,
    rxLocalConfig?: LocalTemplateConfig,
    renderPdfConfig?: TemplateConfig,
    isHideFooterDetails?: boolean,
): JSX.Element => {
    if (renderPdfConfig?.floating_footer) {
        return renderPdfConfig?.floating_footer_details ? (
            getCustomFooterHtml(
                docProfile,
                data,
                rxLocalConfig,
                renderPdfConfig?.footer_top_margin,
                renderPdfConfig?.footer_bottom_margin,
                renderPdfConfig?.footer_left_margin,
                renderPdfConfig?.footer_right_margin,
                renderPdfConfig?.footer_img === NO_FOOTER ? undefined : renderPdfConfig?.footer_img,
                renderPdfConfig?.show_signature,
                renderPdfConfig?.show_name_in_signature,
                renderPdfConfig?.show_signature_text,
                renderPdfConfig?.show_page_number,
                renderPdfConfig?.show_prescription_id,
                renderPdfConfig.show_not_valid_for_medical_legal_purpose_message,
                renderPdfConfig.show_eka_logo,
                renderPdfConfig.attachment_image,
                renderPdfConfig?.footer_doctor_name_color,
                false,
                true,
                renderPdfConfig.show_approval_details,
                undefined,
                renderPdfConfig.floating_footer_details,
            )
        ) : (
            <></>
        );
    }

    if (renderPdfConfig?.footer_img) {
        return getCustomFooterHtml(
            docProfile,
            data,
            rxLocalConfig,
            renderPdfConfig?.footer_top_margin,
            renderPdfConfig?.footer_bottom_margin,
            renderPdfConfig?.footer_left_margin,
            renderPdfConfig?.footer_right_margin,
            renderPdfConfig?.footer_img === NO_FOOTER ? undefined : renderPdfConfig?.footer_img,
            renderPdfConfig?.show_signature,
            renderPdfConfig?.show_name_in_signature,
            renderPdfConfig?.show_signature_text,
            renderPdfConfig?.show_page_number,
            renderPdfConfig?.show_prescription_id,
            renderPdfConfig.show_not_valid_for_medical_legal_purpose_message,
            renderPdfConfig.show_eka_logo,
            renderPdfConfig.attachment_image,
            renderPdfConfig?.footer_doctor_name_color,
            isHideFooterDetails,
            undefined,
            renderPdfConfig.show_approval_details,
            renderPdfConfig.footer_height,
            renderPdfConfig.floating_footer_details,
        );
    }

    return getFooterHtml(docProfile, data, rxLocalConfig, renderPdfConfig);
};

export const getRepitivePtDetails = (
    d: RenderPdfPrescription,
    config: TemplateV2,
    ptFormFields?: DFormEntity[],
): JSX.Element => {
    const patientDetailsFormat = config?.render_pdf_config?.patient_details_format;
    const patientDetailsUppercase = config?.render_pdf_config?.patient_details_in_uppercase;
    const patientNameColor = config?.render_pdf_config?.patient_details_patient_name_color;

    const c = d?.patient?.profile?.personal?.phone?.c || '';
    const n = d?.patient?.profile?.personal?.phone?.n || '';
    const mobileNumber = c && n ? `${c}${n}` : '';

    if (patientDetailsFormat === 'name-age-slash-gender-number') {
        const ageGenderTitle = [
            d?.patientAge ? 'Age' : undefined,
            d?.patient?.profile?.personal?.gender?.charAt(0)?.toUpperCase() ? 'Gender' : undefined,
        ]
            .filter(Boolean)
            .join('/');

        const ageGender = [
            d?.patientAge,
            d?.patient?.profile?.personal?.gender?.charAt(0)?.toUpperCase(),
        ]
            .filter(Boolean)
            .join(' / ');

        return (
            <div>
                <div
                    className="flex items-start justify-between italic text-darwin-neutral-500 text-13"
                    // style={{ fontSize: '0.68rem' }}
                >
                    <div
                        style={
                            {
                                // marginTop: render_pdf_config?.header_top_margin,
                                // marginBottom: render_pdf_config?.header_bottom_margin,
                                // marginLeft: render_pdf_config?.header_left_margin,
                                // marginRight: render_pdf_config?.header_right_margin,
                                // fontSize: '0.68rem',
                                // border: rxLocalConfig?.header_border ? '1px solid black' : '',
                            }
                        }
                        // id={HEADER_CONTAINER}
                        className="flex space-x-4 pt-8 flex justify-between header-bottom-border text-13"
                    >
                        <div
                            style={
                                patientDetailsUppercase
                                    ? {
                                          textTransform: 'uppercase',
                                          //fontSize: '0.68rem',
                                      }
                                    : undefined
                            }
                        >
                            {[
                                d?.patient?.profile?.personal?.name && (
                                    <span
                                        style={{
                                            color: patientNameColor,
                                            //  fontSize: '0.68rem',
                                        }}
                                    >
                                        <span className="bold">Name: </span>
                                        {d?.patient?.profile?.personal?.name || ''}
                                    </span>
                                ),

                                ageGender && (
                                    <span style={{ fontSize: '0.68rem' }}>
                                        <span className="bold">{ageGenderTitle} :</span> {ageGender}
                                    </span>
                                ),

                                mobileNumber && (
                                    <span style={{ fontSize: '0.68rem' }}>
                                        <span className="bold">Mobile Number :</span> {mobileNumber}
                                    </span>
                                ),
                            ]
                                .filter(Boolean)
                                .map((item, index, array) => (
                                    <Fragment key={index}>
                                        {item}
                                        {index < array.length - 1 && ', '}
                                    </Fragment>
                                ))}
                        </div>
                    </div>
                    <div className="flex space-x-4 pt-8 flex justify-between header-bottom-border text-11">
                        {getVisitDateHtml(d, config)}
                    </div>
                </div>
                {/* if ther details are reqd not just name and primay dets reloadd */}
                <div className="flex flex-col space-x-4 justify-between header-bottom-border text-11">
                    {getFormDataHtml(d, config, ptFormFields, true)}
                    {config?.render_pdf_config?.patient_form_below_border ? (
                        <div
                            style={{
                                height: '1px',
                                width: '100%',
                                backgroundColor: '#060606',
                                marginBottom: '8px',
                                fontSize: '0.68rem',
                                marginInline: '0px',
                            }}
                        ></div>
                    ) : null}
                </div>
            </div>
        );
    }

    const patientDetails = [
        d?.patient?.profile?.personal?.gender,
        d?.patientAge,
        mobileNumber,
    ].filter(Boolean);

    return (
        <div>
            <div className="flex items-start justify-between italic text-darwin-neutral-500 text-13">
                <div className="flex space-x-4 pt-8 flex justify-between header-bottom-border text-13">
                    <div
                        style={
                            patientDetailsUppercase
                                ? {
                                      textTransform: 'uppercase',
                                  }
                                : undefined
                        }
                    >
                        <span
                            className="text-13 bold"
                            style={{
                                color: patientNameColor,
                            }}
                        >
                            {d?.patient?.profile?.personal?.name || ''},{' '}
                        </span>
                        {patientDetails.map((detail, i) => {
                            return (
                                <span style={{ fontSize: '0.68rem' }}>
                                    {detail || ''}
                                    {i < patientDetails.length - 1 && ', '}
                                </span>
                            );
                        })}
                    </div>
                </div>
                <div className="flex space-x-4 pt-8 flex justify-between header-bottom-border text-11">
                    {getVisitDateHtml(d, config)}
                </div>
            </div>
            <div className="flex flex-col space-x-4 justify-between header-bottom-border text-11">
                {getFormDataHtml(d, config, ptFormFields, true)}
                {config?.render_pdf_config?.patient_form_below_border ? (
                    <div
                        style={{
                            height: '1px',
                            width: '100%',
                            backgroundColor: '#060606',
                            marginBottom: '8px',
                            fontSize: '0.68rem',
                            marginInline: '0px',
                        }}
                    ></div>
                ) : null}
            </div>
        </div>
    );
};

export const getSpacingBetweenSections = (
    spacing_between_sections?: SpacingBetweenSections,
): string => {
    if (!spacing_between_sections) {
        return 'space-y-2';
    }

    return spacingAccortingToType?.[spacing_between_sections];
};

export const getBodyHtml = (
    data: RenderPdfPrescription,
    showWaterMark: boolean,
    config: TemplateV2,
    ptFormFields: DFormEntity[],
    flavour: Flavour,
): JSX.Element => {
    const padConfig = config?.render_pdf_body_config?.pad_elements_config;

    const doubleColumnConfig =
        config?.render_pdf_config?.columns_config &&
        Object.keys(config?.render_pdf_config?.columns_config).length > 0
            ? config?.render_pdf_config?.columns_config
            : DEFAULT_CONFIG_ELEMENT_IN_DOUBLE_COLUMNS;

    const elementsInDoubleColumn = new Set([
        ...doubleColumnConfig.left,
        ...doubleColumnConfig.right,
    ]);

    const isDoubleColumn = config?.render_pdf_config?.template_column_type === 'double';

    const sectionNameConfig = config?.render_pdf_body_config?.section_name_config;

    const spacing = getSpacingBetweenSections(config?.render_pdf_config?.spacing_between_sections);
    const filteredPadConfig = padConfig?.filter(
        (i) => !IGNORE_CONFIG_KEYS[flavour.toLowerCase() as Flavour].has(i.id),
    );
    const isFollowupAndAdvicesEnabled = filteredPadConfig?.find((i) => i.id === 'followup-advices')
        ?.isShown;
    const isFollowupEnabled = filteredPadConfig?.find((i) => i.id === 'followup')?.isShown;
    const isCareCanvasNotPresentInPadConfig =
        padConfig && padConfig.findIndex((i) => i.id === 'careCanvas') === -1;

    return (
        <div className="space-y-2 text-11 prescription-template" id="body-click">
            {showWaterMark && (
                <img src="" alt="#" className="w-full absolute z-1 top left right bottom" />
            )}
            {!config?.render_pdf_config?.floating_patient_details && (
                <>
                    <div className="flex items-start justify-between italic text-darwin-neutral-1000">
                        {getPatientDetailsHtml(data, config)}
                        {getVisitDateHtml(data, config)}
                    </div>
                    <div>
                        {getFormDataHtml(data, config, ptFormFields)}
                        {config?.render_pdf_config?.patient_form_below_border ? (
                            <div
                                style={{
                                    height: '1px',
                                    width: '100%',
                                    backgroundColor: '#060606',
                                    marginBottom: '8px',
                                }}
                            ></div>
                        ) : null}
                    </div>
                </>
            )}

            {isDoubleColumn
                ? doubleColumnsHtml(data, config, doubleColumnConfig, sectionNameConfig)
                : null}
            {padConfig ? (
                <div className={`${spacing}`}>
                    {padConfig
                        ?.filter((t) => t.isShown)
                        ?.filter(
                            (i) => !IGNORE_CONFIG_KEYS[flavour.toLowerCase() as Flavour].has(i.id),
                        )
                        ?.filter((i) => (isDoubleColumn ? !elementsInDoubleColumn.has(i.id) : true))
                        ?.map((item) => {
                            return (
                                padElements(
                                    data,
                                    item.id,
                                    config,
                                    sectionNameConfig,
                                    false,
                                    elementsInDoubleColumn,
                                ) || getDyformHtml(data, item.id, config)
                            );
                        })
                        .filter(Boolean)}
                </div>
            ) : (
                <>
                    <div className={`${spacing}`}>
                        {isDoubleColumnElementVisible(config, elementsInDoubleColumn, 'vitals') &&
                            getVitalsHtml(data, config)}
                        {isDoubleColumnElementVisible(config, elementsInDoubleColumn, 'vitals') &&
                            getGrowthChartVitalsHtml(data, config)}
                        {isDoubleColumnElementVisible(config, elementsInDoubleColumn, 'vitals') &&
                            getGrowthChartVitalsHtml(data, config)}
                        {isDoubleColumnElementVisible(config, elementsInDoubleColumn, 'symptoms') &&
                            getSymptomsHtml(data, config, sectionNameConfig?.['symptoms'])}
                        {isDoubleColumnElementVisible(
                            config,
                            elementsInDoubleColumn,
                            'diagnosis',
                        ) && getDiagnosisHtml(data, config, sectionNameConfig?.['diagnosis'])}
                        {isDoubleColumnElementVisible(
                            config,
                            elementsInDoubleColumn,
                            'medicalHistory',
                        ) && (
                            <>
                                {getPmhHtml(data, 'pmh', config)}
                                {getPmhHtml(data, 'fh', config)}
                                {getPmhHtml(data, 'lh', config)}
                                {getPmhHtml(data, 'th', config)}
                                {getPmhHtml(data, 'cm', config)}
                                {getPmhHtml(data, 'da', config)}
                                {getPmhHtml(data, 'oa', config)}
                                {getPmhHtml(data, 'pp', config)}
                                {getPmhHtml(data, 'omh', config)}
                            </>
                        )}
                        {isDoubleColumnElementVisible(
                            config,
                            elementsInDoubleColumn,
                            'labVitals',
                        ) &&
                            getInvestigativeReadingsHtml(
                                data,
                                config,
                                sectionNameConfig?.['labVitals'],
                            )}
                        {isDoubleColumnElementVisible(
                            config,
                            elementsInDoubleColumn,
                            'examinations',
                        ) &&
                            getExaminationFindingsHtml(
                                data,
                                config,
                                sectionNameConfig?.['examinations'],
                            )}
                        {getAllDyformHtml(data, config)}
                        {isDoubleColumnElementVisible(
                            config,
                            elementsInDoubleColumn,
                            'medications',
                        ) && (
                            <div>
                                {(
                                    medicationFormatToTableMapping?.[
                                        config?.render_pdf_config
                                            ?.medication_table_format as keyof typeof medicationFormatToTableMapping
                                    ] || getMedications1Html
                                )(
                                    data,
                                    config?.render_pdf_body_config?.medication_config,
                                    config?.render_pdf_config,
                                )}
                            </div>
                        )}
                        {isDoubleColumnElementVisible(config, elementsInDoubleColumn, 'labTests') &&
                            getLabTestsHtml(data, config, sectionNameConfig?.['labTests'])}
                        {isDoubleColumnElementVisible(
                            config,
                            elementsInDoubleColumn,
                            'prescriptionNotes',
                        ) && getNotesHtml(data, config, sectionNameConfig?.['prescriptionNotes'])}
                        <div className="leading-5">
                            {getPmhHtml(data, 'g-vh', config)}
                            {getPmhHtml(data, 'd-vh', config)}
                        </div>
                    </div>
                    {getAdvicesHtml(data, config, sectionNameConfig?.['advices'])}
                    {getFollowupHtml(data, config, sectionNameConfig?.['followup'])}
                    {isDoubleColumnElementVisible(config, elementsInDoubleColumn, 'refer') &&
                        getReferredToHtml(data, config, sectionNameConfig?.['refer'])}
                    {getDentalExaminationsHtml(data, config)}
                    {getDentalProceduresHtml(data, config)}
                    {getOphthalmologyHtml(data, 'opVision', config)}
                    {getOphthalmologyHtml(data, 'opSubjectiveRefraction', config)}
                    {getOphthalmologyHtml(data, 'opAutoRefraction', config)}
                    {getOphthalmologyHtml(data, 'opCurrentSpec', config)}
                    {getOphthalmologyHtml(data, 'opFinalPrescription', config)}
                    {getOphthalmologyHtml(data, 'opIop', config)}
                    <div>
                        {(
                            injectionsFormatToTableMapping?.[
                                config?.render_pdf_config
                                    ?.injections_table_format as keyof typeof injectionsFormatToTableMapping
                            ] || (() => getInjectionsLineHtml(data))
                        )(data, config?.render_pdf_config as TemplateConfig)}
                    </div>
                    {getProceduresHtmls(data, config, sectionNameConfig?.['procedures'])}
                    {getCareCanvasHtml(data, config, sectionNameConfig?.['careCanvas'])}
                </>
            )}
            {!isFollowupAndAdvicesEnabled &&
                !isFollowupEnabled &&
                getIpdAdmissionHtml(data, config)}
            {isCareCanvasNotPresentInPadConfig &&
                getCareCanvasHtml(data, config, sectionNameConfig?.['careCanvas'])}
        </div>
    );
};

export function isDoubleColumnElementVisible(
    config: TemplateV2,
    elementsInDoubleColumn?: Set<string>,
    elementName?: string,
): boolean {
    if (
        elementName &&
        config?.render_pdf_config?.template_column_type === 'double' &&
        elementsInDoubleColumn?.has(elementName)
    ) {
        return false;
    }

    return true;
}

export const doubleColumnsHtml = (
    data: RenderPdfPrescription,
    config: TemplateV2,
    doubleColumnConfig: ColumnConfig,
    sectionNameConfig?: SectionNameConfig,
): JSX.Element | null => {
    const leftComponentNonEmptyElements =
        doubleColumnConfig?.left?.filter((key) =>
            padElements(data, key, config, sectionNameConfig),
        ) || [];

    const rightComponentNonEmptyElements =
        doubleColumnConfig?.right?.filter((key) =>
            padElements(data, key, config, sectionNameConfig),
        ) || [];

    if (leftComponentNonEmptyElements?.length <= 0 && rightComponentNonEmptyElements?.length <= 0) {
        return null;
    }

    const maxRow = Math.max(
        doubleColumnConfig?.left?.length || 0,
        doubleColumnConfig?.right?.length || 0,
    );

    return (
        <div>
            <table
                className="text-11 w-full"
                cellSpacing={0}
                cellPadding={0}
                style={{
                    padding: '0px 0px 8px 0px',
                }}
            >
                <colgroup>
                    <col span={1} style={{ width: '50%' }} />
                    <col span={1} style={{ width: '50%' }} />
                </colgroup>

                <tr
                    style={{
                        maxHeight: '0px',
                        fontSize: '1px',
                        overflow: 'scroll',
                        lineHeight: '0px',
                    }}
                    key={'dummy'}
                >
                    <td
                        style={{
                            height: '0px',
                            verticalAlign: 'top',
                            lineHeight: '0px',
                        }}
                    >
                        <div
                            style={{
                                padding: '0px',
                                height: '100%',
                                lineHeight: '0px',
                            }}
                        >
                            -
                        </div>
                    </td>

                    <td
                        style={{
                            height: '0px',
                            verticalAlign: 'top',
                            lineHeight: '0px',
                        }}
                    >
                        <div
                            style={{
                                padding: '0px',
                                height: '100%',
                                lineHeight: '0px',
                            }}
                        >
                            -
                        </div>
                    </td>
                </tr>

                {[...Array(maxRow)].map((_, i) => {
                    return (
                        <tr className="text-11" key={i}>
                            <td
                                style={{
                                    borderRight: '0.5px solid black',
                                    height: '100%',
                                    verticalAlign: 'top',
                                }}
                            >
                                <div
                                    style={{
                                        padding: '0px 16px 8px 0px',
                                        height: '100%',
                                    }}
                                >
                                    {doubleColumnConfig?.left?.[i]
                                        ? padElements(
                                              data,
                                              doubleColumnConfig?.left?.[i],
                                              config,
                                              sectionNameConfig,
                                              true,
                                          )
                                        : null}
                                </div>
                            </td>

                            <td
                                style={{
                                    borderLeft: '0.5px solid black',
                                    height: '100%',
                                    verticalAlign: 'top',
                                }}
                            >
                                <div
                                    style={{
                                        padding: '0px 0px 8px 16px',
                                        height: '100%',
                                    }}
                                >
                                    {doubleColumnConfig?.right?.[i]
                                        ? padElements(
                                              data,
                                              doubleColumnConfig?.right?.[i],
                                              config,
                                              sectionNameConfig,
                                              true,
                                          )
                                        : null}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </table>
        </div>
    );
};

export const getFooterHtml = (
    docProfile: DoctorProfile,
    d: RenderPdfPrescription,
    rxLocalConfig?: LocalTemplateConfig,
    renderPdfConfig?: TemplateConfig,
): JSX.Element => {
    const footerDoctorNameColor = renderPdfConfig?.footer_doctor_name_color;
    const timeZoneInfo =
        d &&
        (d?.timeZone === 'Asia/Calcutta' || d?.timeZone === 'Asia/Kolkata'
            ? ''
            : getTimeZoneInfo(d.timeZone).abbreviation);

    return (
        <>
            {rxLocalConfig?.footer_border && (
                <div className="border-b border-darwin-neutral-500"></div>
            )}
            <div
                style={{
                    marginTop: renderPdfConfig?.footer_top_margin,
                    paddingTop: '1cm',
                    // marginBottom: renderPdfConfig?.footer_bottom_margin,
                    marginLeft: renderPdfConfig?.footer_left_margin,
                    marginRight: renderPdfConfig?.footer_right_margin,
                    border: rxLocalConfig?.footer_border ? '1px solid black' : '',
                    height:
                        renderPdfConfig?.footer_height?.trim() &&
                        !isNaN(parseFloat(renderPdfConfig?.footer_height))
                            ? parseFloat(renderPdfConfig?.footer_height) + 1.3 + 'cm'
                            : renderPdfConfig?.footer_height || 'auto',
                }}
                id={FOOTER_CONTAINER}
                className="text-11 flex justify-between"
            >
                <div className="text-left">
                    <p className="text-darwin-neutral-900">Not valid for Medico Legal Purpose</p>
                    <p className="bold text-darwin-neutral-1000" id="page-number"></p>
                    <p className="text-darwin-neutral-900 text-9">{d?.id || ''}</p>
                    <img
                        src="data:image/png;base64,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"
                        className="w-72"
                    />
                </div>
                {renderPdfConfig?.attachment_image && (
                    <div className="w-200 h-120 flex items-center justify-center">
                        <img
                            src={renderPdfConfig?.attachment_image}
                            className="max-w-200 h-120 object-fit-contain"
                        />
                    </div>
                )}

                <div className="flex items-end flex-col">
                    <img
                        src={docProfile?.profile?.professional?.signature}
                        className="max-w-92 h-60 object-fit-contain"
                    />
                    <p
                        className="bold"
                        style={{
                            color: footerDoctorNameColor,
                        }}
                    >
                        Dr. {docProfile?.profile?.personal?.name?.f || ''}{' '}
                        {docProfile?.profile?.personal?.name?.l || ''}
                    </p>
                    <span className="whitespace-preline text-right">
                        {docProfile?.profile?.professional?.signature_text || ''}
                    </span>
                </div>
            </div>

            {renderPdfConfig?.show_approval_details ? (
                <div
                    className="flex justify-between items-center text-9 text-darwin-neutral-900"
                    style={{ marginTop: 2, marginBottom: 2 }}
                >
                    <span>
                        PRESCRIPTION AUTHORIZED BY {(d.actor?.name || '-').toUpperCase()} ON{' '}
                        {moment(
                            formatDateInTimeZone({ timeZone: d?.timeZone || 'Asia/Calcutta' }),
                        ).format('DD MMM YYYY hh:mm a') || ''}{' '}
                        {timeZoneInfo}
                    </span>
                    <span>(THIS IS A COMPUTER GENERATED REPORT. SIGNATURE IS NOT REQUIRED.)</span>
                </div>
            ) : null}

            {rxLocalConfig?.footer_border && (
                <div className="border-b border-darwin-neutral-500"></div>
            )}
        </>
    );
};

export const getDoubleColumnMedications = (
    d: RenderPdfPrescription,
    render_pdf_config?: TemplateConfig,
): JSX.Element | undefined => {
    const medication = d?.tool?.medications;
    const heading = render_pdf_config?.medication_table_heading_text;
    const hideHeading = render_pdf_config?.medication_heading_hide;
    const medicationsTableTitleAlignment = render_pdf_config?.medications_table_title_alignment;
    const medicationsTableHeaderColor = render_pdf_config?.medications_table_header_color;

    if (!medication?.length) {
        return;
    }

    return (
        <div>
            {hideHeading ? (
                ''
            ) : (
                <p
                    style={{
                        textAlign: medicationsTableTitleAlignment,
                        color: medicationsTableHeaderColor,
                    }}
                    className="text-darwin-accent-symptoms-blue-800 bold"
                >
                    {heading || 'PRESCRIPTION'}
                </p>
            )}

            <div className="space-y-4">
                {medication?.map((med) => {
                    return (
                        <div className="text-11">
                            <div className="bold underline">
                                {med?.name && (
                                    <span
                                        className={`${
                                            render_pdf_config?.medication_name_in_capital
                                                ? 'uppercase'
                                                : ''
                                        }`}
                                    >
                                        {med?.name}
                                    </span>
                                )}
                                {med?.product_type && <span>({med?.product_type})</span>}
                                {med?.quantity?.custom && <span> - {med?.quantity?.custom} </span>}
                            </div>{' '}
                            {med?.generic_name && (
                                <div className="italic">
                                    <p className="text-10">{med?.generic_name} </p>
                                </div>
                            )}
                            <div
                                className="mt-2"
                                style={{
                                    paddingTop: '4px',
                                }}
                            >
                                <span className="text-11 break-word">
                                    {[med?.dose?.custom, med?.frequency?.custom]
                                        .filter(Boolean)
                                        .join(', ') && (
                                        <span className="">
                                            {[med?.dose?.custom, med?.frequency?.custom]
                                                .filter(Boolean)
                                                .join(', ')}{' '}
                                        </span>
                                    )}
                                    {med?.route?.display_name && (
                                        <span>Route: {med?.route?.display_name || ''}</span>
                                    )}
                                    {med?.area?.name && (
                                        <span>Apply on: {med?.area?.name || ''}</span>
                                    )}
                                    {med?.timing && <span>[{med?.timing || ''}]</span>}
                                    {med?.duration?.custom && (
                                        <span>, {med?.duration?.custom || ''}</span>
                                    )}{' '}
                                    {med?.start_from?.text ? (
                                        <span>[{med?.start_from?.text}]</span>
                                    ) : (
                                        ''
                                    )}
                                </span>
                            </div>
                            {med?.instruction && (
                                <div className="break-word">{med?.instruction || '-'}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// default med table
export const medOptions1 = {
    medId: {
        dose: 'dose',
        frequency: 'frequency',
        duration: 'duration',
        instruction: 'instruction',
    },
    medIdToNameMapping: {
        dose: 'Dose',
        frequency: 'Frequency',
        duration: 'Duration',
        instruction: 'Remarks',
    },
    width: {
        dose: '10%',
        frequency: '12%',
        duration: '12%',
        instruction: '38%',
    },
    medIdToNameMappingForWidth: {
        medication: 'Medications',
        dose: 'Dose',
        frequency: 'Frequency',
        duration: 'Duration',
        instruction: 'Remarks',
    },
    allColumnWidthInNumber: {
        medication: 24,
        dose: 10,
        frequency: 12,
        duration: 12,
        instruction: 38,
    },
};

export const getMedications1Html = (
    d: RenderPdfPrescription,
    medication_config?: GeniePadElementsSettingItem[],
    render_pdf_config?: TemplateConfig,
): JSX.Element | undefined => {
    const medication = d?.tool?.medications;
    const showColumns: { [key: string]: boolean } = {};
    const titleBgColor = render_pdf_config?.medications_table_title_bg_color;
    const borderColor = render_pdf_config?.medications_table_border_color;
    const heading = render_pdf_config?.medication_table_heading_text;
    const hideHeading = render_pdf_config?.medication_heading_hide;
    const medicationsTableTitleAlignment = render_pdf_config?.medications_table_title_alignment;
    const medicationsTableHeaderColor = render_pdf_config?.medications_table_header_color;
    const medTableWidth = render_pdf_config?.medication_table_width;
    medication?.forEach((med) => {
        if (med?.dose?.custom?.trim() || med?.area?.name || med?.route?.display_name) {
            showColumns['dose'] = true;
        }
        if (med?.frequency?.custom || med?.timing) {
            showColumns['frequency'] = true;
        }
        if (med?.duration?.custom || med?.start_from?.text) {
            showColumns['duration'] = true;
        }
        if (med?.instruction) {
            showColumns['instruction'] = true;
        }
    });
    if (!medication?.length) {
        return;
    }

    if (medication_config) {
        const medSequence = [
            ...((medication_config
                .map((conf) => {
                    if (!showColumns?.[conf?.id]) {
                        return false;
                    }
                    return medOptions1.medIdToNameMapping[
                        conf.id as keyof typeof medOptions1.medIdToNameMapping
                    ]
                        ? conf
                        : undefined;
                })
                .filter(Boolean) || []) as GeniePadElementsSettingItem[]),
        ];

        let totalWidthCount =
            medTableWidth?.['medication'] || medOptions1.allColumnWidthInNumber['medication'];

        medSequence.map((conf) => {
            totalWidthCount +=
                medTableWidth?.[conf.id] ||
                medOptions1.allColumnWidthInNumber[
                    conf.id as keyof typeof medOptions1.medIdToNameMapping
                ];
        });

        const medicationWidth =
            ((medTableWidth?.['medication'] || medOptions1.allColumnWidthInNumber['medication']) /
                totalWidthCount) *
            96;

        return (
            <div>
                {hideHeading ? (
                    ''
                ) : (
                    <p
                        style={{
                            textAlign: medicationsTableTitleAlignment,
                            color: medicationsTableHeaderColor,
                        }}
                        className="text-13 text-center prescription-title-color bold underline italic"
                    >
                        {heading || 'PRESCRIPTION'}
                    </p>
                )}

                <div className="text-darwin-neutral-1000">
                    <table
                        style={{ width: '100%', borderColor: borderColor }}
                        className="border-collapse border medication-table-border-color w-full"
                    >
                        <thead>
                            <tr className="text-11 bold w-full">
                                <th
                                    style={{
                                        borderColor: borderColor,
                                        backgroundColor: titleBgColor,
                                        width: `4%`,
                                    }}
                                    className="border medication-table-border-color medication-title-color w-64 text-center p-4"
                                ></th>
                                <th
                                    style={{
                                        borderColor: borderColor,
                                        backgroundColor: titleBgColor,
                                        width: `${medicationWidth}%`,
                                    }}
                                    className="border medication-table-border-color medication-title-color bold text-center p-4"
                                >
                                    Medications
                                </th>
                                {medSequence.map((conf) => {
                                    return (
                                        <th
                                            style={{
                                                borderColor: borderColor,
                                                backgroundColor: titleBgColor,
                                            }}
                                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                                        >
                                            {
                                                medOptions1.medIdToNameMapping[
                                                    conf.id as keyof typeof medOptions1.medIdToNameMapping
                                                ]
                                            }
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        {medication?.map((med) => {
                            return (
                                <tr className="text-11">
                                    <td
                                        style={{ borderColor: borderColor, width: `4%` }}
                                        className="bold p-4 border medication-table-border-color text-center"
                                    >
                                        {med?.ind || '.'}
                                    </td>
                                    <td
                                        style={{
                                            borderColor: borderColor,
                                            width: `${medicationWidth}%`,
                                        }}
                                        className="p-4 border medication-table-border-color"
                                    >
                                        {med?.isTapering && !med?.taperingDoseTitleDisplay ? (
                                            ''
                                        ) : !render_pdf_config?.make_generic_name_as_primary ? (
                                            <>
                                                <span
                                                    className={`bold ${
                                                        render_pdf_config?.medication_name_in_capital
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {med?.name ? `${med?.name} ` : ''}
                                                </span>
                                                {med?.product_type ? (
                                                    <span>({med?.product_type}) </span>
                                                ) : (
                                                    ''
                                                )}

                                                {med?.generic_name ? (
                                                    <p className="text-10">{med?.generic_name} </p>
                                                ) : (
                                                    ''
                                                )}
                                                {med?.quantity?.custom ? (
                                                    <p>[{med?.quantity?.custom}] </p>
                                                ) : (
                                                    ''
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {med?.generic_name ? (
                                                    <p
                                                        className={`bold ${
                                                            render_pdf_config?.medication_name_in_capital
                                                                ? 'uppercase'
                                                                : ''
                                                        }`}
                                                    >
                                                        {med?.generic_name}{' '}
                                                    </p>
                                                ) : (
                                                    ''
                                                )}
                                                <span className="text-10">
                                                    {med?.name ? `${med?.name} ` : ''}
                                                </span>
                                                {med?.product_type ? (
                                                    <span>({med?.product_type}) </span>
                                                ) : (
                                                    ''
                                                )}

                                                {med?.quantity?.custom ? (
                                                    <p>[{med?.quantity?.custom}] </p>
                                                ) : (
                                                    ''
                                                )}
                                            </>
                                        )}{' '}
                                    </td>

                                    {medSequence.map((conf) => {
                                        if (conf.id === medOptions1.medId.dose) {
                                            return (
                                                <td
                                                    style={{
                                                        borderColor: borderColor,
                                                        width: `${
                                                            ((medTableWidth?.[conf.id] ||
                                                                medOptions1.allColumnWidthInNumber[
                                                                    conf.id as keyof typeof medOptions1.medIdToNameMapping
                                                                ]) /
                                                                totalWidthCount) *
                                                            96
                                                        }%`,
                                                    }}
                                                    className="border medication-table-border-color p-4 text-center"
                                                >
                                                    {med?.dose?.custom || ''}
                                                    {med?.route?.display_name && (
                                                        <p>
                                                            Route:{' '}
                                                            <p className="bold">
                                                                {med?.route?.display_name || ''}
                                                            </p>
                                                        </p>
                                                    )}
                                                    {med?.area?.name && (
                                                        <p>
                                                            Apply on:{' '}
                                                            <p className="bold">
                                                                {med?.area?.name || ''}
                                                            </p>
                                                        </p>
                                                    )}
                                                </td>
                                            );
                                        }

                                        if (conf.id === medOptions1.medId.frequency) {
                                            return (
                                                <td
                                                    style={{
                                                        borderColor: borderColor,
                                                        width: `${
                                                            ((medTableWidth?.[conf.id] ||
                                                                medOptions1.allColumnWidthInNumber[
                                                                    conf.id as keyof typeof medOptions1.medIdToNameMapping
                                                                ]) /
                                                                totalWidthCount) *
                                                            96
                                                        }%`,
                                                    }}
                                                    className="border medication-table-border-color p-4 text-center"
                                                >
                                                    <p>{med?.frequency?.custom || ''}</p>
                                                    <p>{med?.timing || ''}</p>
                                                </td>
                                            );
                                        }

                                        if (conf.id === medOptions1.medId.duration) {
                                            return (
                                                <td
                                                    style={{
                                                        borderColor: borderColor,
                                                        width: `${
                                                            ((medTableWidth?.[conf.id] ||
                                                                medOptions1.allColumnWidthInNumber[
                                                                    conf.id as keyof typeof medOptions1.medIdToNameMapping
                                                                ]) /
                                                                totalWidthCount) *
                                                            96
                                                        }%`,
                                                    }}
                                                    className="border medication-table-border-color p-4 text-center"
                                                >
                                                    <p>{med?.duration?.custom || ''}</p>
                                                    {med?.start_from?.text ? (
                                                        <p className="bold">
                                                            ({med?.start_from?.text})
                                                        </p>
                                                    ) : (
                                                        ''
                                                    )}
                                                </td>
                                            );
                                        }

                                        if (conf.id === medOptions1.medId.instruction) {
                                            return (
                                                <td
                                                    style={{
                                                        borderColor: borderColor,
                                                        width: `${
                                                            ((medTableWidth?.[conf.id] ||
                                                                medOptions1.allColumnWidthInNumber[
                                                                    conf.id as keyof typeof medOptions1.medIdToNameMapping
                                                                ]) /
                                                                totalWidthCount) *
                                                            96
                                                        }%`,
                                                    }}
                                                    className="break-word whitespace-preline border medication-table-border-color p-4"
                                                >
                                                    {med?.instruction || '-'}
                                                </td>
                                            );
                                        }
                                    })}
                                </tr>
                            );
                        })}
                    </table>
                </div>
            </div>
        );
    }

    let totalWidthCount =
        medTableWidth?.['medication'] || medOptions1.allColumnWidthInNumber['medication'];

    Object.keys(medOptions1.allColumnWidthInNumber).map((key) => {
        if (showColumns?.[key]) {
            totalWidthCount +=
                medTableWidth?.[key] ||
                medOptions1.allColumnWidthInNumber[
                    key as keyof typeof medOptions1.medIdToNameMapping
                ];
        }
    });

    const medicationWidth =
        ((medTableWidth?.['medication'] || medOptions1.allColumnWidthInNumber['medication']) /
            totalWidthCount) *
        96;

    return (
        <div>
            {hideHeading ? (
                ''
            ) : (
                <p
                    style={{
                        textAlign: medicationsTableTitleAlignment,
                        color: medicationsTableHeaderColor,
                    }}
                    className="text-13 text-center prescription-title-color bold underline italic"
                >
                    {heading || 'PRESCRIPTION'}
                </p>
            )}
            <div className="text-darwin-neutral-1000">
                <table
                    style={{ borderColor: borderColor }}
                    className="border-collapse border medication-table-border-color w-full"
                >
                    <thead>
                        <tr className="text-11 bold w-full">
                            <th
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    width: `4%`,
                                }}
                                className="border medication-table-border-color medication-title-color w-64 text-center p-4"
                            ></th>
                            <th
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    width: `${medicationWidth}%`,
                                }}
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                            >
                                Medications
                            </th>
                            {Object.keys(medOptions1.medIdToNameMapping)
                                .map((key) => {
                                    if (!showColumns?.[key]) {
                                        return null;
                                    }

                                    return (
                                        <th
                                            style={{
                                                borderColor: borderColor,
                                                backgroundColor: titleBgColor,
                                                width: `${
                                                    ((medTableWidth?.[key] ||
                                                        medOptions1.allColumnWidthInNumber[
                                                            key as keyof typeof medOptions1.medIdToNameMapping
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                                        >
                                            {
                                                medOptions1.medIdToNameMapping[
                                                    key as keyof typeof medOptions1.medIdToNameMapping
                                                ]
                                            }
                                        </th>
                                    );
                                })
                                .filter(Boolean)}
                        </tr>
                    </thead>

                    {medication?.map((med) => {
                        return (
                            <tr className="text-11">
                                <td
                                    style={{ borderColor: borderColor, width: `4%` }}
                                    className="bold p-4 border medication-table-border-color text-center"
                                >
                                    {med?.ind || ''}
                                </td>
                                <td
                                    style={{
                                        borderColor: borderColor,
                                        width: `${medicationWidth}%`,
                                    }}
                                    className="p-4 border medication-table-border-color"
                                >
                                    {med?.isTapering && !med?.taperingDoseTitleDisplay ? (
                                        ''
                                    ) : !render_pdf_config?.make_generic_name_as_primary ? (
                                        <>
                                            <span
                                                className={`bold ${
                                                    render_pdf_config?.medication_name_in_capital
                                                        ? 'uppercase'
                                                        : ''
                                                }`}
                                            >
                                                {med?.name ? `${med?.name} ` : ''}
                                            </span>
                                            {med?.product_type ? (
                                                <span>({med?.product_type}) </span>
                                            ) : (
                                                ''
                                            )}

                                            {med?.generic_name ? (
                                                <p className="text-10">{med?.generic_name} </p>
                                            ) : (
                                                ''
                                            )}
                                            {med?.quantity?.custom ? (
                                                <p>[{med?.quantity?.custom}] </p>
                                            ) : (
                                                ''
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {med?.generic_name ? (
                                                <p
                                                    className={`bold ${
                                                        render_pdf_config?.medication_name_in_capital
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {med?.generic_name}{' '}
                                                </p>
                                            ) : (
                                                ''
                                            )}
                                            <span className="text-10">
                                                {med?.name ? `${med?.name} ` : ''}
                                            </span>
                                            {med?.product_type ? (
                                                <span>({med?.product_type}) </span>
                                            ) : (
                                                ''
                                            )}

                                            {med?.quantity?.custom ? (
                                                <p>[{med?.quantity?.custom}] </p>
                                            ) : (
                                                ''
                                            )}
                                        </>
                                    )}{' '}
                                </td>

                                {Object.keys(medOptions1.medIdToNameMapping)
                                    .map((key) => {
                                        if (!showColumns?.[key]) {
                                            return null;
                                        }

                                        if (key === medOptions1.medId.dose) {
                                            return (
                                                <td
                                                    style={{
                                                        borderColor: borderColor,
                                                        width: `${
                                                            ((medTableWidth?.[key] ||
                                                                medOptions1.allColumnWidthInNumber[
                                                                    key as keyof typeof medOptions1.medIdToNameMapping
                                                                ]) /
                                                                totalWidthCount) *
                                                            96
                                                        }%`,
                                                    }}
                                                    className="border medication-table-border-color p-4 text-center"
                                                >
                                                    {med?.dose?.custom || ''}
                                                    {med?.route?.display_name && (
                                                        <p>
                                                            Route:{' '}
                                                            <p className="bold">
                                                                {med?.route?.display_name || ''}
                                                            </p>
                                                        </p>
                                                    )}
                                                    {med?.area?.name && (
                                                        <p>
                                                            Apply on:{' '}
                                                            <p className="bold">
                                                                {med?.area?.name || ''}
                                                            </p>
                                                        </p>
                                                    )}
                                                </td>
                                            );
                                        }
                                        if (key === medOptions1.medId.frequency) {
                                            return (
                                                <td
                                                    style={{
                                                        borderColor: borderColor,
                                                        width: `${
                                                            ((medTableWidth?.[key] ||
                                                                medOptions1.allColumnWidthInNumber[
                                                                    key as keyof typeof medOptions1.medIdToNameMapping
                                                                ]) /
                                                                totalWidthCount) *
                                                            96
                                                        }%`,
                                                    }}
                                                    className="border medication-table-border-color p-4 text-center"
                                                >
                                                    <p>{med?.frequency?.custom || ''}</p>
                                                    <p>{med?.timing || ''}</p>
                                                </td>
                                            );
                                        }

                                        if (key === medOptions1.medId.duration) {
                                            return (
                                                <td
                                                    style={{
                                                        borderColor: borderColor,
                                                        width: `${
                                                            ((medTableWidth?.[key] ||
                                                                medOptions1.allColumnWidthInNumber[
                                                                    key as keyof typeof medOptions1.medIdToNameMapping
                                                                ]) /
                                                                totalWidthCount) *
                                                            96
                                                        }%`,
                                                    }}
                                                    className="border medication-table-border-color p-4 text-center"
                                                >
                                                    <p>{med?.duration?.custom || ''}</p>
                                                    {med?.start_from?.text ? (
                                                        <p className="bold">
                                                            ({med?.start_from?.text})
                                                        </p>
                                                    ) : (
                                                        ''
                                                    )}
                                                </td>
                                            );
                                        }

                                        if (key === medOptions1.medId.instruction) {
                                            return (
                                                <td
                                                    style={{
                                                        borderColor: borderColor,
                                                        width: `${
                                                            ((medTableWidth?.[key] ||
                                                                medOptions1.allColumnWidthInNumber[
                                                                    key as keyof typeof medOptions1.medIdToNameMapping
                                                                ]) /
                                                                totalWidthCount) *
                                                            96
                                                        }%`,
                                                    }}
                                                    className="break-word whitespace-preline border medication-table-border-color p-4"
                                                >
                                                    {med?.instruction || '-'}
                                                </td>
                                            );
                                        }
                                    })
                                    .filter(Boolean)}
                            </tr>
                        );
                    })}
                </table>
            </div>
        </div>
    );
};

// Seperate quantity column
export const medOptions2 = {
    medId: {
        dose: 'dose',
        frequency: 'frequency',
        duration: 'duration',
        quantity: 'quantity',
    },
    medIdToNameMapping: {
        dose: 'Dose',
        frequency: 'Frequency',
        duration: 'Duration',
        quantity: 'Quantity',
    },
    width: {
        dose: '10%',
        frequency: '15%',
        duration: '25%',
        quantity: '15%',
    },
    medIdToNameMappingForWidth: {
        medication: 'Medications',
        dose: 'Dose',
        frequency: 'Frequency',
        duration: 'Duration',
        quantity: 'Quantity',
    },
    allColumnWidthInNumber: {
        medication: 31,
        dose: 10,
        frequency: 15,
        duration: 25,
        quantity: 15,
    },
};

export const getMedications2Html = (
    d: RenderPdfPrescription,
    medication_config?: GeniePadElementsSettingItem[],
    render_pdf_config?: TemplateConfig,
): JSX.Element | undefined => {
    const medication = d?.tool?.medications;
    const showColumns: { [key: string]: boolean } = {};
    const titleBgColor = render_pdf_config?.medications_table_title_bg_color;
    const borderColor = render_pdf_config?.medications_table_border_color;
    const heading = render_pdf_config?.medication_table_heading_text;
    const hideHeading = render_pdf_config?.medication_heading_hide;
    const medicationsTableTitleAlignment = render_pdf_config?.medications_table_title_alignment;
    const medicationsTableHeaderColor = render_pdf_config?.medications_table_header_color;
    const medTableWidth = render_pdf_config?.medication_table_width;

    medication?.forEach((med) => {
        if (med?.dose?.custom?.trim() || med?.area?.name || med?.route?.display_name) {
            showColumns['dose'] = true;
        }
        if (med?.frequency?.custom || med?.timing) {
            showColumns['frequency'] = true;
        }
        if (med?.duration?.custom || med?.start_from?.text) {
            showColumns['duration'] = true;
        }
        if (med?.quantity?.custom) {
            showColumns['quantity'] = true;
        }
    });

    if (!medication?.length) {
        return;
    }

    if (medication_config) {
        const medSequence = [
            ...((medication_config
                .map((conf) => {
                    if (!showColumns?.[conf?.id]) {
                        return false;
                    }

                    return medOptions2.medIdToNameMapping[
                        conf.id as keyof typeof medOptions2.medIdToNameMapping
                    ]
                        ? conf
                        : undefined;
                })
                .filter(Boolean) || []) as GeniePadElementsSettingItem[]),
        ];

        let totalWidthCount =
            medTableWidth?.['medication'] || medOptions2.allColumnWidthInNumber['medication'];

        medSequence.map((conf) => {
            totalWidthCount +=
                medTableWidth?.[conf.id] ||
                medOptions2.allColumnWidthInNumber[
                    conf.id as keyof typeof medOptions2.medIdToNameMapping
                ];
        });

        const medicationWidth =
            ((medTableWidth?.['medication'] || medOptions2.allColumnWidthInNumber['medication']) /
                totalWidthCount) *
            96;

        return (
            <div>
                {hideHeading ? (
                    ''
                ) : (
                    <p
                        style={{
                            textAlign: medicationsTableTitleAlignment,
                            color: medicationsTableHeaderColor,
                        }}
                        className="text-13 text-center prescription-title-color bold underline italic"
                    >
                        {heading || 'PRESCRIPTION'}
                    </p>
                )}
                <div className="text-darwin-neutral-1000">
                    <table
                        style={{ width: '100%', borderColor: borderColor }}
                        className="border-collapse border medication-table-border-color w-full"
                    >
                        <thead>
                            <tr className="text-11 bold w-full">
                                <th
                                    style={{
                                        borderColor: borderColor,
                                        backgroundColor: titleBgColor,
                                        width: `4%`,
                                    }}
                                    className="border medication-table-border-color medication-title-color w-64 text-center p-4"
                                ></th>
                                <th
                                    style={{
                                        borderColor: borderColor,
                                        backgroundColor: titleBgColor,
                                        width: `${medicationWidth}%`,
                                    }}
                                    className="border medication-table-border-color medication-title-color bold text-center p-4"
                                >
                                    Medications
                                </th>
                                {medSequence.map((conf) => {
                                    return (
                                        <th
                                            style={{
                                                borderColor: borderColor,
                                                backgroundColor: titleBgColor,
                                                width: `${
                                                    ((medTableWidth?.[conf.id] ||
                                                        medOptions2.allColumnWidthInNumber[
                                                            conf.id as keyof typeof medOptions2.medIdToNameMapping
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                                        >
                                            {
                                                medOptions2.medIdToNameMapping[
                                                    conf.id as keyof typeof medOptions2.medIdToNameMapping
                                                ]
                                            }
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        {medication?.map((med) => {
                            return (
                                <>
                                    <tr className="text-11">
                                        <td
                                            style={{ borderColor: borderColor, width: `4%` }}
                                            className="bold p-4 border medication-table-border-color text-center"
                                        >
                                            {med?.ind || ''}
                                        </td>
                                        <td
                                            style={{
                                                borderColor: borderColor,
                                                width: `${medicationWidth}%`,
                                            }}
                                            className="p-4 border medication-table-border-color"
                                        >
                                            {med?.isTapering && !med?.taperingDoseTitleDisplay ? (
                                                ''
                                            ) : !render_pdf_config?.make_generic_name_as_primary ? (
                                                <>
                                                    <span
                                                        className={`bold ${
                                                            render_pdf_config?.medication_name_in_capital
                                                                ? 'uppercase'
                                                                : ''
                                                        }`}
                                                    >
                                                        {med?.name ? `${med?.name} ` : ''}
                                                    </span>
                                                    {med?.product_type ? (
                                                        <span>({med?.product_type}) </span>
                                                    ) : (
                                                        ''
                                                    )}

                                                    {med?.generic_name ? (
                                                        <p className="text-10">
                                                            {med?.generic_name}{' '}
                                                        </p>
                                                    ) : (
                                                        ''
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {med?.generic_name ? (
                                                        <p
                                                            className={`bold ${
                                                                render_pdf_config?.medication_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {med?.generic_name}{' '}
                                                        </p>
                                                    ) : (
                                                        ''
                                                    )}
                                                    <span className="text-10">
                                                        {med?.name ? `${med?.name} ` : ''}
                                                    </span>
                                                    {med?.product_type ? (
                                                        <span>({med?.product_type}) </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </>
                                            )}{' '}
                                        </td>

                                        {medSequence.map((conf) => {
                                            if (conf.id === medOptions2.medId.dose) {
                                                return (
                                                    <td
                                                        style={{
                                                            borderColor: borderColor,
                                                            width: `${
                                                                ((medTableWidth?.[conf.id] ||
                                                                    medOptions2
                                                                        .allColumnWidthInNumber[
                                                                        conf.id as keyof typeof medOptions2.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="border medication-table-border-color p-4 text-center"
                                                    >
                                                        {med?.dose?.custom || ''}
                                                        {med?.route?.display_name && (
                                                            <p>
                                                                Route:{' '}
                                                                <p className="bold">
                                                                    {med?.route?.display_name || ''}
                                                                </p>
                                                            </p>
                                                        )}
                                                        {med?.area?.name && (
                                                            <p>
                                                                Apply on:{' '}
                                                                <p className="bold">
                                                                    {med?.area?.name || ''}
                                                                </p>
                                                            </p>
                                                        )}
                                                    </td>
                                                );
                                            }

                                            if (conf.id === medOptions2.medId.frequency) {
                                                return (
                                                    <td
                                                        style={{
                                                            borderColor: borderColor,
                                                            width: `${
                                                                ((medTableWidth?.[conf.id] ||
                                                                    medOptions2
                                                                        .allColumnWidthInNumber[
                                                                        conf.id as keyof typeof medOptions2.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="border medication-table-border-color p-4 text-center"
                                                    >
                                                        <p>{med?.frequency?.custom || ''}</p>
                                                        <p>{med?.timing || ''}</p>
                                                    </td>
                                                );
                                            }

                                            if (conf.id === medOptions2.medId.duration) {
                                                return (
                                                    <td
                                                        style={{
                                                            borderColor: borderColor,
                                                            width: `${
                                                                ((medTableWidth?.[conf.id] ||
                                                                    medOptions2
                                                                        .allColumnWidthInNumber[
                                                                        conf.id as keyof typeof medOptions2.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="border medication-table-border-color p-4 text-center"
                                                    >
                                                        <p>{med?.duration?.custom || ''}</p>
                                                        {med?.start_from?.text ? (
                                                            <p className="bold">
                                                                ({med?.start_from?.text})
                                                            </p>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </td>
                                                );
                                            }

                                            if (conf.id === medOptions2?.medId?.quantity) {
                                                return (
                                                    <td
                                                        style={{
                                                            borderColor: borderColor,
                                                            width: `${
                                                                ((medTableWidth?.[conf.id] ||
                                                                    medOptions2
                                                                        .allColumnWidthInNumber[
                                                                        conf.id as keyof typeof medOptions2.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="border medication-table-border-color p-4 text-center"
                                                    >
                                                        {med?.quantity?.custom || '-'}
                                                    </td>
                                                );
                                            }
                                        })}
                                    </tr>
                                    {med.instruction && (
                                        <tr className="text-11">
                                            <td
                                                style={{ borderColor: borderColor }}
                                                className="bold p-4 border medication-table-border-color text-center"
                                            ></td>
                                            <td
                                                colSpan={5}
                                                style={{ borderColor: borderColor }}
                                                className="p-4 border medication-table-border-color"
                                            >
                                                <span className="p-4 bold">Remarks:</span>
                                                <span>{med.instruction}</span>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </table>
                </div>
            </div>
        );
    }

    let totalWidthCount =
        medTableWidth?.['medication'] || medOptions2.allColumnWidthInNumber['medication'];

    Object.keys(medOptions2.allColumnWidthInNumber).map((key) => {
        if (showColumns?.[key]) {
            totalWidthCount +=
                medTableWidth?.[key] ||
                medOptions2.allColumnWidthInNumber[
                    key as keyof typeof medOptions2.medIdToNameMapping
                ];
        }
    });

    const medicationWidth =
        ((medTableWidth?.['medication'] || medOptions2.allColumnWidthInNumber['medication']) /
            totalWidthCount) *
        96;

    return (
        <div>
            {hideHeading ? (
                ''
            ) : (
                <p
                    style={{
                        textAlign: medicationsTableTitleAlignment,
                        color: medicationsTableHeaderColor,
                    }}
                    className="text-13 text-center prescription-title-color bold underline italic"
                >
                    {heading || 'PRESCRIPTION'}
                </p>
            )}
            <div className="text-darwin-neutral-1000">
                <table
                    style={{ borderColor: borderColor }}
                    className="border-collapse border medication-table-border-color w-full"
                >
                    <thead>
                        <tr className="text-11 bold w-full">
                            <th
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    width: `4%`,
                                }}
                                className="border medication-table-border-color medication-title-color w-64 text-center p-4"
                            ></th>
                            <th
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    width: `${medicationWidth}%`,
                                }}
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                            >
                                Medications
                            </th>
                            {Object.keys(medOptions2.medIdToNameMapping)
                                .map((key) => {
                                    if (!showColumns?.[key]) {
                                        return null;
                                    }
                                    return (
                                        <th
                                            style={{
                                                borderColor: borderColor,
                                                backgroundColor: titleBgColor,
                                                width: `${
                                                    ((medTableWidth?.[key] ||
                                                        medOptions2.allColumnWidthInNumber[
                                                            key as keyof typeof medOptions2.medIdToNameMapping
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                                        >
                                            {
                                                medOptions2.medIdToNameMapping[
                                                    key as keyof typeof medOptions2.medIdToNameMapping
                                                ]
                                            }
                                        </th>
                                    );
                                })
                                .filter(Boolean)}
                        </tr>
                    </thead>

                    {medication?.map((med) => {
                        return (
                            <>
                                <tr className="text-11">
                                    <td
                                        style={{ borderColor: borderColor, width: `4%` }}
                                        className="bold p-4 border medication-table-border-color text-center"
                                    >
                                        {med?.ind || ''}
                                    </td>
                                    <td
                                        style={{
                                            borderColor: borderColor,
                                            width: `${medicationWidth}%`,
                                        }}
                                        className="p-4 border medication-table-border-color"
                                    >
                                        {med?.isTapering && !med?.taperingDoseTitleDisplay ? (
                                            ''
                                        ) : !render_pdf_config?.make_generic_name_as_primary ? (
                                            <>
                                                <span
                                                    className={`bold ${
                                                        render_pdf_config?.medication_name_in_capital
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {med?.name ? `${med?.name} ` : ''}
                                                </span>
                                                {med?.product_type ? (
                                                    <span>({med?.product_type}) </span>
                                                ) : (
                                                    ''
                                                )}

                                                {med?.generic_name ? (
                                                    <p className="text-10">{med?.generic_name} </p>
                                                ) : (
                                                    ''
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {med?.generic_name ? (
                                                    <p
                                                        className={`bold ${
                                                            render_pdf_config?.medication_name_in_capital
                                                                ? 'uppercase'
                                                                : ''
                                                        }`}
                                                    >
                                                        {med?.generic_name}{' '}
                                                    </p>
                                                ) : (
                                                    ''
                                                )}
                                                <span className="text-10">
                                                    {med?.name ? `${med?.name} ` : ''}
                                                </span>
                                                {med?.product_type ? (
                                                    <span>({med?.product_type}) </span>
                                                ) : (
                                                    ''
                                                )}
                                            </>
                                        )}{' '}
                                    </td>

                                    {Object.keys(medOptions2.medIdToNameMapping)
                                        .map((key) => {
                                            if (!showColumns?.[key]) {
                                                return null;
                                            }
                                            if (key === medOptions2.medId.dose) {
                                                return (
                                                    <td
                                                        style={{
                                                            borderColor: borderColor,
                                                            width: `${
                                                                ((medTableWidth?.[key] ||
                                                                    medOptions2
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof medOptions2.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="border medication-table-border-color p-4 text-center"
                                                    >
                                                        {med?.dose?.custom || ''}
                                                        {med?.route?.display_name && (
                                                            <p>
                                                                Route:{' '}
                                                                <p className="bold">
                                                                    {med?.route?.display_name || ''}
                                                                </p>
                                                            </p>
                                                        )}
                                                        {med?.area?.name && (
                                                            <p>
                                                                Apply on:{' '}
                                                                <p className="bold">
                                                                    {med?.area?.name || ''}
                                                                </p>
                                                            </p>
                                                        )}
                                                    </td>
                                                );
                                            }
                                            if (key === medOptions2.medId.frequency) {
                                                return (
                                                    <td
                                                        style={{
                                                            borderColor: borderColor,
                                                            width: `${
                                                                ((medTableWidth?.[key] ||
                                                                    medOptions2
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof medOptions2.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="border medication-table-border-color p-4 text-center"
                                                    >
                                                        <p>{med?.frequency?.custom || ''}</p>
                                                        <p>{med?.timing || ''}</p>
                                                    </td>
                                                );
                                            }
                                            if (key === medOptions2.medId.duration) {
                                                return (
                                                    <td
                                                        style={{
                                                            borderColor: borderColor,
                                                            width: `${
                                                                ((medTableWidth?.[key] ||
                                                                    medOptions2
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof medOptions2.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="border medication-table-border-color p-4 text-center"
                                                    >
                                                        <p>{med?.duration?.custom || ''}</p>
                                                        {med?.start_from?.text ? (
                                                            <p className="bold">
                                                                ({med?.start_from?.text})
                                                            </p>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </td>
                                                );
                                            }
                                            if (key === medOptions2.medId.quantity) {
                                                return (
                                                    <td
                                                        style={{
                                                            borderColor: borderColor,
                                                            width: `${
                                                                ((medTableWidth?.[key] ||
                                                                    medOptions2
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof medOptions2.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="border medication-table-border-color p-4 text-center"
                                                    >
                                                        {med?.quantity?.custom || '-'}
                                                    </td>
                                                );
                                            }
                                        })
                                        .filter(Boolean)}
                                </tr>
                                {med.instruction && (
                                    <tr className="text-11">
                                        <td
                                            style={{ borderColor: borderColor }}
                                            className="bold p-4 border medication-table-border-color text-center"
                                        ></td>
                                        <td
                                            colSpan={5}
                                            style={{ borderColor: borderColor }}
                                            className="p-4 border medication-table-border-color"
                                        >
                                            <span className="p-4 bold">Remarks:</span>
                                            <span>{med.instruction}</span>
                                        </td>
                                    </tr>
                                )}
                            </>
                        );
                    })}
                </table>
            </div>
        </div>
    );
};

//Seperate quantity column without border

export const medOptions3 = {
    medId: {
        dose: 'dose',
        frequency: 'frequency',
        duration: 'duration',
        quantity: 'quantity',
    },
    medIdToNameMapping: {
        dose: 'Dose',
        frequency: 'Frequency',
        duration: 'Duration',
        quantity: 'Quantity',
    },
    width: {
        dose: '10%',
        frequency: '15%',
        duration: '25%',
        quantity: '15%',
    },
    medIdToNameMappingForWidth: {
        medication: 'Medications',
        dose: 'Dose',
        frequency: 'Frequency',
        duration: 'Duration',
        quantity: 'Quantity',
    },
    allColumnWidthInNumber: {
        medication: 31,
        dose: 10,
        frequency: 15,
        duration: 25,
        quantity: 15,
    },
};

export const getMedications3Html = (
    d: RenderPdfPrescription,
    medication_config?: GeniePadElementsSettingItem[],
    render_pdf_config?: TemplateConfig,
): JSX.Element | undefined => {
    const medication = d?.tool?.medications;
    const showColumns: { [key: string]: boolean } = {};
    const titleBgColor = render_pdf_config?.medications_table_title_bg_color;
    const borderColor = render_pdf_config?.medications_table_border_color;
    const heading = render_pdf_config?.medication_table_heading_text;
    const hideHeading = render_pdf_config?.medication_heading_hide;
    const medicationsTableTitleAlignment = render_pdf_config?.medications_table_title_alignment;
    const medicationsTableHeaderColor = render_pdf_config?.medications_table_header_color;
    const medTableWidth = render_pdf_config?.medication_table_width;

    medication?.forEach((med) => {
        if (med?.dose?.custom?.trim() || med?.area?.name || med?.route?.display_name) {
            showColumns['dose'] = true;
        }
        if (med?.frequency?.custom || med?.timing) {
            showColumns['frequency'] = true;
        }
        if (med?.duration?.custom || med?.start_from?.text) {
            showColumns['duration'] = true;
        }
        if (med?.quantity?.custom) {
            showColumns['quantity'] = true;
        }
    });

    if (!medication?.length) {
        return;
    }

    if (medication_config) {
        const medSequence = [
            ...((medication_config
                .map((conf) => {
                    if (!showColumns?.[conf?.id]) {
                        return false;
                    }

                    return medOptions3.medIdToNameMapping[
                        conf.id as keyof typeof medOptions3.medIdToNameMapping
                    ]
                        ? conf
                        : undefined;
                })
                .filter(Boolean) || []) as GeniePadElementsSettingItem[]),
        ];

        let totalWidthCount =
            medTableWidth?.['medication'] || medOptions3.allColumnWidthInNumber['medication'];

        medSequence.map((conf) => {
            totalWidthCount +=
                medTableWidth?.[conf.id] ||
                medOptions3.allColumnWidthInNumber[
                    conf.id as keyof typeof medOptions3.medIdToNameMapping
                ];
        });

        const medicationWidth =
            ((medTableWidth?.['medication'] || medOptions3.allColumnWidthInNumber['medication']) /
                totalWidthCount) *
            96;

        return (
            <div>
                {hideHeading ? (
                    ''
                ) : (
                    <p
                        style={{
                            textAlign: medicationsTableTitleAlignment,
                            color: medicationsTableHeaderColor,
                        }}
                        className="text-13 text-center prescription-title-color bold underline italic"
                    >
                        {heading || 'PRESCRIPTION'}
                    </p>
                )}
                <div className="text-darwin-neutral-1000">
                    <table style={{ width: '100%' }} className="border-collapse w-full">
                        <thead>
                            <tr className="text-11 bold w-full">
                                <th
                                    style={{
                                        borderColor: borderColor,
                                        backgroundColor: titleBgColor,
                                        width: `4%`,
                                    }}
                                    className="border-b medication-table-border-color medication-title-color w-64 text-center p-4"
                                ></th>
                                <th
                                    style={{
                                        borderColor: borderColor,
                                        backgroundColor: titleBgColor,
                                        width: `${medicationWidth}%`,
                                    }}
                                    className="border-b medication-table-border-color medication-title-color bold text-center p-4"
                                >
                                    Medications
                                </th>
                                {medSequence.map((conf) => {
                                    return (
                                        <th
                                            style={{
                                                borderColor: borderColor,
                                                backgroundColor: titleBgColor,
                                                width: `${
                                                    ((medTableWidth?.[conf.id] ||
                                                        medOptions3.allColumnWidthInNumber[
                                                            conf.id as keyof typeof medOptions3.medIdToNameMapping
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border-b medication-table-border-color medication-title-color bold text-center p-4"
                                        >
                                            {
                                                medOptions3.medIdToNameMapping[
                                                    conf.id as keyof typeof medOptions3.medIdToNameMapping
                                                ]
                                            }
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        {medication?.map((med) => {
                            return (
                                <>
                                    <tr
                                        style={{ borderColor: borderColor }}
                                        className={`text-11 ${
                                            med.instruction
                                                ? ''
                                                : 'border-b medication-table-border-color'
                                        }`}
                                    >
                                        <td
                                            style={{ width: `4%` }}
                                            className="bold p-4 text-center"
                                        >
                                            {med?.ind || ''}
                                        </td>
                                        <td
                                            style={{ width: `${medicationWidth}%` }}
                                            className="p-4"
                                        >
                                            {med?.isTapering && !med?.taperingDoseTitleDisplay ? (
                                                ''
                                            ) : !render_pdf_config?.make_generic_name_as_primary ? (
                                                <>
                                                    <span
                                                        className={`bold ${
                                                            render_pdf_config?.medication_name_in_capital
                                                                ? 'uppercase'
                                                                : ''
                                                        }`}
                                                    >
                                                        {med?.name ? `${med?.name} ` : ''}
                                                    </span>
                                                    {med?.product_type ? (
                                                        <span>({med?.product_type}) </span>
                                                    ) : (
                                                        ''
                                                    )}

                                                    {med?.generic_name ? (
                                                        <p className="text-10">
                                                            {med?.generic_name}{' '}
                                                        </p>
                                                    ) : (
                                                        ''
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {med?.generic_name ? (
                                                        <p
                                                            className={`bold ${
                                                                render_pdf_config?.medication_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {med?.generic_name}{' '}
                                                        </p>
                                                    ) : (
                                                        ''
                                                    )}
                                                    <span className="text-10">
                                                        {med?.name ? `${med?.name} ` : ''}
                                                    </span>
                                                    {med?.product_type ? (
                                                        <span>({med?.product_type}) </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </>
                                            )}{' '}
                                        </td>

                                        {medSequence.map((conf) => {
                                            if (conf.id === medOptions3.medId.dose) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[conf.id] ||
                                                                    medOptions3
                                                                        .allColumnWidthInNumber[
                                                                        conf.id as keyof typeof medOptions3.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="p-4 text-center"
                                                    >
                                                        {med?.dose?.custom || ''}
                                                        {med?.route?.display_name && (
                                                            <p>
                                                                Route:{' '}
                                                                <p className="bold">
                                                                    {med?.route?.display_name || ''}
                                                                </p>
                                                            </p>
                                                        )}
                                                        {med?.area?.name && (
                                                            <p>
                                                                Apply on:{' '}
                                                                <p className="bold">
                                                                    {med?.area?.name || ''}
                                                                </p>
                                                            </p>
                                                        )}
                                                    </td>
                                                );
                                            }

                                            if (conf.id === medOptions3.medId.frequency) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[conf.id] ||
                                                                    medOptions3
                                                                        .allColumnWidthInNumber[
                                                                        conf.id as keyof typeof medOptions3.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className=" p-4 text-center"
                                                    >
                                                        <p>{med?.frequency?.custom || ''}</p>
                                                        <p>{med?.timing || ''}</p>
                                                    </td>
                                                );
                                            }

                                            if (conf.id === medOptions3.medId.duration) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[conf.id] ||
                                                                    medOptions3
                                                                        .allColumnWidthInNumber[
                                                                        conf.id as keyof typeof medOptions3.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className=" p-4 text-center"
                                                    >
                                                        <p>{med?.duration?.custom || ''}</p>
                                                        {med?.start_from?.text ? (
                                                            <p className="bold">
                                                                ({med?.start_from?.text})
                                                            </p>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </td>
                                                );
                                            }

                                            if (conf.id === medOptions3?.medId?.quantity) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[conf.id] ||
                                                                    medOptions3
                                                                        .allColumnWidthInNumber[
                                                                        conf.id as keyof typeof medOptions3.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className=" p-4 text-center"
                                                    >
                                                        {med?.quantity?.custom || '-'}
                                                    </td>
                                                );
                                            }
                                        })}
                                    </tr>
                                    {med?.instruction && (
                                        <tr
                                            style={{ borderColor: borderColor }}
                                            className="border-b medication-table-border-color text-11"
                                        >
                                            <td className="bold p-4  text-center"></td>
                                            <td colSpan={5}>
                                                <span className="p-4 bold">Remarks:</span>
                                                <span>{med?.instruction}</span>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </table>
                </div>
            </div>
        );
    }

    let totalWidthCount =
        medTableWidth?.['medication'] || medOptions3.allColumnWidthInNumber['medication'];

    Object.keys(medOptions3.allColumnWidthInNumber).map((key) => {
        if (showColumns?.[key]) {
            totalWidthCount +=
                medTableWidth?.[key] ||
                medOptions3.allColumnWidthInNumber[
                    key as keyof typeof medOptions3.medIdToNameMapping
                ];
        }
    });

    const medicationWidth =
        ((medTableWidth?.['medication'] || medOptions3.allColumnWidthInNumber['medication']) /
            totalWidthCount) *
        96;

    return (
        <div>
            {hideHeading ? (
                ''
            ) : (
                <p
                    style={{
                        textAlign: medicationsTableTitleAlignment,
                        color: medicationsTableHeaderColor,
                    }}
                    className="text-13 text-center prescription-title-color bold underline italic"
                >
                    {heading || 'PRESCRIPTION'}
                </p>
            )}
            <div className="text-darwin-neutral-1000">
                <table className="border-collapse w-full">
                    <thead>
                        <tr className="text-11 bold w-full">
                            <th
                                style={{ borderColor: borderColor, backgroundColor: titleBgColor }}
                                className="border-b medication-table-border-color medication-title-color w-64 text-center p-4"
                            ></th>
                            <th
                                style={{ borderColor: borderColor, backgroundColor: titleBgColor }}
                                className="border-b medication-table-border-color medication-title-color w-64 text-center p-4"
                            >
                                Medications
                            </th>
                            {Object.keys(medOptions3.medIdToNameMapping)
                                .map((key) => {
                                    if (!showColumns?.[key]) {
                                        return null;
                                    }
                                    return (
                                        <th
                                            style={{
                                                borderColor: borderColor,
                                                backgroundColor: titleBgColor,
                                            }}
                                            className="border-b medication-table-border-color medication-title-color w-64 text-center p-4"
                                        >
                                            {
                                                medOptions3.medIdToNameMapping[
                                                    key as keyof typeof medOptions3.medIdToNameMapping
                                                ]
                                            }
                                        </th>
                                    );
                                })
                                .filter(Boolean)}
                        </tr>
                    </thead>

                    {medication?.map((med) => {
                        return (
                            <>
                                <tr
                                    style={{ borderColor: borderColor }}
                                    className={`text-11 ${
                                        med?.instruction
                                            ? ''
                                            : 'border-b medication-table-border-color'
                                    }`}
                                >
                                    <td style={{ width: `4%` }} className="bold p-4  text-center">
                                        {med?.ind || ''}
                                    </td>
                                    <td style={{ width: `${medicationWidth}%` }} className="p-4">
                                        {med?.isTapering && !med?.taperingDoseTitleDisplay ? (
                                            ''
                                        ) : !render_pdf_config?.make_generic_name_as_primary ? (
                                            <>
                                                <span
                                                    className={`bold ${
                                                        render_pdf_config?.medication_name_in_capital
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {med?.name ? `${med?.name} ` : ''}
                                                </span>
                                                {med?.product_type ? (
                                                    <span>({med?.product_type}) </span>
                                                ) : (
                                                    ''
                                                )}

                                                {med?.generic_name ? (
                                                    <p className="text-10">{med?.generic_name} </p>
                                                ) : (
                                                    ''
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {med?.generic_name ? (
                                                    <p
                                                        className={`bold ${
                                                            render_pdf_config?.medication_name_in_capital
                                                                ? 'uppercase'
                                                                : ''
                                                        }`}
                                                    >
                                                        {med?.generic_name}{' '}
                                                    </p>
                                                ) : (
                                                    ''
                                                )}
                                                <span className="text-10">
                                                    {med?.name ? `${med?.name} ` : ''}
                                                </span>
                                                {med?.product_type ? (
                                                    <span>({med?.product_type}) </span>
                                                ) : (
                                                    ''
                                                )}
                                            </>
                                        )}{' '}
                                    </td>

                                    {Object.keys(medOptions3.medIdToNameMapping)
                                        .map((key) => {
                                            if (!showColumns?.[key]) {
                                                return null;
                                            }
                                            if (key === medOptions3.medId.dose) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[key] ||
                                                                    medOptions3
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof medOptions3.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="p-4 text-center"
                                                    >
                                                        {med?.dose?.custom || ''}
                                                        {med?.route?.display_name && (
                                                            <p>
                                                                Route:{' '}
                                                                <p className="bold">
                                                                    {med?.route?.display_name || ''}
                                                                </p>
                                                            </p>
                                                        )}
                                                        {med?.area?.name && (
                                                            <p>
                                                                Apply on:{' '}
                                                                <p className="bold">
                                                                    {med?.area?.name || ''}
                                                                </p>
                                                            </p>
                                                        )}
                                                    </td>
                                                );
                                            }
                                            if (key === medOptions3.medId.frequency) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[key] ||
                                                                    medOptions3
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof medOptions3.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="p-4 text-center"
                                                    >
                                                        <p>{med?.frequency?.custom || ''}</p>
                                                        <p>{med?.timing || ''}</p>
                                                    </td>
                                                );
                                            }
                                            if (key === medOptions3.medId.duration) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[key] ||
                                                                    medOptions3
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof medOptions3.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className=" p-4 text-center"
                                                    >
                                                        <p>{med?.duration?.custom || ''}</p>
                                                        {med?.start_from?.text ? (
                                                            <p className="bold">
                                                                ({med?.start_from?.text})
                                                            </p>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </td>
                                                );
                                            }
                                            if (key === medOptions3.medId.quantity) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[key] ||
                                                                    medOptions3
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof medOptions3.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className=" p-4 text-center"
                                                    >
                                                        {med?.quantity?.custom || '-'}
                                                    </td>
                                                );
                                            }
                                        })
                                        .filter(Boolean)}
                                </tr>
                                {med?.instruction && (
                                    <tr
                                        style={{ borderColor: borderColor }}
                                        className="border-b medication-table-border-color text-11"
                                    >
                                        <td className="bold p-4  text-center"></td>
                                        <td colSpan={5}>
                                            <span className="p-4 bold">Remarks:</span>
                                            <span>{med?.instruction}</span>
                                        </td>
                                    </tr>
                                )}
                            </>
                        );
                    })}
                </table>
            </div>
        </div>
    );
};

// Seperate quantity column without border
export const medOptions4 = {
    medId: {
        dose: 'dose',
        frequency: 'frequency',
        duration: 'duration',
        quantity: 'quantity',
        instruction: 'instruction',
    },
    medIdToNameMapping: {
        dose: 'Dose',
        frequency: 'Frequency',
        duration: 'Duration',
        quantity: 'Quantity',
        instruction: 'Remarks',
    },
    width: {
        dose: '8%',
        frequency: '12%',
        duration: '12%',
        quantity: '12%',
        instruction: '28%',
    },
    medIdToNameMappingForWidth: {
        medication: 'Medications',
        dose: 'Dose',
        frequency: 'Frequency',
        duration: 'Duration',
        quantity: 'Quantity',
        instruction: 'Remarks',
    },
    allColumnWidthInNumber: {
        medication: 24,
        dose: 8,
        frequency: 12,
        duration: 12,
        quantity: 12,
        instruction: 28,
    },
};

export const getMedications4Html = (
    d: RenderPdfPrescription,
    medication_config?: GeniePadElementsSettingItem[],
    render_pdf_config?: TemplateConfig,
): JSX.Element | undefined => {
    const medication = d?.tool?.medications;
    const showColumns: { [key: string]: boolean } = {};
    const titleBgColor = render_pdf_config?.medications_table_title_bg_color;
    const borderColor = render_pdf_config?.medications_table_border_color;
    const heading = render_pdf_config?.medication_table_heading_text;
    const hideHeading = render_pdf_config?.medication_heading_hide;
    const medicationsTableTitleAlignment = render_pdf_config?.medications_table_title_alignment;
    const medicationsTableHeaderColor = render_pdf_config?.medications_table_header_color;
    const medTableWidth = render_pdf_config?.medication_table_width;

    medication?.forEach((med) => {
        if (med?.dose?.custom?.trim() || med?.area?.name || med?.route?.display_name) {
            showColumns['dose'] = true;
        }
        if (med?.frequency?.custom || med?.timing) {
            showColumns['frequency'] = true;
        }
        if (med?.duration?.custom || med?.start_from?.text) {
            showColumns['duration'] = true;
        }
        if (med?.quantity?.custom) {
            showColumns['quantity'] = true;
        }
        if (med?.instruction) {
            showColumns['instruction'] = true;
        }
    });

    if (!medication?.length) {
        return;
    }

    if (medication_config) {
        const medSequence = [
            ...((medication_config
                .map((conf) => {
                    if (!showColumns?.[conf?.id]) {
                        return false;
                    }

                    return medOptions4.medIdToNameMapping[
                        conf.id as keyof typeof medOptions4.medIdToNameMapping
                    ]
                        ? conf
                        : undefined;
                })
                .filter(Boolean) || []) as GeniePadElementsSettingItem[]),
        ];

        let totalWidthCount =
            medTableWidth?.['medication'] || medOptions4.allColumnWidthInNumber['medication'];

        medSequence.map((conf) => {
            totalWidthCount +=
                medTableWidth?.[conf.id] ||
                medOptions4.allColumnWidthInNumber[
                    conf.id as keyof typeof medOptions4.medIdToNameMapping
                ];
        });

        const medicationWidth =
            ((medTableWidth?.['medication'] || medOptions4.allColumnWidthInNumber['medication']) /
                totalWidthCount) *
            96;

        return (
            <div>
                {hideHeading ? (
                    ''
                ) : (
                    <p
                        style={{
                            textAlign: medicationsTableTitleAlignment,
                            color: medicationsTableHeaderColor,
                        }}
                        className="text-13 text-center prescription-title-color bold underline italic"
                    >
                        {heading || 'PRESCRIPTION'}
                    </p>
                )}
                <div className="text-darwin-neutral-1000">
                    <table style={{ width: '100%' }} className="border-collapse w-full">
                        <thead>
                            <tr className="text-11 bold w-full">
                                <th
                                    style={{
                                        borderColor: borderColor,
                                        backgroundColor: titleBgColor,
                                        width: `4%`,
                                    }}
                                    className="border-b medication-table-border-color medication-title-color w-64 text-center p-4"
                                ></th>
                                <th
                                    style={{
                                        borderColor: borderColor,
                                        backgroundColor: titleBgColor,
                                        width: `${medicationWidth}%`,
                                    }}
                                    className="border-b medication-table-border-color medication-title-color bold text-center p-4"
                                >
                                    Medications
                                </th>
                                {medSequence.map((conf) => {
                                    return (
                                        <th
                                            style={{
                                                borderColor: borderColor,
                                                backgroundColor: titleBgColor,
                                                width: `${
                                                    ((medTableWidth?.[conf.id] ||
                                                        medOptions4.allColumnWidthInNumber[
                                                            conf.id as keyof typeof medOptions4.medIdToNameMapping
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border-b medication-table-border-color medication-title-color bold text-center p-4"
                                        >
                                            {
                                                medOptions4.medIdToNameMapping[
                                                    conf.id as keyof typeof medOptions4.medIdToNameMapping
                                                ]
                                            }
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        {medication?.map((med) => {
                            return (
                                <>
                                    <tr
                                        style={{ borderColor: borderColor }}
                                        className={`text-11 ${
                                            med.instruction
                                                ? ''
                                                : 'border-b medication-table-border-color'
                                        }`}
                                    >
                                        <td
                                            style={{ width: `4%` }}
                                            className="bold p-4 text-center"
                                        >
                                            {med?.ind || ''}
                                        </td>
                                        <td
                                            style={{ width: `${medicationWidth}%` }}
                                            className="p-4"
                                        >
                                            {med?.isTapering && !med?.taperingDoseTitleDisplay ? (
                                                ''
                                            ) : !render_pdf_config?.make_generic_name_as_primary ? (
                                                <>
                                                    <span
                                                        className={`bold ${
                                                            render_pdf_config?.medication_name_in_capital
                                                                ? 'uppercase'
                                                                : ''
                                                        }`}
                                                    >
                                                        {med?.name ? `${med?.name} ` : ''}
                                                    </span>
                                                    {med?.product_type ? (
                                                        <span>({med?.product_type}) </span>
                                                    ) : (
                                                        ''
                                                    )}

                                                    {med?.generic_name ? (
                                                        <p className="text-10">
                                                            {med?.generic_name}{' '}
                                                        </p>
                                                    ) : (
                                                        ''
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {med?.generic_name ? (
                                                        <p
                                                            className={`bold ${
                                                                render_pdf_config?.medication_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {med?.generic_name}{' '}
                                                        </p>
                                                    ) : (
                                                        ''
                                                    )}
                                                    <span className="text-10">
                                                        {med?.name ? `${med?.name} ` : ''}
                                                    </span>
                                                    {med?.product_type ? (
                                                        <span>({med?.product_type}) </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </>
                                            )}{' '}
                                        </td>

                                        {medSequence.map((conf) => {
                                            if (conf.id === medOptions4.medId.dose) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[conf.id] ||
                                                                    medOptions4
                                                                        .allColumnWidthInNumber[
                                                                        conf.id as keyof typeof medOptions4.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="p-4 text-center"
                                                    >
                                                        {med?.dose?.custom || ''}
                                                        {med?.route?.display_name && (
                                                            <p>
                                                                Route:{' '}
                                                                <p className="bold">
                                                                    {med?.route?.display_name || ''}
                                                                </p>
                                                            </p>
                                                        )}
                                                        {med?.area?.name && (
                                                            <p>
                                                                Apply on:{' '}
                                                                <p className="bold">
                                                                    {med?.area?.name || ''}
                                                                </p>
                                                            </p>
                                                        )}
                                                    </td>
                                                );
                                            }

                                            if (conf.id === medOptions4.medId.frequency) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[conf.id] ||
                                                                    medOptions4
                                                                        .allColumnWidthInNumber[
                                                                        conf.id as keyof typeof medOptions4.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className=" p-4 text-center"
                                                    >
                                                        <p>{med?.frequency?.custom || ''}</p>
                                                        <p>{med?.timing || ''}</p>
                                                    </td>
                                                );
                                            }

                                            if (conf.id === medOptions4.medId.duration) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[conf.id] ||
                                                                    medOptions4
                                                                        .allColumnWidthInNumber[
                                                                        conf.id as keyof typeof medOptions4.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className=" p-4 text-center"
                                                    >
                                                        <p>{med?.duration?.custom || ''}</p>
                                                        {med?.start_from?.text ? (
                                                            <p className="bold">
                                                                ({med?.start_from?.text})
                                                            </p>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </td>
                                                );
                                            }

                                            if (conf.id === medOptions4?.medId?.quantity) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[conf.id] ||
                                                                    medOptions4
                                                                        .allColumnWidthInNumber[
                                                                        conf.id as keyof typeof medOptions4.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className=" p-4 text-center"
                                                    >
                                                        {med?.quantity?.custom || '-'}
                                                    </td>
                                                );
                                            }

                                            if (conf.id === medOptions4.medId.instruction) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[conf.id] ||
                                                                    medOptions4
                                                                        .allColumnWidthInNumber[
                                                                        conf.id as keyof typeof medOptions4.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="break-all whitespace-preline p-4 text-left"
                                                    >
                                                        {med?.instruction || '-'}
                                                    </td>
                                                );
                                            }
                                        })}
                                    </tr>
                                    <tr
                                        style={{ borderColor: borderColor }}
                                        className="border-b medication-table-border-color text-11"
                                    ></tr>
                                </>
                            );
                        })}
                    </table>
                </div>
            </div>
        );
    }

    let totalWidthCount =
        medTableWidth?.['medication'] || medOptions4.allColumnWidthInNumber['medication'];

    Object.keys(medOptions4.allColumnWidthInNumber).map((key) => {
        if (showColumns?.[key]) {
            totalWidthCount +=
                medTableWidth?.[key] ||
                medOptions4.allColumnWidthInNumber[
                    key as keyof typeof medOptions4.medIdToNameMapping
                ];
        }
    });

    const medicationWidth =
        ((medTableWidth?.['medication'] || medOptions4.allColumnWidthInNumber['medication']) /
            totalWidthCount) *
        96;

    return (
        <div>
            {hideHeading ? (
                ''
            ) : (
                <p
                    style={{
                        textAlign: medicationsTableTitleAlignment,
                        color: medicationsTableHeaderColor,
                    }}
                    className="text-13 text-center prescription-title-color bold underline italic"
                >
                    {heading || 'PRESCRIPTION'}
                </p>
            )}
            <div className="text-darwin-neutral-1000">
                <table className="border-collapse w-full">
                    <thead>
                        <tr className="text-11 bold w-full">
                            <th
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    width: `4%`,
                                }}
                                className="border-b medication-table-border-color medication-title-color w-64 text-center p-4"
                            ></th>
                            <th
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    width: `${medicationWidth}%`,
                                }}
                                className="border-b medication-table-border-color medication-title-color w-64 text-center p-4"
                            >
                                Medications
                            </th>
                            {Object.keys(medOptions4.medIdToNameMapping)
                                .map((key) => {
                                    if (!showColumns?.[key]) {
                                        return null;
                                    }
                                    return (
                                        <th
                                            style={{
                                                borderColor: borderColor,
                                                backgroundColor: titleBgColor,
                                                width: `${
                                                    ((medTableWidth?.[key] ||
                                                        medOptions4.allColumnWidthInNumber[
                                                            key as keyof typeof medOptions4.medIdToNameMapping
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border-b medication-table-border-color medication-title-color w-64 text-center p-4"
                                        >
                                            {
                                                medOptions4.medIdToNameMapping[
                                                    key as keyof typeof medOptions4.medIdToNameMapping
                                                ]
                                            }
                                        </th>
                                    );
                                })
                                .filter(Boolean)}
                        </tr>
                    </thead>

                    {medication?.map((med) => {
                        return (
                            <>
                                <tr
                                    style={{ borderColor: borderColor }}
                                    className={`text-11 ${
                                        med?.instruction
                                            ? ''
                                            : 'border-b medication-table-border-color'
                                    }`}
                                >
                                    <td style={{ width: `4%` }} className="bold p-4  text-center">
                                        {med?.ind || ''}
                                    </td>
                                    <td style={{ width: `${medicationWidth}%` }} className="p-4">
                                        {med?.isTapering && !med?.taperingDoseTitleDisplay ? (
                                            ''
                                        ) : !render_pdf_config?.make_generic_name_as_primary ? (
                                            <>
                                                <span
                                                    className={`bold ${
                                                        render_pdf_config?.medication_name_in_capital
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {med?.name ? `${med?.name} ` : ''}
                                                </span>
                                                {med?.product_type ? (
                                                    <span>({med?.product_type}) </span>
                                                ) : (
                                                    ''
                                                )}

                                                {med?.generic_name ? (
                                                    <p className="text-10">{med?.generic_name} </p>
                                                ) : (
                                                    ''
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {med?.generic_name ? (
                                                    <p
                                                        className={`bold ${
                                                            render_pdf_config?.medication_name_in_capital
                                                                ? 'uppercase'
                                                                : ''
                                                        }`}
                                                    >
                                                        {med?.generic_name}{' '}
                                                    </p>
                                                ) : (
                                                    ''
                                                )}
                                                <span className="text-10">
                                                    {med?.name ? `${med?.name} ` : ''}
                                                </span>
                                                {med?.product_type ? (
                                                    <span>({med?.product_type}) </span>
                                                ) : (
                                                    ''
                                                )}
                                            </>
                                        )}{' '}
                                    </td>

                                    {Object.keys(medOptions4.medIdToNameMapping)
                                        .map((key) => {
                                            if (!showColumns?.[key]) {
                                                return null;
                                            }
                                            if (key === medOptions4.medId.dose) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[key] ||
                                                                    medOptions4
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof medOptions4.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="p-4 text-center"
                                                    >
                                                        {med?.dose?.custom || ''}
                                                        {med?.route?.display_name && (
                                                            <p>
                                                                Route:{' '}
                                                                <p className="bold">
                                                                    {med?.route?.display_name || ''}
                                                                </p>
                                                            </p>
                                                        )}
                                                        {med?.area?.name && (
                                                            <p>
                                                                Apply on:{' '}
                                                                <p className="bold">
                                                                    {med?.area?.name || ''}
                                                                </p>
                                                            </p>
                                                        )}
                                                    </td>
                                                );
                                            }
                                            if (key === medOptions4.medId.frequency) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[key] ||
                                                                    medOptions4
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof medOptions4.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="p-4 text-center"
                                                    >
                                                        <p>{med?.frequency?.custom || ''}</p>
                                                        <p>{med?.timing || ''}</p>
                                                    </td>
                                                );
                                            }
                                            if (key === medOptions4.medId.duration) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[key] ||
                                                                    medOptions4
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof medOptions4.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className=" p-4 text-center"
                                                    >
                                                        <p>{med?.duration?.custom || ''}</p>
                                                        {med?.start_from?.text ? (
                                                            <p className="bold">
                                                                ({med?.start_from?.text})
                                                            </p>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </td>
                                                );
                                            }
                                            if (key === medOptions4.medId.quantity) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[key] ||
                                                                    medOptions4
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof medOptions4.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className=" p-4 text-center"
                                                    >
                                                        {med?.quantity?.custom || '-'}
                                                    </td>
                                                );
                                            }

                                            if (key === medOptions4.medId.instruction) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((medTableWidth?.[key] ||
                                                                    medOptions4
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof medOptions4.medIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="break-all whitespace-preline p-4 text-left"
                                                    >
                                                        {med?.instruction || '-'}
                                                    </td>
                                                );
                                            }
                                        })
                                        .filter(Boolean)}
                                </tr>
                                <tr
                                    style={{ borderColor: borderColor }}
                                    className="border-b medication-table-border-color text-11"
                                ></tr>
                            </>
                        );
                    })}
                </table>
            </div>
        </div>
    );
};

export const medicationFormatToTableMapping = {
    'quantity-column': getMedications2Html,
    'quantity-column-without-border': getMedications3Html,
    'quantity-remarks-column-without-border': getMedications4Html,
};

export const getDyformHtml = (d: RenderPdfPrescription, id: string, config: TemplateV2) => {
    const dyform = d?.tool?.dyform;
    const selectedDyForm = dyform?.find((form) => form.id === id);
    const headingColor = config?.render_pdf_config?.dyform_heading_color;
    const nameColor = config?.render_pdf_config?.dyform_name_color;
    const propertiesColor = config?.render_pdf_config?.dyform_properties_color;
    if (!dyform?.length || !selectedDyForm) {
        return;
    }

    const layout = config?.render_pdf_config?.dyform_data_layout;

    if (layout === 'inline') {
        return (
            <div className="text-darwin-neutral-1000 whitespace-preline">
                <p
                    className="bold uppercase text-darwin-accent-symptoms-blue-800"
                    style={{
                        color: headingColor,
                    }}
                >
                    {selectedDyForm?.name || ''} :
                </p>
                <ul className="text-darwin-neutral-1000 list-disc ml-36 space-y-6">
                    {selectedDyForm?.elements?.map((ele) => {
                        return (
                            <li>
                                <div className="">
                                    <span className="flex items-start space-x-8">
                                        <div className="flex items-center space-x-4">
                                            <span
                                                className={`dyform-title-color ${
                                                    config?.render_pdf_config?.dyform_in_unbold
                                                        ? ''
                                                        : 'bold'
                                                }`}
                                            >
                                                <span
                                                    style={{
                                                        color: nameColor,
                                                    }}
                                                >
                                                    {ele?.name || ''}
                                                </span>
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                <div
                                    style={{
                                        color: propertiesColor,
                                    }}
                                >
                                    {ele?.value || ''}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    return (
        <div className="text-darwin-neutral-1000 whitespace-preline">
            <p
                className="bold uppercase text-darwin-accent-symptoms-blue-800"
                style={{
                    color: headingColor,
                }}
            >
                {selectedDyForm?.name || ''} :
            </p>
            <ul className="text-darwin-neutral-1000 list-disc ml-36">
                {selectedDyForm?.elements?.map((ele) => {
                    return (
                        <li className="">
                            <span className="flex items-start space-x-8">
                                <div className="flex items-center space-x-4">
                                    <span
                                        className={`dyform-title-color ${
                                            config?.render_pdf_config?.dyform_in_unbold
                                                ? ''
                                                : 'bold'
                                        }`}
                                    >
                                        <span
                                            style={{
                                                color: nameColor,
                                            }}
                                        >
                                            {ele?.name || ''}
                                        </span>
                                    </span>
                                    {ele?.value ? <span>-</span> : <></>}
                                </div>
                                <span
                                    style={{
                                        color: propertiesColor,
                                    }}
                                >
                                    {ele?.value || ''}
                                </span>
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export const getAllDyformHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
): (JSX.Element | undefined)[] | undefined => {
    const dyform = d?.tool?.dyform;

    if (!dyform?.length) {
        return;
    }

    return dyform?.map((form) => {
        return getDyformHtml(d, form.id, config);
    });
};

export const getReferredToHtml = (
    d: RenderPdfPrescription,
    config?: TemplateV2,
    sectionName?: string,
): JSX.Element | undefined => {
    const referredTo = d?.tool?.referRenderPdfPrint;
    const headingColor = config?.render_pdf_config?.referred_to_heading_color;
    const propertiesColor = config?.render_pdf_config?.referred_to_properties_color;
    const isBullets = config?.render_pdf_config?.bullets_config?.['refer'];

    if (!referredTo) {
        return;
    }

    return (
        <div>
            {isBullets ? (
                <>
                    {referredTo?.ref_doc_details && referredTo?.ref_doc_details?.length > 0 && (
                        <span
                            style={{
                                color: headingColor,
                            }}
                            className="bold uppercase text-darwin-accent-symptoms-blue-800"
                        >
                            {sectionName || 'REFERRED TO'} :{' '}
                        </span>
                    )}
                    <ul className="ml-36">
                        {referredTo?.ref_doc_details &&
                            referredTo?.ref_doc_details?.length > 0 &&
                            referredTo?.ref_doc_details.map((ref, index) => (
                                <li className="leading-5" key={index}>
                                    <span
                                        style={{
                                            color: propertiesColor,
                                        }}
                                        className={`${
                                            config?.render_pdf_config?.referred_to_in_unbold
                                                ? ''
                                                : 'bold'
                                        }`}
                                    >
                                        {ref?.ref_heading}
                                    </span>
                                    <span
                                        style={{
                                            color: propertiesColor,
                                        }}
                                    >
                                        {ref?.ref_clinic && <span>, {ref?.ref_clinic}</span>}
                                    </span>
                                    {ref?.ref_doc_notes && (
                                        <ul
                                            style={{
                                                paddingLeft: '1rem',
                                                color: propertiesColor,
                                            }}
                                        >
                                            <li>Referral notes : {ref?.ref_doc_notes}</li>
                                        </ul>
                                    )}
                                </li>
                            ))}
                    </ul>
                </>
            ) : (
                <>
                    <div>
                        {referredTo?.ref_doc_details && referredTo?.ref_doc_details?.length > 0 && (
                            <div className="leading-5">
                                <span
                                    style={{
                                        color: headingColor,
                                    }}
                                    className="bold uppercase text-darwin-accent-symptoms-blue-800"
                                >
                                    {sectionName || 'REFERRED TO'} :{' '}
                                </span>
                                {referredTo?.ref_doc_details?.map((ref, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && <span> | </span>}
                                        <span
                                            style={{
                                                color: propertiesColor,
                                            }}
                                            className={`${
                                                config?.render_pdf_config?.referred_to_in_unbold
                                                    ? ''
                                                    : 'bold'
                                            }`}
                                        >
                                            {ref?.ref_heading}
                                        </span>
                                        <span
                                            style={{
                                                color: propertiesColor,
                                            }}
                                        >
                                            {ref?.ref_doc_notes && (
                                                <span>, {ref?.ref_doc_notes}</span>
                                            )}
                                            {ref?.ref_clinic && <span>, {ref?.ref_clinic}</span>}
                                        </span>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export const getFollowupHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
    sectionName?: string,
): JSX.Element | undefined => {
    const followup = d?.tool?.followup;
    const headingColor = config?.render_pdf_config?.followup_heading_color;
    const propertiesColor = config?.render_pdf_config?.followup_properties_color;
    const followupDateColor = config?.render_pdf_config?.followup_date_color;

    if (!followup?.date && !followup?.notes) {
        return getIpdAdmissionHtml(d, config) || undefined;
    }
    return (
        <Fragment>
            {getIpdAdmissionHtml(d, config)}
            <div className="leading-5">
                <span
                    style={{
                        color: headingColor,
                    }}
                    className="bold uppercase text-darwin-accent-symptoms-blue-800"
                >
                    {sectionName || 'FOLLOWUP'}:{' '}
                </span>
                <span
                    style={{
                        color: propertiesColor,
                    }}
                >
                    {followup?.date && (
                        <span>
                            Visit on{' '}
                            <span
                                className={`${
                                    config?.render_pdf_config?.followup_in_unbold ? '' : 'bold'
                                }`}
                                style={{
                                    color: followupDateColor,
                                }}
                            >
                                {followup?.date}
                            </span>
                        </span>
                    )}
                    {followup?.date && followup?.notes ? ', ' : ''}
                    {followup?.notes && <span>Notes : {followup?.notes}</span>}
                </span>
            </div>
        </Fragment>
    );
};

export const getAdvicesHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
    sectionName?: string,
): JSX.Element | undefined => {
    const advices = d?.tool?.advices;
    const advicesFormat = config?.render_pdf_config?.advices_format;
    const headingColor = config?.render_pdf_config?.advices_heading_color;
    const propertiesColor = config?.render_pdf_config?.advices_properties_color;
    const language = d?.translate?.flag && d?.translate?.advices ? d.translate.lang : '';
    const rxElementKeySeperator = config?.render_pdf_config?.rx_element_key_seperator;

    if (!advices?.length) {
        return;
    }

    if (advicesFormat === 'pipe-seperated') {
        return (
            <div className="flex items-start space-x-4 leading-5">
                <p
                    style={{
                        color: headingColor,
                        minWidth: 'fit-content',
                    }}
                    className="bold pt-1 uppercase whitespace-nowrap text-darwin-accent-symptoms-blue-800"
                >
                    {sectionName || 'ADVICE'} :
                </p>
                <div className="flex flex-wrap">
                    {advices?.map((advice, i) => {
                        return (
                            <>
                                <div
                                    className={`whitespace-preline flex flex-col tiny-mce ${
                                        language === 'mr' || language === 'hi' ? 'text-13' : ''
                                    }`}
                                    style={{
                                        width: 'fit-content',
                                        color: propertiesColor,
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: advice?.parsedText || advice?.text || '',
                                    }}
                                />
                                <div className="font-700">
                                    {i !== (advices || []).length - 1 &&
                                        getRxSeperator(rxElementKeySeperator)}
                                    &nbsp;
                                </div>
                            </>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="leading-5">
            <p
                style={{
                    color: headingColor,
                    minWidth: 'fit-content',
                }}
                className="bold uppercase text-darwin-accent-symptoms-blue-800"
            >
                {sectionName || 'ADVICE'} :
            </p>
            <ul className="ml-36">
                {advices?.map((advice) => {
                    return (
                        <li>
                            <span
                                className={`whitespace-preline flex flex-col tiny-mce ${
                                    language === 'mr' || language === 'hi' ? 'text-13' : ''
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: advice?.parsedText || advice?.text || '',
                                }}
                                style={{
                                    color: propertiesColor,
                                }}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export const getNotesHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
    sectionName?: string,
): JSX.Element | undefined => {
    const prescriptionNotes = d?.tool?.prescriptionNotes_html?.text;
    const headingColor = config?.render_pdf_config?.notes_heading_color;
    const propertiesColor = config?.render_pdf_config?.notes_properties_color;

    if (!prescriptionNotes) {
        return;
    }

    return (
        <div className="leading-5">
            <p
                style={{
                    color: headingColor,
                }}
                className="bold uppercase text-darwin-accent-symptoms-blue-800"
            >
                {sectionName || 'NOTES'} :
            </p>
            <p className="text-darwin-neutral-1000">
                <div
                    className="tiny-mce"
                    dangerouslySetInnerHTML={{
                        __html: prescriptionNotes || '',
                    }}
                    style={{
                        color: propertiesColor,
                    }}
                />
            </p>
        </div>
    );
};

export const getLabTestsHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
    sectionName?: string,
): JSX.Element | undefined => {
    const labTests = d?.tool?.labTests;
    const isBullets = config?.render_pdf_config?.bullets_config?.['labTests'];
    const headingColor = config?.render_pdf_config?.lab_tests_heading_color;
    const nameColor = config?.render_pdf_config?.lab_tests_name_color;
    const propertiesColor = config?.render_pdf_config?.lab_tests_properties_color;
    const rxElementKeySeperator = config?.render_pdf_config?.rx_element_key_seperator;

    if (!labTests?.length) {
        return;
    }

    return (
        <div className="leading-5">
            <span
                style={{
                    color: headingColor,
                }}
                className="bold uppercase text-darwin-accent-symptoms-blue-800"
            >
                {sectionName || 'PRESCRIBED LAB TESTS'} :{' '}
            </span>
            {isBullets ? (
                <ul className="ml-36">
                    {labTests?.map((labTest) => {
                        return (
                            <li className="">
                                <span
                                    className={`${
                                        config?.render_pdf_config?.lab_tests_name_in_unbold
                                            ? ''
                                            : 'bold'
                                    } ${
                                        config?.render_pdf_config?.lab_tests_name_in_capital
                                            ? 'uppercase'
                                            : ''
                                    }`}
                                    style={{
                                        color: nameColor,
                                    }}
                                >
                                    {labTest?.name || ''}{' '}
                                </span>
                                <span
                                    style={{
                                        color: propertiesColor,
                                    }}
                                >
                                    {labTest?.test_on || labTest?.repeat_on ? (
                                        <span>
                                            (
                                            {labTest?.test_on
                                                ? `On: ${buildFollowUpLabel(
                                                      labTest?.test_on || '',
                                                  )}`
                                                : ''}
                                            {labTest?.test_on && labTest?.repeat_on ? ' | ' : ''}
                                            {labTest?.repeat_on
                                                ? `Repeat: ${buildFollowUpLabel(
                                                      labTest?.repeat_on || '',
                                                  )}`
                                                : ''}
                                            )
                                        </span>
                                    ) : labTest?.name && labTest?.originalRemark ? (
                                        '-'
                                    ) : (
                                        ''
                                    )}{' '}
                                    <span>
                                        {labTest?.originalRemark
                                            ? `Remark: ${labTest?.originalRemark}`
                                            : ''}
                                    </span>{' '}
                                    <span>
                                        {labTest?.content
                                            ? `(Includes: ${labTest?.content?.join(', ')})`
                                            : ''}
                                    </span>{' '}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                labTests?.map((labTest, i: number) => {
                    return (
                        <span>
                            <span
                                className={`${
                                    config?.render_pdf_config?.lab_tests_name_in_unbold
                                        ? ''
                                        : 'bold'
                                } ${
                                    config?.render_pdf_config?.lab_tests_name_in_capital
                                        ? 'uppercase'
                                        : ''
                                }`}
                                style={{
                                    color: nameColor,
                                }}
                            >
                                {labTest?.name || ''}{' '}
                            </span>
                            <span
                                style={{
                                    color: propertiesColor,
                                }}
                            >
                                {labTest?.test_on || labTest?.repeat_on ? (
                                    <span>
                                        (
                                        {labTest?.test_on
                                            ? `On: ${buildFollowUpLabel(labTest?.test_on || '')}`
                                            : ''}
                                        {labTest?.test_on && labTest?.repeat_on ? ' | ' : ''}
                                        {labTest?.repeat_on
                                            ? `Repeat: ${buildFollowUpLabel(
                                                  labTest?.repeat_on || '',
                                              )}`
                                            : ''}
                                        )
                                    </span>
                                ) : labTest?.name && labTest?.originalRemark ? (
                                    '-'
                                ) : (
                                    ''
                                )}
                                <span>
                                    {labTest?.originalRemark
                                        ? ` Remark: ${labTest?.originalRemark}`
                                        : ''}
                                </span>
                                <span>
                                    {labTest?.content
                                        ? ` (Includes: ${labTest?.content?.join(', ')})`
                                        : ''}
                                    {i !== (labTests || []).length - 1 && (
                                        <span
                                            className="bold"
                                            style={{
                                                color: '#000',
                                            }}
                                        >
                                            {getRxSeperator(rxElementKeySeperator)}
                                        </span>
                                    )}{' '}
                                </span>{' '}
                            </span>
                        </span>
                    );
                })
            )}
        </div>
    );
};

// keeping it for some time : other best wayyyyyy
export const transformBlocksToInline = (html: string): string => {
    let result = html;
    if (html.startsWith('(') && html.endsWith(')')) {
        // Remove "(Note:" from the start and ")" from the end
        result = html.substring(1, html.length - 1);
    }
    // // Split the HTML at </p> tags
    // const parts = html.split(/<\/p>/i);
    // // If there's only one part, there are no closing p tags
    // if (parts.length <= 1) {
    //     return html;
    // }
    // // Replace all opening p tags in each part
    // const transformedParts = parts.map((part) =>
    //     part.replace(/<p[^>]*>/gi, '<span style="display:inline;">'),
    // );
    // // Join the parts back together with appropriate endings
    // let result = '';
    // for (let i = 0; i < transformedParts.length; i++) {
    //     result += transformedParts[i];
    //     // Add the appropriate closing for all except the last part
    //     // (the last part doesn't need anything added since it didn't end with </p>)
    //     if (i < transformedParts.length - 1) {
    //         if (i === transformedParts.length - 2) {
    //             // Second-to-last part (the last one with a </p>)
    //             result += '</span>';
    //         } else {
    //             // All other parts
    //             result += '</br></span>';
    //         }
    //     }
    // }

    return result;
};

export const getSymptomsHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
    sectionName?: string,
): JSX.Element | undefined => {
    const symptoms = d?.tool?.sectionProp?.sy;
    const isBullets = config?.render_pdf_config?.bullets_config?.['symptoms'];
    const headingColor = config?.render_pdf_config?.symptoms_heading_color;
    const nameColor = config?.render_pdf_config?.symptoms_name_color;
    const propertiesColor = config?.render_pdf_config?.symptoms_properties_color;
    const rxElementKeySeperator = config?.render_pdf_config?.rx_element_key_seperator;

    if (!symptoms) {
        return;
    }

    return (
        <div className="text-darwin-neutral-1000">
            <span
                style={{
                    color: headingColor,
                }}
                className="uppercase text-darwin-accent-symptoms-blue-800 bold"
            >
                {sectionName || 'Symptoms'} :
            </span>
            {isBullets ? (
                <ul className="ml-36 list-outside list-disc">
                    {symptoms?.values?.map((sym) => {
                        return (
                            <li className="flex flex-wrap items-start gap-x-1 list-disc">
                                <span
                                    className={`${
                                        config?.render_pdf_config?.symptoms_name_in_unbold
                                            ? ''
                                            : 'bold'
                                    } ${
                                        config?.render_pdf_config?.symptoms_name_in_capital
                                            ? 'uppercase'
                                            : ''
                                    }`}
                                    style={{
                                        color: nameColor,
                                    }}
                                >
                                    {sym?.name ? `${sym?.name} ` : ''}
                                    {sym?.toshow ? `- ` : ''}
                                </span>

                                {sym?.toshow?.includes('<ul ') || sym?.toshow?.includes('<ul>') ? (
                                    <div
                                        className={`tiny-mce`}
                                        style={{
                                            width: 'fit-content',
                                            color: propertiesColor,
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: transformBlocksToInline(sym?.toshow || ''),
                                        }}
                                    />
                                ) : (
                                    <span
                                        className={`tiny-mce`}
                                        style={{
                                            width: 'fit-content',
                                            color: propertiesColor,
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: transformBlocksToInline(sym?.toshow || ''),
                                        }}
                                    ></span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <span className="ml-8">
                    {symptoms?.values?.map((sym, i: number) => {
                        return (
                            <span>
                                <span
                                    className={`${
                                        config?.render_pdf_config?.symptoms_name_in_unbold
                                            ? ''
                                            : 'bold'
                                    } ${
                                        config?.render_pdf_config?.symptoms_name_in_capital
                                            ? 'uppercase'
                                            : ''
                                    }`}
                                    style={{
                                        color: nameColor,
                                    }}
                                >
                                    {sym?.name ? `${sym?.name} ` : ''}
                                </span>
                                <span
                                    style={{
                                        color: propertiesColor,
                                    }}
                                >
                                    {utility?.parseHTMLToStringForPipeSeperated(sym?.toshow) || ''}

                                    <span
                                        className="bold"
                                        style={{
                                            color: '#000',
                                        }}
                                    >
                                        {i !== (symptoms?.values || []).length - 1 &&
                                            getRxSeperator(rxElementKeySeperator)}
                                        &nbsp;
                                    </span>
                                </span>
                            </span>
                        );
                    })}
                </span>
            )}
        </div>
    );
};

export const getRxSeperator = (key?: SeperatorType) => {
    if (!key || key === '|') {
        return <>&nbsp;|&nbsp;</>;
    }

    return key;
};

export const getDiagnosisHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
    sectionName?: string,
): JSX.Element | undefined => {
    const diagnosis = d.tool?.sectionProp?.dy;
    const isBullets = config?.render_pdf_config?.bullets_config?.['diagnosis'];
    const headingColor = config?.render_pdf_config?.diagnosis_heading_color;
    const nameColor = config?.render_pdf_config?.diagnosis_name_color;
    const propertiesColor = config?.render_pdf_config?.diagnosis_properties_color;
    const rxElementKeySeperator = config?.render_pdf_config?.rx_element_key_seperator;

    if (!diagnosis) {
        return;
    }

    return (
        <div className="text-darwin-neutral-1000">
            <span
                style={{
                    color: headingColor,
                }}
                className="uppercase text-darwin-accent-symptoms-blue-800 bold"
            >
                {sectionName || 'DIAGNOSIS'} :
            </span>
            {isBullets ? (
                <ul className="ml-36 list-outside list-disc">
                    {diagnosis?.values?.map((diag) => {
                        return (
                            <li className="flex flex-wrap items-start gap-x-1 list-disc">
                                <span
                                    className={`${
                                        config?.render_pdf_config?.diagnosis_name_in_unbold
                                            ? ''
                                            : 'bold'
                                    } ${
                                        config?.render_pdf_config?.diagnosis_name_in_capital
                                            ? 'uppercase'
                                            : ''
                                    }`}
                                    style={{
                                        color: nameColor,
                                    }}
                                >
                                    {diag?.name ? `${diag?.name} ` : ''}
                                    {diag?.toshow ? `- ` : ''}
                                </span>
                                {diag?.toshow?.includes('<ul ') ||
                                diag?.toshow?.includes('<ul>') ? (
                                    <div
                                        className={`tiny-mce`}
                                        style={{
                                            width: 'fit-content',
                                            color: propertiesColor,
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: transformBlocksToInline(diag?.toshow || ''),
                                        }}
                                    />
                                ) : (
                                    <span
                                        className={`tiny-mce`}
                                        style={{
                                            width: 'fit-content',
                                            color: propertiesColor,
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: transformBlocksToInline(diag?.toshow || ''),
                                        }}
                                    ></span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <span className="ml-8">
                    {diagnosis?.values?.map((diag, i: number) => {
                        return (
                            <span>
                                <span
                                    className={`${
                                        config?.render_pdf_config?.diagnosis_name_in_unbold
                                            ? ''
                                            : 'bold'
                                    } ${
                                        config?.render_pdf_config?.diagnosis_name_in_capital
                                            ? 'uppercase'
                                            : ''
                                    }`}
                                    style={{
                                        color: nameColor,
                                    }}
                                >
                                    {diag?.name ? `${diag?.name} ` : ''}
                                </span>
                                <span
                                    style={{
                                        color: propertiesColor,
                                    }}
                                >
                                    {/* {diag?.toshow || ''} */}
                                    {utility?.parseHTMLToStringForPipeSeperated(diag?.toshow) || ''}
                                </span>
                                {i !== (diagnosis?.values || [])?.length - 1 && (
                                    <span
                                        className="bold"
                                        style={{
                                            color: '#000',
                                        }}
                                    >
                                        {getRxSeperator(rxElementKeySeperator)}
                                    </span>
                                )}
                            </span>
                        );
                    })}
                </span>
            )}
        </div>
    );
};
type MedicalHistory =
    | 'pmh'
    | 'fh'
    | 'lh'
    | 'th'
    | 'cm'
    | 'da'
    | 'oa'
    | 'pp'
    | 'omh'
    | 'd-vh'
    | 'g-vh';

const mhSectionNameToColor = {
    pmh: 'patient_medical_history',
    fh: 'family_history',
    lh: 'lifestyle_habits',
    th: 'travel_history',
    cm: 'current_medications',
    da: 'drug_allergies',
    oa: 'other_allergies',
    pp: 'past_procedure',
    omh: 'other_medical_history',
    'd-vh': 'due-vaccination-history',
    'g-vh': 'given-vaccination-history',
};

export const getPmhHtml = (
    d: RenderPdfPrescription,
    type: MedicalHistory,
    config: TemplateV2,
): JSX.Element | undefined => {
    const mhData = d?.tool?.sectionProp?.mhData?.[type];
    const isBullets =
        type === 'g-vh' || type === 'd-vh'
            ? true
            : config?.render_pdf_config?.bullets_config?.['medicalHistory'];
    const headingColor = config?.render_pdf_config?.pmh_heading_color;
    const nameColor = config?.render_pdf_config?.pmh_name_color;
    const propertiesColor = config?.render_pdf_config?.pmh_properties_color;
    const rxElementKeySeperator = config?.render_pdf_config?.rx_element_key_seperator;

    const sectionHeadingColor = config?.render_pdf_config?.[
        `${mhSectionNameToColor?.[type] || ''}_heading_color` as keyof TemplateConfig
    ] as string;
    const sectionNameColor = config?.render_pdf_config?.[
        `${mhSectionNameToColor?.[type] || ''}_name_color` as keyof TemplateConfig
    ] as string;
    const sectionPropertiesColor = config?.render_pdf_config?.[
        `${mhSectionNameToColor?.[type] || ''}_properties_color` as keyof TemplateConfig
    ] as string;

    if (!mhData) {
        return;
    }
    const { medical_history_status_display } = config?.render_pdf_config || {};
    const status_display = medical_history_status_display || 'clinical';

    const editStatus = (toshow: string, status_display: string): string => {
        if (toshow.includes('Status:')) {
            if (status_display === 'reported') {
                return toshow.replace(/Status: (Active|Inactive)/i, (match, status) => {
                    const newStatus = status.toLowerCase() === 'active' ? 'Yes' : 'No';
                    return `Status: ${newStatus}`;
                });
            }
        }
        return toshow;
    };

    return (
        <div className="text-darwin-neutral-1000">
            <span
                style={{
                    color: sectionHeadingColor || headingColor,
                }}
                className="text-darwin-accent-symptoms-blue-800 bold"
            >
                {mhData?.name} :
            </span>
            {isBullets ? (
                <ul className="ml-36">
                    {mhData?.values?.map((mh) => {
                        return (
                            <li className="">
                                <span
                                    className={`${
                                        config?.render_pdf_config?.medical_history_name_in_unbold
                                            ? ''
                                            : 'bold'
                                    }`}
                                    style={{
                                        color: sectionNameColor || nameColor,
                                    }}
                                >
                                    {mh?.name ? `${mh?.name} ` : ''}
                                </span>
                                <span
                                    style={{
                                        color: sectionPropertiesColor || propertiesColor,
                                    }}
                                >
                                    {editStatus(mh?.toshow, status_display) || ''}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <span className="ml-8">
                    {mhData?.values?.map((mh, i: number) => {
                        return (
                            <>
                                <span
                                    className={`${
                                        config?.render_pdf_config?.medical_history_name_in_unbold
                                            ? ''
                                            : 'bold'
                                    }`}
                                    style={{
                                        color: sectionNameColor || nameColor,
                                    }}
                                >
                                    {mh?.name ? `${mh?.name} ` : ''}
                                </span>
                                <span
                                    style={{
                                        color: sectionPropertiesColor || propertiesColor,
                                    }}
                                >
                                    {mh?.toshow || ''}
                                </span>
                                {i !== (mhData?.values || [])?.length - 1 && (
                                    <span className="bold">
                                        {getRxSeperator(rxElementKeySeperator)}
                                    </span>
                                )}{' '}
                            </>
                        );
                    })}
                </span>
            )}
        </div>
    );
};

export const getExaminationFindingsHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
    sectionName?: string,
): JSX.Element | undefined => {
    const examintionFindings = d.tool?.medicalHistory?.examinations;
    const isBullets = config?.render_pdf_config?.bullets_config?.['examinations'];
    const headingColor = config?.render_pdf_config?.examinations_heading_color;
    const nameColor = config?.render_pdf_config?.examinations_name_color;
    const propertiesColor = config?.render_pdf_config?.examinations_properties_color;
    const rxElementKeySeperator = config?.render_pdf_config?.rx_element_key_seperator;

    if (!examintionFindings?.length) {
        return;
    }

    return (
        <div className="text-darwin-neutral-1000">
            <span
                style={{
                    color: headingColor,
                }}
                className="uppercase text-darwin-accent-symptoms-blue-800 bold"
            >
                {sectionName || 'EXAMINATION FINDINGS'} :
            </span>

            {isBullets ? (
                <ul className="ml-36">
                    {examintionFindings?.map((examination) => {
                        return (
                            <li className="">
                                <span
                                    className={`${
                                        config?.render_pdf_config
                                            ?.examination_findings_name_in_unbold
                                            ? ''
                                            : 'bold'
                                    }`}
                                    style={{
                                        color: nameColor,
                                    }}
                                >
                                    {examination?.name ? `${examination?.name} ` : ''}
                                </span>
                                <span
                                    style={{
                                        color: propertiesColor,
                                    }}
                                >
                                    {examination?.notes ? `(${examination?.notes})` : ''}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <span className="ml-8">
                    {examintionFindings?.map((examination, i: number) => {
                        return (
                            <span>
                                <span
                                    className={`${
                                        config?.render_pdf_config
                                            ?.examination_findings_name_in_unbold
                                            ? ''
                                            : 'bold'
                                    }`}
                                    style={{
                                        color: nameColor,
                                    }}
                                >
                                    {examination?.name ? `${examination?.name}` : ''}
                                </span>
                                <span
                                    style={{
                                        color: propertiesColor,
                                    }}
                                >
                                    {examination?.notes ? ` (${examination?.notes})` : ''}
                                </span>{' '}
                                {i !== (examintionFindings || [])?.length - 1 && (
                                    <span className="bold">
                                        {getRxSeperator(rxElementKeySeperator)}
                                    </span>
                                )}{' '}
                            </span>
                        );
                    })}
                </span>
            )}
        </div>
    );
};

export const getInvestigativeReadingsHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
    sectionName?: string,
): JSX.Element | undefined => {
    const isBullets = config?.render_pdf_config?.bullets_config?.['labVitals'];
    const labVitalFormat = config?.render_pdf_config?.lab_vitals_format;
    const headingColor = config?.render_pdf_config?.lab_vitals_heading_color;
    const nameColor = config?.render_pdf_config?.lab_vitals_name_color;
    const propertiesColor = config?.render_pdf_config?.lab_vitals_properties_color;
    const rxElementKeySeperator = config?.render_pdf_config?.rx_element_key_seperator;
    const isTestBasedTabularFormat = config?.render_pdf_config?.tabular_config?.['labVitals'];
    const isDefaultTabularFormat = config?.render_pdf_config?.tabular_config?.['labVitals_v2'];
    if (isTestBasedTabularFormat) {
        const labVitals = d?.tool?.labVitalsDate;
        if (!labVitals?.length) {
            return;
        }
        // Collect all unique dates and test names
        const allDates = Array.from(new Set(labVitals?.map((lv) => lv.dt)))?.sort((a, b) => {
            const da = Date.parse(a.replace(/'/g, ''));
            const db = Date.parse(b.replace(/'/g, ''));
            if (!isNaN(da) && !isNaN(db)) {
                return db - da; // descending
            }
            return b.localeCompare(a); // fallback
        });
        const allNamesSet = new Set<string>();
        labVitals?.forEach((lv) => {
            lv?.arr?.forEach((item: any) => {
                if (item.name) allNamesSet.add(item.name);
            });
        });
        const allNames = Array.from(allNamesSet);

        // Build a map: name -> { date -> reading }
        const nameDateMap: Record<string, Record<string, any>> = {};
        allNames?.forEach((name) => {
            nameDateMap[name] = {};
        });
        labVitals?.forEach((lv) => {
            lv?.arr?.forEach((item: any) => {
                if (item?.name) {
                    nameDateMap[item.name][lv.dt] = item;
                }
            });
        });

        // Calculate widths
        const serialWidth = '4%';
        const nameWidth = '25%';
        const dateColCount = allDates.length;
        const dateColWidth = dateColCount > 0 ? `${(76 / dateColCount).toFixed(2)}%` : 'auto';

        return (
            <div className="text-darwin-neutral-1000">
                <span
                    style={{ color: headingColor }}
                    className="uppercase text-darwin-accent-symptoms-blue-800 bold"
                >
                    {sectionName || 'INVESTIGATIVE READINGS'} :
                </span>
                <table className="border-collapse border medication-table-border-color w-full mt-2">
                    <thead>
                        <tr className="text-11 bold w-full">
                            <th
                                style={{ width: serialWidth }}
                                className="border medication-table-border-color medication-title-color w-64 text-center p-4"
                            >
                                {' '}
                            </th>
                            <th
                                style={{ width: nameWidth }}
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                            >
                                Name
                            </th>
                            {allDates.map((dt) => (
                                <th
                                    key={dt}
                                    style={{ width: dateColWidth }}
                                    className="border medication-table-border-color medication-title-color bold text-center p-4"
                                >
                                    {dt
                                        ? dt?.length === 10
                                            ? `${dt?.slice(0, 2)}${dt?.slice(3, 5)}${dt?.slice(
                                                  8,
                                                  10,
                                              )}`
                                            : dt
                                        : ''}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allNames?.map((name, idx) => (
                            <tr className="text-11" key={name}>
                                <td className="p-4 border medication-table-border-color text-center">
                                    {idx + 1}
                                </td>
                                <td className="p-4 border medication-table-border-color text-left">
                                    <span
                                        className={`${
                                            config?.render_pdf_config?.lab_vitals_name_in_unbold
                                                ? ''
                                                : 'bold'
                                        }`}
                                    >
                                        {name}
                                    </span>
                                </td>
                                {allDates?.map((dt) => {
                                    const reading = nameDateMap[name][dt];
                                    return (
                                        <td
                                            key={dt}
                                            className="p-4 border medication-table-border-color text-left align-middle"
                                        >
                                            {reading ? (
                                                <div className="flex flex-col items-center justify-center">
                                                    <span>
                                                        {reading?.value} {reading?.unit?.name}
                                                    </span>
                                                    {reading?.interpretation && (
                                                        <span className="text-10 mt-1">
                                                            {'[ '}
                                                            {reading?.interpretation?.value || ''}
                                                            {' ]'}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : null}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (isDefaultTabularFormat) {
        const labVitals = d?.tool?.labVitals;
        if (!labVitals?.length) {
            return;
        }

        // Width allocations for each column
        const serialWidth = '4%';
        const nameWidth = '24%';
        const dateColWidth = '12%';
        const readingColWidth = '20%';
        const interpretationColWidth = '15%';
        const remarksColWidth = '25%';

        return (
            <div className="text-darwin-neutral-1000">
                <span
                    style={{ color: headingColor }}
                    className="uppercase text-darwin-accent-symptoms-blue-800 bold"
                >
                    {sectionName || 'INVESTIGATIVE READINGS'} :
                </span>
                <table className="border-collapse border medication-table-border-color w-full mt-2">
                    <thead>
                        <tr className="text-11 bold w-full">
                            <th
                                style={{ width: serialWidth }}
                                className="border medication-table-border-color medication-title-color text-center p-4"
                            />
                            <th
                                style={{ width: nameWidth }}
                                className="border medication-table-border-color medication-title-color text-center p-4"
                            >
                                Name
                            </th>
                            <th
                                style={{ width: readingColWidth }}
                                className="border medication-table-border-color medication-title-color text-center p-4"
                            >
                                Reading
                            </th>
                            <th
                                style={{ width: interpretationColWidth }}
                                className="border medication-table-border-color medication-title-color text-center p-4"
                            >
                                Interpretation
                            </th>
                            <th
                                style={{ width: dateColWidth }}
                                className="border medication-table-border-color medication-title-color text-center p-4"
                            >
                                Date
                            </th>
                            <th
                                style={{ width: remarksColWidth }}
                                className="border medication-table-border-color medication-title-color text-center p-4"
                            >
                                Remarks
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {labVitals?.map((labVital, idx) => (
                            <tr className="text-11" key={`${labVital?.name}-${idx}`}>
                                <td className="p-4 border medication-table-border-color text-center">
                                    {idx + 1}
                                </td>
                                <td className="p-4 border medication-table-border-color text-left">
                                    <span
                                        className={`${
                                            config?.render_pdf_config?.lab_vitals_name_in_unbold
                                                ? ''
                                                : 'bold'
                                        }`}
                                    >
                                        {labVital?.name || ''}
                                    </span>
                                </td>
                                <td className="p-4 border medication-table-border-color text-left">
                                    {labVital?.value} {labVital?.unit?.name}
                                </td>
                                <td className="p-4 border medication-table-border-color text-left">
                                    {labVital?.interpretation?.value || ''}
                                </td>
                                <td className="p-4 border medication-table-border-color text-left">
                                    {labVital?.dateInString || ''}
                                </td>
                                <td className="p-4 border medication-table-border-color text-left">
                                    {labVital?.remark || ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (labVitalFormat === 'date-data') {
        const labVitals = d.tool.labVitalsDate;

        if (!labVitals?.length) {
            return;
        }

        return (
            <div className="text-darwin-neutral-1000">
                <span
                    style={{
                        color: headingColor,
                    }}
                    className="uppercase text-darwin-accent-symptoms-blue-800 bold"
                >
                    {sectionName || 'INVESTIGATIVE READINGS'} :
                </span>

                <ul className="ml-36">
                    {labVitals?.map((labVital) => {
                        return (
                            <li className="">
                                {labVital?.dt && (
                                    <span
                                        style={{
                                            color: nameColor,
                                        }}
                                        className="bold"
                                    >
                                        {labVital?.dt || ''} :{' '}
                                    </span>
                                )}

                                {labVital.arr.map((labValue, i) => {
                                    return (
                                        <span
                                            style={{
                                                color: propertiesColor,
                                            }}
                                        >
                                            {labValue.name && <span>{labValue.name} - </span>}
                                            <span>
                                                {labValue.toshownodate || ''}{' '}
                                                {i !== (labVital.arr || []).length - 1 &&
                                                    getRxSeperator(rxElementKeySeperator)}{' '}
                                            </span>
                                        </span>
                                    );
                                })}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    const labVitals = d?.tool?.labVitals;

    if (!labVitals?.length) {
        return;
    }
    return (
        <div className="text-darwin-neutral-1000">
            <span
                style={{
                    color: headingColor,
                }}
                className="uppercase text-darwin-accent-symptoms-blue-800 bold"
            >
                {sectionName || 'INVESTIGATIVE READINGS'} :
            </span>

            {isBullets ? (
                <ul className="ml-36">
                    {labVitals?.map((labVital) => {
                        return (
                            <li className="">
                                {labVital?.name && (
                                    <span
                                        className={`uppercase ${
                                            config?.render_pdf_config?.lab_vitals_name_in_unbold
                                                ? ''
                                                : 'bold'
                                        }`}
                                        style={{
                                            color: nameColor,
                                        }}
                                    >
                                        {labVital?.name || ''} :{' '}
                                    </span>
                                )}
                                <span
                                    style={{
                                        color: propertiesColor,
                                    }}
                                >
                                    {labVital?.toshow || ''}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <span className="ml-8">
                    {labVitals?.map((labVital, i) => {
                        return (
                            <span>
                                {labVital?.name && (
                                    <span
                                        className={`uppercase ${
                                            config?.render_pdf_config?.lab_vitals_name_in_unbold
                                                ? ''
                                                : 'bold'
                                        }`}
                                        style={{
                                            color: nameColor,
                                        }}
                                    >
                                        {labVital?.name || ''} :{' '}
                                    </span>
                                )}
                                <span
                                    style={{
                                        color: propertiesColor,
                                    }}
                                >
                                    {labVital?.toshow || ''}
                                </span>
                                {i !== (labVitals || [])?.length - 1 && (
                                    <span className="bold">
                                        {getRxSeperator(rxElementKeySeperator)}
                                    </span>
                                )}{' '}
                            </span>
                        );
                    })}
                </span>
            )}
        </div>
    );
};

export const getVitalsHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
): JSX.Element | undefined => {
    const vitals = d.tool?.medicalHistory?.vitals;
    const isBullets = config?.render_pdf_config?.bullets_config?.['vitals'];
    const isTabular = config?.render_pdf_config?.tabular_config?.['vitals'];
    const headingColor = config?.render_pdf_config?.vitals_heading_color;
    const nameColor = config?.render_pdf_config?.vitals_name_color;
    const propertiesColor = config?.render_pdf_config?.vitals_properties_color;
    const rxElementKeySeperator = config?.render_pdf_config?.rx_element_key_seperator;
    const isExtraLarge = config?.render_pdf_config?.prescription_size === 'extra-large';

    if (!vitals?.length) {
        return;
    }

    return (
        <div className="text-darwin-neutral-1000">
            <span
                style={{
                    color: headingColor,
                }}
                className="uppercase text-darwin-accent-symptoms-blue-800 bold"
            >
                VITALS :
            </span>

            {isBullets ? (
                <ul className="ml-36">
                    {vitals?.map((vital) => {
                        return (
                            <li className="">
                                <span
                                    className={`uppercase ${
                                        config?.render_pdf_config?.vitals_in_unbold ? '' : 'bold'
                                    }`}
                                    style={{
                                        color: nameColor,
                                    }}
                                >
                                    {vital?.dis_name || vital?.name || ''}
                                </span>
                                -
                                <span
                                    style={{
                                        color: propertiesColor,
                                    }}
                                >
                                    {vital?.value?.qt || ''}
                                    {vital?.value?.unit || ''}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            ) : isTabular ? (
                <table
                    className="border-collapse border medication-table-border-color w-full"
                    style={{
                        maxWidth: isExtraLarge ? 650 : 550,
                    }}
                >
                    <thead>
                        <tr className="text-11">
                            <th
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                                style={{ width: '8%' }}
                            ></th>
                            <th
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                                style={{ width: '30%' }}
                            >
                                Vital
                            </th>
                            <th
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                                style={{ width: '25%' }}
                            >
                                Observation
                            </th>
                            <th
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                                style={{ width: '37%' }}
                            >
                                Biological Reference Interval
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {vitals.map((i, index) => {
                            const { name, value } = i;
                            return (
                                <tr className="text-11">
                                    <td className="p-4 border medication-table-border-color text-center">
                                        {index + 1}
                                    </td>
                                    <td className="p-4 border medication-table-border-color">
                                        {name || '-'}
                                    </td>
                                    <td className="p-4 border medication-table-border-color text-center">
                                        {value.qt} {value.unit}
                                    </td>
                                    <td className="p-4 border medication-table-border-color text-center">
                                        {!value.safe
                                            ? ''
                                            : `${
                                                  (value.safe.normal_value
                                                      ? `${value.safe.normal_value} ${
                                                            value.unit || ''
                                                        }`
                                                      : '') ||
                                                  (value.safe.low && value.safe.high
                                                      ? `${value.safe.low} - ${value.safe.high} ${
                                                            value.unit || ''
                                                        }`
                                                      : '')
                                              }`}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <span className="ml-8">
                    {vitals?.map((vital, i) => {
                        return (
                            <span>
                                <span
                                    className={`uppercase ${
                                        config?.render_pdf_config?.vitals_in_unbold ? '' : 'bold'
                                    }`}
                                    style={{
                                        color: nameColor,
                                    }}
                                >
                                    {vital?.name || ''}
                                </span>
                                -
                                <span
                                    style={{
                                        color: propertiesColor,
                                    }}
                                >
                                    {vital?.value?.qt || ''}
                                    {vital?.value?.unit || ''}
                                </span>
                                {i !== (d.tool?.medicalHistory?.vitals || []).length - 1 && (
                                    <span className="bold">
                                        {getRxSeperator(rxElementKeySeperator)}
                                    </span>
                                )}{' '}
                            </span>
                        );
                    })}
                </span>
            )}
        </div>
    );
};

export const getGrowthChartVitalsHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
): JSX.Element | undefined => {
    const gcVitals = d.tool?.medicalHistory?.growthChartVitals?.chartValues;
    const gcChartType = d.tool?.medicalHistory?.growthChartVitals?.chartType;
    const headingColor = config?.render_pdf_config?.growth_chart_heading_color;
    const keyColor = config?.render_pdf_config?.growth_chart_name_color;
    const propertyColor = config?.render_pdf_config?.growth_chart_properties_color;
    if (!gcVitals?.length) {
        return;
    }

    return (
        <div className="text-darwin-neutral-1000">
            <span
                className="uppercase text-darwin-accent-symptoms-blue-800 bold"
                style={{ color: headingColor }}
            >
                GROWTH CHART INDICATORS {gcChartType === 'fanton' ? '[FENTON]' : `[WHO/IAP]`} :
            </span>

            <ul className="ml-36">
                {gcVitals?.map((vital) => {
                    return (
                        <li className="">
                            <span className={`uppercase bold`} style={{ color: keyColor }}>
                                {vital?.name || ''}
                            </span>
                            : <span style={{ color: propertyColor }}>{vital?.value}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export const getFormDataHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
    ptFormFields?: DFormEntity[],
    fromHeader?: boolean,
): JSX.Element | null => {
    const nameColor = config?.render_pdf_config?.patient_details_form_data_name_color;
    const propertiesColor = config?.render_pdf_config?.patient_details_form_data_properties_color;
    if (!d?.patient?.formData?.length) {
        return null;
    }

    const commonFormData = d?.patient?.formData?.filter(
        (fd) => fd.key === 'uhid' || ptFormFields?.some((ptf) => ptf.key === fd.key),
    );

    if (!commonFormData?.length) {
        return null;
    }

    if (config?.render_pdf_config?.patient_form_data_format === 'pipe-seperated-without-key') {
        return (
            <div
                className={
                    fromHeader
                        ? `flex flex-wrap text-darwin-neutral-1000 `
                        : `flex flex-wrap text-darwin-neutral-1000 pb-4`
                }
            >
                {commonFormData?.map((formData, i) => {
                    return (
                        <>
                            <span
                                className="break-all"
                                style={{
                                    color: propertiesColor,
                                }}
                            >
                                {formData?.value || ''}
                            </span>
                            {(commonFormData?.length || 0) - 1 === i ? (
                                <span
                                    className={`${
                                        config?.render_pdf_config?.patient_form_data_in_unbold
                                            ? ''
                                            : 'bold'
                                    }`}
                                >
                                    .
                                </span>
                            ) : (
                                <span
                                    className={`${
                                        config?.render_pdf_config?.patient_form_data_in_unbold
                                            ? ''
                                            : 'bold'
                                    }`}
                                >
                                    &nbsp; | &nbsp;
                                </span>
                            )}
                            &nbsp;
                        </>
                    );
                })}
            </div>
        );
    }

    return (
        <div
            className={
                fromHeader
                    ? `flex flex-wrap italic text-darwin-neutral-1000 `
                    : `flex flex-wrap italic text-darwin-neutral-1000 pb-4`
            }
        >
            {commonFormData.map((formData, i) => {
                return (
                    <>
                        <span
                            className={`${
                                config?.render_pdf_config?.patient_form_data_in_unbold ? '' : 'bold'
                            } break-all`}
                            style={{
                                color: nameColor,
                            }}
                        >
                            {formData?.label || ''}
                        </span>
                        &nbsp;:&nbsp;
                        <span
                            className="break-all"
                            style={{
                                color: propertiesColor,
                            }}
                        >
                            {formData?.value || ''}
                        </span>
                        {(commonFormData?.length || 0) - 1 === i ? (
                            <span
                                className={`${
                                    config?.render_pdf_config?.patient_form_data_in_unbold
                                        ? ''
                                        : 'bold'
                                }`}
                            >
                                .
                            </span>
                        ) : (
                            <span
                                className={`${
                                    config?.render_pdf_config?.patient_form_data_in_unbold
                                        ? ''
                                        : 'bold'
                                }`}
                            >
                                ,
                            </span>
                        )}
                        &nbsp;
                    </>
                );
            })}
        </div>
    );
};

export const getVisitDateHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
): JSX.Element | null => {
    const dateColor = config?.render_pdf_config?.patient_details_date_color;

    const timeZoneInfo =
        d?.timeZone === 'Asia/Calcutta' || d?.timeZone === 'Asia/Kolkata'
            ? ''
            : getTimeZoneInfo(d.timeZone).abbreviation;

    if (config?.render_pdf_config?.date_and_time === 'date' && (d?.dateEnd || d?.date)) {
        return (
            <p
                className={`${config?.render_pdf_config?.date_in_unbold ? '' : 'bold'}`}
                style={{
                    color: dateColor,
                }}
            >
                {moment(
                    formatDateInTimeZone({
                        date: d.dateEnd || d.date || '',
                        timeZone: d?.timeZone || 'Asia/Calcutta',
                    }),
                ).format('DD/MM/YYYY') || ''}{' '}
                {timeZoneInfo}
            </p>
        );
    }

    if (
        config?.render_pdf_config?.date_and_time === 'day-month-date-year-time' &&
        (d?.dateEnd || d?.date)
    ) {
        return (
            <p
                className={`${config?.render_pdf_config?.date_in_unbold ? '' : 'bold'}`}
                style={{
                    color: dateColor,
                }}
            >
                {moment(
                    formatDateInTimeZone({
                        date: d.dateEnd || d.date || '',
                        timeZone: d?.timeZone || 'Asia/Calcutta',
                    }),
                ).format('dddd, MMMM D, YYYY h:mm A') || ''}{' '}
                {timeZoneInfo}
            </p>
        );
    }

    return d?.dateEnd || d?.date ? (
        <p
            className={`${
                config?.render_pdf_config?.date_in_unbold ? '' : 'bold'
            }  whitespace-nowrap`}
            style={{
                color: dateColor,
            }}
        >
            {moment(
                formatDateInTimeZone({
                    date: d.dateEnd || d.date || '',
                    timeZone: d?.timeZone || 'Asia/Calcutta',
                }),
            ).format('DD/MM/YYYY, HH:mm') || ''}{' '}
            {timeZoneInfo}
        </p>
    ) : null;
};

export const getPatientDetailsHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
): JSX.Element => {
    const patientDetailsFormat = config?.render_pdf_config?.patient_details_format;
    const patientDetailsUppercase = config?.render_pdf_config?.patient_details_in_uppercase;
    const patientNameColor = config?.render_pdf_config?.patient_details_patient_name_color;

    if (patientDetailsFormat === 'name-age-slash-gender-number') {
        const ageGender = [
            d?.patientAge,
            d?.patient?.profile?.personal?.gender?.charAt(0)?.toUpperCase(),
        ]
            .filter(Boolean)
            .join(' / ');

        const c = d?.patient?.profile?.personal?.phone?.c || '';
        const n = d?.patient?.profile?.personal?.phone?.n || '';
        const mobileNumber = c && n ? `${c}${n}` : '';

        return (
            <div
                style={
                    patientDetailsUppercase
                        ? {
                              textTransform: 'uppercase',
                          }
                        : undefined
                }
            >
                {d?.patient?.profile?.personal?.name && (
                    <>
                        <span
                            style={{
                                color: patientNameColor,
                            }}
                        >
                            <span className="bold">Name: </span>
                            {d?.patient?.profile?.personal?.name || ''}
                        </span>{' '}
                        ,{' '}
                    </>
                )}

                {ageGender && (
                    <span>
                        <span className="bold">Age/Gender :</span> {ageGender},{' '}
                    </span>
                )}

                {mobileNumber && (
                    <span>
                        <span className="bold">Mobile Number :</span> {mobileNumber}
                    </span>
                )}
            </div>
        );
    }

    const c = d?.patient?.profile?.personal?.phone?.c || '';
    const n = d?.patient?.profile?.personal?.phone?.n || '';
    const mobileNumber = c && n ? `${c}${n}` : '';

    const patientDetails = [
        d?.patient?.profile?.personal?.gender,
        d?.patientAge,
        mobileNumber,
    ].filter(Boolean);

    return (
        <div
            style={
                patientDetailsUppercase
                    ? {
                          textTransform: 'uppercase',
                      }
                    : undefined
            }
        >
            <span
                className="text-13 bold"
                style={{
                    color: patientNameColor,
                }}
            >
                {d?.patient?.profile?.personal?.name || ''},{' '}
            </span>
            {patientDetails.map((detail) => {
                return <span>{detail || ''}, </span>;
            })}
        </div>
    );
};

function getTimeZoneInfo(
    timeZone: string = 'Asia/Kolkata',
): {
    abbreviation: string;
} {
    const now = new Date();

    // Get abbreviation (short form, e.g., IST, PST)
    const abbreviation =
        new Intl.DateTimeFormat('en-US', {
            timeZone,
            timeZoneName: 'short',
        })
            .formatToParts(now)
            .find((part) => part.type === 'timeZoneName')?.value || '';

    return { abbreviation };
}

export const getDentalExaminationsHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
): JSX.Element | undefined => {
    const dentalExaminations = d.tool?.dentalExaminations;
    const headingColor = config?.render_pdf_config?.dental_examinations_heading_color;
    const propertiesColor = config?.render_pdf_config?.dental_examinations_properties_color;
    const keyColor = config?.render_pdf_config?.dental_examinations_key_color;

    if (!dentalExaminations) {
        return;
    }

    const groupByTooth = groupBy(dentalExaminations, (i) => i.group_id || i.teeth_id);

    return (
        <div className="space-y-4 text-darwin-neutral-1000">
            <p
                className="uppercase text-darwin-accent-symptoms-blue-800 bold"
                style={{ color: headingColor }}
            >
                Dental Examinations / Past Procedures :
            </p>
            <div>
                {Object.entries(groupByTooth).map((t) => {
                    const teeth = uniq(
                        t[1].map((i) => {
                            return `${TEETH_TO_NAME[i.teeth_id || ''] || `T${i.teeth_id}`} ${
                                i.surfaces && i.surfaces.length > 0
                                    ? `(${i.surfaces?.map((i) => i.name)})`
                                    : ''
                            }`;
                        }),
                    ).join(', ');
                    const examinations = uniq(
                        t[1].map((i) => {
                            const sinceAndRemark = [
                                i.since ? `Since: ${moment(i.since).format('Do MMM YY')}` : '',
                                i.remark?.trim() ? `Notes: ${i.remark.trim()}` : '',
                            ]
                                .filter(Boolean)
                                .join(', ');
                            return `${i.name} ${sinceAndRemark && `(${sinceAndRemark})`}`;
                        }),
                    ).join(', ');
                    return (
                        <p>
                            -{' '}
                            <span className="font-700" style={{ color: keyColor }}>
                                {TEETH_TO_NAME[teeth] || teeth || 'T'}:{' '}
                            </span>
                            <span style={{ color: propertiesColor }}>{examinations}</span>
                        </p>
                    );
                })}
            </div>
        </div>
    );
};

export const getDentalProceduresHtml = (
    d: RenderPdfPrescription,
    config: TemplateV2,
): JSX.Element | undefined => {
    const dentalProcedures = d.tool?.dentalProcedures;
    const headingColor = config?.render_pdf_config?.dental_procedures_heading_color;
    const titleBgColor = config?.render_pdf_config?.dental_procedures_table_heading_color;
    const borderColor = config?.render_pdf_config?.dental_procedures_table_border_color;
    if (!dentalProcedures || !dentalProcedures.length) {
        return;
    }
    const showColumns: { [key: string]: boolean } = {};
    dentalProcedures?.forEach(
        ({ teeth_ids, surfaces, visits, start_on, remark, conducted_by, assisted_by }) => {
            if (teeth_ids && teeth_ids?.length > 0) {
                showColumns['teeth_ids'] = true;
            }
            if (surfaces && surfaces?.length > 0) {
                showColumns['surfaces'] = true;
            }
            if (visits) {
                showColumns['visits'] = true;
            }
            if (start_on) {
                showColumns['start_on'] = true;
            }
            if (remark || conducted_by || assisted_by) {
                showColumns['remark'] = true;
            }
        },
    );

    return (
        <div className="space-y-4 text-darwin-neutral-1000">
            <p
                className="uppercase text-darwin-accent-symptoms-blue-800 bold"
                style={{ color: headingColor }}
            >
                Dental Procedures :
            </p>
            <table className="border-collapse border medication-table-border-color w-full">
                <thead>
                    <tr className="text-11">
                        <th
                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                            style={{
                                borderColor: borderColor,
                                backgroundColor: titleBgColor,
                                width: '4.5%',
                            }}
                        >
                            *
                        </th>
                        <th
                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                            style={{
                                borderColor: borderColor,
                                backgroundColor: titleBgColor,
                                width: '25%',
                            }}
                        >
                            Procedure
                        </th>
                        {showColumns['teeth_ids'] && (
                            <th
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                }}
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                            >
                                Teeth
                            </th>
                        )}
                        {showColumns['surfaces'] && (
                            <th
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    width: '16%',
                                }}
                            >
                                Surfaces
                            </th>
                        )}
                        {showColumns['visits'] && (
                            <th
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    width: '7.5%',
                                }}
                            >
                                Visits
                            </th>
                        )}
                        {showColumns['start_on'] && (
                            <th
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    maxWidth: '17.5%',
                                }}
                            >
                                Date
                            </th>
                        )}
                        {showColumns['remark'] && (
                            <th
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    minWidth: '15%',
                                }}
                            >
                                Notes
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {dentalProcedures.map((i, index) => {
                        const {
                            name,
                            teeth_ids,
                            surfaces,
                            start_on,
                            remark,
                            visits,
                            conducted_by,
                            assisted_by,
                        } = i;
                        return (
                            <tr className="text-11">
                                <td
                                    style={{ borderColor: borderColor }}
                                    className="p-4 border medication-table-border-color text-center"
                                >
                                    {index + 1}
                                </td>
                                <td
                                    style={{ borderColor: borderColor }}
                                    className="p-4 border medication-table-border-color"
                                >
                                    {name || '-'}
                                </td>
                                {showColumns['teeth_ids'] && (
                                    <td
                                        style={{ borderColor: borderColor }}
                                        className="p-4 border medication-table-border-color text-center"
                                    >
                                        {teeth_ids?.join(', ') || '-'}
                                    </td>
                                )}
                                {showColumns['surfaces'] && (
                                    <td
                                        style={{ borderColor: borderColor }}
                                        className="p-4 border medication-table-border-color text-center"
                                    >
                                        {surfaces?.map((i) => i.name)?.join(', ') || '-'}
                                    </td>
                                )}
                                {showColumns['visits'] && (
                                    <td
                                        style={{ borderColor: borderColor }}
                                        className="p-4 border medication-table-border-color text-center"
                                    >
                                        {visits || '-'}
                                    </td>
                                )}
                                {showColumns['start_on'] && (
                                    <td
                                        style={{ borderColor: borderColor }}
                                        className="p-4 border medication-table-border-color text-center"
                                    >
                                        {start_on ? moment(start_on).format('Do MMM YY') : '-'}
                                    </td>
                                )}
                                {showColumns['remark'] && (
                                    <td
                                        style={{ borderColor: borderColor }}
                                        className="p-4 border medication-table-border-color text-center"
                                    >
                                        <p>
                                            {remark
                                                ? remark
                                                : conducted_by || assisted_by
                                                ? ''
                                                : '-'}
                                        </p>
                                        {conducted_by && <p>Conducted By: {conducted_by}</p>}
                                        {assisted_by && <p>Assisted By: {assisted_by}</p>}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

type opthalType = keyof typeof rxKeyToHeadingMap;

export const getOphthalmologyHtml = (
    d: RenderPdfPrescription,
    type: opthalType,
    config: TemplateV2,
): JSX.Element | undefined => {
    const ophthalData = d?.tool?.[type];
    const headingColor = config?.render_pdf_config?.opthal_heading_color;
    const titleBgColor = config?.render_pdf_config?.opthal_table_heading_color;
    const borderColor = config?.render_pdf_config?.opthal_table_border_color;
    const allKeys: Set<string> = new Set([]);

    if (!ophthalData || ophthalData.length === 0) {
        return;
    }

    ophthalData.forEach((i) => {
        Object.entries(i)
            .filter(
                ([k, v]) =>
                    k !== 'id' &&
                    k !== 'eye' &&
                    k !== 'name' &&
                    v &&
                    typeof v === 'object' &&
                    'value' in v &&
                    v.value !== null &&
                    v.value !== undefined &&
                    (typeof v.value === 'number' ||
                        (typeof v.value === 'string' && v.value.trim() !== '')),
            )
            .forEach(([k, v]) => {
                allKeys.add(k);
            });
    });
    const cols = getColumns(type);

    const sortCols = cols.map((col) => col.key);
    const keysArray = [...allKeys];
    const sortedAllKeys = sortCols.filter((key) => keysArray.includes(key as string));
    const allKeysArray = [...sortedAllKeys];

    return (
        <div className="mb-4 text-darwin-neutral-1000">
            <p
                className="uppercase text-darwin-accent-symptoms-blue-800 bold"
                style={{ color: headingColor }}
            >
                {rxKeyToHeadingMap?.[type]} :
            </p>
            <table className="border-collapse border medication-table-border-color w-full">
                <thead>
                    <tr className="text-11">
                        <th
                            className="border medication-table-border-color medication-title-color bold text-center p-4 uppercase"
                            style={{
                                borderColor: borderColor,
                                backgroundColor: titleBgColor,
                                width: '20%',
                            }}
                        >
                            Eye
                        </th>

                        {allKeysArray.map((key) => {
                            return (
                                <th
                                    className="border medication-table-border-color medication-title-color bold text-center p-4 uppercase"
                                    style={{
                                        borderColor: borderColor,
                                        backgroundColor: titleBgColor,
                                        width: `${80 / allKeysArray.length}%`,
                                    }}
                                >
                                    {key}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {ophthalData?.map((data) => {
                        return (
                            <tr className="text-11">
                                <td
                                    style={{ borderColor: borderColor }}
                                    className="p-4 border text-center medication-table-border-color"
                                >
                                    {data['eye'].value || data.name || '-'}
                                </td>
                                {allKeysArray.map((key) => {
                                    return (
                                        <td
                                            style={{ borderColor: borderColor }}
                                            className="p-4 border text-center medication-table-border-color"
                                        >
                                            {data?.[key as string]?.custom}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export const getInjectionsHtml = (data: RenderPdfPrescription): JSX.Element | undefined => {
    const injections = data.tool?.injections;

    const timeZoneInfo =
        data?.timeZone === 'Asia/Calcutta' || data?.timeZone === 'Asia/Kolkata'
            ? ''
            : getTimeZoneInfo(data.timeZone).abbreviation;

    if (!injections) {
        return;
    }

    return (
        <div className="space-y-4 text-darwin-neutral-1000">
            <p className="uppercase text-darwin-accent-symptoms-blue-800 bold">Injections :</p>
            <table className="border-collapse border medication-table-border-color w-full">
                <thead>
                    <tr className="text-11">
                        <th
                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                            style={{ width: '5%' }}
                        ></th>
                        <th
                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                            style={{ width: '25%' }}
                        >
                            Injection
                        </th>
                        <th className="border medication-table-border-color medication-title-color bold text-center p-4">
                            Dose
                        </th>
                        <th className="border medication-table-border-color medication-title-color bold text-center p-4">
                            Route
                        </th>
                        <th
                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                            style={{ width: '20%' }}
                        >
                            Infusion Rate
                        </th>
                        <th
                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                            style={{ width: '7.5%' }}
                        >
                            Frequency
                        </th>
                        <th
                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                            style={{ width: '17.5%' }}
                        >
                            Timing
                        </th>
                        <th
                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                            style={{ width: '15%' }}
                        >
                            Duration
                        </th>
                        <th
                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                            style={{ width: '15%' }}
                        >
                            Remarks
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {injections.map((injection, index) => {
                        return (
                            <>
                                <tr className="text-11">
                                    <td
                                        className="p-4 border medication-table-border-color text-center"
                                        rowSpan={
                                            Math.max(
                                                injection?.added_drug?.length || 0,
                                                injection?.tapering_dose?.length || 0,
                                            ) + 1
                                        }
                                    >
                                        {index + 1}
                                    </td>
                                    <td
                                        className="p-4 border medication-table-border-color"
                                        rowSpan={(injection?.tapering_dose?.length || 0) + 1}
                                    >
                                        {injection?.name}
                                        {injection?.generic_name}
                                    </td>
                                    {renderInjectionRow(
                                        {
                                            injection,
                                            routeSpan:
                                                Math.max(
                                                    injection?.added_drug?.length || 0,
                                                    injection?.tapering_dose?.length || 0,
                                                ) + 1,
                                            spanAll: !!injection?.added_drug?.length,
                                        },
                                        timeZoneInfo,
                                    )}
                                </tr>
                                {injection?.added_drug?.map((drug) => (
                                    <tr key={drug.id}>
                                        <td className="p-4 border medication-table-border-color">
                                            {drug.name}
                                            {drug.generic_name}
                                        </td>
                                        {renderInjectionRow(
                                            { injection: drug, spanAll: true },
                                            timeZoneInfo,
                                        )}
                                    </tr>
                                ))}
                                {injection?.tapering_dose?.map((td) => (
                                    <tr key={injection?.id}>
                                        {renderInjectionRow({ injection: td }, timeZoneInfo)}
                                    </tr>
                                ))}
                            </>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const renderInjectionRow = (
    {
        injection,
        routeSpan = 0,
        spanAll = false,
    }: {
        routeSpan?: number;
        injection: InjectionsEntity;
        spanAll?: boolean;
    },
    timeZoneInfo: string = 'Asia/Calcutta',
) => {
    return (
        <>
            <td className="p-4 border medication-table-border-color text-center">
                {injection?.dose?.custom}
            </td>
            {routeSpan ? (
                <td
                    className="p-4 border medication-table-border-color text-center"
                    rowSpan={routeSpan}
                >
                    {injection?.route}
                </td>
            ) : null}
            {spanAll ? (
                routeSpan ? (
                    <td
                        className="p-4 border medication-table-border-color text-center"
                        rowSpan={routeSpan}
                    >
                        <div className="flex flex-col gap-y-4">
                            <div>{injection?.infusion_rate?.iv_drop_rate?.custom}</div>
                            <div>{injection?.infusion_rate?.iv_rate?.custom}</div>
                            <div>
                                {injection?.infusion_rate?.infusion_time?.custom
                                    ? `Over ${injection?.infusion_rate?.infusion_time?.custom}`
                                    : null}
                            </div>
                        </div>
                    </td>
                ) : null
            ) : (
                <td className="p-4 border medication-table-border-color text-center">
                    <div className="flex flex-col gap-y-4">
                        <div>{injection?.infusion_rate?.iv_drop_rate?.custom}</div>
                        <div>{injection?.infusion_rate?.iv_rate?.custom}</div>
                        <div>
                            {injection?.infusion_rate?.infusion_time?.custom
                                ? `Over ${injection?.infusion_rate?.infusion_time?.custom}`
                                : null}
                        </div>
                    </div>
                </td>
            )}
            {spanAll ? (
                routeSpan ? (
                    <td
                        className="p-4 border medication-table-border-color text-center"
                        rowSpan={routeSpan}
                    >
                        <div className="flex flex-col gap-y-4">
                            <div>{injection?.frequency?.custom}</div>
                            <div>
                                {injection?.frequency?.time_split?.map((time) => (
                                    <div className="flex flex-col">
                                        <span>
                                            {moment(
                                                formatDateInTimeZone({
                                                    date: time.timing?.toString(),
                                                    timeZone: timeZoneInfo,
                                                }),
                                            ).format('hh:mm A')}
                                        </span>
                                        {time?.custom ? -(<span>{time?.custom}</span>) : null}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </td>
                ) : null
            ) : (
                <td className="p-4 border medication-table-border-color text-center">
                    <div className="flex flex-col gap-y-4">
                        <div>{injection?.frequency?.custom}</div>
                        <div>
                            {injection?.frequency?.time_split?.map((time) => (
                                <div className="flex flex-col">
                                    <span>
                                        {moment(
                                            formatDateInTimeZone({
                                                date: time.timing?.toString(),
                                                timeZone: timeZoneInfo,
                                            }),
                                        ).format('hh:mm A')}
                                    </span>
                                    {time?.custom ? -(<span>{time?.custom}</span>) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </td>
            )}

            {spanAll ? (
                routeSpan ? (
                    <td
                        className="p-4 border medication-table-border-color text-center"
                        rowSpan={routeSpan}
                    >
                        <div className="flex flex-col">{injection?.timing}</div>
                    </td>
                ) : null
            ) : (
                <td className="p-4 border medication-table-border-color text-center">
                    <div className="flex flex-col">{injection?.timing}</div>
                </td>
            )}
            {spanAll ? (
                routeSpan ? (
                    <td
                        className="p-4 border medication-table-border-color text-center"
                        rowSpan={routeSpan}
                    >
                        {injection?.duration?.custom}
                    </td>
                ) : null
            ) : (
                <td className="p-4 border medication-table-border-color text-center">
                    {injection?.duration?.custom}
                </td>
            )}
            {spanAll ? (
                routeSpan ? (
                    <td
                        className="p-4 border medication-table-border-color text-center"
                        rowSpan={routeSpan}
                    >
                        {injection?.instructions}
                    </td>
                ) : null
            ) : (
                <td className="p-4 border medication-table-border-color text-center">
                    {injection?.instructions}
                </td>
            )}
        </>
    );
};

export const getInjectionsLineHtml = (data: RenderPdfPrescription): JSX.Element | undefined => {
    const injections = data?.tool?.injections;

    const timeZoneInfo =
        data?.timeZone === 'Asia/Calcutta' || data?.timeZone === 'Asia/Kolkata'
            ? ''
            : getTimeZoneInfo(data.timeZone).abbreviation;

    if (!injections?.length) {
        return;
    }

    return (
        <div className="space-y-4 text-darwin-neutral-1000">
            <p className="uppercase text-darwin-accent-symptoms-blue-800 bold">Injections :</p>
            {injections.map((injection) => {
                return (
                    <ul className="ml-36">
                        {injection?.added_drug && injection?.added_drug.length > 0 ? (
                            <li>
                                <u>
                                    <span className="bold">{injection?.name}</span>{' '}
                                    {injection?.generic_name
                                        ? `(${injection?.generic_name})`
                                        : null}
                                    {injection?.dose?.custom
                                        ? ` - [${injection?.dose?.custom}]`
                                        : null}
                                    {injection?.added_drug.map((drug) => (
                                        <>
                                            {' '}
                                            <span className="bold">
                                                {drug.name ? ` + ${drug.name}` : null}
                                            </span>
                                            {drug.generic_name ? ` (${drug.generic_name})` : null}
                                            {drug.dose?.custom ? ` - ${drug.dose?.custom}` : null}
                                        </>
                                    ))}
                                </u>
                                {injection?.route ? ` - ${injection?.route}` : null}
                                {injection?.infusion_rate?.iv_drop_rate?.custom
                                    ? ` - ${injection?.infusion_rate?.iv_drop_rate?.custom}`
                                    : null}
                                {injection?.infusion_rate?.iv_rate?.custom
                                    ? ` - ${injection?.infusion_rate?.iv_rate?.custom}`
                                    : null}
                                {injection?.infusion_rate?.infusion_time?.custom ? (
                                    <>
                                        {' '}
                                        - <span>Over</span>{' '}
                                        {injection?.infusion_rate?.infusion_time?.custom}
                                    </>
                                ) : null}
                                <div>
                                    {injection?.frequency?.custom ? (
                                        <>
                                            <span>{injection?.frequency?.custom}</span>
                                        </>
                                    ) : null}
                                    {injection?.frequency?.time_split?.map((time, index, array) => (
                                        <>
                                            {' '}
                                            {index === 0 ? '[ at ' : ''}
                                            {moment(
                                                formatDateInTimeZone({
                                                    date: time.timing?.toString(),
                                                    timeZone: data.timeZone || 'Asia/Calcutta',
                                                }),
                                            ).format('hh:mm A')}
                                            {` ${timeZoneInfo}`}{' '}
                                            {time?.custom ? ` - ${time?.custom}` : null}
                                            {index !== array.length - 1 ? ',' : ''}
                                            {index === array.length - 1 ? ']' : ''}
                                        </>
                                    ))}
                                    {injection?.timing ? ` - ${injection?.timing}` : null}
                                    {injection?.duration?.custom ? (
                                        <>
                                            {' - '}
                                            {injection?.duration?.custom}
                                        </>
                                    ) : null}
                                </div>
                                {injection?.instructions ? (
                                    <div>
                                        <span className="bold">Remarks: </span>
                                        {injection?.instructions}
                                    </div>
                                ) : null}
                            </li>
                        ) : (
                            <li>
                                <u>
                                    <span className="bold">{injection?.name}</span>{' '}
                                    {injection?.generic_name
                                        ? `(${injection?.generic_name})`
                                        : null}
                                </u>
                                {injection?.dose?.custom ? ` - [${injection?.dose?.custom}]` : null}
                                {injection?.route ? ` - ${injection?.route}` : null}
                                {injection?.infusion_rate?.iv_drop_rate?.custom
                                    ? ` - ${injection?.infusion_rate?.iv_drop_rate?.custom}`
                                    : null}
                                {injection?.infusion_rate?.iv_rate?.custom
                                    ? ` - ${injection?.infusion_rate?.iv_rate?.custom}`
                                    : null}
                                {injection?.infusion_rate?.infusion_time?.custom ? (
                                    <>
                                        {' '}
                                        - <span>Over</span>{' '}
                                        {injection?.infusion_rate?.infusion_time?.custom}
                                    </>
                                ) : null}
                                <div>
                                    {injection?.frequency?.custom ? (
                                        <>
                                            <span> {injection?.frequency?.custom}</span>
                                        </>
                                    ) : null}
                                    {injection?.frequency?.time_split?.map((time, index, array) => (
                                        <>
                                            {' '}
                                            {index === 0 ? '[ at ' : ''}
                                            {moment(
                                                formatDateInTimeZone({
                                                    date: time.timing?.toString(),
                                                    timeZone: data.timeZone || 'Asia/Calcutta',
                                                }),
                                            ).format('hh:mm A')}
                                            {` ${timeZoneInfo}`}{' '}
                                            {time?.custom ? ` - ${time?.custom}` : null}
                                            {index !== array.length - 1 ? ',' : ''}
                                            {index === array.length - 1 ? ']' : ''}
                                        </>
                                    ))}
                                    {injection?.timing ? ` - ${injection?.timing}` : null}
                                    {injection?.duration?.custom ? (
                                        <>
                                            {' - '}
                                            {/* <span className="bold">For</span>{' '} */}
                                            {injection?.duration?.custom}
                                        </>
                                    ) : null}
                                </div>
                                {injection?.instructions ? (
                                    <div>
                                        <span className="bold">Remarks: </span>
                                        {injection?.instructions}
                                    </div>
                                ) : null}
                            </li>
                        )}
                        {injection?.tapering_dose?.map((taper_dose) => (
                            <div>
                                <u>
                                    <span className="bold">{injection?.name}</span>{' '}
                                    {injection?.generic_name
                                        ? `(${injection?.generic_name})`
                                        : null}
                                </u>
                                {taper_dose.dose?.custom ? ` - [${taper_dose.dose?.custom}]` : null}
                                {taper_dose.route ? ` - ${taper_dose.route}` : null}
                                {taper_dose.infusion_rate?.iv_drop_rate?.custom
                                    ? ` - ${taper_dose.infusion_rate?.iv_drop_rate?.custom}`
                                    : null}
                                {taper_dose.infusion_rate?.iv_rate?.custom
                                    ? ` - ${taper_dose.infusion_rate?.iv_rate?.custom}`
                                    : null}
                                {taper_dose.infusion_rate?.infusion_time?.custom ? (
                                    <>
                                        {' '}
                                        - <span>Over</span>{' '}
                                        {taper_dose.infusion_rate?.infusion_time?.custom}
                                    </>
                                ) : null}
                                <div>
                                    {taper_dose.frequency?.custom ? (
                                        <>
                                            <span> {taper_dose.frequency?.custom}</span>
                                        </>
                                    ) : null}
                                    {taper_dose.frequency?.time_split?.map((time, index, array) => (
                                        <>
                                            {' '}
                                            {index === 0 ? '[ at ' : ''}
                                            {moment(
                                                formatDateInTimeZone({
                                                    date: time.timing?.toString(),
                                                    timeZone: data.timeZone || 'Asia/Calcutta',
                                                }),
                                            ).format('hh:mm A')}
                                            {` ${timeZoneInfo}`}{' '}
                                            {time?.custom ? ` - ${time?.custom}` : null}
                                            {index !== array.length - 1 ? ',' : ''}
                                            {index === array.length - 1 ? ']' : ''}
                                        </>
                                    ))}
                                    {taper_dose.timing ? ` - ${taper_dose.timing}` : null}
                                    {taper_dose.duration?.custom ? (
                                        <>
                                            {' - '}
                                            {taper_dose.duration?.custom}
                                        </>
                                    ) : null}
                                </div>
                                {taper_dose.instructions ? (
                                    <div>
                                        <span className="bold">Remarks: </span>
                                        {taper_dose.instructions}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </ul>
                );
            })}
        </div>
    );
};

export const getProceduresHtml = (d: RenderPdfPrescription): JSX.Element | undefined => {
    const procedures = d.tool?.procedures;

    if (!procedures) {
        return;
    }

    return (
        <div className="space-y-4 text-darwin-neutral-1000">
            <p className="uppercase text-darwin-accent-symptoms-blue-800 bold">Procedures :</p>
            <table className="border-collapse border medication-table-border-color w-full">
                <thead>
                    <tr className="text-11">
                        <th
                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                            style={{ width: '5%' }}
                        >
                            *
                        </th>
                        <th
                            className="border medication-table-border-color medication-title-color bold text-left p-4"
                            style={{ width: '30%' }}
                        >
                            Procedure
                        </th>
                        <th
                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                            style={{ width: '17.5%' }}
                        >
                            Date
                        </th>
                        <th
                            className="border medication-table-border-color medication-title-color bold text-center p-4"
                            style={{ width: '47.5%' }}
                        >
                            Notes
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {procedures.map((i, index) => {
                        const { name, notes, date } = i;
                        return (
                            <tr className="text-11">
                                <td className="p-4 border medication-table-border-color text-center">
                                    {index + 1}
                                </td>
                                <td className="p-4 border medication-table-border-color">
                                    {name || '-'}
                                </td>
                                <td className="p-4 border medication-table-border-color text-center">
                                    {date ? moment(date).format('Do MMM YY') : '-'}
                                </td>
                                <td className="p-4 border medication-table-border-color text-center">
                                    {notes || '-'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export const getProceduresHtmls = (
    d: RenderPdfPrescription,
    config: TemplateV2,
    sectionName?: string,
): JSX.Element | undefined => {
    const procedures = d.tool?.procedures;
    const isBullets = config?.render_pdf_config?.bullets_config?.['procedures'];
    const isTabular = config?.render_pdf_config?.tabular_config?.['procedures'];
    const headingColor = config?.render_pdf_config?.procedures_heading_color;
    const nameColor = config?.render_pdf_config?.procedures_name_color;
    const propertiesColor = config?.render_pdf_config?.procedures_properties_color;
    const rxElementKeySeperator = config?.render_pdf_config?.rx_element_key_seperator;
    const isExtraLarge = config?.render_pdf_config?.prescription_size === 'extra-large';

    if (!procedures?.length) {
        return;
    }

    return (
        <div className="text-darwin-neutral-1000">
            <span
                style={{ color: headingColor }}
                className="uppercase text-darwin-accent-symptoms-blue-800 bold"
            >
                {sectionName || 'PROCEDURES'} :
            </span>

            {isBullets ? (
                <ul className="ml-36">
                    {procedures.map((procedure) => (
                        <li className="">
                            <span
                                className={`uppercase ${
                                    config?.render_pdf_config?.procedures_in_unbold ? '' : 'bold'
                                }`}
                                style={{ color: nameColor }}
                            >
                                {procedure?.name || ''}
                            </span>
                            {procedure?.notes ? (
                                <span style={{ color: propertiesColor }}>
                                    {' '}
                                    (Notes : {procedure.notes})
                                </span>
                            ) : (
                                <></>
                            )}
                            <span style={{ color: propertiesColor }}>
                                {procedure?.date ? ' - ' : ''}
                                {procedure?.date ? moment(procedure.date).format('Do MMM YY') : ''}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : isTabular ? (
                <table
                    className="border-collapse border medication-table-border-color w-full"
                    style={{ maxWidth: '100%' }}
                >
                    <thead>
                        <tr className="text-11">
                            <th
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                                style={{ width: '4%' }}
                            ></th>
                            <th
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                                style={{ width: '30%' }}
                            >
                                Procedure
                            </th>
                            <th
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                                style={{ width: '17%' }}
                            >
                                Date
                            </th>
                            <th
                                className="border medication-table-border-color medication-title-color bold text-center p-4"
                                style={{ width: '49%' }}
                            >
                                Notes
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {procedures.map((procedure, index) => (
                            <tr className="text-11">
                                <td className="p-4 border medication-table-border-color text-center">
                                    {index + 1}
                                </td>
                                <td className="p-4 border medication-table-border-color">
                                    {procedure?.name || '-'}
                                </td>
                                <td className="p-4 border medication-table-border-color text-center">
                                    {procedure?.date
                                        ? moment(procedure.date).format('Do MMM YY')
                                        : '-'}
                                </td>
                                <td className="p-4 border medication-table-border-color text-center">
                                    {procedure?.notes || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <span>
                    {procedures.map((procedure, i) => (
                        <span>
                            <span
                                className={`uppercase ${
                                    config?.render_pdf_config?.procedures_in_unbold ? '' : 'bold'
                                }`}
                                style={{ color: nameColor }}
                            >
                                {procedure?.name || ''}
                            </span>
                            {procedure?.notes ? (
                                <span style={{ color: propertiesColor }}>
                                    {' '}
                                    (Notes : {procedure.notes})
                                </span>
                            ) : (
                                <></>
                            )}
                            <span style={{ color: propertiesColor }}>
                                {procedure?.date ? ' - ' : ''}
                                {procedure?.date ? moment(procedure.date).format('Do MMM YY') : ''}
                            </span>
                            {i !== procedures.length - 1 && (
                                <span className="bold">
                                    {getRxSeperator(rxElementKeySeperator)}
                                </span>
                            )}
                        </span>
                    ))}
                </span>
            )}
        </div>
    );
};

export const injOptions2 = {
    injId: {
        dose: 'dose',
        route: 'route',
        frequency: 'frequency',
        duration: 'duration',
    },
    injIdToNameMapping: {
        dose: 'Dose',
        route: 'Route',
        frequency: 'Frequency',
        duration: 'Duration',
    },
    width: {
        dose: '10%',
        route: '12%',
        frequency: '12%',
        duration: '12%',
    },
    injIdToNameMappingForWidth: {
        medication: 'Injections',
        dose: 'Dose',
        route: 'Route',
        frequency: 'Frequency',
        duration: 'Duration',
    },
    allColumnWidthInNumber: {
        medication: 31,
        dose: 10,
        route: 12,
        frequency: 12,
        duration: 12,
    },
};

export const injOptions3 = {
    injId: {
        dose: 'dose',
        route: 'route',
        frequency: 'frequency',
        duration: 'duration',
    },
    injIdToNameMapping: {
        dose: 'Dose',
        route: 'Route',
        frequency: 'Frequency',
        duration: 'Duration',
    },
    width: {
        dose: '10%',
        route: '12%',
        frequency: '12%',
        duration: '12%',
    },
    injIdToNameMappingForWidth: {
        medication: 'Injections',
        dose: 'Dose',
        route: 'Route',
        frequency: 'Frequency',
        duration: 'Duration',
    },
    allColumnWidthInNumber: {
        medication: 31,
        dose: 10,
        route: 12,
        frequency: 12,
        duration: 12,
    },
};

export const injOptions1 = {
    injId: {
        dose: 'dose',
        route: 'route',
        frequency: 'frequency',
        instruction: 'instruction',
    },
    injIdToNameMapping: {
        dose: 'Dose',
        route: 'Route',
        frequency: 'Frequency',
        instruction: 'Remarks',
    },
    width: {
        dose: '10%',
        route: '8%',
        frequency: '12%',
        instruction: '38%',
    },
    injIdToNameMappingForWidth: {
        medication: 'Injections',
        dose: 'Dose',
        route: 'Route',
        frequency: 'Frequency',
        instruction: 'Remarks',
    },
    allColumnWidthInNumber: {
        medication: 31,
        dose: 10,
        route: 25,
        frequency: 15,
        instruction: 38,
    },
};

export const injOptions4 = {
    injId: {
        dose: 'dose',
        route: 'route',
        frequency: 'frequency',
        duration: 'duration',
        instruction: 'instruction',
    },
    injIdToNameMapping: {
        dose: 'Dose',
        route: 'Route',
        frequency: 'Frequency',
        duration: 'Duration',
        instruction: 'Remarks',
    },
    width: {
        dose: '8%',
        route: '12%',
        frequency: '12%',
        duration: '12%',
        instruction: '28%',
    },
    injIdToNameMappingForWidth: {
        medication: 'Injections',
        dose: 'Dose',
        route: 'Route',
        frequency: 'Frequency',
        duration: 'Duration',
        instruction: 'Remarks',
    },
    allColumnWidthInNumber: {
        medication: 24,
        dose: 8,
        route: 12,
        frequency: 12,
        duration: 12,
        instruction: 28,
    },
};

//keeping for time being will remove later:

// export const getInjections1Html = (
//     d: RenderPdfPrescription,
//     render_pdf_config?: RenderPdfConfig,
// ): JSX.Element | undefined => {
//     const injections = d?.tool?.injections;
//     const showColumns: { [key: string]: boolean } = {};
//     const titleBgColor = render_pdf_config?.injections_table_title_bg_color || '#E4DEEB';
//     const borderColor = render_pdf_config?.injections_table_border_color || '#8064A2';
//     const heading = render_pdf_config?.injections_table_heading_text;
//     const hideHeading = render_pdf_config?.injections_heading_hide;
//     const tableTitleAlignment = render_pdf_config?.injections_table_title_alignment;
//     const tableHeaderColor = render_pdf_config?.injections_table_header_color || '#8064A2';
//     const tableWidth = render_pdf_config?.injections_table_width;

//     injections?.forEach((inj) => {
//         if (inj?.dose?.custom?.trim()) {
//             showColumns['dose'] = true;
//         }
//         if (inj?.frequency?.custom || inj?.frequency?.time_split?.length) {
//             showColumns['frequency'] = true;
//         }
//         if (inj?.duration?.custom) {
//             showColumns['duration'] = true;
//         }
//         if (inj?.instructions) {
//             showColumns['instruction'] = true;
//         }
//     });

//     if (!injections?.length) {
//         return;
//     }
//     let totalWidthCount =
//         tableWidth?.['medication'] || injOptions1.allColumnWidthInNumber['medication'];
//     Object.keys(injOptions1.allColumnWidthInNumber).forEach((key) => {
//         if (showColumns?.[key]) {
//             totalWidthCount +=
//                 tableWidth?.[key] ||
//                 injOptions1.allColumnWidthInNumber[
//                     key as keyof typeof injOptions1.allColumnWidthInNumber
//                 ];
//         }
//     });

//     const medicationWidth =
//         ((tableWidth?.['medication'] || injOptions1.allColumnWidthInNumber['medication']) /
//             totalWidthCount) *
//         96;

//     return (
//         <div>
//             {!hideHeading && (
//                 <p
//                     style={{ textAlign: tableTitleAlignment, color: tableHeaderColor }}
//                     className="text-13 text-center prescription-title-color bold underline italic"
//                 >
//                     {heading || 'INJECTIONS'}
//                 </p>
//             )}
//             <div className="text-darwin-neutral-1000">
//                 <table
//                     style={{ borderColor }}
//                     className="border-collapse border medication-table-border-color w-full"
//                 >
//                     <colgroup>
//                         <col span={1} style={{ width: `4%` }} />
//                         <col span={1} style={{ width: `${medicationWidth}%` }} />
//                         {Object.keys(injOptions1.width)
//                             .map(
//                                 (key) =>
//                                     showColumns[key] && (
//                                         <col
//                                             span={1}
//                                             style={{
//                                                 width: `${
//                                                     ((tableWidth?.[key] ||
//                                                         injOptions1.allColumnWidthInNumber[
//                                                             key as keyof typeof injOptions1.allColumnWidthInNumber
//                                                         ]) /
//                                                         totalWidthCount) *
//                                                     96
//                                                 }%`,
//                                             }}
//                                         />
//                                     ),
//                             )
//                             .filter(Boolean)}
//                     </colgroup>
//                     <thead>
//                         <tr className="text-11 bold w-full">
//                             <th
//                                 style={{ borderColor, backgroundColor: titleBgColor }}
//                                 className="border medication-table-border-color w-64 text-center p-4"
//                             ></th>
//                             <th
//                                 style={{ borderColor, backgroundColor: titleBgColor }}
//                                 className="border medication-table-border-color bold text-center p-4"
//                             >
//                                 Injections
//                             </th>
//                             {Object.keys(injOptions1.injIdToNameMapping)
//                                 .map(
//                                     (key) =>
//                                         showColumns[key] && (
//                                             <th
//                                                 style={{
//                                                     borderColor,
//                                                     backgroundColor: titleBgColor,
//                                                 }}
//                                                 className="border medication-table-border-color bold text-center p-4"
//                                             >
//                                                 {
//                                                     injOptions1.injIdToNameMapping[
//                                                         key as keyof typeof injOptions1.injIdToNameMapping
//                                                     ]
//                                                 }
//                                             </th>
//                                         ),
//                                 )
//                                 .filter(Boolean)}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {injections.map((inj, index) => (
//                             <tr key={index} className="text-11">
//                                 <td
//                                     style={{ borderColor }}
//                                     className="bold p-4 border medication-table-border-color text-center"
//                                 >
//                                     {index + 1}
//                                 </td>
//                                 <td
//                                     style={{ borderColor }}
//                                     className="p-4 border medication-table-border-color"
//                                 >
//                                     {!render_pdf_config?.make_generic_name_as_primary ? (
//                                         <>
//                                             <span
//                                                 className={`bold ${
//                                                     render_pdf_config?.injections_name_in_capital
//                                                         ? 'uppercase'
//                                                         : ''
//                                                 }`}
//                                             >
//                                                 {inj?.generic_name ? `${inj?.generic_name} ` : ''}
//                                                 {inj?.added_drug?.map((drug) => (
//                                                     <>
//                                                         {' '}
//                                                         <span>
//                                                             {drug.name ? ` ${drug.name}` : null}
//                                                         </span>
//                                                         {drug.generic_name
//                                                             ? ` (${drug.generic_name})`
//                                                             : null}
//                                                         {drug.dose?.custom
//                                                             ? ` - ${drug.dose?.custom}`
//                                                             : null}
//                                                     </>
//                                                 ))}{' '}
//                                             </span>
//                                             <br />
//                                             <span>{inj?.name}</span>{' '}
//                                         </>
//                                     ) : (
//                                         <>
//                                             <span
//                                                 className={`bold ${
//                                                     render_pdf_config?.injections_name_in_capital
//                                                         ? 'uppercase'
//                                                         : ''
//                                                 }`}
//                                             >
//                                                 {inj?.name}{' '}
//                                             </span>
//                                             <br />
//                                             <span>
//                                                 {inj?.generic_name ? `${inj?.generic_name} ` : ''}
//                                                 {inj?.added_drug?.map((drug) => (
//                                                     <>
//                                                         {' '}
//                                                         <span>
//                                                             {drug.name ? ` ${drug.name}` : null}
//                                                         </span>
//                                                         {drug.generic_name
//                                                             ? ` (${drug.generic_name})`
//                                                             : null}
//                                                         {drug.dose?.custom
//                                                             ? ` - ${drug.dose?.custom}`
//                                                             : null}
//                                                     </>
//                                                 ))}
//                                             </span>
//                                         </>
//                                     )}
//                                 </td>
//                                 {showColumns['dose'] && (
//                                     <td
//                                         style={{ borderColor }}
//                                         className="border medication-table-border-color p-4 text-center"
//                                     >
//                                         {inj?.dose?.custom || ''}
//                                     </td>
//                                 )}
//                                 {showColumns['duration'] && (
//                                     <td
//                                         style={{ borderColor }}
//                                         className="border medication-table-border-color p-4 text-center"
//                                     >
//                                         <span>{inj?.route ? `${inj?.route}` : null}</span>
//                                         <br />
//                                         <span>
//                                             {inj?.infusion_rate?.iv_drop_rate?.custom
//                                                 ? `${inj?.infusion_rate?.iv_drop_rate?.custom}`
//                                                 : null}
//                                         </span>{' '}
//                                         <span>
//                                             {inj?.infusion_rate?.iv_rate?.custom
//                                                 ? `${inj?.infusion_rate?.iv_rate?.custom}`
//                                                 : null}
//                                         </span>
//                                         <br />
//                                         <span>
//                                             {inj?.infusion_rate?.infusion_time?.custom ? (
//                                                 <>
//                                                     {' '}
//                                                     <span>Over</span>{' '}
//                                                     {inj?.infusion_rate?.infusion_time?.custom}
//                                                 </>
//                                             ) : null}
//                                         </span>
//                                     </td>
//                                 )}
//                                 {showColumns['frequency'] && (
//                                     <td
//                                         style={{ borderColor }}
//                                         className="border medication-table-border-color p-4 text-center"
//                                     >
//                                         <div>
//                                             {inj?.frequency?.custom ? (
//                                                 <>
//                                                     <span> {inj?.frequency?.custom}</span>
//                                                 </>
//                                             ) : null}
//                                             {<br />}
//                                             {inj?.frequency?.time_split?.map(
//                                                 (time, index, array) => (
//                                                     <>
//                                                         {' '}
//                                                         {index === 0 ? '[ at ' : ''}
//                                                         {moment(time?.timing).format(
//                                                             'hh:mm A',
//                                                         )}{' '}
//                                                         {time?.custom ? ` - ${time?.custom}` : null}
//                                                         {index !== array.length - 1 ? ',' : ''}
//                                                         {index === array.length - 1 ? ']' : ''}
//                                                     </>
//                                                 ),
//                                             )}
//                                             {<br />}
//                                             {inj?.timing ? ` ${inj?.timing}` : null}
//                                             {<br />}
//                                             {inj?.duration?.custom || ''}
//                                         </div>
//                                     </td>
//                                 )}
//                                 {showColumns['instruction'] && (
//                                     <td
//                                         style={{ borderColor }}
//                                         className="break-word whitespace-preline border medication-table-border-color p-4"
//                                     >
//                                         {inj?.instructions || '-'}
//                                     </td>
//                                 )}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

export const getInjections1Html = (
    d: RenderPdfPrescription,
    render_pdf_config?: TemplateConfig,
    injections_config?: GeniePadElementsSettingItem[],
): JSX.Element | undefined => {
    const injections = d?.tool?.injections;
    const showColumns: { [key: string]: boolean } = {};
    const titleBgColor = render_pdf_config?.injections_table_title_bg_color || '#E4DEEB';
    const borderColor = render_pdf_config?.injections_table_border_color || '#8064A2';
    const heading = render_pdf_config?.injections_table_heading_text;
    const hideHeading = render_pdf_config?.injections_heading_hide;
    const tableTitleAlignment = render_pdf_config?.injections_table_title_alignment;
    const tableHeaderColor = render_pdf_config?.injections_table_header_color || '#8064A2';
    const tableWidth = render_pdf_config?.injections_table_width;

    const timeZoneInfo =
        d?.timeZone === 'Asia/Calcutta' || d?.timeZone === 'Asia/Kolkata'
            ? ''
            : getTimeZoneInfo(d.timeZone).abbreviation;

    injections?.forEach((inj) => {
        if (inj?.dose?.custom?.trim()) {
            showColumns['dose'] = true;
        }
        if (
            inj?.frequency?.custom ||
            inj?.frequency?.time_split?.length ||
            inj?.timing ||
            inj?.duration?.custom
        ) {
            showColumns['frequency'] = true;
        }
        if (inj?.duration?.custom) {
            showColumns['duration'] = true;
        }
        if (inj?.instructions) {
            showColumns['instruction'] = true;
        }
        if (inj?.route || inj?.infusion_rate) {
            showColumns['route'] = true;
        }
        // Check tapering doses for columns
        inj?.tapering_dose?.forEach((taper) => {
            if (taper?.dose?.custom?.trim()) {
                showColumns['dose'] = true;
            }
            if (
                taper?.frequency?.custom ||
                taper?.frequency?.time_split?.length ||
                taper?.timing ||
                taper?.duration?.custom
            ) {
                showColumns['frequency'] = true;
            }
            if (taper?.duration?.custom) {
                showColumns['duration'] = true;
            }
            if (taper?.instructions) {
                showColumns['instruction'] = true;
            }
            if (taper?.route || taper?.infusion_rate) {
                showColumns['route'] = true;
            }
        });
    });

    if (!injections?.length) {
        return;
    }
    let totalWidthCount =
        tableWidth?.['medication'] || injOptions1.allColumnWidthInNumber['medication'];
    Object.keys(injOptions1.allColumnWidthInNumber).forEach((key) => {
        if (showColumns?.[key]) {
            totalWidthCount +=
                tableWidth?.[key] ||
                injOptions1.allColumnWidthInNumber[
                    key as keyof typeof injOptions1.allColumnWidthInNumber
                ];
        }
    });

    const medicationWidth =
        ((tableWidth?.['medication'] || injOptions1.allColumnWidthInNumber['medication']) /
            totalWidthCount) *
        96;

    return (
        <div>
            {!hideHeading && (
                <p
                    style={{ textAlign: tableTitleAlignment, color: tableHeaderColor }}
                    className="text-13 text-center prescription-title-color bold underline italic"
                >
                    {heading || 'INJECTIONS'}
                </p>
            )}
            <div className="text-darwin-neutral-1000">
                <table
                    style={{ borderColor }}
                    className="border-collapse border medication-table-border-color w-full"
                >
                    <thead>
                        <tr className="text-11 bold w-full">
                            <th
                                style={{ borderColor, backgroundColor: titleBgColor, width: `4%` }}
                                className="border medication-table-border-color w-64 text-center p-4"
                            ></th>
                            <th
                                style={{
                                    borderColor,
                                    backgroundColor: titleBgColor,
                                    width: `${medicationWidth}%`,
                                }}
                                className="border medication-table-border-color bold text-center p-4"
                            >
                                Injections
                            </th>
                            {Object.keys(injOptions1.injIdToNameMapping)
                                .map(
                                    (key) =>
                                        showColumns[key] && (
                                            <th
                                                style={{
                                                    borderColor,
                                                    backgroundColor: titleBgColor,
                                                    width: `${
                                                        ((tableWidth?.[key] ||
                                                            injOptions1.allColumnWidthInNumber[
                                                                key as keyof typeof injOptions1.allColumnWidthInNumber
                                                            ]) /
                                                            totalWidthCount) *
                                                        96
                                                    }%`,
                                                }}
                                                className="border medication-table-border-color bold text-center p-4"
                                            >
                                                {
                                                    injOptions1.injIdToNameMapping[
                                                        key as keyof typeof injOptions1.injIdToNameMapping
                                                    ]
                                                }
                                            </th>
                                        ),
                                )
                                .filter(Boolean)}
                        </tr>
                    </thead>
                    <tbody>
                        {injections.map((inj, index) => (
                            <React.Fragment key={`inj-${index}`}>
                                <tr className="text-11">
                                    <td
                                        style={{ borderColor, width: `4%` }}
                                        className="bold p-4 border medication-table-border-color text-center"
                                    >
                                        {index + 1}
                                    </td>
                                    <td
                                        style={{ borderColor, width: `${medicationWidth}%` }}
                                        className="p-4 border medication-table-border-color"
                                    >
                                        {render_pdf_config?.make_generic_name_as_primary ? (
                                            <>
                                                <span
                                                    className={`bold ${
                                                        render_pdf_config?.injections_name_in_capital
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {inj?.generic_name
                                                        ? `${inj?.generic_name} `
                                                        : ''}
                                                </span>
                                                <br />
                                                <span>{inj?.name}</span>
                                                {inj?.added_drug?.map((drug) => (
                                                    <>
                                                        {' + '}

                                                        <br />
                                                        <span
                                                            className={`bold ${
                                                                render_pdf_config?.injections_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {drug.generic_name
                                                                ? ` (${drug.generic_name})`
                                                                : null}
                                                        </span>
                                                        <br />
                                                        <span>
                                                            {drug.name ? ` ${drug.name}` : null}
                                                        </span>
                                                    </>
                                                ))}{' '}
                                            </>
                                        ) : (
                                            <>
                                                <span
                                                    className={`bold ${
                                                        render_pdf_config?.injections_name_in_capital
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {inj?.name}{' '}
                                                </span>
                                                <br />
                                                <span>
                                                    {inj?.generic_name
                                                        ? `${inj?.generic_name} `
                                                        : ''}
                                                </span>

                                                {inj?.added_drug?.map((drug) => (
                                                    <>
                                                        {' + '}
                                                        <br />
                                                        <span
                                                            className={`bold ${
                                                                render_pdf_config?.injections_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {drug.name ? ` ${drug.name}` : null}
                                                        </span>
                                                        <br />
                                                        {drug.generic_name
                                                            ? ` (${drug.generic_name})`
                                                            : null}
                                                    </>
                                                ))}
                                            </>
                                        )}
                                    </td>
                                    {showColumns['dose'] && (
                                        <td
                                            style={{
                                                borderColor,
                                                width: `${
                                                    ((tableWidth?.['dose'] ||
                                                        injOptions1.allColumnWidthInNumber[
                                                            'dose' as keyof typeof injOptions1.allColumnWidthInNumber
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border medication-table-border-color p-4 text-center"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <div>
                                                    {inj?.dose?.custom}
                                                    {/* {inj?.added_drug?.length &&
                                                    inj?.added_drug?.length > 0
                                                        ? ' + '
                                                        : ''} */}
                                                </div>
                                                <div>
                                                    {inj?.added_drug?.map((drug) =>
                                                        drug.dose?.custom ? (
                                                            <>
                                                                {' + '}
                                                                <br />
                                                                {drug.dose?.custom}
                                                            </>
                                                        ) : null,
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    {showColumns['route'] && (
                                        <td
                                            style={{
                                                borderColor,
                                                width: `${
                                                    ((tableWidth?.['route'] ||
                                                        injOptions1.allColumnWidthInNumber[
                                                            'route' as keyof typeof injOptions1.allColumnWidthInNumber
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border medication-table-border-color p-4 text-center"
                                        >
                                            <span>{inj?.route ? `${inj?.route}` : null}</span>
                                            <br />
                                            <span>
                                                {inj?.infusion_rate?.iv_drop_rate?.custom
                                                    ? `${inj?.infusion_rate?.iv_drop_rate?.custom}`
                                                    : null}
                                            </span>{' '}
                                            <span>
                                                {inj?.infusion_rate?.iv_rate?.custom
                                                    ? `${inj?.infusion_rate?.iv_rate?.custom}`
                                                    : null}
                                            </span>
                                            <br />
                                            <span>
                                                {inj?.infusion_rate?.infusion_time?.custom ? (
                                                    <>
                                                        {' '}
                                                        <span>Over</span>{' '}
                                                        {inj?.infusion_rate?.infusion_time?.custom}
                                                    </>
                                                ) : null}
                                            </span>
                                        </td>
                                    )}
                                    {showColumns['frequency'] && (
                                        <td
                                            style={{
                                                borderColor,
                                                width: `${
                                                    ((tableWidth?.['frequency'] ||
                                                        injOptions1.allColumnWidthInNumber[
                                                            'frequency' as keyof typeof injOptions1.allColumnWidthInNumber
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border medication-table-border-color p-4 text-center"
                                        >
                                            <div>
                                                {inj?.frequency?.custom ? (
                                                    <>
                                                        <span> {inj?.frequency?.custom}</span>
                                                    </>
                                                ) : null}
                                                {<br />}
                                                {inj?.frequency?.time_split?.map(
                                                    (time, index, array) => (
                                                        <>
                                                            {' '}
                                                            {index === 0 ? '[ at ' : ''}
                                                            {moment(
                                                                formatDateInTimeZone({
                                                                    date: time.timing?.toString(),
                                                                    timeZone:
                                                                        d.timeZone ||
                                                                        'Asia/Calcutta',
                                                                }),
                                                            ).format('hh:mm A')}
                                                            {` ${timeZoneInfo}`}{' '}
                                                            {time?.custom
                                                                ? ` - ${time?.custom}`
                                                                : null}
                                                            {index !== array.length - 1 ? ',' : ''}
                                                            {index === array.length - 1 ? ']' : ''}
                                                        </>
                                                    ),
                                                )}
                                                {<br />}
                                                {inj?.timing ? ` ${inj?.timing}` : null}
                                                {<br />}
                                                {inj?.duration?.custom || ''}
                                            </div>
                                        </td>
                                    )}
                                    {showColumns['instruction'] && (
                                        <td
                                            style={{
                                                borderColor,
                                                width: `${
                                                    ((tableWidth?.['instruction'] ||
                                                        injOptions1.allColumnWidthInNumber[
                                                            'instruction' as keyof typeof injOptions1.allColumnWidthInNumber
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border medication-table-border-color p-4"
                                        >
                                            {inj?.instructions}
                                        </td>
                                    )}
                                </tr>
                                {inj?.tapering_dose?.map((taper, taperIndex) => (
                                    <tr
                                        key={`inj-${index}-taper-${taperIndex}`}
                                        className="text-11"
                                    >
                                        <td
                                            style={{ borderColor, width: `4%` }}
                                            className="bold p-4 border medication-table-border-color text-center"
                                        >
                                            {inj?.taperingDoseTitleDisplay
                                                ? `${taperIndex + 1}` + 'T'
                                                : ''}
                                        </td>
                                        <td
                                            style={{ borderColor, width: `${medicationWidth}%` }}
                                            className="p-4 border medication-table-border-color"
                                        >
                                            {inj?.taperingDoseTitleDisplay ? (
                                                render_pdf_config?.make_generic_name_as_primary ? (
                                                    <>
                                                        <span
                                                            className={`bold ${
                                                                render_pdf_config?.injections_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {inj?.generic_name
                                                                ? `${inj?.generic_name} `
                                                                : ''}
                                                        </span>
                                                        <br />
                                                        <span>{inj?.name}</span>
                                                        {inj?.added_drug?.map((drug) => (
                                                            <>
                                                                {' + '}

                                                                <br />
                                                                <span
                                                                    className={`bold ${
                                                                        render_pdf_config?.injections_name_in_capital
                                                                            ? 'uppercase'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    {drug.generic_name
                                                                        ? ` (${drug.generic_name})`
                                                                        : null}
                                                                </span>
                                                                <br />
                                                                <span>
                                                                    {drug.name
                                                                        ? ` ${drug.name}`
                                                                        : null}
                                                                </span>
                                                            </>
                                                        ))}{' '}
                                                    </>
                                                ) : (
                                                    <>
                                                        <span
                                                            className={`bold ${
                                                                render_pdf_config?.injections_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {inj?.name}{' '}
                                                        </span>
                                                        <br />
                                                        <span>
                                                            {inj?.generic_name
                                                                ? `${inj?.generic_name} `
                                                                : ''}
                                                        </span>

                                                        {inj?.added_drug?.map((drug) => (
                                                            <>
                                                                {' + '}
                                                                <br />
                                                                <span
                                                                    className={`bold ${
                                                                        render_pdf_config?.injections_name_in_capital
                                                                            ? 'uppercase'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    {drug.name
                                                                        ? ` ${drug.name}`
                                                                        : null}
                                                                </span>
                                                                <br />
                                                                {drug.generic_name
                                                                    ? ` (${drug.generic_name})`
                                                                    : null}
                                                            </>
                                                        ))}
                                                    </>
                                                )
                                            ) : (
                                                ''
                                            )}
                                        </td>
                                        {showColumns['dose'] && (
                                            <td
                                                style={{
                                                    borderColor,
                                                    width: `${
                                                        ((tableWidth?.['dose'] ||
                                                            injOptions1.allColumnWidthInNumber[
                                                                'dose' as keyof typeof injOptions1.allColumnWidthInNumber
                                                            ]) /
                                                            totalWidthCount) *
                                                        96
                                                    }%`,
                                                }}
                                                className="border medication-table-border-color p-4 text-center"
                                            >
                                                {taper?.dose?.custom}
                                            </td>
                                        )}
                                        {showColumns['route'] && (
                                            <td
                                                style={{
                                                    borderColor,
                                                    width: `${
                                                        ((tableWidth?.['route'] ||
                                                            injOptions1.allColumnWidthInNumber[
                                                                'route' as keyof typeof injOptions1.allColumnWidthInNumber
                                                            ]) /
                                                            totalWidthCount) *
                                                        96
                                                    }%`,
                                                }}
                                                className="border medication-table-border-color p-4 text-center"
                                            >
                                                <span>
                                                    {taper?.route
                                                        ? `${taper?.route}`
                                                        : `${inj?.route}`}
                                                </span>
                                                <br />
                                                <span>
                                                    {taper?.infusion_rate?.iv_drop_rate?.custom
                                                        ? `${taper?.infusion_rate?.iv_drop_rate?.custom}`
                                                        : null}
                                                </span>{' '}
                                                <span>
                                                    {taper?.infusion_rate?.iv_rate?.custom
                                                        ? `${taper?.infusion_rate?.iv_rate?.custom}`
                                                        : null}
                                                </span>
                                                <br />
                                                <span>
                                                    {taper?.infusion_rate?.infusion_time?.custom ? (
                                                        <>
                                                            {' '}
                                                            <span>Over</span>{' '}
                                                            {
                                                                taper?.infusion_rate?.infusion_time
                                                                    ?.custom
                                                            }
                                                        </>
                                                    ) : null}
                                                </span>
                                            </td>
                                        )}
                                        {showColumns['frequency'] && (
                                            <td
                                                style={{
                                                    borderColor,
                                                    width: `${
                                                        ((tableWidth?.['frequency'] ||
                                                            injOptions1.allColumnWidthInNumber[
                                                                'frequency' as keyof typeof injOptions1.allColumnWidthInNumber
                                                            ]) /
                                                            totalWidthCount) *
                                                        96
                                                    }%`,
                                                }}
                                                className="border medication-table-border-color p-4 text-center"
                                            >
                                                <div>
                                                    {taper?.frequency?.custom ? (
                                                        <>
                                                            <span> {taper?.frequency?.custom}</span>
                                                        </>
                                                    ) : null}
                                                    {<br />}
                                                    {taper?.frequency?.time_split?.map(
                                                        (time, index, array) => (
                                                            <>
                                                                {' '}
                                                                {index === 0 ? '[ at ' : ''}
                                                                {moment(
                                                                    formatDateInTimeZone({
                                                                        date: time.timing?.toString(),
                                                                        timeZone:
                                                                            d.timeZone ||
                                                                            'Asia/Calcutta',
                                                                    }),
                                                                ).format('hh:mm A')}
                                                                {` ${timeZoneInfo}`}{' '}
                                                                {time?.custom
                                                                    ? ` - ${time?.custom}`
                                                                    : null}
                                                                {index !== array.length - 1
                                                                    ? ','
                                                                    : ''}
                                                                {index === array.length - 1
                                                                    ? ']'
                                                                    : ''}
                                                            </>
                                                        ),
                                                    )}
                                                    {<br />}
                                                    {taper?.timing ? ` ${taper?.timing}` : null}
                                                    {<br />}
                                                    {taper?.duration?.custom || ''}
                                                </div>
                                            </td>
                                        )}
                                        {/* {showColumns['duration'] && (
                                            <td
                                                style={{ borderColor }}
                                                className="border medication-table-border-color p-4 text-center"
                                            >
                                                {taper?.duration?.custom}
                                            </td>
                                        )} */}
                                        {showColumns['instruction'] && (
                                            <td
                                                style={{
                                                    borderColor,
                                                    width: `${
                                                        ((tableWidth?.['instruction'] ||
                                                            injOptions1.allColumnWidthInNumber[
                                                                'instruction' as keyof typeof injOptions1.allColumnWidthInNumber
                                                            ]) /
                                                            totalWidthCount) *
                                                        96
                                                    }%`,
                                                }}
                                                className="border medication-table-border-color p-4"
                                            >
                                                {taper?.instructions}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const getInjections2Html = (
    d: RenderPdfPrescription,
    render_pdf_config?: TemplateConfig,
): JSX.Element | undefined => {
    const injections = d?.tool?.injections;
    const showColumns: { [key: string]: boolean } = {};
    const titleBgColor = render_pdf_config?.injections_table_title_bg_color || '#E4DEEB';
    const borderColor = render_pdf_config?.injections_table_border_color || '#8064A2';
    const heading = render_pdf_config?.injections_table_heading_text;
    const hideHeading = render_pdf_config?.injections_heading_hide;
    const tableTitleAlignment = render_pdf_config?.injections_table_title_alignment;
    const tableHeaderColor = render_pdf_config?.injections_table_header_color || '#8064A2';
    const tableWidth = render_pdf_config?.injections_table_width;

    const timeZoneInfo =
        d?.timeZone === 'Asia/Calcutta' || d?.timeZone === 'Asia/Kolkata'
            ? ''
            : getTimeZoneInfo(d.timeZone).abbreviation;

    injections?.forEach((inj) => {
        if (inj?.dose?.custom?.trim()) {
            showColumns['dose'] = true;
        }
        if (inj?.route || inj?.infusion_rate) {
            showColumns['route'] = true;
        }
        if (inj?.frequency?.custom || inj?.frequency?.time_split?.length) {
            showColumns['frequency'] = true;
        }
        if (inj?.duration?.custom) {
            showColumns['duration'] = true;
        }

        inj?.tapering_dose?.forEach((taper) => {
            if (taper?.dose?.custom?.trim()) {
                showColumns['dose'] = true;
            }
            if (taper?.frequency?.custom || taper?.frequency?.time_split?.length) {
                showColumns['frequency'] = true;
            }
            if (taper?.duration?.custom) {
                showColumns['durations'] = true;
            }
            if (taper?.route || taper?.infusion_rate) {
                showColumns['route'] = true;
            }
        });
    });

    if (!injections?.length) {
        return;
    }

    let totalWidthCount =
        tableWidth?.['medication'] || injOptions2.allColumnWidthInNumber['medication'];

    Object.keys(injOptions2.allColumnWidthInNumber).forEach((key) => {
        if (showColumns?.[key]) {
            totalWidthCount +=
                tableWidth?.[key] ||
                injOptions2.allColumnWidthInNumber[
                    key as keyof typeof injOptions2.allColumnWidthInNumber
                ];
        }
    });

    const medicationWidth =
        ((tableWidth?.['medication'] || injOptions2.allColumnWidthInNumber['medication']) /
            totalWidthCount) *
        96;

    return (
        <div>
            {!hideHeading && (
                <p
                    style={{
                        textAlign: tableTitleAlignment,
                        color: tableHeaderColor,
                    }}
                    className="text-13 text-center prescription-title-color bold underline italic"
                >
                    {heading || 'INJECTIONS'}
                </p>
            )}
            <div className="text-darwin-neutral-1000">
                <table
                    style={{ borderColor }}
                    className="border-collapse border medication-table-border-color w-full"
                >
                    <thead>
                        <tr className="text-11 bold w-full">
                            <th
                                style={{ borderColor, backgroundColor: titleBgColor, width: `4%` }}
                                className="border medication-table-border-color w-64 text-center p-4"
                            ></th>
                            <th
                                style={{
                                    borderColor,
                                    backgroundColor: titleBgColor,
                                    width: `${medicationWidth}%`,
                                }}
                                className="border medication-table-border-color bold text-center p-4"
                            >
                                Injections
                            </th>
                            {['dose', 'route', 'frequency', 'duration']
                                .map(
                                    (key) =>
                                        showColumns[key] && (
                                            <th
                                                key={key}
                                                style={{
                                                    borderColor,
                                                    backgroundColor: titleBgColor,
                                                    width: `${
                                                        ((tableWidth?.[key] ||
                                                            injOptions2.allColumnWidthInNumber[
                                                                key as keyof typeof injOptions2.allColumnWidthInNumber
                                                            ]) /
                                                            totalWidthCount) *
                                                        96
                                                    }%`,
                                                }}
                                                className="border medication-table-border-color bold text-center p-4"
                                            >
                                                {
                                                    injOptions2.injIdToNameMapping[
                                                        key as keyof typeof injOptions2.injIdToNameMapping
                                                    ]
                                                }
                                            </th>
                                        ),
                                )
                                .filter(Boolean)}
                        </tr>
                    </thead>

                    <tbody>
                        {injections?.map((inj, index) => (
                            <React.Fragment key={`inj-${index}`}>
                                <tr className="text-11">
                                    <td
                                        style={{ borderColor, width: `4%` }}
                                        className="bold p-4 border medication-table-border-color text-center"
                                    >
                                        {index + 1}
                                    </td>
                                    <td
                                        style={{ borderColor, width: `${medicationWidth}%` }}
                                        className="p-4 border medication-table-border-color"
                                    >
                                        {render_pdf_config?.make_generic_name_as_primary ? (
                                            <>
                                                <span
                                                    className={`bold ${
                                                        render_pdf_config?.injections_name_in_capital
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {inj?.generic_name
                                                        ? `${inj?.generic_name} `
                                                        : ''}
                                                </span>
                                                <br />
                                                <span>{inj?.name}</span>
                                                {inj?.added_drug?.map((drug) => (
                                                    <>
                                                        {' + '}

                                                        <br />
                                                        <span
                                                            className={`bold ${
                                                                render_pdf_config?.injections_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {drug.generic_name
                                                                ? ` (${drug.generic_name})`
                                                                : null}
                                                        </span>
                                                        <br />
                                                        <span>
                                                            {drug.name ? ` ${drug.name}` : null}
                                                        </span>
                                                    </>
                                                ))}{' '}
                                            </>
                                        ) : (
                                            <>
                                                <span
                                                    className={`bold ${
                                                        render_pdf_config?.injections_name_in_capital
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {inj?.name}{' '}
                                                </span>
                                                <br />
                                                <span>
                                                    {inj?.generic_name
                                                        ? `${inj?.generic_name} `
                                                        : ''}
                                                </span>

                                                {inj?.added_drug?.map((drug) => (
                                                    <>
                                                        {' + '}
                                                        <br />
                                                        <span
                                                            className={`bold ${
                                                                render_pdf_config?.injections_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {drug.name ? ` ${drug.name}` : null}
                                                        </span>
                                                        <br />
                                                        {drug.generic_name
                                                            ? ` (${drug.generic_name})`
                                                            : null}
                                                    </>
                                                ))}
                                            </>
                                        )}
                                    </td>

                                    {showColumns['dose'] && (
                                        <td
                                            style={{
                                                borderColor,
                                                width: `${
                                                    ((tableWidth?.['dose'] ||
                                                        injOptions2.allColumnWidthInNumber[
                                                            'dose' as keyof typeof injOptions2.allColumnWidthInNumber
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border medication-table-border-color p-4 text-center"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <div>
                                                    {inj?.dose?.custom}
                                                    {inj?.added_drug ? ' + ' : ''}
                                                </div>
                                                <div>
                                                    {inj?.added_drug?.map((drug) =>
                                                        drug.dose?.custom
                                                            ? `${drug.dose?.custom}`
                                                            : null,
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    )}

                                    {showColumns['route'] && (
                                        <td
                                            style={{
                                                borderColor,
                                                width: `${
                                                    ((tableWidth?.['route'] ||
                                                        injOptions2.allColumnWidthInNumber[
                                                            'route' as keyof typeof injOptions2.allColumnWidthInNumber
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border medication-table-border-color p-4 text-center"
                                        >
                                            <span>{inj?.route ? `${inj?.route}` : null}</span>
                                            <br />
                                            <span>
                                                {inj?.infusion_rate?.iv_drop_rate?.custom
                                                    ? `${inj?.infusion_rate?.iv_drop_rate?.custom}`
                                                    : null}
                                            </span>{' '}
                                            <span>
                                                {inj?.infusion_rate?.iv_rate?.custom
                                                    ? `${inj?.infusion_rate?.iv_rate?.custom}`
                                                    : null}
                                            </span>
                                            <br />
                                            <span>
                                                {inj?.infusion_rate?.infusion_time?.custom ? (
                                                    <>
                                                        {' '}
                                                        <span>Over</span>{' '}
                                                        {inj?.infusion_rate?.infusion_time?.custom}
                                                    </>
                                                ) : null}
                                            </span>
                                        </td>
                                    )}

                                    {showColumns['frequency'] && (
                                        <td
                                            style={{
                                                borderColor,
                                                width: `${
                                                    ((tableWidth?.['frequency'] ||
                                                        injOptions2.allColumnWidthInNumber[
                                                            'frequency' as keyof typeof injOptions2.allColumnWidthInNumber
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border medication-table-border-color p-4 text-center"
                                        >
                                            <div>
                                                {inj?.frequency?.custom ? (
                                                    <span> {inj?.frequency?.custom}</span>
                                                ) : null}
                                                {inj?.frequency?.time_split &&
                                                    inj?.frequency.time_split.length > 0 && <br />}
                                                {inj?.frequency?.time_split?.map(
                                                    (time, timeIdx, array) => (
                                                        <span key={`time-${timeIdx}`}>
                                                            {timeIdx === 0 ? '[ at ' : ''}
                                                            {moment(
                                                                formatDateInTimeZone({
                                                                    date: time.timing?.toString(),
                                                                    timeZone:
                                                                        d.timeZone ||
                                                                        'Asia/Calcutta',
                                                                }),
                                                            ).format('hh:mm A')}
                                                            {` ${timeZoneInfo}`}{' '}
                                                            {time?.custom
                                                                ? ` - ${time?.custom}`
                                                                : null}
                                                            {timeIdx !== array.length - 1
                                                                ? ','
                                                                : ''}
                                                            {timeIdx === array.length - 1
                                                                ? ']'
                                                                : ''}
                                                        </span>
                                                    ),
                                                )}
                                                {inj?.timing && <br />}
                                                {inj?.timing ? ` ${inj?.timing}` : null}
                                            </div>
                                        </td>
                                    )}

                                    {showColumns['duration'] && (
                                        <td
                                            style={{
                                                borderColor,
                                                width: `${
                                                    ((tableWidth?.['duration'] ||
                                                        injOptions2.allColumnWidthInNumber[
                                                            'duration' as keyof typeof injOptions2.allColumnWidthInNumber
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border medication-table-border-color p-4 text-center"
                                        >
                                            {inj?.duration?.custom || ''}
                                        </td>
                                    )}
                                </tr>
                                {inj?.instructions && (
                                    <tr key={`remarks-${index}`} className="text-11">
                                        <td
                                            style={{ borderColor }}
                                            className="bold p-4 border medication-table-border-color text-center"
                                        ></td>
                                        <td
                                            colSpan={
                                                Object.keys(showColumns).filter(Boolean).length + 1
                                            }
                                            style={{ borderColor }}
                                            className="p-4 border medication-table-border-color"
                                        >
                                            <span className="bold">Remarks:</span>{' '}
                                            <span>{inj?.instructions}</span>
                                        </td>
                                    </tr>
                                )}
                                {inj?.tapering_dose?.map((taper, taperIndex) => (
                                    <>
                                        <tr
                                            key={`inj-${index}-taper-${taperIndex}`}
                                            className="text-11"
                                        >
                                            <td
                                                style={{ borderColor, width: `4%` }}
                                                className="bold p-4 border medication-table-border-color text-center"
                                            >
                                                {inj?.taperingDoseTitleDisplay
                                                    ? `${taperIndex + 1}` + 'T'
                                                    : ''}
                                            </td>
                                            <td
                                                style={{
                                                    borderColor,
                                                    width: `${medicationWidth}%`,
                                                }}
                                                className="p-4 border medication-table-border-color"
                                            >
                                                {inj?.taperingDoseTitleDisplay ? (
                                                    render_pdf_config?.make_generic_name_as_primary ? (
                                                        <>
                                                            <span
                                                                className={`bold ${
                                                                    render_pdf_config?.injections_name_in_capital
                                                                        ? 'uppercase'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {inj?.generic_name
                                                                    ? `${inj?.generic_name} `
                                                                    : ''}
                                                            </span>
                                                            <br />
                                                            <span>{inj?.name}</span>
                                                            {inj?.added_drug?.map((drug) => (
                                                                <>
                                                                    {' + '}

                                                                    <br />
                                                                    <span
                                                                        className={`bold ${
                                                                            render_pdf_config?.injections_name_in_capital
                                                                                ? 'uppercase'
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        {drug.generic_name
                                                                            ? ` (${drug.generic_name})`
                                                                            : null}
                                                                    </span>
                                                                    <br />
                                                                    <span>
                                                                        {drug.name
                                                                            ? ` ${drug.name}`
                                                                            : null}
                                                                    </span>
                                                                </>
                                                            ))}{' '}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span
                                                                className={`bold ${
                                                                    render_pdf_config?.injections_name_in_capital
                                                                        ? 'uppercase'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {inj?.name}{' '}
                                                            </span>
                                                            <br />
                                                            <span>
                                                                {inj?.generic_name
                                                                    ? `${inj?.generic_name} `
                                                                    : ''}
                                                            </span>

                                                            {inj?.added_drug?.map((drug) => (
                                                                <>
                                                                    {' + '}
                                                                    <br />
                                                                    <span
                                                                        className={`bold ${
                                                                            render_pdf_config?.injections_name_in_capital
                                                                                ? 'uppercase'
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        {drug.name
                                                                            ? ` ${drug.name}`
                                                                            : null}
                                                                    </span>
                                                                    <br />
                                                                    {drug.generic_name
                                                                        ? ` (${drug.generic_name})`
                                                                        : null}
                                                                </>
                                                            ))}
                                                        </>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </td>
                                            {showColumns['dose'] && (
                                                <td
                                                    style={{
                                                        borderColor,
                                                        width: `${
                                                            ((tableWidth?.['dose'] ||
                                                                injOptions2.allColumnWidthInNumber[
                                                                    'dose' as keyof typeof injOptions2.allColumnWidthInNumber
                                                                ]) /
                                                                totalWidthCount) *
                                                            96
                                                        }%`,
                                                    }}
                                                    className="border medication-table-border-color p-4 text-center"
                                                >
                                                    {taper?.dose?.custom}
                                                </td>
                                            )}
                                            {showColumns['route'] && (
                                                <td
                                                    style={{
                                                        borderColor,
                                                        width: `${
                                                            ((tableWidth?.['route'] ||
                                                                injOptions2.allColumnWidthInNumber[
                                                                    'route' as keyof typeof injOptions2.allColumnWidthInNumber
                                                                ]) /
                                                                totalWidthCount) *
                                                            96
                                                        }%`,
                                                    }}
                                                    className="border medication-table-border-color p-4 text-center"
                                                >
                                                    <span>
                                                        {taper?.route
                                                            ? `${taper?.route}`
                                                            : `${inj?.route}`}
                                                    </span>
                                                    <br />
                                                    <span>
                                                        {taper?.infusion_rate?.iv_drop_rate?.custom
                                                            ? `${taper?.infusion_rate?.iv_drop_rate?.custom}`
                                                            : null}
                                                    </span>{' '}
                                                    <span>
                                                        {taper?.infusion_rate?.iv_rate?.custom
                                                            ? `${taper?.infusion_rate?.iv_rate?.custom}`
                                                            : null}
                                                    </span>
                                                    <br />
                                                    <span>
                                                        {taper?.infusion_rate?.infusion_time
                                                            ?.custom ? (
                                                            <>
                                                                {' '}
                                                                <span>Over</span>{' '}
                                                                {
                                                                    taper?.infusion_rate
                                                                        ?.infusion_time?.custom
                                                                }
                                                            </>
                                                        ) : null}
                                                    </span>
                                                </td>
                                            )}
                                            {showColumns['frequency'] && (
                                                <td
                                                    style={{
                                                        borderColor,
                                                        width: `${
                                                            ((tableWidth?.['frequency'] ||
                                                                injOptions2.allColumnWidthInNumber[
                                                                    'frequency' as keyof typeof injOptions2.allColumnWidthInNumber
                                                                ]) /
                                                                totalWidthCount) *
                                                            96
                                                        }%`,
                                                    }}
                                                    className="border medication-table-border-color p-4 text-center"
                                                >
                                                    <div>
                                                        {taper?.frequency?.custom ? (
                                                            <>
                                                                <span>
                                                                    {' '}
                                                                    {taper?.frequency?.custom}
                                                                </span>
                                                            </>
                                                        ) : null}
                                                        {<br />}
                                                        {taper?.frequency?.time_split?.map(
                                                            (time, index, array) => (
                                                                <>
                                                                    {' '}
                                                                    {index === 0 ? '[ at ' : ''}
                                                                    {moment(
                                                                        formatDateInTimeZone({
                                                                            date: time.timing?.toString(),
                                                                            timeZone:
                                                                                d.timeZone ||
                                                                                'Asia/Calcutta',
                                                                        }),
                                                                    ).format('hh:mm A')}
                                                                    {` ${timeZoneInfo}`}{' '}
                                                                    {time?.custom
                                                                        ? ` - ${time?.custom}`
                                                                        : null}
                                                                    {index !== array.length - 1
                                                                        ? ','
                                                                        : ''}
                                                                    {index === array.length - 1
                                                                        ? ']'
                                                                        : ''}
                                                                </>
                                                            ),
                                                        )}
                                                        {<br />}
                                                        {taper?.timing ? ` ${taper?.timing}` : null}
                                                        {<br />}
                                                        {taper?.duration?.custom || ''}
                                                    </div>
                                                </td>
                                            )}
                                            {/* {showColumns['duration'] && (
                                            <td
                                                style={{ borderColor }}
                                                className="border medication-table-border-color p-4 text-center"
                                            >
                                                {taper?.duration?.custom}
                                            </td>
                                        )} */}
                                            {showColumns['instruction'] && (
                                                <td
                                                    style={{
                                                        borderColor,
                                                        width: `${
                                                            ((tableWidth?.['instruction'] ||
                                                                injOptions2.allColumnWidthInNumber[
                                                                    'instruction' as keyof typeof injOptions2.allColumnWidthInNumber
                                                                ]) /
                                                                totalWidthCount) *
                                                            96
                                                        }%`,
                                                    }}
                                                    className="border medication-table-border-color p-4"
                                                >
                                                    {taper?.instructions}
                                                </td>
                                            )}
                                        </tr>
                                        {taper?.instructions && (
                                            <tr key={`remarks-${taperIndex}`} className="text-11">
                                                <td
                                                    style={{ borderColor }}
                                                    className="bold p-4 border medication-table-border-color text-center"
                                                ></td>
                                                <td
                                                    colSpan={
                                                        Object.keys(showColumns).filter(Boolean)
                                                            .length + 1
                                                    }
                                                    style={{ borderColor }}
                                                    className="p-4 border medication-table-border-color"
                                                >
                                                    <span className="bold">Remarks:</span>{' '}
                                                    <span>{taper?.instructions}</span>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const getInjections3Html = (
    d: RenderPdfPrescription,
    render_pdf_config?: TemplateConfig,
): JSX.Element | undefined => {
    const injections = d?.tool?.injections;
    const showColumns: { [key: string]: boolean } = {};
    const titleBgColor = render_pdf_config?.injections_table_title_bg_color || '#E4DEEB';
    const borderColor = render_pdf_config?.injections_table_border_color || '#8064A2';
    const heading = render_pdf_config?.injections_table_heading_text;
    const hideHeading = render_pdf_config?.injections_heading_hide;
    const tableTitleAlignment = render_pdf_config?.injections_table_title_alignment;
    const tableHeaderColor = render_pdf_config?.injections_table_header_color || '#8064A2';
    const tableWidth = render_pdf_config?.injections_table_width;

    const timeZoneInfo =
        d?.timeZone === 'Asia/Calcutta' || d?.timeZone === 'Asia/Kolkata'
            ? ''
            : getTimeZoneInfo(d.timeZone).abbreviation;

    injections?.forEach((inj) => {
        if (inj?.dose?.custom?.trim()) {
            showColumns['dose'] = true;
        }
        if (inj?.route || inj?.infusion_rate) {
            showColumns['route'] = true;
        }
        if (inj?.frequency?.custom || inj?.frequency?.time_split?.length) {
            showColumns['frequency'] = true;
        }
        if (inj?.duration?.custom) {
            showColumns['duration'] = true;
        }
        // Check tapering doses for columns
        inj?.tapering_dose?.forEach((taper) => {
            if (taper?.dose?.custom?.trim()) {
                showColumns['dose'] = true;
            }
            if (taper?.frequency?.custom || taper?.frequency?.time_split?.length) {
                showColumns['frequency'] = true;
            }
            if (taper?.duration?.custom) {
                showColumns['duration'] = true;
            }
            if (taper?.instructions) {
                showColumns['instruction'] = true;
            }
            if (taper?.route || taper?.infusion_rate) {
                showColumns['route'] = true;
            }
        });
    });

    if (!injections?.length) {
        return;
    }

    let totalWidthCount =
        tableWidth?.['medication'] || injOptions3.allColumnWidthInNumber['medication'];

    Object.keys(injOptions3.allColumnWidthInNumber).map((key) => {
        if (showColumns?.[key]) {
            totalWidthCount +=
                tableWidth?.[key] ||
                injOptions3.allColumnWidthInNumber[
                    key as keyof typeof injOptions3.injIdToNameMapping
                ];
        }
    });

    const medicationWidth =
        ((tableWidth?.['medication'] || injOptions3.allColumnWidthInNumber['medication']) /
            totalWidthCount) *
        96;

    return (
        <div>
            {hideHeading ? (
                ''
            ) : (
                <p
                    style={{
                        textAlign: tableTitleAlignment,
                        color: tableHeaderColor,
                    }}
                    className="text-13 text-center prescription-title-color bold underline italic"
                >
                    {heading || 'INJECTIONS'}
                </p>
            )}
            <div className="text-darwin-neutral-1000">
                <table style={{ width: '100%' }} className="border-collapse w-full">
                    <thead>
                        <tr className="text-11 bold w-full">
                            <th
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    width: `4%`,
                                }}
                                className="border-b medication-table-border-color medication-title-color w-64 text-center p-4"
                            ></th>
                            <th
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    width: `${medicationWidth}%`,
                                }}
                                className="border-b medication-table-border-color medication-title-color bold text-center p-4"
                            >
                                Injections
                            </th>
                            {Object.keys(injOptions3.injIdToNameMapping)
                                .map((key) => {
                                    if (!showColumns?.[key]) {
                                        return null;
                                    }
                                    return (
                                        <th
                                            style={{
                                                borderColor: borderColor,
                                                backgroundColor: titleBgColor,
                                                width: `${
                                                    ((tableWidth?.[key] ||
                                                        injOptions3.allColumnWidthInNumber[
                                                            key as keyof typeof injOptions3.injIdToNameMapping
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border-b medication-table-border-color medication-title-color bold text-center p-4"
                                        >
                                            {
                                                injOptions3.injIdToNameMapping[
                                                    key as keyof typeof injOptions3.injIdToNameMapping
                                                ]
                                            }
                                        </th>
                                    );
                                })
                                .filter(Boolean)}
                        </tr>
                    </thead>

                    {injections?.map((inj, index) => {
                        return (
                            <React.Fragment key={`inj-${index}`}>
                                <tr
                                    style={{ borderColor: borderColor }}
                                    className={`text-11 ${
                                        inj?.instructions
                                            ? ''
                                            : 'border-b medication-table-border-color'
                                    }`}
                                >
                                    <td style={{ width: `4%` }} className="bold p-4 text-center">
                                        {index + 1}
                                    </td>
                                    <td style={{ width: `${medicationWidth}%` }} className="p-4">
                                        {render_pdf_config?.make_generic_name_as_primary ? (
                                            <>
                                                <span
                                                    className={`bold ${
                                                        render_pdf_config?.injections_name_in_capital
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {inj?.generic_name
                                                        ? `${inj?.generic_name} `
                                                        : ''}
                                                </span>
                                                <br />
                                                <span>{inj?.name}</span>
                                                {inj?.added_drug?.map((drug) => (
                                                    <>
                                                        {' + '}

                                                        <br />
                                                        <span
                                                            className={`bold ${
                                                                render_pdf_config?.injections_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {drug.generic_name
                                                                ? ` (${drug.generic_name})`
                                                                : null}
                                                        </span>
                                                        <br />
                                                        <span>
                                                            {drug.name ? ` ${drug.name}` : null}
                                                        </span>
                                                    </>
                                                ))}{' '}
                                            </>
                                        ) : (
                                            <>
                                                <span
                                                    className={`bold ${
                                                        render_pdf_config?.injections_name_in_capital
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {inj?.name}{' '}
                                                </span>
                                                <br />
                                                <span>
                                                    {inj?.generic_name
                                                        ? `${inj?.generic_name} `
                                                        : ''}
                                                </span>

                                                {inj?.added_drug?.map((drug) => (
                                                    <>
                                                        {' + '}
                                                        <br />
                                                        <span
                                                            className={`bold ${
                                                                render_pdf_config?.injections_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {drug.name ? ` ${drug.name}` : null}
                                                        </span>
                                                        <br />
                                                        {drug.generic_name
                                                            ? ` (${drug.generic_name})`
                                                            : null}
                                                    </>
                                                ))}
                                            </>
                                        )}
                                    </td>

                                    {Object.keys(injOptions3.injIdToNameMapping)
                                        .map((key) => {
                                            if (!showColumns?.[key]) {
                                                return null;
                                            }
                                            if (key === injOptions3.injId.dose) {
                                                return (
                                                    <td
                                                        className="p-4 text-center"
                                                        style={{
                                                            width: `${
                                                                ((tableWidth?.[key] ||
                                                                    injOptions3
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof injOptions3.injIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                    >
                                                        {/* {inj?.dose?.custom || ''} */}
                                                        <div className="flex flex-col gap-2">
                                                            <div>
                                                                {inj?.dose?.custom}
                                                                {inj?.added_drug ? ' + ' : ''}
                                                            </div>
                                                            <div>
                                                                {inj?.added_drug?.map((drug) =>
                                                                    drug.dose?.custom
                                                                        ? `${drug.dose?.custom}`
                                                                        : null,
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (key === injOptions3.injId.route) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((tableWidth?.[key] ||
                                                                    injOptions3
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof injOptions3.injIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="p-4 text-center"
                                                    >
                                                        <span>
                                                            {inj?.route ? `${inj?.route}` : null}
                                                        </span>
                                                        <br />
                                                        <span>
                                                            {inj?.infusion_rate?.iv_drop_rate
                                                                ?.custom
                                                                ? `${inj?.infusion_rate?.iv_drop_rate?.custom}`
                                                                : null}
                                                        </span>{' '}
                                                        <span>
                                                            {inj?.infusion_rate?.iv_rate?.custom
                                                                ? `${inj?.infusion_rate?.iv_rate?.custom}`
                                                                : null}
                                                        </span>
                                                        <br />
                                                        <span>
                                                            {inj?.infusion_rate?.infusion_time
                                                                ?.custom ? (
                                                                <>
                                                                    {' '}
                                                                    <span>Over</span>{' '}
                                                                    {
                                                                        inj?.infusion_rate
                                                                            ?.infusion_time?.custom
                                                                    }
                                                                </>
                                                            ) : null}
                                                        </span>
                                                    </td>
                                                );
                                            }
                                            if (key === injOptions3.injId.frequency) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((tableWidth?.[key] ||
                                                                    injOptions3
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof injOptions3.injIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="p-4 text-center"
                                                    >
                                                        <div>
                                                            {inj?.frequency?.custom ? (
                                                                <span>
                                                                    {' '}
                                                                    {inj?.frequency?.custom}
                                                                </span>
                                                            ) : null}
                                                            {inj?.frequency?.time_split &&
                                                                inj?.frequency.time_split.length >
                                                                    0 && <br />}
                                                            {inj?.frequency?.time_split?.map(
                                                                (time, timeIdx, array) => (
                                                                    <span key={`time-${timeIdx}`}>
                                                                        {timeIdx === 0
                                                                            ? '[ at '
                                                                            : ''}
                                                                        {moment(
                                                                            formatDateInTimeZone({
                                                                                date: time.timing?.toString(),
                                                                                timeZone:
                                                                                    d.timeZone ||
                                                                                    'Asia/Calcutta',
                                                                            }),
                                                                        ).format('hh:mm A')}
                                                                        {` ${timeZoneInfo}`}{' '}
                                                                        {time?.custom
                                                                            ? ` - ${time?.custom}`
                                                                            : null}
                                                                        {timeIdx !==
                                                                        array.length - 1
                                                                            ? ','
                                                                            : ''}
                                                                        {timeIdx ===
                                                                        array.length - 1
                                                                            ? ']'
                                                                            : ''}
                                                                    </span>
                                                                ),
                                                            )}
                                                            {inj?.timing && <br />}
                                                            {inj?.timing ? ` ${inj?.timing}` : null}
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (key === injOptions3.injId.duration) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((tableWidth?.[key] ||
                                                                    injOptions3
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof injOptions3.injIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="p-4 text-center"
                                                    >
                                                        {inj?.duration?.custom || ''}
                                                    </td>
                                                );
                                            }
                                            return null;
                                        })
                                        .filter(Boolean)}
                                </tr>
                                {inj?.instructions && (
                                    <tr
                                        style={{ borderColor: borderColor }}
                                        className="border-b medication-table-border-color text-11"
                                    >
                                        <td className="bold p-4 text-center"></td>
                                        <td colSpan={5}>
                                            <span className="bold">Remarks:</span>{' '}
                                            <span>{inj?.instructions}</span>
                                        </td>
                                    </tr>
                                )}
                                {inj?.tapering_dose?.map((taper, TaperIndex) => (
                                    <>
                                        {' '}
                                        <tr
                                            style={{ borderColor: borderColor }}
                                            className={`text-11 ${
                                                taper?.instructions
                                                    ? ''
                                                    : 'border-b medication-table-border-color'
                                            }`}
                                        >
                                            <td style={{ width: `4%` }} className="p-4 text-center">
                                                {inj?.taperingDoseTitleDisplay
                                                    ? `${TaperIndex + 1}` + 'T'
                                                    : ''}
                                            </td>
                                            <td style={{ width: `${medicationWidth}%` }}>
                                                {inj?.taperingDoseTitleDisplay ? (
                                                    render_pdf_config?.make_generic_name_as_primary ? (
                                                        <>
                                                            <span
                                                                className={`bold ${
                                                                    render_pdf_config?.injections_name_in_capital
                                                                        ? 'uppercase'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {inj?.generic_name
                                                                    ? `${inj?.generic_name} `
                                                                    : ''}
                                                            </span>
                                                            <br />
                                                            <span>{inj?.name}</span>
                                                            {inj?.added_drug?.map((drug) => (
                                                                <>
                                                                    {' + '}

                                                                    <br />
                                                                    <span
                                                                        className={`bold ${
                                                                            render_pdf_config?.injections_name_in_capital
                                                                                ? 'uppercase'
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        {drug.generic_name
                                                                            ? ` (${drug.generic_name})`
                                                                            : null}
                                                                    </span>
                                                                    <br />
                                                                    <span>
                                                                        {drug.name
                                                                            ? ` ${drug.name}`
                                                                            : null}
                                                                    </span>
                                                                </>
                                                            ))}{' '}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span
                                                                className={`bold ${
                                                                    render_pdf_config?.injections_name_in_capital
                                                                        ? 'uppercase'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {inj?.name}{' '}
                                                            </span>
                                                            <br />
                                                            <span>
                                                                {inj?.generic_name
                                                                    ? `${inj?.generic_name} `
                                                                    : ''}
                                                            </span>

                                                            {inj?.added_drug?.map((drug) => (
                                                                <>
                                                                    {' + '}
                                                                    <br />
                                                                    <span
                                                                        className={`bold ${
                                                                            render_pdf_config?.injections_name_in_capital
                                                                                ? 'uppercase'
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        {drug.name
                                                                            ? ` ${drug.name}`
                                                                            : null}
                                                                    </span>
                                                                    <br />
                                                                    {drug.generic_name
                                                                        ? ` (${drug.generic_name})`
                                                                        : null}
                                                                </>
                                                            ))}
                                                        </>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </td>

                                            {Object.keys(injOptions3.injIdToNameMapping)
                                                .map((key) => {
                                                    if (!showColumns?.[key]) {
                                                        return null;
                                                    }

                                                    if (key === injOptions3.injId.dose) {
                                                        return (
                                                            <td
                                                                style={{
                                                                    width: `${
                                                                        ((tableWidth?.[key] ||
                                                                            injOptions3
                                                                                .allColumnWidthInNumber[
                                                                                key as keyof typeof injOptions3.injIdToNameMapping
                                                                            ]) /
                                                                            totalWidthCount) *
                                                                        96
                                                                    }%`,
                                                                }}
                                                                className="p-4 text-center"
                                                            >
                                                                {/* {inj?.dose?.custom || ''} */}
                                                                <div className="flex flex-col gap-2">
                                                                    <div>
                                                                        {taper?.dose?.custom}
                                                                        {taper?.added_drug
                                                                            ? ' + '
                                                                            : ''}
                                                                    </div>
                                                                    <div>
                                                                        {taper?.added_drug?.map(
                                                                            (drug) =>
                                                                                drug.dose?.custom
                                                                                    ? `${drug.dose?.custom}`
                                                                                    : null,
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        );
                                                    }
                                                    if (key === injOptions3.injId.route) {
                                                        return (
                                                            <td
                                                                style={{
                                                                    width: `${
                                                                        ((tableWidth?.[key] ||
                                                                            injOptions3
                                                                                .allColumnWidthInNumber[
                                                                                key as keyof typeof injOptions3.injIdToNameMapping
                                                                            ]) /
                                                                            totalWidthCount) *
                                                                        96
                                                                    }%`,
                                                                }}
                                                                className="p-4 text-center"
                                                            >
                                                                <span>
                                                                    {taper?.route
                                                                        ? `${taper?.route}`
                                                                        : null}
                                                                </span>
                                                                <br />
                                                                <span>
                                                                    {taper?.infusion_rate
                                                                        ?.iv_drop_rate?.custom
                                                                        ? `${taper?.infusion_rate?.iv_drop_rate?.custom}`
                                                                        : null}
                                                                </span>{' '}
                                                                <span>
                                                                    {taper?.infusion_rate?.iv_rate
                                                                        ?.custom
                                                                        ? `${taper?.infusion_rate?.iv_rate?.custom}`
                                                                        : null}
                                                                </span>
                                                                <br />
                                                                <span>
                                                                    {taper?.infusion_rate
                                                                        ?.infusion_time?.custom ? (
                                                                        <>
                                                                            {' '}
                                                                            <span>Over</span>{' '}
                                                                            {
                                                                                taper?.infusion_rate
                                                                                    ?.infusion_time
                                                                                    ?.custom
                                                                            }
                                                                        </>
                                                                    ) : null}
                                                                </span>
                                                            </td>
                                                        );
                                                    }
                                                    if (key === injOptions3.injId.frequency) {
                                                        return (
                                                            <td
                                                                style={{
                                                                    width: `${
                                                                        ((tableWidth?.[key] ||
                                                                            injOptions3
                                                                                .allColumnWidthInNumber[
                                                                                key as keyof typeof injOptions3.injIdToNameMapping
                                                                            ]) /
                                                                            totalWidthCount) *
                                                                        96
                                                                    }%`,
                                                                }}
                                                                className="p-4 text-center"
                                                            >
                                                                <div>
                                                                    {taper?.frequency?.custom ? (
                                                                        <span>
                                                                            {' '}
                                                                            {
                                                                                taper?.frequency
                                                                                    ?.custom
                                                                            }
                                                                        </span>
                                                                    ) : null}
                                                                    {taper?.frequency?.time_split &&
                                                                        taper?.frequency.time_split
                                                                            .length > 0 && <br />}
                                                                    {taper?.frequency?.time_split?.map(
                                                                        (time, timeIdx, array) => (
                                                                            <span
                                                                                key={`time-${timeIdx}`}
                                                                            >
                                                                                {timeIdx === 0
                                                                                    ? '[ at '
                                                                                    : ''}
                                                                                {moment(
                                                                                    formatDateInTimeZone(
                                                                                        {
                                                                                            date: time.timing?.toString(),
                                                                                            timeZone:
                                                                                                d.timeZone ||
                                                                                                'Asia/Calcutta',
                                                                                        },
                                                                                    ),
                                                                                ).format('hh:mm A')}
                                                                                {` ${timeZoneInfo}`}{' '}
                                                                                {time?.custom
                                                                                    ? ` - ${time?.custom}`
                                                                                    : null}
                                                                                {timeIdx !==
                                                                                array.length - 1
                                                                                    ? ','
                                                                                    : ''}
                                                                                {timeIdx ===
                                                                                array.length - 1
                                                                                    ? ']'
                                                                                    : ''}
                                                                            </span>
                                                                        ),
                                                                    )}
                                                                    {taper?.timing && <br />}
                                                                    {taper?.timing
                                                                        ? ` ${taper?.timing}`
                                                                        : null}
                                                                </div>
                                                            </td>
                                                        );
                                                    }
                                                    if (key === injOptions3.injId.duration) {
                                                        return (
                                                            <td
                                                                style={{
                                                                    width: `${
                                                                        ((tableWidth?.[key] ||
                                                                            injOptions3
                                                                                .allColumnWidthInNumber[
                                                                                key as keyof typeof injOptions3.injIdToNameMapping
                                                                            ]) /
                                                                            totalWidthCount) *
                                                                        96
                                                                    }%`,
                                                                }}
                                                                className="p-4 text-center"
                                                            >
                                                                {taper?.duration?.custom || ''}
                                                            </td>
                                                        );
                                                    }
                                                    return null;
                                                })
                                                .filter(Boolean)}
                                        </tr>
                                        {taper?.instructions && (
                                            <tr
                                                style={{ borderColor: borderColor }}
                                                className="border-b medication-table-border-color text-11"
                                            >
                                                <td className="bold p-4 text-center"></td>
                                                <td colSpan={5}>
                                                    <span className="bold">Remarks:</span>{' '}
                                                    <span>{taper?.instructions}</span>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </React.Fragment>
                        );
                    })}
                </table>
            </div>
        </div>
    );
};

export const getInjections4Html = (
    d: RenderPdfPrescription,
    render_pdf_config?: TemplateConfig,
): JSX.Element | undefined => {
    const injections = d?.tool?.injections;
    const showColumns: { [key: string]: boolean } = {};
    const titleBgColor = render_pdf_config?.injections_table_title_bg_color || '#E4DEEB';
    const borderColor = render_pdf_config?.injections_table_border_color || '#8064A2';
    const heading = render_pdf_config?.injections_table_heading_text;
    const hideHeading = render_pdf_config?.injections_heading_hide;
    const tableTitleAlignment = render_pdf_config?.injections_table_title_alignment;
    const tableHeaderColor = render_pdf_config?.injections_table_header_color || '#8064A2';
    const tableWidth = render_pdf_config?.injections_table_width;

    const timeZoneInfo =
        d?.timeZone === 'Asia/Calcutta' || d?.timeZone === 'Asia/Kolkata'
            ? ''
            : getTimeZoneInfo(d.timeZone).abbreviation;

    injections?.forEach((inj) => {
        if (inj?.dose?.custom?.trim()) {
            showColumns['dose'] = true;
        }
        if (inj?.route || inj?.infusion_rate) {
            showColumns['route'] = true;
        }
        if (inj?.frequency?.custom || inj?.frequency?.time_split?.length) {
            showColumns['frequency'] = true;
        }
        if (inj?.duration?.custom) {
            showColumns['duration'] = true;
        }
        if (inj?.instructions) {
            showColumns['instruction'] = true;
        }
        // Check tapering doses for columns
        inj?.tapering_dose?.forEach((taper) => {
            if (taper?.dose?.custom?.trim()) {
                showColumns['dose'] = true;
            }
            if (taper?.frequency?.custom || taper?.frequency?.time_split?.length) {
                showColumns['frequency'] = true;
            }
            if (taper?.duration?.custom) {
                showColumns['duration'] = true;
            }
            if (taper?.instructions) {
                showColumns['instruction'] = true;
            }
            if (taper?.route || taper?.infusion_rate) {
                showColumns['route'] = true;
            }
        });
    });

    if (!injections?.length) {
        return;
    }

    let totalWidthCount =
        tableWidth?.['medication'] || injOptions4.allColumnWidthInNumber['medication'];

    Object.keys(injOptions4.allColumnWidthInNumber).map((key) => {
        if (showColumns?.[key]) {
            totalWidthCount +=
                tableWidth?.[key] ||
                injOptions4.allColumnWidthInNumber[
                    key as keyof typeof injOptions4.injIdToNameMapping
                ];
        }
    });

    const medicationWidth =
        ((tableWidth?.['medication'] || injOptions4.allColumnWidthInNumber['medication']) /
            totalWidthCount) *
        96;

    return (
        <div>
            {hideHeading ? (
                ''
            ) : (
                <p
                    style={{
                        textAlign: tableTitleAlignment,
                        color: tableHeaderColor,
                    }}
                    className="text-13 text-center prescription-title-color bold underline italic"
                >
                    {heading || 'INJECTIONS'}
                </p>
            )}
            <div className="text-darwin-neutral-1000">
                <table style={{ width: '100%' }} className="border-collapse w-full">
                    <thead>
                        <tr className="text-11 bold w-full">
                            <th
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    width: `4%`,
                                }}
                                className="border-b medication-table-border-color medication-title-color w-64 text-center p-4"
                            ></th>
                            <th
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: titleBgColor,
                                    width: `${medicationWidth}%`,
                                }}
                                className="border-b medication-table-border-color medication-title-color bold text-center p-4"
                            >
                                Injections
                            </th>
                            {Object.keys(injOptions4.injIdToNameMapping)
                                .map((key) => {
                                    if (!showColumns?.[key]) {
                                        return null;
                                    }
                                    return (
                                        <th
                                            style={{
                                                borderColor: borderColor,
                                                backgroundColor: titleBgColor,
                                                width: `${
                                                    ((tableWidth?.[key] ||
                                                        injOptions4.allColumnWidthInNumber[
                                                            key as keyof typeof injOptions4.injIdToNameMapping
                                                        ]) /
                                                        totalWidthCount) *
                                                    96
                                                }%`,
                                            }}
                                            className="border-b medication-table-border-color medication-title-color bold text-center p-4"
                                        >
                                            {
                                                injOptions4.injIdToNameMapping[
                                                    key as keyof typeof injOptions4.injIdToNameMapping
                                                ]
                                            }
                                        </th>
                                    );
                                })
                                .filter(Boolean)}
                        </tr>
                    </thead>

                    {injections?.map((inj, index) => {
                        return (
                            <React.Fragment key={`inj-${index}`}>
                                <tr
                                    style={{ borderColor: borderColor }}
                                    className="border-b medication-table-border-color text-11"
                                >
                                    <td style={{ width: `4%` }} className="bold p-4 text-center">
                                        {index + 1}
                                    </td>
                                    <td style={{ width: `${medicationWidth}%` }} className="p-4">
                                        {render_pdf_config?.make_generic_name_as_primary ? (
                                            <>
                                                <span
                                                    className={`bold ${
                                                        render_pdf_config?.injections_name_in_capital
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {inj?.generic_name
                                                        ? `${inj?.generic_name} `
                                                        : ''}
                                                </span>
                                                <br />
                                                <span>{inj?.name}</span>
                                                {inj?.added_drug?.map((drug) => (
                                                    <>
                                                        {' + '}

                                                        <br />
                                                        <span
                                                            className={`bold ${
                                                                render_pdf_config?.injections_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {drug.generic_name
                                                                ? ` (${drug.generic_name})`
                                                                : null}
                                                        </span>
                                                        <br />
                                                        <span>
                                                            {drug.name ? ` ${drug.name}` : null}
                                                        </span>
                                                    </>
                                                ))}{' '}
                                            </>
                                        ) : (
                                            <>
                                                <span
                                                    className={`bold ${
                                                        render_pdf_config?.injections_name_in_capital
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {inj?.name}{' '}
                                                </span>
                                                <br />
                                                <span>
                                                    {inj?.generic_name
                                                        ? `${inj?.generic_name} `
                                                        : ''}
                                                </span>

                                                {inj?.added_drug?.map((drug) => (
                                                    <>
                                                        {' + '}
                                                        <br />
                                                        <span
                                                            className={`bold ${
                                                                render_pdf_config?.injections_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {drug.name ? ` ${drug.name}` : null}
                                                        </span>
                                                        <br />
                                                        {drug.generic_name
                                                            ? ` (${drug.generic_name})`
                                                            : null}
                                                    </>
                                                ))}
                                            </>
                                        )}
                                    </td>

                                    {Object.keys(injOptions4.injIdToNameMapping)
                                        .map((key) => {
                                            if (!showColumns?.[key]) {
                                                return null;
                                            }
                                            if (key === injOptions4.injId.dose) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((tableWidth?.[key] ||
                                                                    injOptions4
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof injOptions4.injIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="p-4 text-center"
                                                    >
                                                        <div className="flex flex-col gap-2">
                                                            <div>
                                                                {inj?.dose?.custom}
                                                                {/* {inj?.added_drug?.length ? ' + ' : ''} */}
                                                            </div>
                                                            <div>
                                                                {inj?.added_drug?.map((drug) =>
                                                                    drug.dose?.custom ? (
                                                                        <>
                                                                            {' + '}
                                                                            <br />
                                                                            {drug.dose?.custom}
                                                                        </>
                                                                    ) : null,
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (key === injOptions4.injId.route) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((tableWidth?.[key] ||
                                                                    injOptions4
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof injOptions4.injIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="p-4 text-center"
                                                    >
                                                        <span>
                                                            {inj?.route ? `${inj?.route}` : null}
                                                        </span>
                                                        <br />
                                                        <span>
                                                            {inj?.infusion_rate?.iv_drop_rate
                                                                ?.custom
                                                                ? `${inj?.infusion_rate?.iv_drop_rate?.custom}`
                                                                : null}
                                                        </span>{' '}
                                                        <span>
                                                            {inj?.infusion_rate?.iv_rate?.custom
                                                                ? `${inj?.infusion_rate?.iv_rate?.custom}`
                                                                : null}
                                                        </span>
                                                        <br />
                                                        <span>
                                                            {inj?.infusion_rate?.infusion_time
                                                                ?.custom ? (
                                                                <>
                                                                    {' '}
                                                                    <span>Over</span>{' '}
                                                                    {
                                                                        inj?.infusion_rate
                                                                            ?.infusion_time?.custom
                                                                    }
                                                                </>
                                                            ) : null}
                                                        </span>
                                                    </td>
                                                );
                                            }
                                            if (key === injOptions4.injId.frequency) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((tableWidth?.[key] ||
                                                                    injOptions4
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof injOptions4.injIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="p-4 text-center"
                                                    >
                                                        <div>
                                                            {inj?.frequency?.custom ? (
                                                                <span>
                                                                    {' '}
                                                                    {inj?.frequency?.custom}
                                                                </span>
                                                            ) : null}
                                                            {inj?.frequency?.time_split &&
                                                                inj?.frequency.time_split.length >
                                                                    0 && <br />}
                                                            {inj?.frequency?.time_split?.map(
                                                                (time, timeIdx, array) => (
                                                                    <span key={`time-${timeIdx}`}>
                                                                        {timeIdx === 0
                                                                            ? '[ at '
                                                                            : ''}
                                                                        {moment(
                                                                            formatDateInTimeZone({
                                                                                date: time.timing?.toString(),
                                                                                timeZone:
                                                                                    d.timeZone ||
                                                                                    'Asia/Calcutta',
                                                                            }),
                                                                        ).format('hh:mm A')}
                                                                        {` ${timeZoneInfo}`}{' '}
                                                                        {time?.custom
                                                                            ? ` - ${time?.custom}`
                                                                            : null}
                                                                        {timeIdx !==
                                                                        array.length - 1
                                                                            ? ','
                                                                            : ''}
                                                                        {timeIdx ===
                                                                        array.length - 1
                                                                            ? ']'
                                                                            : ''}
                                                                    </span>
                                                                ),
                                                            )}
                                                            {inj?.timing && <br />}
                                                            {inj?.timing ? ` ${inj?.timing}` : null}
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            if (key === injOptions4.injId.duration) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((tableWidth?.[key] ||
                                                                    injOptions4
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof injOptions4.injIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="p-4 text-center"
                                                    >
                                                        {inj?.duration?.custom || ''}
                                                    </td>
                                                );
                                            }
                                            if (key === injOptions4.injId.instruction) {
                                                return (
                                                    <td
                                                        style={{
                                                            width: `${
                                                                ((tableWidth?.[key] ||
                                                                    injOptions4
                                                                        .allColumnWidthInNumber[
                                                                        key as keyof typeof injOptions4.injIdToNameMapping
                                                                    ]) /
                                                                    totalWidthCount) *
                                                                96
                                                            }%`,
                                                        }}
                                                        className="break-all whitespace-preline p-4 text-left"
                                                    >
                                                        {inj?.instructions || '-'}
                                                    </td>
                                                );
                                            }
                                            return null;
                                        })
                                        .filter(Boolean)}
                                </tr>
                                {inj?.tapering_dose?.map((taper, taperIndex) => (
                                    <tr
                                        style={{ borderColor: borderColor }}
                                        className="border-b medication-table-border-color text-11"
                                    >
                                        <td
                                            style={{ width: `4%` }}
                                            className="bold p-4 text-center"
                                        >
                                            {inj?.taperingDoseTitleDisplay
                                                ? `${taperIndex + 1}` + 'T'
                                                : ''}
                                        </td>
                                        <td
                                            style={{ width: `${medicationWidth}%` }}
                                            className="p-4"
                                        >
                                            {inj?.taperingDoseTitleDisplay ? (
                                                render_pdf_config?.make_generic_name_as_primary ? (
                                                    <>
                                                        <span
                                                            className={`bold ${
                                                                render_pdf_config?.injections_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {inj?.generic_name
                                                                ? `${inj?.generic_name} `
                                                                : ''}
                                                        </span>
                                                        <br />
                                                        <span>{inj?.name}</span>
                                                        {inj?.added_drug?.map((drug) => (
                                                            <>
                                                                {' + '}

                                                                <br />
                                                                <span
                                                                    className={`bold ${
                                                                        render_pdf_config?.injections_name_in_capital
                                                                            ? 'uppercase'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    {drug.generic_name
                                                                        ? ` (${drug.generic_name})`
                                                                        : null}
                                                                </span>
                                                                <br />
                                                                <span>
                                                                    {drug.name
                                                                        ? ` ${drug.name}`
                                                                        : null}
                                                                </span>
                                                            </>
                                                        ))}{' '}
                                                    </>
                                                ) : (
                                                    <>
                                                        <span
                                                            className={`bold ${
                                                                render_pdf_config?.injections_name_in_capital
                                                                    ? 'uppercase'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {inj?.name}{' '}
                                                        </span>
                                                        <br />
                                                        <span>
                                                            {inj?.generic_name
                                                                ? `${inj?.generic_name} `
                                                                : ''}
                                                        </span>

                                                        {inj?.added_drug?.map((drug) => (
                                                            <>
                                                                {' + '}
                                                                <br />
                                                                <span
                                                                    className={`bold ${
                                                                        render_pdf_config?.injections_name_in_capital
                                                                            ? 'uppercase'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    {drug.name
                                                                        ? ` ${drug.name}`
                                                                        : null}
                                                                </span>
                                                                <br />
                                                                {drug.generic_name
                                                                    ? ` (${drug.generic_name})`
                                                                    : null}
                                                            </>
                                                        ))}
                                                    </>
                                                )
                                            ) : (
                                                ''
                                            )}
                                        </td>

                                        {Object.keys(injOptions4.injIdToNameMapping)
                                            .map((key) => {
                                                if (!showColumns?.[key]) {
                                                    return null;
                                                }
                                                if (key === injOptions4.injId.dose) {
                                                    return (
                                                        <td
                                                            style={{
                                                                width: `${
                                                                    ((tableWidth?.[key] ||
                                                                        injOptions4
                                                                            .allColumnWidthInNumber[
                                                                            key as keyof typeof injOptions4.injIdToNameMapping
                                                                        ]) /
                                                                        totalWidthCount) *
                                                                    96
                                                                }%`,
                                                            }}
                                                            className="p-4 text-center"
                                                        >
                                                            <div className="flex flex-col gap-2">
                                                                <div>
                                                                    {taper?.dose?.custom}
                                                                    {/* {inj?.added_drug?.length ? ' + ' : ''} */}
                                                                </div>
                                                                <div>
                                                                    {taper?.added_drug?.map(
                                                                        (drug) =>
                                                                            drug.dose?.custom ? (
                                                                                <>
                                                                                    {' + '}
                                                                                    <br />
                                                                                    {
                                                                                        drug.dose
                                                                                            ?.custom
                                                                                    }
                                                                                </>
                                                                            ) : null,
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                if (key === injOptions4.injId.route) {
                                                    return (
                                                        <td
                                                            style={{
                                                                width: `${
                                                                    ((tableWidth?.[key] ||
                                                                        injOptions4
                                                                            .allColumnWidthInNumber[
                                                                            key as keyof typeof injOptions4.injIdToNameMapping
                                                                        ]) /
                                                                        totalWidthCount) *
                                                                    96
                                                                }%`,
                                                            }}
                                                            className="p-4 text-center"
                                                        >
                                                            <span>
                                                                {taper?.route
                                                                    ? `${taper?.route}`
                                                                    : null}
                                                            </span>
                                                            <br />
                                                            <span>
                                                                {taper?.infusion_rate?.iv_drop_rate
                                                                    ?.custom
                                                                    ? `${taper?.infusion_rate?.iv_drop_rate?.custom}`
                                                                    : null}
                                                            </span>{' '}
                                                            <span>
                                                                {taper?.infusion_rate?.iv_rate
                                                                    ?.custom
                                                                    ? `${taper?.infusion_rate?.iv_rate?.custom}`
                                                                    : null}
                                                            </span>
                                                            <br />
                                                            <span>
                                                                {taper?.infusion_rate?.infusion_time
                                                                    ?.custom ? (
                                                                    <>
                                                                        {' '}
                                                                        <span>Over</span>{' '}
                                                                        {
                                                                            taper?.infusion_rate
                                                                                ?.infusion_time
                                                                                ?.custom
                                                                        }
                                                                    </>
                                                                ) : null}
                                                            </span>
                                                        </td>
                                                    );
                                                }
                                                if (key === injOptions4.injId.frequency) {
                                                    return (
                                                        <td
                                                            style={{
                                                                width: `${
                                                                    ((tableWidth?.[key] ||
                                                                        injOptions4
                                                                            .allColumnWidthInNumber[
                                                                            key as keyof typeof injOptions4.injIdToNameMapping
                                                                        ]) /
                                                                        totalWidthCount) *
                                                                    96
                                                                }%`,
                                                            }}
                                                            className="p-4 text-center"
                                                        >
                                                            <div>
                                                                {taper?.frequency?.custom ? (
                                                                    <span>
                                                                        {' '}
                                                                        {taper?.frequency?.custom}
                                                                    </span>
                                                                ) : null}
                                                                {taper?.frequency?.time_split &&
                                                                    taper?.frequency.time_split
                                                                        .length > 0 && <br />}
                                                                {taper?.frequency?.time_split?.map(
                                                                    (time, timeIdx, array) => (
                                                                        <span
                                                                            key={`time-${timeIdx}`}
                                                                        >
                                                                            {timeIdx === 0
                                                                                ? '[ at '
                                                                                : ''}
                                                                            {moment(
                                                                                formatDateInTimeZone(
                                                                                    {
                                                                                        date: time.timing?.toString(),
                                                                                        timeZone:
                                                                                            d.timeZone ||
                                                                                            'Asia/Calcutta',
                                                                                    },
                                                                                ),
                                                                            ).format('hh:mm A')}
                                                                            {` ${timeZoneInfo}`}{' '}
                                                                            {time?.custom
                                                                                ? ` - ${time?.custom}`
                                                                                : null}
                                                                            {timeIdx !==
                                                                            array.length - 1
                                                                                ? ','
                                                                                : ''}
                                                                            {timeIdx ===
                                                                            array.length - 1
                                                                                ? ']'
                                                                                : ''}
                                                                        </span>
                                                                    ),
                                                                )}
                                                                {taper?.timing && <br />}
                                                                {taper?.timing
                                                                    ? ` ${taper?.timing}`
                                                                    : null}
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                if (key === injOptions4.injId.duration) {
                                                    return (
                                                        <td
                                                            style={{
                                                                width: `${
                                                                    ((tableWidth?.[key] ||
                                                                        injOptions4
                                                                            .allColumnWidthInNumber[
                                                                            key as keyof typeof injOptions4.injIdToNameMapping
                                                                        ]) /
                                                                        totalWidthCount) *
                                                                    96
                                                                }%`,
                                                            }}
                                                            className="p-4 text-center"
                                                        >
                                                            {taper?.duration?.custom || ''}
                                                        </td>
                                                    );
                                                }
                                                if (key === injOptions4.injId.instruction) {
                                                    return (
                                                        <td
                                                            style={{
                                                                width: `${
                                                                    ((tableWidth?.[key] ||
                                                                        injOptions4
                                                                            .allColumnWidthInNumber[
                                                                            key as keyof typeof injOptions4.injIdToNameMapping
                                                                        ]) /
                                                                        totalWidthCount) *
                                                                    96
                                                                }%`,
                                                            }}
                                                            className="break-all whitespace-preline p-4 text-left"
                                                        >
                                                            {taper?.instructions || '-'}
                                                        </td>
                                                    );
                                                }
                                                return null;
                                            })
                                            .filter(Boolean)}
                                    </tr>
                                ))}
                            </React.Fragment>
                        );
                    })}
                </table>
            </div>
        </div>
    );
};

export const injectionsFormatToTableMapping = {
    '': getInjectionsLineHtml,
    table: getInjections1Html,
    'quantity-column': getInjections2Html,
    'quantity-column-without-border': getInjections3Html,
    'quantity-remarks-column-without-border': getInjections4Html,
};

export const getIpdAdmissionHtml = (data: RenderPdfPrescription, config: TemplateV2) => {
    const ipdAdmission = data.tool?.ipdAdmission;
    const procedures = data.tool?.procedures;
    const includeProcedures = ipdAdmission?.include_procedures;
    const notesPresent = ipdAdmission?.notes && ipdAdmission.notes.trim().length > 0;
    const proceduresPresent = includeProcedures && procedures && procedures.length > 0;
    const headingColor = config?.render_pdf_config?.admission_advised_heading_color;
    const keyColor = config?.render_pdf_config?.admission_advised_name_color;
    const propertiesColor = config?.render_pdf_config?.admission_advised_properties_color;
    return (
        ipdAdmission?.advised && (
            <div className="my-8 space-x-5">
                <span
                    className="bold uppercase text-darwin-accent-symptoms-blue-800"
                    style={{ color: headingColor }}
                >
                    Admission advised
                </span>
                {(notesPresent || proceduresPresent) && (
                    <span className="bold text-darwin-accent-symptoms-blue-800">:</span>
                )}
                {notesPresent && <span style={{ color: keyColor }}>{ipdAdmission.notes}</span>}
                {proceduresPresent && (
                    <span style={{ color: propertiesColor }}>{`(Procedures: ${uniq(
                        procedures?.map((i) => i.name),
                    ).join(', ')})`}</span>
                )}
            </div>
        )
    );
};

export const getCareCanvasHtml = (
    data: RenderPdfPrescription,
    config: TemplateV2,
    sectionName?: string,
) => {
    const careCanvas = Array.isArray(data.tool?.careCanvas) ? data.tool?.careCanvas : [];
    const headingColor = config?.render_pdf_config?.care_canvas_heading_color;
    if (!careCanvas?.length) return;
    return (
        <div className="space-y-5">
            <p
                className="uppercase text-darwin-accent-symptoms-blue-800 bold"
                style={{ color: headingColor }}
            >
                {sectionName || 'Canvas'} :
            </p>
            {careCanvas.map(({ final_image, width, height }) => {
                const maxWidth = width || '16cm';
                const maxHeight = height || '16cm';
                return (
                    <div>
                        <div className="flex justify-center">
                            <img
                                src={final_image}
                                style={{
                                    maxWidth: maxWidth,
                                    maxHeight: maxHeight,
                                    margin: '6px auto',
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export const getHeader = (
    docProfile: DoctorProfile,
    ptFormFields?: DFormEntity[],
    render_pdf_config?: TemplateConfig,
    rxLocalConfig?: LocalTemplateConfig,
    activeClinic?: string,
    data?: RenderPdfPrescription,
    rxConfig?: TemplateV2,
): JSX.Element => {
    if (render_pdf_config?.header_img) {
        return getCustomHeaderHtml(
            render_pdf_config,
            ptFormFields,
            rxLocalConfig,
            render_pdf_config?.header_img === NO_HEADER ? undefined : render_pdf_config?.header_img,
            data,
            rxConfig,
        );
    }

    return getHeaderHtml(
        docProfile,
        ptFormFields,
        render_pdf_config,
        rxLocalConfig,
        activeClinic,
        data,
        rxConfig,
    );
};
