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

export const getReviewSectionHtml = (tool: Tool): string => {
    const reviewText = getReviewText(tool);
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
          font-size:11.5px;
          line-height:1.2;
          padding:3px 4px;
        "
      >
        ${reviewText}
      </div>
    `;
};
