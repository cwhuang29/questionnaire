import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import { Paper } from '@mui/material';
import history from 'helpers/history';
import { clearMessage } from 'actions/message';
import Register from 'pages/Register';
import Login from 'pages/Login';
import Home from 'pages/Home';
import NavBar from 'pages/NavBar';
import Form from 'pages/Form';

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
      <NavBar currentUser={currentUser} />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route path='/form/:formId' component={Form} />
        <Route
          path='*'
          render={() => <Paper sx={{ textAlign: 'center' }}>404</Paper>}
        />
      </Switch>
    </Router>
  );
};

export default App;
