import React from 'react';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';

import PageWrapper from '@components/HomePageWrapper';
import formService from '@services/form.service';
import withFetchService from '@shared/hooks/withFetchService';

const FormAnswerLayoutView = (props) => {
  const { data, error, isLoading } = props;
  const { data: formData = {} } = data;

  console.log(formData, '!!!!!!!!!!!!!!!');

  return (
    <PageWrapper>
      {Object.keys(error).length === 0 && !isLoading ? (
        <>
          <div />
        </>
      ) : (
        <h3>Hold on a second ... </h3>
      )}
    </PageWrapper>
  );
};

const getAnswerFormForComponent = (formId) => () => formService.getAnswerForm(formId);

const FormAnswerLayout = React.memo(() => {
  const { formId } = useParams();
  const FormAnswerWithData = withFetchService(FormAnswerLayoutView, getAnswerFormForComponent(formId), false);
  return <FormAnswerWithData />;
});

FormAnswerLayoutView.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default FormAnswerLayout;
