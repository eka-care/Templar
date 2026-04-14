import { Tool } from '../RenderPdfPrescription';
import { formPositions } from './constants';
import { formatInvestigationDate, renderBulletColumns } from './common';

export const getInvestigationColumnsHtml = (tool: Tool): string => {
    const investigationItems =
        tool?.labTests?.map((test) =>
            test?.test_on && test.test_on.trim() !== ''
                ? `${test.name} (${formatInvestigationDate(test.test_on)})`
                : test.name,
        ) || [];

    return renderBulletColumns(
        investigationItems,
        formPositions.investigation.width,
        formPositions.investigation.height,
        'display:-webkit-box;list-style-type:disc;list-style-position:inside;white-space:normal;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical',
    );
};
