import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import Chart, { ChartConfiguration } from 'chart.js/auto';

// Register fonts if needed
import { registerFont } from 'canvas';
try {
    registerFont('/usr/share/fonts/truetype/poppins/Poppins-Regular.ttf', { family: 'Poppins' });
} catch {
    /* optional */
}

// The core function used by templateUtils.tsx
interface Vital {
    ts: string;
    weightKg?: number;
    heightCm?: number;
    ofcCm?: number;
}

interface GenerateGrowthChartOptions {
    width?: number;
    height?: number;
    title?: string;
    xUnit?: 'months' | 'years';
}

interface GrowthChartResult {
    base64: string;
}

export async function generateGrowthChart(
    vitals: Vital[],
    dobIso: string,
    sex: 'male' | 'female',
    chartType: 'weightForAge' | 'heightForAge' | 'ofcForAge' | 'bmiForAge',
    opts: GenerateGrowthChartOptions = {},
): Promise<GrowthChartResult> {
    const { width = 1200, height = 800, title = '', xUnit = 'months' } = opts;

    const canvas = new ChartJSNodeCanvas({
        width,
        height,
        backgroundColour: 'white',
    });

    // Transform vitals data into points for plotting
    const dataPoints = vitals
        .map((v) => {
            const ageDays =
                (new Date(v.ts).getTime() - new Date(dobIso).getTime()) / (1000 * 60 * 60 * 24);
            const ageMonths = ageDays / 30.4375;
            let y: number | undefined;
            if (chartType === 'weightForAge') y = v.weightKg;
            else if (chartType === 'heightForAge') y = v.heightCm;
            else if (chartType === 'ofcForAge') y = v.ofcCm;
            else if (chartType === 'bmiForAge' && v.heightCm && v.weightKg) {
                const hM = v.heightCm / 100;
                y = v.weightKg / (hM * hM);
            }
            return { x: ageMonths, y };
        })
        .filter((p) => p.y != null);

    // Dummy percentile data — in your case use the actual WHO/CDC tables
    const percentileData = [
        { label: 'P3', factor: 0.85 },
        { label: 'P15', factor: 0.9 },
        { label: 'P50', factor: 1.0 },
        { label: 'P85', factor: 1.1 },
        { label: 'P97', factor: 1.2 },
    ].map((p) => ({
        label: p.label,
        data: dataPoints.map((d) => ({ x: d.x, y: d.y! * p.factor })),
        borderColor: '#999',
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.3,
        borderDash: p.label === 'P50' ? [] : [4, 2],
    }));

    const config: ChartConfiguration<'scatter'> = {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Dataset 1',
                    data: dataPoints.map((point) => ({
                        x: point.x,
                        y: point.y ?? null, // Ensure y is never undefined
                    })),
                    borderColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0.4,
                    borderDash: [],
                },
            ],
        },
        options: {
            // Your chart options
        },
    };

    const buffer = await canvas.renderToBuffer(config);
    return { base64: buffer.toString('base64') };
}
