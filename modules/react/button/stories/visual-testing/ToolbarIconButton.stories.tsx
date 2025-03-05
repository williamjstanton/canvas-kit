import * as React from 'react';
import {customColorTheme} from '../../../../../utils/storybook';
import {boldIcon} from '@workday/canvas-system-icons-web';
import {ToolbarIconButton} from '@workday/canvas-kit-react/button';
import {Container, stateTableColumnProps} from './utils';
import {PartialEmotionCanvasTheme} from '@workday/canvas-kit-react/common';
import {ComponentStatesTable, StaticStates} from '@workday/canvas-kit-react/testing';
import {Tooltip} from '../../../tooltip';

export default {
  title: 'Testing/Buttons/Button/Toolbar Icon Button',
  component: ToolbarIconButton,
  parameters: {
    chromatic: {
      disable: false,
    },
  },
};

const columnProps = [
  ...stateTableColumnProps,
  {label: 'Mirrored Icon ', props: {shouldMirrorIcon: true, disabled: false}},
];

const ToolbarIconButtonTest = (props: {theme?: PartialEmotionCanvasTheme}) => (
  <StaticStates theme={props.theme}>
    <ComponentStatesTable
      rowProps={[
        {label: 'Toggled Off', props: {toggled: false}},
        {label: 'Toggled On', props: {toggled: true}},
      ]}
      columnProps={columnProps}
    >
      {(props: any) => (
        <Container>
          <Tooltip title={`Bold: ${props.toggled ? 'On' : 'Off'}`}>
            <ToolbarIconButton icon={boldIcon} {...props} />
          </Tooltip>
        </Container>
      )}
    </ComponentStatesTable>
  </StaticStates>
);

export const ToolbarIconButtonStates = {render: () => <ToolbarIconButtonTest />};

export const ToolbarIconButtonThemedStates = {
  render: () => <ToolbarIconButtonTest theme={{canvas: customColorTheme}} />,
};
