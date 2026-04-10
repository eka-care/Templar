import { Tool } from '../RenderPdfPrescription';
import { formPositions } from './constants';
import { getValue, renderBulletColumns } from './common';

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
                ? `${medication?.frequency?.onceEvery?.value || ''} ${
                      medication?.frequency?.onceEvery?.unit || ''
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
    const toDay = getValue('to_day' in medication ? medication?.to_day?.text || medication?.to_day?.value : '');
    const startTo = getValue(
        startFrom || toDay ? `${startFrom}${startFrom && toDay ? ' to ' : ''}${toDay}`.trim() : '',
    );
    const instruction = getValue(medication?.instruction);
    const quantity = getValue('quantity' in medication ? medication?.quantity?.custom : '');

    return [medicineName, dose, applyOn, frequency, timing, duration, startTo, instruction, quantity]
        .filter((part) => part && part.trim() !== '')
        .join(' | ');
};

export const getMedicationColumnsHtml = (tool: Tool): string => {
    const medicationItems =
        tool?.medications?.flatMap((medication) => {
            if (medication?.isTapering) {
                return [];
            }
            const medicineName = getValue(medication?.name || medication?.generic_name);
            const items = [formatMedicationLine(medication, medicineName)];
            const taperingDose = medication?.tapering_dose || [];
            taperingDose.forEach((taperDose) => {
                items.push(formatMedicationLine(taperDose, medicineName));
            });
            return items.filter((item) => item.trim() !== '');
        }) || [];

    const uniqueMedicationItems = Array.from(new Set(medicationItems));
    return renderBulletColumns(
        uniqueMedicationItems,
        formPositions.medications.width,
        formPositions.medications.height,
        'display:-webkit-box;list-style-type:disc;list-style-position:inside;white-space:normal;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical',
    );
};
