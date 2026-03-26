
import { createTheme as createMuiTheme } from '@mui/material/styles';

import { shadows } from './core/shadows';
import { palette } from './core/palette';
import { themeConfig } from './theme-config';
import { components } from './core/components';
import { typography } from './core/typography';
import { customShadows } from './core/custom-shadows';


// ----------------------------------------------------------------------

export const baseTheme= {
  colorSchemes: {
    light: {
      palette
      shadows
      customShadows
    },
  },
  components,
  typography,
  shape: { borderRadius: 8 },
  cssVariables
};

// ----------------------------------------------------------------------

  themeOverrides?;
};

export function createTheme({ themeOverrides = {} }= {}): Theme {
  const theme = createMuiTheme(baseTheme, themeOverrides);

  return theme;
}
