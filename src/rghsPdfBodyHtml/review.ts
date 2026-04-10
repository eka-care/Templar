import { Tool } from '../RenderPdfPrescription';
import { formPositions } from './constants';

export const getReviewText = (tool: Tool): string => {
    const reviewParts = [];
    if (tool?.followup?.date) {
        reviewParts.push(tool.followup.date);
    }
    if (tool?.followup?.notes) {
        reviewParts.push(`notes: ${tool.followup.notes}`);
    }
    return reviewParts.length > 1 ? `${reviewParts[0]} (${reviewParts.slice(1).join(', ')})` : reviewParts[0] || '';
};

const getReviewFontFit = (text: string): { fontSize: number; lineHeight: number } => {
    const maxFontSize = 11;
    const minFontSize = 8;
    const usableWidth = Math.max(formPositions.review.width - 8, 1);
    const usableHeight = Math.max(formPositions.review.height - 6, 1);
    const content = text.trim();

    if (!content) {
        return { fontSize: maxFontSize, lineHeight: Math.round(maxFontSize * 1.25) };
    }

    for (let font = maxFontSize; font >= minFontSize; font--) {
        const lineHeight = Math.round(font * 1.25);
        const charsPerLine = Math.max(1, Math.floor(usableWidth / (font * 0.55)));
        const estimatedLines = Math.ceil(content.length / charsPerLine);
        if (estimatedLines * lineHeight <= usableHeight) {
            return { fontSize: font, lineHeight };
        }
    }

    return { fontSize: minFontSize, lineHeight: Math.round(minFontSize * 1.25) };
};

export const getReviewSectionHtml = (tool: Tool): string => {
    const reviewText = getReviewText(tool);
    const reviewTypography = getReviewFontFit(reviewText);
    return `
      <div
        style="
          position:absolute;
          top:${formPositions.review.contentTop}px;
          left:${formPositions.review.left}px;
          width:${formPositions.review.width}px;
          height:${formPositions.review.height}px;
          box-sizing:border-box;
          overflow:hidden;
          font-size:${reviewTypography.fontSize}px;
          line-height:${reviewTypography.lineHeight}px;
          white-space:normal;
          word-break:break-word;
          padding:3px 4px;
        "
      >
        ${reviewText}
      </div>
    `;
};
