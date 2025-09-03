import { TemplateConfig } from './RenderPdfPrescription';
import { getCustomFooterHtml, getFooterHtml, NO_FOOTER } from '../src/templateUtils';
import { DoctorProfile, LocalTemplateConfig } from './types';

export const getBodyHtmlMCERT = (heading: string, description: string) => {
    return (
        <div>
            <p
                className="flex flex-col text-center text-28"
                dangerouslySetInnerHTML={{
                    __html: heading,
                }}
            ></p>

            <p
                className="mt-28"
                dangerouslySetInnerHTML={{
                    __html: description,
                }}
            ></p>
        </div>
    );
};

export const getFooterMcert = (
    docProfile: DoctorProfile,
    data: any,
    renderPdfConfig?: TemplateConfig,
    rxLocalConfig?: LocalTemplateConfig,
    isHideFooterDetails?: boolean,
): JSX.Element => {
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
