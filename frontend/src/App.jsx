import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';

import Menu from 'components/Menu';
import { Paper } from '@mui/material';
import history from 'helpers/history';
import { clearMessage } from 'actions/message';
import Register from './pages/Register';
import Login from './pages/Login';

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen(() => {
      dispatch(clearMessage());
    });
  }, [dispatch]);

  return (
    <Router history={history}>
      <header className='App-header'>
        <Menu currentUser={currentUser} />
      </header>

      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route
          path=''
          render={() => <Paper sx={{ textAlign: 'center' }}>404</Paper>}
        />
      </Switch>
    </Router>
  );
};

export default App;
