import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import { Paper } from '@mui/material';
import history from 'helpers/history';
import Register from 'pages/Register';
import Login from 'pages/Login';
import Scenario from 'pages/Scenario';
import Home from 'pages/Home';
import NavBar from 'pages/NavBar';
import Form from 'pages/Form';
import Test from 'pages/Test';
import useGlobalMessageContext from 'hooks/useGlobalMessageContext';

const App = () => {
  const { user } = useSelector((state) => state.auth); // Change user to isLoggedIn
  const { clearAllGlobalMessages } = useGlobalMessageContext();

  useEffect(() => {
    history.listen((location) => {
      clearAllGlobalMessages();
    });
  }, []);

  return (
    <Router history={history}>
      <NavBar user={user} />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/home' component={Home} />
        <Route path='/register' component={Register} />
        <Route path='/login' render={(routeProps) => <Login />} />
        <Route path='/scenarios/:scenario' render={(routeProps) => <Scenario />} />
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
