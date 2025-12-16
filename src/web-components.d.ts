import 'react';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'qr-code': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    contents?: string;
                    'module-color'?: string;
                    'position-ring-color'?: string;
                    'position-center-color'?: string;
                    'mask-x-to-y-ratio'?: string;
                },
                HTMLElement
            >;
        }
    }
}


