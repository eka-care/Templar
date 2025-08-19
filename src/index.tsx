import { RenderPdfPrescription, TemplateV2 } from './RenderPdfPrescription';
import { getFooter, getHeader } from './templateUtils';
import { DFormEntity, DoctorProfile, LocalTemplateConfig } from './types';

// Export all types for consumers
export type { 
    DFormEntity, 
    DoctorProfile, 
    LocalTemplateConfig 
} from './types';
export type { RenderPdfPrescription, TemplateV2 } from './RenderPdfPrescription';

type GetHeaderPayload = {
    docProfile: DoctorProfile;
    ptFormFields?: DFormEntity[];
    data?: RenderPdfPrescription;
    rxConfig?: TemplateV2;
    rxLocalConfig?: LocalTemplateConfig;
};

export const getHeaderHtml = ({
    docProfile,
    ptFormFields,
    rxLocalConfig,
    data,
    rxConfig,
}: GetHeaderPayload): JSX.Element => {
    return getHeader(
        docProfile,
        ptFormFields || [],
        rxConfig?.render_pdf_config,
        rxLocalConfig,
        rxConfig?.render_pdf_config?.clinicId,
        data,
        rxConfig,
    );
};

type GetFooterHtml = {
    docProfile: DoctorProfile;
    data?: RenderPdfPrescription;
    rxLocalConfig?: LocalTemplateConfig;
    rxConfig?: TemplateV2;
    isHideFooterDetails?: boolean;
};

export const getFooterHtml = ({
    docProfile,
    rxLocalConfig,
    data,
    rxConfig,
    isHideFooterDetails,
}: GetFooterHtml): JSX.Element => {
    return getFooter(
        docProfile,
        data || ({} as RenderPdfPrescription),
        rxLocalConfig,
        rxConfig?.render_pdf_config,
        isHideFooterDetails,
    );
};
