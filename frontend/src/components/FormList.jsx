import React, { useEffect, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid, GridToolbar, GridOverlay } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { getAllForms } from 'actions/form';
import messages from 'shared/constant/messages';
import history from 'helpers/history';
import ROLES from 'shared/constant/roles';
import useGlobalMessageContext from 'hooks/useGlobalMessageContext';
import { GLOBAL_MESSAGE_SERVERITY } from 'shared/constant/styles';
// import GlobalMessageContext from 'components/MessageBar';

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
    field: 'created_at',
    headerName: 'Created At',
    width: 200,
    type: 'dateTime',
  },
];

const onCellDoubleClick = (params) => {
  if (params.field === 'name') {
    history.push(`/form/${params.id}`);
  }
};

const CustomLoadingOverlay = () => (
  <GridOverlay>
    <div style={{ position: 'absolute', top: 0, width: '100%' }}>
      <LinearProgress />
    </div>
  </GridOverlay>
);

const SortedDescendingIcon = () => <ExpandMoreIcon className='icon' />;

const SortedAscendingIcon = () => <ExpandLessIcon className='icon' />;

const CustomNoRowsOverlay = () => (
  <div
    style={{
      display: 'flex',
      top: '58px',
      left: 0,
      right: 0,
      bottom: 0,
      height: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      overflow: 'hidden',
    }}
  >
    {messages.NO_DATA}
  </div>
);

const FormList = () => {
  const [formAll, setFormAll] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const { addGlobalMessage } = useGlobalMessageContext();
  // const context = useContext(GlobalMessageContext); // Use context.addGlobalMessage({}) instead of addGlobalMessage

  useEffect(() => {
    dispatch(getAllForms())
      .then((data) => {
        setFormAll(data.data);
        setIsLoading(false);
      })
      .catch((resp) => {
        if (!resp || !Object.prototype.hasOwnProperty.call(resp, 'status')) {
          // TODO Handle unknown error on server (e.g. server crashed)
        } else if (resp.status === 401) {
          history.push('/login');
        }

        addGlobalMessage({
          title: resp?.data.errHead || resp?.data.error || messages.UNKNOWN_ERROR,
          content: resp?.data.errBody || messages.SERVER_UNSTABLE,
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
          enableClose: true,
        });
      });
  }, []);

  // https://mui.com/api/data-grid/data-grid/
  return (
    <DataGrid
      autoHeight
      loading={isLoading}
      hideFooterSelectedRowCount
      editMode='row'
      density='standard'
      disableDensitySelector
      components={{
        Toolbar: GridToolbar,
        LoadingOverlay: CustomLoadingOverlay,
        ColumnSortedDescendingIcon: SortedDescendingIcon,
        ColumnSortedAscendingIcon: SortedAscendingIcon,
        NoRowsOverlay: CustomNoRowsOverlay,
      }}
      onCellDoubleClick={onCellDoubleClick}
      columns={columns}
      rows={formAll}
      style={{ cursor: 'pointer' }}
    />
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
