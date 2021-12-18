import React, { useEffect, useState, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import useGlobalMessageContext from 'hooks/useGlobalMessageContext';
import { GLOBAL_MESSAGE_SERVERITY } from 'shared/constant/styles';
import FormList from 'components/FormList';

const rows = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];

export default function Test() {
  const { addGlobalMessage } = useGlobalMessageContext();

  useEffect(() => {
    addGlobalMessage({
      title: 'This is title 01',
      content: '',
      severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
      timestamp: Date.now(),
      enableClose: true,
    });

    addGlobalMessage({
      title: 'This is title 02',
      severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
      timestamp: Date.now(),
    });
    setTimeout(
      () =>
        addGlobalMessage({
          title: 'Title 03',
          content:
            'This is content. As part of the customization API, the grid allows you to override internal components with the components prop.',
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          enableClose: true,
          timestamp: Date.now(),
        }),
      3
    );
    setTimeout(
      () =>
        addGlobalMessage({
          title: 'Title 04',
          content:
            'As part of the customization API, the grid allows you to override internal components with the components prop. The prop accepts an object of type GridSlotsComponent. \n If you wish to pass additional props in a component slot, you can do it using the componentsProps prop. This prop is of type GridSlotsComponentsProps.',
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
          enableClose: true,
        }),
      6
    );
  }, []);

  return (
    <>
      <div style={{ marginTop: '50px', height: 300, width: '80%' }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
      <div> !!!!!!!!!!!!</div>
      <FormList />
    </>
  );
}
