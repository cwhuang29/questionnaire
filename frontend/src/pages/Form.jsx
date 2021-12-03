import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import apis from 'shared/constant/apis';
import history from 'helpers/history';
import ROLES from 'shared/constant/roles';
import { getFormById } from 'actions/form';
import LoadingNotification from 'components/LoadingNotification';

const Form = () => {
  const [form, setForm] = React.useState(null);
  const [isShow, setIsShow] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const { formId } = useParams();

  React.useEffect(() => {
    setIsShow(true);
    dispatch(getFormById(formId))
      .then(data => setForm(data.data))
      .catch(resp => {
        if (resp && Object.prototype.hasOwnProperty.call(resp, 'status') && resp.status === 401) {
          history.goBack();
        }
        setErrorMessage(`(${resp.statusText}) ${resp.data.error}`); // TODO Show error
      })
      .finally(() => setIsShow(false));
  }, [formId]);

  return (
    <>
      <LoadingNotification msg='Fetching data ...' isShow={isShow} />
      <h1>{JSON.stringify(form)}</h1>
    </>
  );
};

export default Form;
