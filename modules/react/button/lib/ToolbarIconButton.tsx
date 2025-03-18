import * as React from 'react';
import {borderRadius, colors, space} from '@workday/canvas-kit-react/tokens';
import {
  focusRing,
  useTheme,
  Themeable,
  EmotionCanvasTheme,
  createComponent,
  styled,
  StyledType,
} from '@workday/canvas-kit-react/common';
import {ButtonColors} from './types';
import {BaseButton} from './BaseButton';
import {TertiaryButtonProps} from './TertiaryButton';
import {base, brand, system} from '@workday/canvas-tokens-web';
import {createStencil} from '@workday/canvas-kit-styling';
import {mergeStyles} from '../../layout';

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
    ['& .wd-icon']: {
      display: 'inline-block',
      width: 20,
      height: 20,
    },
    // Maybe I don't need this
    // Should ingerit from BaseButton w/ prerelease/minor
    // '&:focus-visible, &.focus': {
    //   outline: '2px solid transparent',
    //   outlineOffset: '2px',
    // },
  },
  modifiers: {
    toggled: {
      true: {
        // Using '!important' because inherited focus state changes border colors
        // Can't have that when using border to communicate 'on' state
        border: `1px solid ${base.licorice400} !important`,
        '&:disabled': {
          border: `1px solid ${base.licorice100} !important`,
        },
      },
      false: {
        // make sure border color is mapped to a background color
        // so border does not appear in Windows 11 high contrast mode
        border: '1px solid var(--button-background-color, white)',
      },
    },
  },
});

const StyledToolbarIconButton = styled(BaseButton)<StyledType & ToolbarIconButtonProps>({
  ['& .wd-icon']: {
    display: 'inline-block',
    width: 20,
    height: 20,
  },
  '&:focus-visible, &.focus': {
    ...focusRing({
      width: 2,
      separation: 0,
      innerColor: 'transparent',
      outerColor: brand.common.focusOutline,
    }),
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
        colors={getToolbarIconButtonColors(theme, toggled)}
        size={'small'}
        fillIcon={toggled}
        aria-pressed={toggled}
        {...mergeStyles(elemProps, toolbarIconButtonStencil({toggled: toggled}))}
      >
        {icon ? <BaseButton.Icon icon={icon} shouldMirrorIcon={shouldMirrorIcon} /> : children}
      </BaseButton>
    );
  },
});

const getToolbarIconButtonColors = (theme: EmotionCanvasTheme, toggled?: boolean): ButtonColors => {
  const {
    canvas: {
      palette: {primary: themePrimary},
    },
  } = theme;
  return {
    default: {
      icon: toggled ? themePrimary.main : colors.licorice200,
      background: toggled ? themePrimary.lightest : 'transparent',
    },
    hover: {
      icon: toggled ? themePrimary.dark : colors.licorice500,
      background: colors.soap300,
    },
    active: {
      icon: toggled ? themePrimary.dark : colors.licorice500,
      background: colors.soap500,
    },
    focus: {
      icon: toggled ? themePrimary.main : colors.licorice200,
      background: toggled ? themePrimary.lightest : 'transparent',
    },
    disabled: {
      icon: toggled ? themePrimary.light : colors.soap600,
      background: toggled ? themePrimary.lightest : 'transparent',
      opacity: '1',
    },
  };
};
