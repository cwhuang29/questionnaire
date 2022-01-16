import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getFormById } from '@actions/form';
import withFetchService from '@shared/hooks/withFetchService';

import { CreateForm } from './CreateForm';

const getFormByIdForComponent = (formId) => () => getFormById(formId);

const FormView = (props) => {
  const { data: form, isLoading } = props;

  return (
    <div>
      <h1>{JSON.stringify(props)}</h1>
      <h1>{JSON.stringify(form)}</h1>
      <div>{isLoading ? 'true' : 'false'} !!!!!!!!!!</div>
    </div>
  );
};

FormView.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const Form = () => {
  const { formId } = useParams();
  const FormWithData = withFetchService(FormView, getFormByIdForComponent(formId));
  return <FormWithData />;
};

export { CreateForm, Form as default };
