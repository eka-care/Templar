import React, { useEffect, useMemo, useState } from 'react';

/**
 * Types (lightweight subset of your big RenderPdfPrescription types)
 */
type VitalRaw = {
    id?: string;
    name?: string;
    dis_name?: string;
    date?: string; // ISO
    value?: { qt?: string; unit?: string; code?: string; code_id?: string };
};

type ToolLike = {
    language?: string;
    medicalHistory?: { vitals?: VitalRaw[] };
    vitals?: VitalRaw[]; // some payloads have top-level vitals
};

type RenderPdfLike = {
    patient?: {
        profile?: { personal?: { name?: string; age?: { dob?: string }; gender?: string } };
    };
    tool?: ToolLike;
    date?: string;
    visitId?: string;
    // ... other irrelevant fields
};

type PreGeneratedImages = {
    weightForAge?: string; // data:image/png;base64,...
    heightForAge?: string;
    ofcForAge?: string;
    bmiForAge?: string;
};

type GetGrowthChartsPrintProps = {
    renderPdf: RenderPdfLike; // first arg (contains vitals)
    other?: any; // second arg (irrelevant; accepted to match signature)
    preGenerated?: PreGeneratedImages | null; // optional pre-generated images for SSR
    artboardWidth?: number; // optional image width in px
    artboardHeight?: number; // optional image height in px
    onError?: (err: Error) => void;
};

/**
 * Expected async generator interface.
 * Replace with your server-side implementation (chartjs-node-canvas).
 *
 * signature:
 *   generateGrowthChart(vitalsPoints, dobIso, sex, chartType, options)
 * returns:
 *   Promise<{ base64: string; buffer: Buffer }>
 *
 * chartType: 'weightForAge' | 'heightForAge' | 'ofcForAge' | 'bmiForAge' | 'weightForHeight'
 *
 * vitalsPoints: Array<{ ts: string, weightKg?: number, heightCm?: number, ofcCm?: number, gestationalAgeWeeks?: number }>
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function generateGrowthChart(
    vitalsPoints: Array<{
        ts: string;
        weightKg?: number;
        heightCm?: number;
        ofcCm?: number;
        gestationalAgeWeeks?: number;
    }>,
    dobIso: string,
    sex: 'M' | 'F',
    chartType: 'weightForAge' | 'heightForAge' | 'ofcForAge' | 'bmiForAge' | 'weightForHeight',
    options?: {
        width?: number;
        height?: number;
        title?: string;
        xUnit?: 'months' | 'weeks' | 'days';
    },
): Promise<{ base64: string; buffer?: Buffer }> {
    // ---------- STUB ----------
    // Replace this stub with your server-side generator (chartjs-node-canvas).
    // This stub returns a tiny placeholder SVG/png data for quick visual testing.
    const title = options?.title ?? chartType;
    const width = options?.width ?? 800;
    const height = options?.height ?? 500;

    // create a simple SVG and convert to base64 data URL so the component can render during dev/test
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
    <rect width='100%' height='100%' fill='#fff'/>
    <text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='#333'>
      ${escapeHtml(title)}
    </text>
    <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='#666'>
      (replace stub with chartjs-node-canvas output)
    </text>
  </svg>`;
    const base64 = Buffer.from(svg).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${base64}`;
    return {
        base64: dataUrl.replace(/^data:image\/svg\+xml;base64,/, ''),
        buffer: Buffer.from(svg),
    };
}

/**
 * Utility: normalize number (returns undefined if NaN)
 */
function toNumberSafe(qt?: string | number | null): number | undefined {
    if (qt == null) return undefined;
    const n = typeof qt === 'number' ? qt : Number(String(qt).trim());
    return Number.isFinite(n) ? n : undefined;
}

/**
 * Utility: sanitize and normalize vitals array into series of merged points (by exact timestamp)
 */
function buildVitalsSeries(tool?: ToolLike) {
    const raw: VitalRaw[] = (tool?.medicalHistory?.vitals ?? tool?.vitals) || [];
    // Group by exact timestamp string (many of your vitals share same ISO date in example)
    const map = new Map<string, any>();
    for (const v of raw) {
        const ts = v.date ?? new Date().toISOString();
        const key = String(ts);
        if (!map.has(key))
            map.set(key, {
                ts,
                weightKg: undefined,
                heightCm: undefined,
                ofcCm: undefined,
                bmi: undefined,
                gestationalAgeWeeks: undefined,
            });
        const entry = map.get(key);
        const name = (v.name ?? v.dis_name ?? '').toLowerCase();

        const qt = toNumberSafe(v.value?.qt);
        // Normalize common units (you might expand these rules)
        if (name.includes('weight')) {
            // assume kg, but if unit suggests 'g' or 'lbs' handle accordingly (not implemented here)
            entry.weightKg = qt;
        } else if (name.includes('height') || name.includes('length')) {
            entry.heightCm = qt;
        } else if (name.includes('occipital') || name.includes('ofc') || name.includes('head')) {
            entry.ofcCm = qt;
        } else if (name.includes('bmi')) {
            entry.bmi = qt;
        } else if (name.includes('gestat') || name.includes('gestation')) {
            entry.gestationalAgeWeeks = qt;
        }
        map.set(key, entry);
    }

    // Sort ascending by timestamp
    const arr = Array.from(map.values()).sort(
        (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime(),
    );
    return arr;
}

/**
 * HTML escape
 */
function escapeHtml(s: string | number | null | undefined) {
    if (s == null) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * The main exported component/function.
 * NOTE: It's a React functional component returning JSX.Element.
 * - If preGenerated images are available via props.preGenerated, renders immediately.
 * - Otherwise, triggers async `generateGrowthChart` calls and shows images when ready.
 */
export function GetGrowthChartsPrint(props: GetGrowthChartsPrintProps): JSX.Element {
    const {
        renderPdf,
        preGenerated = null,
        artboardWidth = 1400,
        artboardHeight = 800,
        onError,
    } = props;

    // memoize series & patient info
    const dob = renderPdf?.patient?.profile?.personal?.age?.dob ?? '';
    const sexRaw = renderPdf?.patient?.profile?.personal?.gender ?? 'M';
    const sex = String(sexRaw).toUpperCase().startsWith('F') ? 'F' : 'M';
    const series = useMemo(() => buildVitalsSeries(renderPdf?.tool), [renderPdf]);

    // local state for images (data URLs)
    const [weightImg, setWeightImg] = useState<string | null>(preGenerated?.weightForAge ?? null);
    const [heightImg, setHeightImg] = useState<string | null>(preGenerated?.heightForAge ?? null);
    const [ofcImg, setOfcImg] = useState<string | null>(preGenerated?.ofcForAge ?? null);
    const [bmiImg, setBmiImg] = useState<string | null>(preGenerated?.bmiForAge ?? null);
    const [loading, setLoading] = useState<boolean>(false);

    // Build generator-friendly vitals list
    const vitalsForGenerator = useMemo(() => {
        return series.map((s) => ({
            ts: s.ts,
            weightKg: s.weightKg,
            heightCm: s.heightCm,
            ofcCm: s.ofcCm,
            gestationalAgeWeeks: s.gestationalAgeWeeks,
        }));
    }, [series]);

    useEffect(() => {
        // If pre-generated provided, do nothing
        if (preGenerated) return;

        // If images already exist (maybe from previous run), do nothing
        if (weightImg && heightImg && ofcImg && bmiImg) return;

        // otherwise generate
        let mounted = true;
        setLoading(true);

        (async () => {
            try {
                // Generate all 4 charts in parallel
                const opts = {
                    width: artboardWidth,
                    height: artboardHeight,
                    xUnit: 'months' as const,
                };
                const tasks = [
                    generateGrowthChart(
                        vitalsForGenerator,
                        dob || new Date().toISOString(),
                        sex,
                        'weightForAge',
                        { ...opts, title: 'Weight for age' },
                    ),
                    generateGrowthChart(
                        vitalsForGenerator,
                        dob || new Date().toISOString(),
                        sex,
                        'heightForAge',
                        { ...opts, title: 'Height for age' },
                    ),
                    generateGrowthChart(
                        vitalsForGenerator,
                        dob || new Date().toISOString(),
                        sex,
                        'ofcForAge',
                        { ...opts, title: 'OFC for age' },
                    ),
                    generateGrowthChart(
                        vitalsForGenerator,
                        dob || new Date().toISOString(),
                        sex,
                        'bmiForAge',
                        { ...opts, title: 'BMI for age' },
                    ),
                ];

                // run all
                const results = await Promise.all(tasks);

                if (!mounted) return;

                // results are { base64, buffer? }
                // generator stub provided returns a data-url as base64 string WITHOUT data:image prefix.
                // We need to ensure we produce proper data:image/*; if generator returns base64 without prefix,
                // figure out the mime type — assume png (image/png) unless generator provided svg data URL.
                // For this implementation, we'll check if result.base64 startsWith('data:'); if yes use directly,
                // otherwise prefix with image/png base64.
                const toDataUrl = (r: { base64: string }) => {
                    const b = r.base64 || '';
                    if (b.startsWith('data:')) return b; // already a data URL (our stub sometimes returns svg data URL)
                    return `data:image/png;base64,${b}`;
                };

                setWeightImg(toDataUrl(results[0]));
                setHeightImg(toDataUrl(results[1]));
                setOfcImg(toDataUrl(results[2]));
                setBmiImg(toDataUrl(results[3]));
            } catch (err: any) {
                console.error('generateGrowthCharts error', err);
                onError?.(err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [
        preGenerated,
        weightImg,
        heightImg,
        ofcImg,
        bmiImg,
        vitalsForGenerator,
        dob,
        sex,
        artboardWidth,
        artboardHeight,
        onError,
    ]);

    // Render the 4 charts in a grid; show small placeholders while loading
    const imgStyle: React.CSSProperties = {
        width: '48%',
        height: 'auto',
        border: '1px solid #e6e6e6',
        borderRadius: 6,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        objectFit: 'contain',
        marginBottom: 12,
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '1%',
    };

    return (
        <div
            className="growth-charts-print"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#222' }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                }}
            >
                <div>
                    <div style={{ fontWeight: 600 }}>Growth charts</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                        {renderPdf?.patient?.profile?.personal?.name ?? ''}
                        {renderPdf?.patient?.profile?.personal?.age?.dob
                            ? ` • DOB: ${renderPdf.patient.profile.personal.age.dob}`
                            : ''}
                    </div>
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                    {renderPdf?.visitId ? `Visit: ${renderPdf.visitId}` : ''}{' '}
                    {renderPdf?.date ? `• ${new Date(renderPdf.date).toLocaleString()}` : ''}
                </div>
            </div>

            <div style={containerStyle}>
                <div style={{ width: '49%' }}>
                    {weightImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={weightImg} alt="Weight for age" style={imgStyle} />
                    ) : (
                        <div
                            style={{
                                ...imgStyle,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {loading ? 'Rendering weight chart…' : 'No data'}
                        </div>
                    )}
                </div>

                <div style={{ width: '49%' }}>
                    {heightImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={heightImg} alt="Height for age" style={imgStyle} />
                    ) : (
                        <div
                            style={{
                                ...imgStyle,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {loading ? 'Rendering height chart…' : 'No data'}
                        </div>
                    )}
                </div>

                <div style={{ width: '49%' }}>
                    {ofcImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ofcImg} alt="OFC for age" style={imgStyle} />
                    ) : (
                        <div
                            style={{
                                ...imgStyle,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {loading ? 'Rendering OFC chart…' : 'No data'}
                        </div>
                    )}
                </div>

                <div style={{ width: '49%' }}>
                    {bmiImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={bmiImg} alt="BMI for age" style={imgStyle} />
                    ) : (
                        <div
                            style={{
                                ...imgStyle,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {loading ? 'Rendering BMI chart…' : 'No data'}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                Legend: percentile curves (P3, P15, P50, P85, P97) are shown as thin lines; patient
                measurements are solid markers.
            </div>
        </div>
    );
}
