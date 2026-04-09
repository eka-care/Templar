import { Tool } from './RenderPdfPrescription';
import { DoctorProfile } from './types';

type BulletLayoutResult = {
    fontSize: number;
    lineHeight: number;
    fittedColumns: string[][];
};

const convertCmToPx = (cm: number): number => cm * 37.795275591;

const formPositions = {
    symptoms: {
        titleTop: convertCmToPx(9.5),
        contentTop: convertCmToPx(9.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(12),
        height: convertCmToPx(2.4),
    },
    history: {
        titleTop: convertCmToPx(12.5),
        contentTop: convertCmToPx(12.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(12),
        height: convertCmToPx(2.4),
    },
    vitals: {
        titleTop: convertCmToPx(9.6),
        contentTop: convertCmToPx(9.8),
        left: convertCmToPx(16.25),
        width: convertCmToPx(3.4),
        height: convertCmToPx(2.85),
    },
    investigation: {
        titleTop: convertCmToPx(18.5),
        contentTop: convertCmToPx(18.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(16.8),
        height: convertCmToPx(2.4),
    },
    medications: {
        titleTop: convertCmToPx(21.5),
        contentTop: convertCmToPx(21.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(16.8),
        height: convertCmToPx(2.4),
    },
    examinationDiagnosis: {
        titleTop: convertCmToPx(15.5),
        contentTop: convertCmToPx(15.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(16.8),
        height: convertCmToPx(2.4),
    },
    advices: {
        titleTop: convertCmToPx(24.5),
        contentTop: convertCmToPx(24.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(16.8),
        height: convertCmToPx(2.4),
    },
    review: {
        titleTop: convertCmToPx(27.5),
        contentTop: convertCmToPx(27.6),
        left: convertCmToPx(2.5),
        width: convertCmToPx(8.0),
        height: convertCmToPx(1.5),
    },
    signature: {
        titleTop: convertCmToPx(27.5),
        contentTop: convertCmToPx(27.35),
        left: convertCmToPx(12.35),
        width: convertCmToPx(6.95),
        height: convertCmToPx(1.5),
    },
};

const getTextWidth = (text: string, fontSize: number): number => text.length * fontSize * 0.6;
const stripHtml = (value: string): string => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const getValue = (value: unknown): string =>
    value === undefined || value === null ? '' : String(value);
const RGHS_VITAL_IDS = ['v-1365277675', 'lb-1201285132', 'lb-199711567', 'lb-7991006736'];

const getOrdinal = (day: number): string => {
    const mod10 = day % 10;
    const mod100 = day % 100;
    if (mod10 === 1 && mod100 !== 11) return `${day}st`;
    if (mod10 === 2 && mod100 !== 12) return `${day}nd`;
    if (mod10 === 3 && mod100 !== 13) return `${day}rd`;
    return `${day}th`;
};

const formatInvestigationDate = (dateInput?: string): string => {
    if (!dateInput) return '';
    const parsedDate = new Date(dateInput);
    if (Number.isNaN(parsedDate.getTime())) return dateInput;

    const dayWithOrdinal = getOrdinal(parsedDate.getDate());
    const month = parsedDate.toLocaleString('en-US', { month: 'long' });
    const year = parsedDate.toLocaleString('en-US', { year: '2-digit' });
    const time = parsedDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
    return `${dayWithOrdinal} ${month} ${year}, ${time}`;
};

const computeBulletLayout = (
    items: string[],
    maxWidth: number,
    maxHeight: number,
    columnGap = 18,
): BulletLayoutResult => {
    const maxFontSize = 11.5;
    const minFontSize = 8.5;
    const usableHeight = Math.max(0, maxHeight);
    const usableWidth = Math.max(0, maxWidth);

    let selectedFontSize = maxFontSize;
    let selectedLineHeight = Math.round(selectedFontSize * 1.25);

    for (let font = maxFontSize; font >= minFontSize; font--) {
        const candidateLineHeight = Math.round(font * 1.25);
        const itemsPerCol = Math.max(1, Math.floor(usableHeight / candidateLineHeight));
        const colCount = Math.max(1, Math.ceil(items.length / itemsPerCol));
        const totalGap = (colCount - 1) * columnGap;

        let requiredTextWidth = 0;
        for (let col = 0; col < colCount; col++) {
            const start = col * itemsPerCol;
            const end = Math.min(start + itemsPerCol, items.length);
            const colItems = items.slice(start, end);
            const maxInColumn = colItems.reduce((max, item) => Math.max(max, getTextWidth(item, font)), 0);
            requiredTextWidth += maxInColumn + 16;
        }

        if (requiredTextWidth + totalGap <= usableWidth) {
            selectedFontSize = font;
            selectedLineHeight = candidateLineHeight;
            break;
        }

        if (font === minFontSize) {
            selectedFontSize = minFontSize;
            selectedLineHeight = Math.round(minFontSize * 1.25);
        }
    }

    const itemsPerColumn = Math.max(1, Math.floor(usableHeight / selectedLineHeight));
    const allColumns: string[][] = [];
    for (let i = 0; i < items.length; i += itemsPerColumn) {
        allColumns.push(items.slice(i, i + itemsPerColumn));
    }

    const fittedColumns: string[][] = [];
    let usedWidth = 0;
    for (let i = 0; i < allColumns.length; i++) {
        const maxTextInColumn = allColumns[i].reduce(
            (max, item) => Math.max(max, getTextWidth(item, selectedFontSize)),
            0,
        );
        const columnWidth = maxTextInColumn + 16;
        const nextWidth = usedWidth + (fittedColumns.length > 0 ? columnGap : 0) + columnWidth;
        if (nextWidth > usableWidth) break;
        fittedColumns.push(allColumns[i]);
        usedWidth = nextWidth;
    }

    return {
        fontSize: selectedFontSize,
        lineHeight: selectedLineHeight,
        fittedColumns,
    };
};

export const getRghsBodyHtmlFromTool = (tool: Tool, docProfile?: DoctorProfile): string => {
    const mappedSymptoms =
        tool?.symptoms?.map((symptom) => {
            const properties = Object.values(symptom?.properties || {});
            const sinceProperty = properties.find((property) => property?.name === 'Since');
            const severityProperty = properties.find((property) => property?.name === 'Severity');

            const sinceSelection = sinceProperty?.selection?.[0];
            const severitySelection = severityProperty?.selection?.[0];

            const sinceValue = sinceSelection?.value
                ? `${sinceSelection.value}${sinceSelection.unit ? ` ${sinceSelection.unit}` : ''}`
                : '-';
            const severityValue = severitySelection?.value || '-';

            return {
                name: symptom?.name,
                since: sinceValue,
                severity: severityValue,
            };
        }) || [];

    const items = mappedSymptoms.map((symptom) => {
        const details = [];
        if (symptom.since && symptom.since !== '-') {
            details.push(`Since: ${symptom.since}`);
        }
        if (symptom.severity && symptom.severity !== '-') {
            details.push(`Severity: ${symptom.severity}`);
        }
        return details.length > 0 ? `${symptom.name} (${details.join(', ')})` : symptom.name;
    });
    const { fontSize, lineHeight, fittedColumns } = computeBulletLayout(
        items,
        formPositions.symptoms.width,
        formPositions.symptoms.height,
    );

    const symptomColumnsForRender = fittedColumns.length > 0 ? fittedColumns : [items];
    const columnsHtml = symptomColumnsForRender
        .map((columnItems) => {
            const itemsHtml = columnItems
                .map(
                    (item) =>
                        `<li style="display:-webkit-box;list-style-type:disc;list-style-position:inside;line-height:${lineHeight}px;padding-left:2px;font-size:${fontSize}px;white-space:normal;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${item}</li>`,
                )
                .join('');
            return `<ul style="margin:0;padding-left:0;list-style-type:disc;list-style-position:inside;text-align:left;">${itemsHtml}</ul>`;
        })
        .join('');

    const patientHistory = tool?.medicalHistory?.patientHistory;
    const historySourceItems = [
        ...(patientHistory?.patientMedicalConditions || []).map((item) => ({
            ...item,
            __historyType: 'patientMedicalConditions',
        })),
        ...(patientHistory?.lifestyleHabits || []).map((item) => ({
            ...item,
            __historyType: 'lifestyleHabits',
        })),
        ...(patientHistory?.recentTravelHistory || []).map((item) => ({
            ...item,
            __historyType: 'recentTravelHistory',
        })),
        ...(patientHistory?.currentMedications || []).map((item) => ({
            ...item,
            __historyType: 'currentMedications',
        })),
        ...(patientHistory?.drugAllergy || []).map((item) => ({
            ...item,
            __historyType: 'drugAllergy',
        })),
        ...(patientHistory?.foodOtherAllergy || []).map((item) => ({
            ...item,
            __historyType: 'foodOtherAllergy',
        })),
        ...(patientHistory?.pastProcedures || []).map((item) => ({
            ...item,
            __historyType: 'pastProcedures',
        })),
        ...(patientHistory?.otherMedicalHistory || []).map((item) => ({
            ...item,
            __historyType: 'otherMedicalHistory',
        })),
        ...(patientHistory?.familyHistory || []).map((item) => ({
            ...item,
            __historyType: 'familyHistory',
        })),
    ];

    const historyItems = historySourceItems.map((historyItem) => {
        const itemObj = historyItem as unknown as Record<string, unknown>;
        const historyType = getValue(itemObj?.__historyType);
        const sinceObj = itemObj?.since as { custom?: string } | undefined;
        const frequencyObj = itemObj?.frequency as
            | { custom?: string; value?: string; unit?: string }
            | undefined;
        const notesValue = getValue(itemObj?.notes);

        const sinceValue = getValue(sinceObj?.custom || itemObj?.since);
        const statusValue = getValue(itemObj?.status);
        const frequencyValue = getValue(
            frequencyObj?.custom ||
            (frequencyObj?.value
                ? `${frequencyObj?.value}${frequencyObj?.unit ? ` ${frequencyObj?.unit}` : ''}`
                : itemObj?.frequency),
        );

        const details = [];
        if (sinceValue) details.push(`Since: ${sinceValue}`);
        if (statusValue) details.push(`Status: ${statusValue}`);
        if (frequencyValue) details.push(`Frequency: ${frequencyValue}`);

        const name = getValue(itemObj?.name);
        if (historyType === 'recentTravelHistory' && notesValue) {
            return `${name} (Notes: ${notesValue})`;
        }
        return details.length > 0 ? `${name} (${details.join(', ')})` : name;
    });

    const historyLayout = computeBulletLayout(
        historyItems,
        formPositions.history.width,
        formPositions.history.height,
    );
    const historyColumnsForRender =
        historyLayout.fittedColumns.length > 0 ? historyLayout.fittedColumns : [historyItems];
    const historyColumnsHtml = historyColumnsForRender
        .map((columnItems) => {
            const itemsHtml = columnItems
                .map(
                    (item) =>
                        `<li style="display:-webkit-box;list-style-type:disc;list-style-position:inside;line-height:${historyLayout.lineHeight}px;padding-left:2px;font-size:${historyLayout.fontSize}px;white-space:normal;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${item}</li>`,
                )
                .join('');
            return `<ul style="margin:0;padding-left:0;list-style-type:disc;list-style-position:inside;text-align:left;">${itemsHtml}</ul>`;
        })
        .join('');

    const vitalsDummyItems = RGHS_VITAL_IDS.map((id) => {
        const vital = (tool?.medicalHistory?.vitals || []).find((item) => item.id === id);
        if (!vital) return '';
        const valuePart = getValue(vital.value?.qt);
        const unitPart = getValue(vital.value?.unit);
        return `${valuePart}${unitPart ? ` ${unitPart}` : ''}`.trim();
    });
    const vitalsExtraGapPx = 6;
    const vitalsCount = vitalsDummyItems.length;
    const totalGaps = vitalsExtraGapPx * Math.max(vitalsCount - 1, 0);
    const usableVitalsHeight = Math.max(formPositions.vitals.height - totalGaps, 1);
    const vitalsLineSlot = usableVitalsHeight / Math.max(vitalsCount, 1);
    const vitalsFontSize = 11.5;
    const vitalsHtml = vitalsDummyItems
        .map(
            (item, index) =>
                `<div style="position:absolute;left:0;right:0;top:${(
                    index * vitalsLineSlot +
                    index * vitalsExtraGapPx
                ).toFixed(2)}px;font-size:${vitalsFontSize}px;line-height:${(vitalsLineSlot * 0.95).toFixed(
                    2,
                )}px;white-space:nowrap;">${item}</div>`,
        )
        .join('');

    const investigationItems =
        tool?.labTests?.map((test) =>
            test?.test_on && test.test_on.trim() !== ''
                ? `${test.name} (${formatInvestigationDate(test.test_on)})`
                : test.name,
        ) || [];
    const investigationLayout = computeBulletLayout(
        investigationItems,
        formPositions.investigation.width,
        formPositions.investigation.height,
    );
    const investigationColumnsForRender =
        investigationLayout.fittedColumns.length > 0
            ? investigationLayout.fittedColumns
            : [investigationItems];
    const investigationColumnsHtml = investigationColumnsForRender
        .map((columnItems) => {
            const itemsHtml = columnItems
                .map(
                    (item) =>
                        `<li style="display:-webkit-box;list-style-type:disc;list-style-position:inside;line-height:${investigationLayout.lineHeight}px;padding-left:2px;font-size:${investigationLayout.fontSize}px;white-space:normal;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${item}</li>`,
                )
                .join('');
            return `<ul style="margin:0;padding-left:0;list-style-type:disc;list-style-position:inside;text-align:left;">${itemsHtml}</ul>`;
        })
        .join('');

    const formatMedicationLine = (
        medication:
            | NonNullable<Tool['medications']>[number]
            | NonNullable<NonNullable<Tool['medications']>[number]['tapering_dose']>[number],
        medicineName: string,
    ): string => {
        const medObj = medication as unknown as {
            soa?: boolean;
            area?: { name?: string };
        };
        const dose = getValue(
            medication?.dose?.value
                ? `${medication?.dose?.value}${medication?.dose?.unit ? ` ${medication?.dose?.unit}` : ''}`
                : medication?.dose?.custom,
        );
        const applyOnValue = getValue(medObj?.area?.name);
        const applyOn = medObj?.soa || applyOnValue ? applyOnValue : '';
        const frequency = getValue(
            medication?.frequency?.custom ||
            medication?.frequency?.type ||
            (medication?.frequency?.onceEvery
                ? `${medication?.frequency?.onceEvery?.value || ''} ${medication?.frequency?.onceEvery?.unit || ''
                    }`.trim()
                : ''),
        );
        const timing = getValue(medication?.timing);
        const duration = getValue(
            medication?.duration?.value
                ? `${medication?.duration?.value} ${medication?.duration?.unit || ''}`.trim()
                : medication?.duration?.custom,
        );
        const startFrom = getValue(medication?.start_from?.text || medication?.start_from?.value);
        const toDay = getValue(
            'to_day' in medication ? medication?.to_day?.text || medication?.to_day?.value : '',
        );
        const startTo = getValue(
            startFrom || toDay ? `${startFrom}${startFrom && toDay ? ' to ' : ''}${toDay}`.trim() : '',
        );
        const instruction = getValue(medication?.instruction);
        const quantity = getValue('quantity' in medication ? medication?.quantity?.custom : '');

        return [
            medicineName,
            dose,
            applyOn,
            frequency,
            timing,
            duration,
            startTo,
            instruction,
            quantity,
        ]
            .filter((part) => part && part.trim() !== '')
            .join(' | ');
    };

    const medicationItems =
        tool?.medications?.flatMap((medication) => {
            if (medication?.isTapering) {
                return [];
            }
            const medicineName = getValue(medication?.name || medication?.generic_name);
            const items = [formatMedicationLine(medication, medicineName)];
            const taperingDose = medication?.tapering_dose || [];
            taperingDose.forEach((taperDose) => {
                // Keep medicine name on taper rows as requested.
                items.push(formatMedicationLine(taperDose, medicineName));
            });
            return items.filter((item) => item.trim() !== '');
        }) || [];
    const uniqueMedicationItems = Array.from(new Set(medicationItems));

    const medicationsLayout = computeBulletLayout(
        uniqueMedicationItems,
        formPositions.medications.width,
        formPositions.medications.height,
    );
    const medicationColumnsForRender =
        medicationsLayout.fittedColumns.length > 0
            ? medicationsLayout.fittedColumns
            : [uniqueMedicationItems];
    const medicationColumnsHtml = medicationColumnsForRender
        .map((columnItems) => {
            const itemsHtml = columnItems
                .map(
                    (item) =>
                        `<li style="display:-webkit-box;list-style-type:disc;list-style-position:inside;line-height:${medicationsLayout.lineHeight}px;padding-left:2px;font-size:${medicationsLayout.fontSize}px;white-space:normal;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${item}</li>`,
                )
                .join('');
            return `<ul style="margin:0;padding-left:0;list-style-type:disc;list-style-position:inside;text-align:left;">${itemsHtml}</ul>`;
        })
        .join('');

    const examinationItems =
        tool?.medicalHistory?.examinations?.map((exam) =>
            exam?.notes && exam.notes.trim() !== ''
                ? `${exam.name} (Notes: ${stripHtml(exam.notes)})`
                : exam.name,
        ) || [];

    const diagnosisItems =
        tool?.diagnosis?.map((diagnosis) => {
            const properties = Object.values(diagnosis?.properties || {});
            const sinceProperty = properties.find((property) => property?.name === 'Since');
            const statusProperty = properties.find((property) => property?.name === 'Status');

            const sinceSelection = sinceProperty?.selection?.[0];
            const statusSelection = statusProperty?.selection?.[0];

            const sinceValue = sinceSelection?.value
                ? `${sinceSelection.value}${sinceSelection.unit ? ` ${sinceSelection.unit}` : ''}`
                : '';
            const statusValue = statusSelection?.value || '';

            const details = [];
            if (sinceValue) details.push(`Since: ${sinceValue}`);
            if (statusValue) details.push(`Status: ${statusValue}`);

            return details.length > 0
                ? `${diagnosis?.name} (${details.join(', ')})`
                : diagnosis?.name;
        }) || [];

    const hasExaminationItems = examinationItems.length > 0;
    const hasDiagnosisItems = diagnosisItems.length > 0;
    const useTwoColumns = hasExaminationItems && hasDiagnosisItems;

    const examinationDiagnosisColumnGap = 10;
    const examinationDiagnosisColumnWidth =
        useTwoColumns
            ? (formPositions.examinationDiagnosis.width - examinationDiagnosisColumnGap) / 2
            : formPositions.examinationDiagnosis.width;

    const examinationLayout = computeBulletLayout(
        examinationItems,
        examinationDiagnosisColumnWidth,
        formPositions.examinationDiagnosis.height,
    );
    const diagnosisLayout = computeBulletLayout(
        diagnosisItems,
        examinationDiagnosisColumnWidth,
        formPositions.examinationDiagnosis.height,
    );

    const examinationColumnsForRender =
        examinationLayout.fittedColumns.length > 0 ? examinationLayout.fittedColumns : [examinationItems];
    const examinationColumnHtml = examinationColumnsForRender
        .map((columnItems) => {
            const itemsHtml = columnItems
                .map(
                    (item) =>
                        `<li style="display:-webkit-box;list-style-type:disc;list-style-position:inside;line-height:${examinationLayout.lineHeight}px;padding-left:2px;font-size:${examinationLayout.fontSize}px;white-space:normal;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${item}</li>`,
                )
                .join('');
            return `<ul style="margin:0;padding-left:0;list-style-type:disc;list-style-position:inside;text-align:left;">${itemsHtml}</ul>`;
        })
        .join('');

    const diagnosisColumnsForRender =
        diagnosisLayout.fittedColumns.length > 0 ? diagnosisLayout.fittedColumns : [diagnosisItems];
    const diagnosisColumnHtml = diagnosisColumnsForRender
        .map((columnItems) => {
            const itemsHtml = columnItems
                .map(
                    (item) =>
                        `<li style="display:-webkit-box;list-style-type:disc;list-style-position:inside;line-height:${diagnosisLayout.lineHeight}px;padding-left:2px;font-size:${diagnosisLayout.fontSize}px;white-space:normal;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${item}</li>`,
                )
                .join('');
            return `<ul style="margin:0;padding-left:0;list-style-type:disc;list-style-position:inside;text-align:left;">${itemsHtml}</ul>`;
        })
        .join('');

    const adviceItems =
        tool?.advices
            ?.map((advice) =>
                stripHtml((advice?.parsedText || advice?.text || '').replace(/\u00a0/g, ' ')).trim(),
            )
            .filter((adviceText) => adviceText !== '') || [];
    const adviceLayout = computeBulletLayout(
        adviceItems,
        formPositions.advices.width,
        formPositions.advices.height,
    );
    const adviceColumnsForRender =
        adviceLayout.fittedColumns.length > 0
            ? adviceLayout.fittedColumns
            : [adviceItems];
    const adviceColumnsHtml = adviceColumnsForRender
        .map((columnItems, colIndex) => {
            const itemsHtml = columnItems
                .map(
                    (adviceText) =>
                        `<li style="display:list-item;list-style-type:disc;list-style-position:inside;line-height:${adviceLayout.lineHeight}px;padding-left:2px;font-size:${adviceLayout.fontSize}px;white-space:normal;">${adviceText}</li>`,
                )
                .join('');
            return `<ul data-col="${colIndex}" style="margin:0;padding-left:0;list-style-type:disc;list-style-position:inside;text-align:left;">${itemsHtml}</ul>`;
        })
        .join('');

    const reviewParts = [];
    if (tool?.followup?.date) {
        reviewParts.push(tool.followup.date);
    }
    if (tool?.followup?.notes) {
        reviewParts.push(`notes: ${tool.followup.notes}`);
    }
    const reviewText =
        reviewParts.length > 1
            ? `${reviewParts[0]} (${reviewParts.slice(1).join(', ')})`
            : reviewParts[0] || '';

    const signatureUrl = docProfile?.profile?.professional?.signature || '';
    const signatureName = `${docProfile?.profile?.personal?.name?.f || ''} ${docProfile?.profile?.personal?.name?.l || ''
        }`.trim();
    const signatureHtml = signatureUrl
        ? `<img src="${signatureUrl}" alt="signature" style="max-width:85%;max-height:76%;object-fit:contain;display:block;margin-left:34%;margin-top:4%;" />`
        : '';
    const signatureNameHtml = signatureName
        ? `<div style="font-size:11.5px;line-height:1.2;margin-top:6%;margin-left:34%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${signatureName}</div>`
        : '';

    return `
        <div
          style="
            position:relative;
            width:210mm;
            min-height:297mm;
            font-family:Arial,sans-serif;
          "
        >
          <div
            style="
              position:absolute;
              top:${formPositions.symptoms.contentTop}px;
              left:${formPositions.symptoms.left}px;
              width:${formPositions.symptoms.width}px;
              height:${formPositions.symptoms.height}px;
              box-sizing:border-box;
              overflow:hidden;
            "
          >
            <div
              style="
                display:flex;
                gap:18px;
                align-items:flex-start;
                height:100%;
                overflow:hidden;
              "
            >
              ${columnsHtml}
            </div>
          </div>
          <div
            style="
              position:absolute;
              top:${formPositions.history.contentTop}px;
              left:${formPositions.history.left}px;
              width:${formPositions.history.width}px;
              height:${formPositions.history.height}px;
              box-sizing:border-box;
              overflow:hidden;
            "
          >
            <div
              style="
                display:flex;
                gap:18px;
                align-items:flex-start;
                height:100%;
                overflow:hidden;
              "
            >
              ${historyColumnsHtml}
            </div>
          </div>
          <div
            style="
              position:absolute;
              top:${formPositions.vitals.contentTop}px;
              left:${formPositions.vitals.left}px;
              width:${formPositions.vitals.width}px;
              height:${formPositions.vitals.height}px;
              box-sizing:border-box;
              overflow:hidden;
              text-align:left;
              padding-left:8px;
              padding-top:0px;
              position:relative;
            "
          >
            ${vitalsHtml}
          </div>
          <div
            style="
              position:absolute;
              top:${formPositions.examinationDiagnosis.contentTop}px;
              left:${formPositions.examinationDiagnosis.left}px;
              width:${formPositions.examinationDiagnosis.width}px;
              height:${formPositions.examinationDiagnosis.height}px;
              box-sizing:border-box;
              overflow:hidden;
            "
          >
            <div
              style="
                display:flex;
                gap:${useTwoColumns ? examinationDiagnosisColumnGap : 0}px;
                align-items:flex-start;
                height:100%;
                overflow:hidden;
              "
            >
              ${hasExaminationItems
            ? `<div style="width:${examinationDiagnosisColumnWidth}px;height:100%;overflow:hidden;">
                <div style="font-size:11.5px;font-weight:400;line-height:1.2;margin-bottom:2px;">Systemic Examination</div>
                <div style="height:calc(100% - 16px);overflow:hidden;">
                  ${examinationColumnHtml}
                </div>
              </div>`
            : ''
        }
              ${hasDiagnosisItems
            ? `<div style="width:${examinationDiagnosisColumnWidth}px;height:100%;overflow:hidden;">
                <div style="font-size:11.5px;font-weight:400;line-height:1.2;margin-bottom:2px;">Provisional Diagnosis</div>
                <div style="height:calc(100% - 16px);overflow:hidden;">
                  ${diagnosisColumnHtml}
                </div>
              </div>`
            : ''
        }
            </div>
          </div>
          <div
            style="
              position:absolute;
              top:${formPositions.investigation.contentTop}px;
              left:${formPositions.investigation.left}px;
              width:${formPositions.investigation.width}px;
              height:${formPositions.investigation.height}px;
              box-sizing:border-box;
              overflow:hidden;
            "
          >
            <div
              style="
                display:flex;
                gap:18px;
                align-items:flex-start;
                height:100%;
                overflow:hidden;
              "
            >
              ${investigationColumnsHtml}
            </div>
          </div>
          <div
            style="
              position:absolute;
              top:${formPositions.medications.contentTop}px;
              left:${formPositions.medications.left}px;
              width:${formPositions.medications.width}px;
              height:${formPositions.medications.height}px;
              box-sizing:border-box;
              overflow:hidden;
            "
          >
            <div
              style="
                display:flex;
                gap:18px;
                align-items:flex-start;
                height:100%;
                overflow:hidden;
              "
            >
              ${medicationColumnsHtml}
            </div>
          </div>
          <div
            style="
              position:absolute;
              top:${formPositions.advices.contentTop}px;
              left:${formPositions.advices.left}px;
              width:${formPositions.advices.width}px;
              height:${formPositions.advices.height}px;
              box-sizing:border-box;
              overflow:hidden;
            "
          >
            <div
              style="
                display:flex;
                gap:18px;
                align-items:flex-start;
                height:100%;
                overflow:hidden;
              "
            >
              ${adviceColumnsHtml}
            </div>
          </div>
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
            ${signatureHtml}
            ${signatureNameHtml}
          </div>
          <div style="display:none;">${tool.language}</div>
        </div>`.trim();
};
