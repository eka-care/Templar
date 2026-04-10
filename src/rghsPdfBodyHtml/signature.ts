import { DoctorProfile } from '../types';
import { formPositions } from './constants';

export const getSignatureHtml = (docProfile?: DoctorProfile): { image: string; name: string } => {
    const signatureUrl = docProfile?.profile?.professional?.signature || '';
    const signatureName = `${docProfile?.profile?.personal?.name?.f || ''} ${
        docProfile?.profile?.personal?.name?.l || ''
    }`.trim();

    const image = signatureUrl
        ? `<img src="${signatureUrl}" alt="signature" style="max-width:85%;max-height:76%;object-fit:contain;display:block;margin-left:34%;margin-top:4%;" />`
        : '';
    const name = signatureName
        ? `<div style="font-size:11.5px;line-height:1.2;margin-top:6%;margin-left:34%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${signatureName}</div>`
        : '';

    return { image, name };
};

export const getSignatureSectionHtml = (docProfile?: DoctorProfile): string => {
    const signature = getSignatureHtml(docProfile);
    return `
      <div
        style="
          position:absolute;
          top:${formPositions.signature.contentTop}px;
          left:${formPositions.signature.left}px;
          width:${formPositions.signature.width}px;
          height:${formPositions.signature.height}px;
          box-sizing:border-box;
          overflow:hidden;
          padding:3px 4px;
          padding-left:10%;
          text-align:left;
        "
      >
        ${signature.image}
        ${signature.name}
      </div>
    `;
};
