import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { getAllForms } from 'actions/form';
import { TitleText } from 'components/styledComponents';
import ROLES from 'shared/constant/roles';

const FormWrapper = () => {
  const [formAll, setFormAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllForms())
      .then(data => setFormAll(data.data))
      .catch(resp => {
        if (resp === undefined || resp.status === 401) {
          history.push('/login');
        }
        setErrorMessage(`(${resp.statusText}) ${resp.data.error}`); // TODO Show error
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150,
      type: 'number', // 'string' (default) 'number' 'date' 'dateTime' 'boolean' 'singleSelect' 'actions'
      // valueOptions: ['optionA', 'optionB', 'optionC'] // If the column type is 'singleSelect', you need to set the valueOptions
      // renderHeader: (params) => (<strong>{'Birthday '}<span role='img' aria-label='enjoy'>🎂</span></strong>), // Add additional decorators in the header
      // valueGetter: ({ value }) => value && new Date(value), // If data type is not the correct one, you can use valueGetter to parse the value to the correct type
    },
    { field: 'name', headerName: 'Researcher Name', width: 150 },
    { field: 'role', headerName: 'Role', valueFormatter: ({ value }) => ROLES[value] },
    { field: 'author', headerName: 'Author', width: 150 },
    { field: 'createdAt', headerName: 'Created At', width: 200 },
  ];

  return (
    <>
      {loading ? <div>Fetching data ...</div> : null}
      <TitleText width='400px' height='35px' lineHeight='1.5' fontSize='18px'>
        This is title
      </TitleText>
      <DataGrid components={{ Toolbar: GridToolbar }} columns={columns} rows={formAll} />
    </>
  );
};

export default FormWrapper;

// <Grid container spacing={3}>
//   {formAll.map(form => (
//     <Grid item xs={12} key={form.id}>
//       {form.role}
//       <Button variant='text' onClick={() => history.push('/login')}>
//         {form.name}
//       </Button>
//     </Grid>
//   ))}
// </Grid>
//
// Require purchase
// import { DataGridPro } from '@mui/x-data-grid-pro';
// <DataGridPro
//   columns={[
//     { field: 'id', hide: true },
//     { field: 'name', headerName: 'researcher name', minWidth: 150 },
//     { field: 'role', description: 'What is this for', resizable: false },
//     { field: 'author', resizable: false },
//     { field: 'createdAt', resizable: false },
//   ]}
//   rows={formAll}
// />
