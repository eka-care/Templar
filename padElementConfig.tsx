import { SectionNameConfig } from './types';
import { RenderPdfPrescription, TemplateV2 } from './RenderPdfPrescription';
import {
    getAdvicesHtml,
    getDentalExaminationsHtml,
    getDentalProceduresHtml,
    getDiagnosisHtml,
    getDoubleColumnMedications,
    getExaminationFindingsHtml,
    getFollowupHtml,
    getGrowthChartVitalsHtml,
    getInjections1Html,
    getInjections2Html,
    getInjections3Html,
    getInjections4Html,
    getInjectionsHtml,
    getInjectionsLineHtml,
    getInvestigativeReadingsHtml,
    getLabTestsHtml,
    getMedications1Html,
    getNotesHtml,
    getOphthalmologyHtml,
    getPmhHtml,
    getProceduresHtml,
    getProceduresHtmls,
    getReferredToHtml,
    getSymptomsHtml,
    getVitalsHtml,
    injectionsFormatToTableMapping,
    medicationFormatToTableMapping,
} from "../Templar/templateUtils";

export const padElements = (
    data: RenderPdfPrescription,
    elementId: string,
    config: TemplateV2,
    sectionNameConfig: SectionNameConfig | undefined,
    isDoubleColumn?: boolean,
): JSX.Element | undefined => {
    switch (elementId) {
        case 'symptoms':
            return getSymptomsHtml(data, config, sectionNameConfig?.[elementId]);

        case 'medications':
            if (isDoubleColumn) {
                return getDoubleColumnMedications(data, config?.render_pdf_config);
            }

            return (
                medicationFormatToTableMapping?.[
                    config.render_pdf_config
                        ?.medication_table_format as keyof typeof medicationFormatToTableMapping
                ] || getMedications1Html
            )(data, config?.render_pdf_body_config?.medication_config, config?.render_pdf_config);
        case 'vitals':
            return (
                <div>
                    {getVitalsHtml(data, config)}
                    {getGrowthChartVitalsHtml(data, config)}
                </div>
            );

        case 'diagnosis':
            return getDiagnosisHtml(data, config, sectionNameConfig?.[elementId]);
        case 'medicalHistory':
            return (
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
            );
        case 'labTests':
            return getLabTestsHtml(data, config, sectionNameConfig?.[elementId]);
        case 'labVitals':
            return getInvestigativeReadingsHtml(data, config, sectionNameConfig?.[elementId]);
        case 'examinations':
            return getExaminationFindingsHtml(data, config, sectionNameConfig?.[elementId]);
        case 'prescriptionNotes':
            return getNotesHtml(data, config, sectionNameConfig?.[elementId]);
        case 'refer':
            return getReferredToHtml(data, config, sectionNameConfig?.[elementId]);
        case 'followup-advices':
            return (
                <>
                    {getAdvicesHtml(data, config, sectionNameConfig?.['advices'])}
                    {getFollowupHtml(data, config, sectionNameConfig?.['followup'])}
                </>
            );
        case 'dentalChart':
            return (
                <>
                    {getDentalExaminationsHtml(data, config)}
                    {getDentalProceduresHtml(data, config)}
                </>
            );
        case 'injections':
            return (
                injectionsFormatToTableMapping?.[
                    config.render_pdf_config
                        ?.injections_table_format as keyof typeof injectionsFormatToTableMapping
                ] || (() => <>{getInjectionsLineHtml(data)}</>)
            )(data, config?.render_pdf_config);
        case 'opFinalPrescription':
            return getOphthalmologyHtml(data, 'opFinalPrescription', config);
        case 'opVision':
            return getOphthalmologyHtml(data, 'opVision', config);
        case 'opIop':
            return getOphthalmologyHtml(data, 'opIop', config);
        case 'opCurrentSpec':
            return getOphthalmologyHtml(data, 'opCurrentSpec', config);
        case 'opSubjectiveRefraction':
            return getOphthalmologyHtml(data, 'opSubjectiveRefraction', config);
        case 'opAutoRefraction':
            return getOphthalmologyHtml(data, 'opAutoRefraction', config);
        case 'procedures':
            return getProceduresHtmls(data, config);
        default:
            return;
    }
};
