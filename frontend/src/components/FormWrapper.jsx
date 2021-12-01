import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Grid } from '@mui/material';

import { getAllForm } from 'actions/form';

const FormWrapper = () => {
  const [formAll, setFormAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllForm())
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
    <Grid container spacing={3}>
      {loading ? <div>Fetching data ...</div> : null}

      {formAll.map(form => (
        <Grid item xs={12} key={form.id}>
          {form.role}
          <Button variant='text' onClick={() => history.push('/login')}>
            {form.name}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default FormWrapper;
