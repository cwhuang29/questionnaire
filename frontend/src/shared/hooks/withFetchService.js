import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import messages from '@constants/messages';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';

const ServiceFetcher = (props) => {
  const { render, fetchService, ...notForHOCProps } = props; // Method 1 (render props)
  // const { Component, fetchService, ...notForHOCProps } = props; // Method 2

  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({});
  const { addGlobalMessage } = useGlobalMessageContext();

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchService())
      .then((resp) => setData(resp.data))
      .catch((err) => {
        setError(err);
        addGlobalMessage({
          title: err.title || messages.UNKNOWN_ERROR,
          content: err.content || messages.SERVER_UNSTABLE,
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
        });
      })
      .finally(() => setIsLoading(false)); // This leads to another re-render
  }, []);

  const injectedProps = { ...notForHOCProps, data, isLoading, error };
  return render(injectedProps); // Method 1 (render props)
  // return <Component {...injectedProps} />; // Method 2
};

const render = (Component, props) => <Component {...props} />;

// Method 1 (render props)
const withFetchService =
  (Component, fetchService) =>
  ({ ...props }) =>
    <ServiceFetcher {...props} fetchService={fetchService} render={(_props) => render(Component, _props)} />;

// Method 2
// const withFetchService = (Component, fetchService) => {
//   const injectedProps = { Component, fetchService }; // Method 2
//   return ({ ...props }) => <ServiceFetcher {...props} {...injectedProps} />;
// };

ServiceFetcher.propTypes = {
  fetchService: PropTypes.func.isRequired,
};

export default withFetchService;
