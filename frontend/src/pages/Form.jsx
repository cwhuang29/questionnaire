import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Proptypes from 'prop-types';

const Greeting = ({ greeting, isShow }) => isShow ? <h1>{greeting}</h1> : null;

const Form = () => {
  const [form, setForm] = React.useState({title: 'form01', 'description': 'gogogo'});
  const { formId } = useParams();

  const [greeting, setGreeting] = useState('Hello');
  const [isShowGreeting, setShowGreeting] = useState(true);

  const changeGreeting = () => setShowGreeting(!isShowGreeting);

  React.useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${formId}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [formId]);

  // if (!form) return null;

  return (
    <>
      <Greeting greeting={greeting} isShow={isShowGreeting} />
      <button onClick={changeGreeting} type="button">
        Toggle Show
      </button>
      <h1>{form.title}</h1>
      <p>{form.description}</p>
    </>
  );
};

Greeting.defaultProps = {
  greeting: 'HELLO !!!',
  isShow: true
}

Greeting.propTypes = {
  greeting: Proptypes.string,
  isShow: Proptypes.bool
}

export default Form;
