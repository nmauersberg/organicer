import 'twin.macro';
import { css as cssImport } from '@emotion/react';
import { CSSInterpolation } from '@emotion/serialize';
import styledImport from '@emotion/styled';
import '@emotion/react';

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport;
  const css: typeof cssImport;
}

declare module 'react' {
  // The css prop
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSInterpolation;
  }
  // The inline svg css prop
  interface SVGProps<T> extends SVGProps<SVGSVGElement> {
    css?: CSSInterpolation;
  }
}

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      red: string;
      blue: string;
      green: string;
      orange: string;
      petrol: string;
      lime: string;
    };
  }
}
