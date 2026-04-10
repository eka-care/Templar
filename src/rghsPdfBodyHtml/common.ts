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
    /** When set (e.g. 1 for medications), never use more than this many bullet columns. */
    maxColumnCount?: number,
): BulletLayoutResult => {
    const maxFontSize = 11;
    const minFontSize = 8;
    const usableHeight = Math.max(0, maxHeight);
    const usableWidth = Math.max(0, maxWidth);

    const tryFit = (font: number, colCount: number): string[][] | null => {
        const lineHeight = Math.round(font * 1.25);
        const maxLinesPerColumn = Math.max(1, Math.floor(usableHeight / lineHeight));
        const totalGap = (colCount - 1) * columnGap;
        const colWidth = Math.floor((usableWidth - totalGap) / colCount);
        if (colWidth <= 16) return null;

        const textAreaWidth = Math.max(colWidth - 20, 1);
        const columns: string[][] = Array.from({ length: colCount }, () => []);
        const usedLines: number[] = Array.from({ length: colCount }, () => 0);
        let colIndex = 0;

        for (const item of items) {
            const plainText = stripHtml(item);
            const requiredLines = Math.max(1, Math.ceil(getTextWidth(plainText, font) / textAreaWidth));

            while (
                colIndex < colCount - 1 &&
                usedLines[colIndex] > 0 &&
                usedLines[colIndex] + requiredLines > maxLinesPerColumn
            ) {
                colIndex++;
            }

            if (usedLines[colIndex] + requiredLines > maxLinesPerColumn && columns[colIndex].length > 0) {
                return null;
            }

            columns[colIndex].push(item);
            usedLines[colIndex] += requiredLines;
        }

        return columns.filter((col) => col.length > 0);
    };

    const maxColumnsByWidth = Math.max(1, Math.floor((usableWidth + columnGap) / (150 + columnGap)));
    let maxColumns = Math.min(Math.max(maxColumnsByWidth, 1), Math.max(items.length, 1), 3);
    if (maxColumnCount !== undefined) {
        maxColumns = Math.min(maxColumns, Math.max(1, maxColumnCount));
    }

    // Prefer the largest font first; only then shrink. Within a font size, prefer *fewer* columns
    // (wider text, less wrapping). Extra columns are only used when a single column cannot fit at
    // that font within the height budget. (Font must stay outer: otherwise we'd shrink font for
    // 1 col before trying 2 cols at 11px.)
    for (let font = maxFontSize; font >= minFontSize; font--) {
        for (let colCount = 1; colCount <= maxColumns; colCount++) {
            const fittedColumns = tryFit(font, colCount);
            if (fittedColumns) {
                return {
                    fontSize: font,
                    lineHeight: Math.round(font * 1.25),
                    fittedColumns,
                };
            }
        }
    }

    return {
        fontSize: minFontSize,
        lineHeight: Math.round(minFontSize * 1.25),
        fittedColumns: [items],
    };
};

/** Styles for the text cell only (line-clamp etc.). List row uses padding + absolute bullet — not flex — so PDF engines don’t stack bullet above text. */
const sanitizeListItemStyleForTextSpan = (listItemStyle: string): string =>
    listItemStyle
        .replace(/display\s*:\s*list-item/gi, 'display:block')
        .replace(/list-style-type\s*:\s*[^;]+;?/gi, '')
        .replace(/list-style-position\s*:\s*[^;]+;?/gi, '')
        .replace(/;\s*;/g, ';')
        .trim();

export const renderBulletColumns = (
    items: string[],
    width: number,
    height: number,
    listItemStyle: string,
    columnGap = 18,
    maxColumnCount?: number,
): string => {
    const layout = computeBulletLayout(items, width, height, columnGap, maxColumnCount);
    const columns = layout.fittedColumns.length > 0 ? layout.fittedColumns : [items];
    const safeColumnHeight = Math.max(1, Math.floor(height / layout.lineHeight) * layout.lineHeight);
    const textSpanStyle = sanitizeListItemStyleForTextSpan(listItemStyle);
    const bulletGutterPx = 14;

    const columnsHtml = columns
        .map((columnItems, colIndex) => {
            const itemsHtml = columnItems
                .map(
                    (item) =>
                        `<li style="list-style:none;margin:0;padding:0 0 0 ${bulletGutterPx}px;position:relative;display:block;font-size:${layout.fontSize}px;line-height:${layout.lineHeight}px;text-align:left;"><span style="position:absolute;left:0;top:0;width:${bulletGutterPx - 2}px;line-height:${layout.lineHeight}px;text-align:center;">&bull;</span><span style="display:block;overflow-wrap:break-word;word-break:break-word;text-align:left;${textSpanStyle}">${item}</span></li>`,
                )
                .join('');
            return `<ul data-col="${colIndex}" style="margin:0;padding-left:0;list-style:none;text-align:left;flex:1;min-width:0;max-height:${safeColumnHeight}px;overflow:hidden;">${itemsHtml}</ul>`;
        })
        .join('');

    return `<div style="display:flex;gap:${columnGap}px;align-items:flex-start;height:100%;overflow:hidden;">${columnsHtml}</div>`;
};
