import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { updateForm } from '@actions/form';
import msg, { FORM_MESSAGE } from '@constants/messages';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';
import { FORM_OPERATION_TYPE } from '@shared/constants';
import { isAdmin } from '@utils/admin.js';

import FormEdit from './FormEdit';

const FormUpdate = () => {
  const navigate = useNavigate();
  const isAdminUser = isAdmin();
  const { addGlobalMessage } = useGlobalMessageContext();
  const { formId } = useParams();
  const { state: formData } = useLocation();

  const title = '更新問卷';
  const submitAction = (data) => updateForm(formId, data);

  useEffect(() => {
    if (!isAdminUser) {
      addGlobalMessage({
        title: msg.PERMISSION_DENIED,
        severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
        timestamp: Date.now(),
      });
      navigate('/');
    } else if (!formData) {
      // If user enter URL directly instead of redirecting to this page via <Form />, formToBeUpdated will be null
      addGlobalMessage({
        title: FORM_MESSAGE.ACCESS_VIA_LINK,
        severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
        timestamp: Date.now(),
      });
      navigate('/');
    }
  }, []);

  return isAdminUser && formData ? <FormEdit title={title} operationType={FORM_OPERATION_TYPE.UPDATE} submitAction={submitAction} formData={formData} /> : null;
};

export default FormUpdate;