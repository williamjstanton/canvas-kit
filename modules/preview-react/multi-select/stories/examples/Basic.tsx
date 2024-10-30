import React from 'react';

import {FormField} from '@workday/canvas-kit-react/form-field';
import {MultiSelect} from '@workday/canvas-kit-preview-react/multi-select';
import {StatusIndicator} from '@workday/canvas-kit-preview-react/status-indicator';
import {Dialog} from '@workday/canvas-kit-react/dialog';

const items = ['Cheese', 'Olives', 'Onions', 'Pepperoni', 'Peppers'];

const SuperStatus = () => {
  return (
    <StatusIndicator emphasis="high">
      <StatusIndicator.Label>Modified</StatusIndicator.Label>
      <Dialog>
        <Dialog.Target>Details</Dialog.Target>
        <Dialog.Popper>
          <Dialog.Card>
            <Dialog.CloseIcon aria-label="Close" />
            <Dialog.Heading paddingTop="m">Delta View</Dialog.Heading>
            <Dialog.Body>
              <p>body content</p>
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
