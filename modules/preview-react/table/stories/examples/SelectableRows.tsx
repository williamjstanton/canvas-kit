import React from 'react';

import {Table} from '@workday/canvas-kit-preview-react/table';
import {Heading} from '@workday/canvas-kit-react/text';
import {Checkbox} from '@workday/canvas-kit-react/checkbox';
import {styled, useUniqueId} from '@workday/canvas-kit-react/common';
import {Tooltip} from '@workday/canvas-kit-react/tooltip';
import {colors} from '@workday/canvas-kit-react/tokens';

const pizzaToppingData = [
  {topping: 'Pepperoni', amount: '2.5 oz.'},
  {topping: 'Mozzarella', amount: '5 oz.'},
  {topping: 'Basil', amount: '10 Leaves'},
  {topping: 'Roasted Red Peppers', amount: '3 oz.'},
  {topping: 'Mushrooms', amount: '2 oz.'},
];

const StyledCell = styled(Table.Cell)({
  backgroundColor: 'transparent',
});

const CustomRow = props => {
  const [isSelected, setIsSelected] = React.useState(props.selected);
  const selectRowHandler = e => {
    setIsSelected(e.target.checked);
  };

  return (
    <Table.Row background={isSelected && colors.blueberry200}>
      <StyledCell>
        <Tooltip title={props.rowData.topping}>
          <Checkbox checked={isSelected} onChange={selectRowHandler} />
        </Tooltip>
      </StyledCell>
      <StyledCell>{props.rowData.topping}</StyledCell>
      <StyledCell>{props.rowData.amount}</StyledCell>
    </Table.Row>
  );
};

export const SelectableRows = () => {
  const headingID = useUniqueId();
  const [selectAll, setSelectAll] = React.useState(false);
  const selectAllHandler = e => {
    setSelectAll(e.target.checked);
  };

  return (
    <>
      <Heading as="h3" id={headingID} size="small" marginBottom="s">
        Pizza Toppings
      </Heading>
      <Table aria-labelledby={headingID}>
        <Table.Row>
          <StyledCell backgroundColor={colors.soap100}>
            <Tooltip title="Select All">
              <Checkbox checked={selectAll} onChange={selectAllHandler} />
            </Tooltip>
          </StyledCell>
          <Table.Header scope="col" backgroundColor={colors.soap100}>
            Toppings
          </Table.Header>
          <Table.Header scope="col" backgroundColor={colors.soap100}>
            Amount
          </Table.Header>
        </Table.Row>

        {pizzaToppingData.map(i => (
          <CustomRow rowData={i} selected={selectAll} />
        ))}
      </Table>
    </>
  );
};
