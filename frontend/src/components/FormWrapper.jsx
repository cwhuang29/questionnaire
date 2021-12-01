import React from 'react';
import { Box } from '@mui/material';

import FormList from 'components/FormList';

const FormWrapper = () =>  {
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

    await dispatch(login(values))
      .then(() => history.push('/'))
      .catch((error) => {
        setLoading(false);
        setErrorMessage(JSON.stringify(error));
      });

  return (
    <Box component='form' sx={{ mt: 20 }}>
      This is form wrapper
    </Box>
  );
};

export default FormWrapper;
