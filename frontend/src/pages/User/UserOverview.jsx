import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import DataGrid from '@components/DataGrid';
import PageWrapper from '@components/HomePageWrapper';
import Spacing from '@components/Styling/Spacing';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';
import { GLOBAL_MESSAGE_SERVERITY } from '@shared/constants/styles';
import withFetchService from '@shared/hooks/withFetchService';
import userService from '@shared/services/user.service';

import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, Typography } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';

import { usersOverviewBaseColumns } from './userData';

const getUserOverview = () => userService.getAllUsers();

const getRowId = row => `${row.email}`;

const UserOverViewView = props => {
  const { data, error, isLoading } = props;
  const [userData, setUserData] = useState(); // Note: useState(data.data) is {} since props is feed by withFetchService, and the initial value is {}
  const { addGlobalMessage } = useGlobalMessageContext();

  /*
   * You can update the state right during rendering. React will re-run the component with updated state immediately after exiting the first render so it wouldn’t be expensive
   * An update during rendering is exactly what getDerivedStateFromProps has always been like conceptually.
   * In essence, we can optimize performance by getting rid of an additional browser repaint phase, as useEffect always runs after the render is committed to the screen
   * https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
   * https://stackoverflow.com/questions/54625831/how-to-sync-props-to-state-using-react-hooks-setstate
   */
  if (data?.data !== undefined && userData === undefined) {
    setUserData(data.data);
  }

  const deleteUserStatus = params => () => {
    // Note: the index of data has been set to "email" by getRowId(), so the following two lines are equivalent
    const { id } = params;
    const { email } = params.row;

    userService
      .deleteUser({ email })
      .then(resp => {
        addGlobalMessage({
          title: resp.title,
          content: resp.content,
          severity: GLOBAL_MESSAGE_SERVERITY.SUCCESS,
          timestamp: Date.now(),
        });
        const remainRows = userData.filter(d => d.email !== id);
        setUserData(remainRows);
      })
      .catch(err => {
        addGlobalMessage({
          title: err.title,
          content: err.content,
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
        });
      });
  };

  const usersOverviewActionColumn = useMemo(
    () => ({
      field: 'actions',
      headerName: 'Delete',
      type: 'actions',
      align: 'center',
      width: 80,
      getActions: params => [<GridActionsCellItem icon={<DeleteIcon />} label='delete' onClick={deleteUserStatus(params)} />],
    }),
    [userData]
  );

  const usersOverviewColumns = [...usersOverviewBaseColumns, usersOverviewActionColumn];

  return (
    <PageWrapper>
      {Object.keys(error).length === 0 && (
        <>
          <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', margin: ' 0.3em 0 0.8em' }}>
            使用者一覽
          </Typography>

          <Alert severity={GLOBAL_MESSAGE_SERVERITY.WARNING}>
            <div style={{ fontSize: '1rem' }}>僅有已註冊的用戶才會顯示</div>
          </Alert>
          <Spacing />

          <DataGrid autoHeight isLoading={isLoading} columns={usersOverviewColumns} rows={userData} getRowId={getRowId} />
          <Spacing />
        </>
      )}
    </PageWrapper>
  );
};

const UserOverview = React.memo(() => {
  const UserOverviewWithData = withFetchService(UserOverViewView, getUserOverview, false);
  return <UserOverviewWithData />;
});

UserOverViewView.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default UserOverview;
