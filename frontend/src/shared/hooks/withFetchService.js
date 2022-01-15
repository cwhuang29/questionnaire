import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import messages from '@constants/messages';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';

const ServiceFetcher = (props) => {
  const { render, fetchService, ...notForHOCProps } = props; // Method 1 (render props)
  // const { Component, fetchService, ...notForHOCProps } = props; // Method 2

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { addGlobalMessage } = useGlobalMessageContext();

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchService())
      .then((resp) => setData(resp.data))
      .catch((resp) => {
        if (!resp || !Object.prototype.hasOwnProperty.call(resp, 'status')) {
          navigate.goBack();
        } else if (resp.status === 401) {
          navigate('/login');
        }

        addGlobalMessage({
          title: resp?.data.errHead || resp?.data.error || messages.UNKNOWN_ERROR,
          content: resp?.data.errBody || messages.SERVER_UNSTABLE,
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const componentProps = { ...notForHOCProps, data, isLoading };
  return render(componentProps); // Method 1 (render props)
  // return <Component {...componentProps} />; // Method 2
};

const render = (Component, props) => <Component {...props} />;

// Method 1 (render props)
const withFetchService =
  (Component, fetchService) =>
  ({ ...props }) =>
    <ServiceFetcher {...props} fetchService={fetchService} render={(_props) => render(Component, _props)} />;

// Method 2
// const withFetchService = (Component, fetchService) => {
//   const hocProps = { Component, fetchService }; // Method 2
//   return ({ ...props }) => <ServiceFetcher {...props} {...hocProps} />;
// };

ServiceFetcher.propTypes = {
  fetchService: PropTypes.func.isRequired,
};

export default withFetchService;
