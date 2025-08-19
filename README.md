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

### Basic Usage

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

### `getHeaderHtml(payload: GetHeaderPayload): JSX.Element`

Generates the header HTML for PDF documents.

**Parameters:**
- `docProfile: DoctorProfile` - Doctor's profile information
- `ptFormFields?: DFormEntity[]` - Patient form fields (optional)
- `rxLocalConfig?: LocalTemplateConfig` - Local template configuration (optional)
- `data?: RenderPdfPrescription` - Prescription data (optional)
- `rxConfig?: TemplateV2` - Render configuration (optional)

### `getFooterHtml(payload: GetFooterPayload): JSX.Element`

Generates the footer HTML for PDF documents.

**Parameters:**
- `docProfile: DoctorProfile` - Doctor's profile information  
- `rxLocalConfig?: LocalTemplateConfig` - Local template configuration (optional)
- `data?: RenderPdfPrescription` - Prescription data (optional)
- `rxConfig?: TemplateV2` - Render configuration (optional)
- `isHideFooterDetails?: boolean` - Whether to hide footer details (optional)

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

- `dist/Templar.js` - CommonJS build
- `dist/Templar.esm.js` - ESM build  
- `dist/Templar.d.ts` - TypeScript definitions
- Source maps for debugging

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
