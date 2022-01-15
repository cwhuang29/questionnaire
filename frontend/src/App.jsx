import React, { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

import Menu from '@components/Menu';
import Home from '@home';
import useAuth from '@hooks/useAuth';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';
import Ecosystem from '@pages/Ecosystem';
import Form from '@pages/Form';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Test from '@pages/Test';

const NoMatch = () => (
  <div>
    <h2>Nothing to see here!</h2>
    <p>
      <Link to='/'>Go to the home page</Link>
    </p>
  </div>
);

const App = () => {
  const { pathname } = useLocation(); // URL http://127.0.0.1:3000/?a=123#ok returns {pathname: '/', search: '?a=123', hash: '#ok' ...}
  const auth = useAuth();
  const { clearAllGlobalMessages } = useGlobalMessageContext();

  useEffect(() => {
    // clearAllGlobalMessage]();
    window.scrollTo(0, 0);
  }, [clearAllGlobalMessages, pathname]);

  return (
    <>
      <Menu auth={auth} />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/ecosystem'>
          <Route path='' element={<Ecosystem />} />
          <Route path=':ecosystem' element={<Ecosystem />} />
        </Route>
        <Route path='/form/:formId' element={<Form />} />
        <Route path='/test'>
          <Route path='' element={<Test />} />
          <Route path=':testId' element={<Test />} />
          <Route path=':testId/:test02Id' element={<Test />} />
        </Route>
        <Route path='*' element={<NoMatch />} />
      </Routes>
    </>
  );
};

// https://reactrouter.com/docs/en/v6/upgrading/v5
// React router v5
// <Route path='/home' component={Home} />
// React router v6
// <Route path='/home' element={<Home />} />
// React router v5
// useEffect(() => {
//   const unlisten = history.listen((location) => {
//     clearAllGlobalMessages();
//   });
//   return () => {
//     if (unlisten) unlisten;
//   };
// }, []);
// React router v6
// <Route path=":userId" element={<Profile animate={true} />} />
// function Profile({ animate }) { let params = useParams(); let location = useLocation(); }
// React router is not supporting optinal parameter such as "path='/page/:friendlyName/:sort?'" in v6

export default App;
