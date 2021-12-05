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
import Test from 'pages/Test';

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen(() => {
      dispatch(clearMessage());
    });
  }, [dispatch]);

  return (
    <Router history={history}>
      <NavBar user={user} />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/home' component={Home} />
        <Route path='/register' component={Register} />
        <Route path='/login' render={(routeProps) => <Login />} />
        <Route path='/form/:formId' component={Form} />
        <Route path='/test' component={Test} />
        <Route
          path=''
          render={() => <Paper sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2em' }}>Not Found</Paper>}
        />
      </Switch>
    </Router>
  );
};

export default App;
