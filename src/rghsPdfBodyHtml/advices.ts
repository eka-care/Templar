import { Tool } from '../RenderPdfPrescription';
import { formPositions } from './constants';
import { renderBulletColumns, stripHtml } from './common';

export const getAdviceColumnsHtml = (tool: Tool): string => {
    const adviceItems =
        tool?.advices
            ?.map((advice) => stripHtml((advice?.parsedText || advice?.text || '').replace(/\u00a0/g, ' ')).trim())
            .filter((adviceText) => adviceText !== '') || [];

    return renderBulletColumns(
        adviceItems,
        formPositions.advices.width,
        formPositions.advices.height,
        'display:list-item;list-style-type:disc;list-style-position:inside;white-space:normal',
    );
};
