import React from 'react';

import {Text} from '@workday/canvas-kit-react/text';
import {Table} from '@workday/canvas-kit-react/table';
import {createComponent} from '@workday/canvas-kit-react/common';
import {createStyles} from '@workday/canvas-kit-styling';
import {system} from '@workday/canvas-tokens-web';

import {
  caretDownSmallIcon,
  caretUpSmallIcon,
  copyIcon,
  minusCircleIcon,
  plusCircleIcon,
} from '@workday/canvas-system-icons-web';
import {TertiaryButton} from '../../../../button';
import {Flex} from '../../../../layout';

// modify the sorting example
interface CountryData {
  country: string;
  capital: string;
  population: number;
}

const countryData: CountryData[] = [
  {country: 'Australia', capital: 'Canberra', population: 25690000},
  {country: 'Bahamas', capital: 'Nassau', population: 407906},
  {country: 'Canada', capital: 'Ottawa', population: 38250000},
  {country: 'Fiji', capital: 'Suva', population: 924610},
  {country: 'Ghana', capital: 'Accra', population: 32830000},
  {country: 'Hong Kong', capital: 'City of Victoria', population: 7413000},
  {country: 'India', capital: 'New Delhi', population: 1408000000},
  {country: 'Ireland', capital: 'Dublin', population: 5033000},
  {country: 'Jamaica', capital: 'Kingston', population: 2828000},
  {country: 'Kenya', capital: 'Nairobi', population: 53010000},
  {country: 'Micronesia', capital: 'Palikir', population: 113131},
  {country: 'New Zealand', capital: 'Wellington', population: 5123000},
  {country: 'Philippines', capital: 'Manila', population: 113900000},
  {country: 'Puerto Rico', capital: 'San Juan', population: 3264000},
  {country: 'Samoa', capital: 'Apia', population: 218764},
  {country: 'Singapore', capital: 'Singapore', population: 5454000},
  {country: 'Tanzania', capital: 'Dodoma', population: 63590000},
  {country: 'United Kingdom', capital: 'London', population: 67330000},
  {country: 'United States', capital: 'Washington, D.C.', population: 331900000},
  {country: 'Zimbabwe', capital: 'Harare', population: 15990000},
];

const rowStyles = createStyles({
  gridTemplateColumns: '12rem repeat(4, 1fr)',
});

const textStyles = createStyles({
  paddingInlineStart: system.space.x3,
});

export const WithRowActions = () => {
  return (
    <Table>
      <Table.Caption>Population Listed by Country (2021)</Table.Caption>
      <Table.Head>
        <Table.Row cs={rowStyles}>
          <Table.Cell>
            <Text>Row Actions</Text>
          </Table.Cell>
          <FilterColumnDialog>Country</FilterColumnDialog>
          <FilterColumnDialog>Capital</FilterColumnDialog>
          <FilterColumnDialog>Population</FilterColumnDialog>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {countryData.map(item => {
          return (
            <Table.Row key={item.country} cs={rowStyles}>
              <RowActionIcons />
              <Table.Header scope="row">
                <Text cs={textStyles}>{item.country}</Text>
              </Table.Header>
              <Table.Cell>
                <Text cs={textStyles}>{item.capital}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text cs={textStyles}>{item.population.toLocaleString()}</Text>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

const RowActionIcons = createComponent()({
  displayName: 'RowActionIcons',
  Component: () => {
    return (
      <Table.Cell>
        <Flex>
          <TertiaryButton icon={copyIcon} size="small" />
          <TertiaryButton icon={plusCircleIcon} size="small" />
          <TertiaryButton icon={minusCircleIcon} size="small" />
          <TertiaryButton icon={caretUpSmallIcon} size="small" />
          <TertiaryButton icon={caretDownSmallIcon} size="small" />
        </Flex>
      </Table.Cell>
    );
  },
});

const RowActionMenu = createComponent()({
  displayName: 'RowActionMenu',
  Component: () => {
    return <Table.Cell></Table.Cell>;
  },
});

const FilterColumnDialog = createComponent()({
  displayName: 'FilterColumnDialog',
  Component: ({children}) => {
    return (
      <Table.Header scope="col">
        <button>{children}</button>
      </Table.Header>
    );
  },
});
