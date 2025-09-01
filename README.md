# Templar

A TypeScript library that contains the logic to beautify data to PDF HTML, providing utilities for generating header and footer HTML for medical prescriptions and documents.

## Features

- 🏥 **Medical PDF Templates**: Specialized templates for medical prescriptions and documents
- 📋 **Header & Footer Generation**: Clean APIs for generating PDF headers and footers
- 🎨 **Customizable Styling**: Support for custom templates and configurations  
- ⚡ **TypeScript Support**: Full type safety and IntelliSense support
- 📦 **Multiple Export Formats**: CommonJS, ESM, and TypeScript definitions
- 🚀 **Built with Vite**: Fast and modern build process

## Installation

```bash
npm install @eka-care/templar
```

## Usage

### NPM Package Usage

```tsx
import { getHeaderHtml, getFooterHtml } from '@eka-care/templar';
import type { DoctorProfile, LocalTemplateConfig, RenderPdfPrescription } from '@eka-care/templar';

// Generate header HTML
const headerElement = getHeaderHtml({
    docProfile: doctorProfile,
    ptFormFields: patientFormFields,
    rxLocalConfig: templateConfig,
    data: prescriptionData,
    rxConfig: renderConfig,
});

// Generate footer HTML  
const footerElement = getFooterHtml({
    docProfile: doctorProfile,
    rxLocalConfig: templateConfig,
    data: prescriptionData,
    rxConfig: renderConfig,
    isHideFooterDetails: false,
});
```

### Browser Usage (Single JS File)

After building with `npm run build`, you'll get a single UMD file `dist/Templar.js` (~1.17MB) that includes all dependencies bundled and can be used directly in the browser:

#### Option 1: Local File

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Include your Templar library - single file with all dependencies bundled -->
    <script src="./dist/Templar.js"></script>
</head>
<body>
    <script>
        // Use Templar functions via the global Templar object
        const headerHtml = Templar.getHeaderHtml({
            docProfile: { /* your doctor profile */ },
            ptFormFields: [], // optional
            data: {}, // optional
            rxConfig: {}, // optional
            rxLocalConfig: {} // optional
        });
        
        const footerHtml = Templar.getFooterHtml({
            docProfile: { /* your doctor profile */ },
            rxLocalConfig: {}, // optional
            data: {}, // optional
            rxConfig: {}, // optional
            isHideFooterDetails: false // optional
        });
        
        const headHtml = Templar.getHead({
            language: 'en', // optional, default 'en'
            sizeType: 'normal', // optional, default 'normal'
            showPageBorder: false, // optional, default false
            fontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' // required
        });
    </script>
</body>
</html>
```

#### Option 2: CDN (unpkg)

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Include Templar directly from CDN -->
    <script src="https://unpkg.com/@eka-care/templar/dist/Templar.js"></script>
</head>
<body>
    <script>
        // Use Templar functions via the global Templar object
        const headerHtml = Templar.getHeaderHtml({
            docProfile: { /* your doctor profile */ },
            // ... other options
        });
        
        const footerHtml = Templar.getFooterHtml({
            docProfile: { /* your doctor profile */ },
            // ... other options
        });
        
        const headHtml = Templar.getHead({
            language: 'en',
            sizeType: 'normal',
            showPageBorder: false,
            fontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
        });
    </script>
</body>
</html>
```

### Type Definitions

The package exports all necessary TypeScript types:

```tsx
import type { 
    DoctorProfile,
    LocalTemplateConfig,
    RenderPdfPrescription,
    TemplateV2,
    DFormEntity 
} from '@eka-care/templar';
```

## API Reference

### `getHeaderHtml(payload: GetHeaderPayload): string`

Generates the header HTML string for PDF documents.

**Parameters:**
- `docProfile: DoctorProfile` - Doctor's profile information
- `ptFormFields?: DFormEntity[]` - Patient form fields (optional)
- `rxLocalConfig?: LocalTemplateConfig` - Local template configuration (optional)
- `data?: RenderPdfPrescription` - Prescription data (optional)
- `rxConfig?: TemplateV2` - Render configuration (optional)

### `getFooterHtml(payload: GetFooterPayload): string`

Generates the footer HTML string for PDF documents.

**Parameters:**
- `docProfile: DoctorProfile` - Doctor's profile information  
- `rxLocalConfig?: LocalTemplateConfig` - Local template configuration (optional)
- `data?: RenderPdfPrescription` - Prescription data (optional)
- `rxConfig?: TemplateV2` - Render configuration (optional)
- `isHideFooterDetails?: boolean` - Whether to hide footer details (optional)

### `getHead(options: HeadOptions): string`

Generates HTML head content with styles and fonts.

**Parameters:**
- `language?: keyof typeof fontFamily` - Language for fonts (default: 'en')
- `sizeType?: 'extra-large' | 'compact' | 'spacious' | 'normal'` - Size type (default: 'normal')
- `showPageBorder?: boolean` - Whether to show page border (default: false)
- `fontsUrl: string` - URL for font CSS (required)

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd templar

# Install dependencies
npm install

# Run type checking
npm run type-check
```

### Building

```bash
# Build the package with Vite
npm run build

# Watch mode for development
npm run dev
```

### Build Outputs

The Vite build process generates:

- `dist/Templar.js` - Single UMD build (~1.17MB, all dependencies bundled)
- `dist/Templar.d.ts` - TypeScript definitions
- Additional TypeScript declaration files for all modules

**Build Size:**
- Single UMD file: ~1.17MB (includes React and all dependencies)
- Gzipped: ~244KB
- The file includes all Templar logic and utilities bundled into a single file for browser usage

### Scripts

- `npm run build` - Build the package with Vite
- `npm run build:watch` - Build in watch mode
- `npm run clean` - Clean build artifacts
- `npm run type-check` - Run TypeScript type checking
- `npm run dev` - Development mode with watch

## Build Process

This package uses **Vite** as the build tool for optimal performance and modern JavaScript bundling:

- ⚡ **Fast Builds**: Vite provides lightning-fast builds using esbuild
- 📦 **Tree Shaking**: Automatic dead code elimination
- 🔧 **Modern Output**: ES2018+ target with proper polyfills
- 🗺️ **Source Maps**: Full source map support for debugging
- 🎯 **Dual Module**: Supports both CommonJS and ESM formats

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
