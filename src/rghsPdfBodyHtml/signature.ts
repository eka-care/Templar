import { DoctorProfile } from '../types';
import { formPositions } from './constants';

export const getSignatureHtml = (docProfile?: DoctorProfile): { image: string; text: string; name: string } => {
    const signatureUrl = docProfile?.profile?.professional?.signature || '';
    const rawDoctorName = `${docProfile?.profile?.personal?.name?.f || ''} ${
        docProfile?.profile?.personal?.name?.l || ''
    }`.trim();
    const prefixedDoctorName = rawDoctorName
        ? /^dr\.?\s/i.test(rawDoctorName)
            ? rawDoctorName
            : `Dr. ${rawDoctorName}`
        : '';
    const signatureTextValue = (docProfile?.profile?.professional?.signature_text || '').trim();

    const image = signatureUrl
        ? `<img src="${signatureUrl}" alt="signature" style="max-width:85%;max-height:76%;object-fit:contain;display:block;margin-left:34%;margin-top:4%;" />`
        : '';
    const text = signatureTextValue
        ? `<div style="font-size:11px;line-height:1.2;margin-top:6%;margin-left:34%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${signatureTextValue}</div>`
        : '';
    const name = prefixedDoctorName
        ? `<div style="font-size:11px;line-height:1.2;margin-top:6%;margin-left:34%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${prefixedDoctorName}</div>`
        : '';

    return { image, text, name };
};

export const getSignatureSectionHtml = (docProfile?: DoctorProfile): string => {
    const signature = getSignatureHtml(docProfile);
    let signatureContent = '';
    switch (true) {
        case Boolean(signature.image):
            signatureContent = signature.image;
            break;
        case Boolean(signature.text):
            signatureContent = signature.text;
            break;
        default:
            signatureContent = signature.name;
    }

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
        ${signatureContent}
      </div>
    `;
};
