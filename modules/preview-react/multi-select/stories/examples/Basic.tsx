import React from 'react';

import {FormField} from '@workday/canvas-kit-react/form-field';
import {MultiSelect} from '@workday/canvas-kit-preview-react/multi-select';
import {StatusIndicator} from '@workday/canvas-kit-preview-react/status-indicator';
import {Dialog} from '@workday/canvas-kit-react/dialog';
import {TertiaryButton} from '@workday/canvas-kit-react/button';
import {BodyText} from '@workday/canvas-kit-react/text';
import {SystemIcon} from '@workday/canvas-kit-react/icon';
import {caretBottomSmallIcon, plusCircleIcon, xCircleIcon} from '@workday/canvas-system-icons-web';

const items = ['Cheese', 'Olives', 'Onions', 'Pepperoni', 'Peppers'];

const SuperStatus = () => {
  return (
    <StatusIndicator emphasis="high">
      <StatusIndicator.Label>Modified</StatusIndicator.Label>
      <Dialog>
        <Dialog.Target as={TertiaryButton} icon={caretBottomSmallIcon} variant="inverse" />
        <Dialog.Popper>
          <Dialog.Card>
            <Dialog.CloseIcon aria-label="Close" />
            <Dialog.Heading>Delta View</Dialog.Heading>
            <Dialog.Body>
              <BodyText size="small">
                <SystemIcon icon={xCircleIcon} />
                https://jira2.workday.com/secure/attachment/5968514/Screen%20Recording%202024-07-16%20at%2019.44.18.mov
                Mushrooms
              </BodyText>
              <BodyText size="small">
                <SystemIcon icon={xCircleIcon} />
                Olives
              </BodyText>
            </Dialog.Body>
          </Dialog.Card>
        </Dialog.Popper>
      </Dialog>
    </StatusIndicator>
  );
};

export const Basic = () => {
  return (
    <>
      <MultiSelect items={items}>
        <FormField orientation="vertical">
          <FormField.Label>
            Toppings
            <SuperStatus />
          </FormField.Label>
          <FormField.Input as={MultiSelect.Input} placeholder="Select Multiple" />
          <MultiSelect.Popper>
            <MultiSelect.Card>
              <MultiSelect.List>
                {item => (
                  <MultiSelect.Item data-id={item}>
                    <MultiSelect.Item.Text>{item}</MultiSelect.Item.Text>
                  </MultiSelect.Item>
                )}
              </MultiSelect.List>
            </MultiSelect.Card>
          </MultiSelect.Popper>
        </FormField>
      </MultiSelect>
    </>
  );
};
