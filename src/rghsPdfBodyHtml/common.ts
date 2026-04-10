import { BulletLayoutResult } from './types';

const getTextWidth = (text: string, fontSize: number): number => text.length * fontSize * 0.6;

export const stripHtml = (value: string): string => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export const getValue = (value: unknown): string =>
    value === undefined || value === null ? '' : String(value);

const getOrdinal = (day: number): string => {
    const mod10 = day % 10;
    const mod100 = day % 100;
    if (mod10 === 1 && mod100 !== 11) return `${day}st`;
    if (mod10 === 2 && mod100 !== 12) return `${day}nd`;
    if (mod10 === 3 && mod100 !== 13) return `${day}rd`;
    return `${day}th`;
};

export const formatInvestigationDate = (dateInput?: string): string => {
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

export const computeBulletLayout = (
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

export const renderBulletColumns = (
    items: string[],
    width: number,
    height: number,
    listItemStyle: string,
    columnGap = 18,
): string => {
    const layout = computeBulletLayout(items, width, height, columnGap);
    const columns = layout.fittedColumns.length > 0 ? layout.fittedColumns : [items];

    return columns
        .map((columnItems, colIndex) => {
            const itemsHtml = columnItems
                .map(
                    (item) =>
                        `<li style="${listItemStyle};line-height:${layout.lineHeight}px;padding-left:2px;font-size:${layout.fontSize}px;">${item}</li>`,
                )
                .join('');
            return `<ul data-col="${colIndex}" style="margin:0;padding-left:0;list-style-type:disc;list-style-position:inside;text-align:left;">${itemsHtml}</ul>`;
        })
        .join('');
};
