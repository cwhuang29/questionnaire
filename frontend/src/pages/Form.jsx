import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import history from 'helpers/history';
import { getFormById } from 'actions/form';
import messages from 'shared/constant/messages';
import useGlobalMessageContext from 'hooks/useGlobalMessageContext';
import { GLOBAL_MESSAGE_SERVERITY } from 'shared/constant/styles';

const Form = () => {
  const [form, setForm] = React.useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { formId } = useParams();
  const { addGlobalMessage } = useGlobalMessageContext();

  React.useEffect(() => {
    setIsLoading(true);
    dispatch(getFormById(formId))
      .then((data) => setForm(data.data))
      .catch((resp) => {
        if (!resp || !Object.prototype.hasOwnProperty.call(resp, 'status')) {
          history.goBack();
        } else if (resp.status === 401) {
          history.push('/login');
        }

        addGlobalMessage({
          title: resp?.data.errHead || resp?.data.error || messages.UNKNOWN_ERROR,
          content: resp?.data.errBody || messages.SERVER_UNSTABLE,
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
        });
      })
      .finally(() => setIsLoading(false));
  }, [formId]);

  return (
    <>
      <h1>{JSON.stringify(form)}</h1>
      <div>{isLoading}</div>
    </>
  );
};

export default Form;
