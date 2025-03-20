import * as React from 'react';
import {useTheme, Themeable, createComponent} from '@workday/canvas-kit-react/common';
import {BaseButton} from './BaseButton';
import {TertiaryButtonProps} from './TertiaryButton';
import {base, brand, system} from '@workday/canvas-tokens-web';
import {createStencil, px2rem} from '@workday/canvas-kit-styling';
import {mergeStyles} from '@workday/canvas-kit-react/layout';
import {systemIconStencil} from '@workday/canvas-kit-react/icon';

export interface ToolbarIconButtonProps
  extends Omit<TertiaryButtonProps, 'size' | 'variant'>,
    Themeable {
  onToggleChange?: (toggled: boolean | undefined) => void;
  toggled?: boolean;
  shouldMirrorIcon?: boolean;
}

export const toolbarIconButtonStencil = createStencil({
  base: {
    padding: system.space.zero,
    minWidth: system.space.x8,
    width: system.space.x8,
    height: system.space.x8,
    borderRadius: system.shape.x1,
    [systemIconStencil.vars.color]: system.color.icon.default,
    ['& .wd-icon']: {
      display: 'inline-block',
      width: 20,
      height: 20,
    },
    '&:hover, &.hover': {
      backgroundColor: system.color.bg.alt.default,
      [systemIconStencil.vars.color]: system.color.icon.strong,
    },
    '&:active': {
      backgroundColor: system.color.bg.alt.stronger,
      [systemIconStencil.vars.color]: system.color.icon.strong,
    },
    '&:focus-visible, &.focus': {
      [systemIconStencil.vars.color]: system.color.icon.default,
    },
    '&:disabled': {
      // Can't find system token for soap600
      [systemIconStencil.vars.color]: base.soap600,
      opacity: '1',
    },
  },
  modifiers: {
    toggled: {
      /**
       * Selected state:
       * WHCM = Windows 11 high contrast desktop theme (mode)
       * Can't use 'outline': already in use as 'transparent' for WHCM
       * When true: use 'border'
       * When false: use 'border' none and add 1px padding for alignment
       * Note: 'border' always appears visible in WHCM
       * Note: Using '!important' because focus and hover states override border color
       */
      true: {
        border: `1px solid ${system.color.border.contrast.default} !important`,
        backgroundColor: brand.primary.lightest,
        [systemIconStencil.vars.color]: brand.primary.base,

        '&:hover, &.hover, &:active': {
          [systemIconStencil.vars.color]: brand.primary.dark,
        },
        '&:focus-visible, &.focus': {
          backgroundColor: brand.primary.lightest,
          [systemIconStencil.vars.color]: brand.primary.base,
        },
        '&:disabled': {
          border: `1px solid ${system.color.border.input.disabled} !important`,
          backgroundColor: brand.primary.lightest,
          [systemIconStencil.vars.color]: brand.primary.light,
        },
      },
      false: {
        border: 'none',
        padding: px2rem(1),
      },
    },
  },
});

export const ToolbarIconButton = createComponent('button')({
  displayName: 'ToolbarIconButton',
  Component: (
    {
      // TODO: Fix useTheme and make it a real hook
      // eslint-disable-next-line react-hooks/rules-of-hooks
      theme = useTheme(),
      onToggleChange,
      icon,
      shouldMirrorIcon = false,
      toggled,
      children,
      ...elemProps
    }: ToolbarIconButtonProps,
    ref,
    Element
  ) => {
    const isInitialMount = React.useRef(true);

    // Only call onToggleChange on update - not on first mount
    React.useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        if (toggled && typeof onToggleChange === 'function') {
          onToggleChange(toggled);
        }
      }
    }, [toggled, onToggleChange]);

    return (
      <BaseButton
        ref={ref}
        as={Element}
        size={'small'}
        aria-pressed={toggled}
        {...mergeStyles(elemProps, toolbarIconButtonStencil({toggled: toggled}))}
      >
        {icon ? <BaseButton.Icon icon={icon} shouldMirrorIcon={shouldMirrorIcon} /> : children}
      </BaseButton>
    );
  },
});
