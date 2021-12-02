import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Grid } from '@mui/material';

import { getAllForms } from 'actions/form';
import { TitleText } from 'components/styledComponents';

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
        if (resp?.status === 401) {
          history.push('/login');
        }
        setErrorMessage(`(${resp.statusText}) ${resp.data.error}`); // TODO Show error
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <Grid container spacing={3}>
        {loading ? <div>Fetching data ...</div> : null}

        <TitleText width='400px' height='35px' lineHeight='1.5' fontSize='18px'>
          This is title
        </TitleText>

        {formAll.map(form => (
          <Grid item xs={12} key={form.id}>
            {form.role}
            <Button variant='text' onClick={() => history.push('/login')}>
              {form.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default FormWrapper;

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
