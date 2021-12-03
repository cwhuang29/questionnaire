import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid, GridToolbar, GridOverlay } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { getAllForms } from 'actions/form';
import messages from 'shared/constant/messages';
import MessageBar from 'components/MessageBar';
import history from 'helpers/history';
import ROLES from 'shared/constant/roles';

const onCellDoubleClick = (params, evt) => {
  if (params.field === 'name') {
    history.push(`/form/${params.id}`);
  }
};

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 150,
    type: 'number', // 'string' (default) 'number' 'date' 'dateTime' 'boolean' 'singleSelect' 'actions'
    // editable: true,
    // valueOptions: ['optionA', 'optionB', 'optionC'] // If the column type is 'singleSelect', you need to set the valueOptions
    // renderHeader: (params) => (<strong>{'Birthday '}<span role='img' aria-label='enjoy'>🎂</span></strong>), // Add additional decorators in the header
    // valueGetter: ({ value }) => value && new Date(value), // If data type is not the correct one, you can use valueGetter to parse the value to the correct type
  },
  { field: 'name', headerName: 'Form Name', width: 150 },
  {
    field: 'role',
    headerName: 'Role',
    valueFormatter: ({ value }) => ROLES[value],
  },
  { field: 'author', headerName: 'Author', width: 150 },
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 200,
    type: 'dateTime',
  },
];

const CustomLoadingOverlay = () => (
  <GridOverlay>
    <div style={{ position: 'absolute', top: 0, width: '100%' }}>
      <LinearProgress />
    </div>
  </GridOverlay>
);

const CustomNoRowsOverlay = () => <MessageBar msgHead={messages.NO_DATA} isShow isShowButton={false} />;

const SortedDescendingIcon = () => <ExpandMoreIcon className='icon' />;

const SortedAscendingIcon = () => <ExpandLessIcon className='icon' />;

const FormList = () => {
  const [formAll, setFormAll] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllForms())
      .then((data) => setFormAll(data.data))
      .catch((resp) => {
        if (resp && Object.prototype.hasOwnProperty.call(resp, 'status') && resp.status === 401) {
          history.push('/login');
        }
        setErrorMessage(`(${resp.statusText}) ${resp.data.error}`); // TODO Show error
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <MessageBar
        className='messageBar12345'
        msgHead='Fetching data ...'
        msgBody='Hold on for a second'
        isShow={isLoading}
      />
      <DataGrid
        autoHeight
        loading
        hideFooterSelectedRowCount
        editMode='row'
        density='standard'
        components={{
          Toolbar: GridToolbar,
          LoadingOverlay: CustomLoadingOverlay,
          NoRowsOverlay: CustomNoRowsOverlay,
          ColumnSortedDescendingIcon: SortedDescendingIcon,
          ColumnSortedAscendingIcon: SortedAscendingIcon,
        }}
        onCellDoubleClick={onCellDoubleClick}
        columns={columns}
        rows={formAll}
        style={{ cursor: 'pointer' }}
        // checkboxSelection
        // componentsProps={{ cell: { onMouseEnter: handlePopoverOpen, onMouseLeave: handlePopoverClose, }, }}
      />
    </>
  );
};

export default FormList;

// <Grid container spacing={3}>
//   {formAll.map(form => (
//     <Grid item xs={12} key={form.id}>
//       {form.role}
//       <Button variant='text' onClick={() => history.push(`/${form.id}`)}>
//         {form.name}
//       </Button>
//     </Grid>
//   ))}
// </Grid>
