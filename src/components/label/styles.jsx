
import { varAlpha } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';


// ----------------------------------------------------------------------

export const LabelRoot = styled('span', {
  shouldForwardProp: (prop) => !['color', 'variant', 'disabled', 'sx'].includes(prop),
})(({ color, variant, disabled, theme }) => {
  const defaultStyles= {
    ...(color === 'default' && {
      /**
       * @variant filled
       */
      ...(variant === 'filled' && {
        color
        backgroundColor
        ...theme.applyStyles('dark', {
          color: theme.vars.palette.grey[800],
        }),
      }),
      /**
       * @variant outlined
       */
      ...(variant === 'outlined' && {
        backgroundColor: 'transparent',
        color
        border: `2px solid ${theme.vars.palette.text.primary}`,
      }),
      /**
       * @variant soft
       */
      ...(variant === 'soft' && {
        color
        backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
      }),
      /**
       * @variant inverted
       */
      ...(variant === 'inverted' && {
        color: theme.vars.palette.grey[800],
        backgroundColor: theme.vars.palette.grey[300],
      }),
    }),
  };

  const colorStyles= {
    ...(color &&
      color !== 'default' && {
        /**
         * @variant filled
         */
        ...(variant === 'filled' && {
          color
          backgroundColor
        }),
        /**
         * @variant outlined
         */
        ...(variant === 'outlined' && {
          backgroundColor: 'transparent',
          color
          border: `2px solid ${theme.vars.palette[color].main}`,
        }),
        /**
         * @variant soft
         */
        ...(variant === 'soft' && {
          color
          backgroundColor: varAlpha(theme.vars.palette[color].mainChannel, 0.16),
          ...theme.applyStyles('dark', {
            color
          }),
        }),
        /**
         * @variant inverted
         */
        ...(variant === 'inverted' && {
          color
          backgroundColor
        }),
      }),
  };

  return {
    height: 24,
    minWidth: 24,
    lineHeight: 0,
    flexShrink: 0,
    cursor: 'default',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    gap: theme.spacing(0.75),
    justifyContent: 'center',
    padding: theme.spacing(0, 0.75),
    fontSize: theme.typography.pxToRem(12),
    fontWeight
    borderRadius: theme.shape.borderRadius * 0.75,
    transition: theme.transitions.create(['all'], { duration: theme.transitions.duration.shorter }),
    ...defaultStyles,
    ...colorStyles,
    ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
  };
});

export const LabelIcon = styled('span')({
  width: 16,
  height: 16,
  flexShrink: 0,
  '& svg, img': { width: '100%', height: '100%', objectFit: 'cover' },
});
