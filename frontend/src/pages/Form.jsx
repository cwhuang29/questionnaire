import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Proptypes from 'prop-types';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

const Link = ({ className, children }) => (
  <a id={className} href='http://test.com' className={className}>
    {children}
  </a>
);

Link.defaultProps = {
  className: 'HELLO !!!',
  children: {},
};

Link.propTypes = {
  className: Proptypes.string,
  children: Proptypes.object,
};

const StyledLink = styled(Link)`
  color: palevioletred;
  font-weight: bold;
`;

const Greeting = ({ greeting, isShow }) =>
  isShow ? <h1>{greeting}</h1> : null;

const Form = () => {
  const [form, setForm] = React.useState({
    title: 'form01',
    description: 'gogogo',
  });
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
      <Wrapper>
        <Title>Hello !!!!</Title>
      </Wrapper>
      <StyledLink>Styled, exciting Link</StyledLink>

      <Greeting greeting={greeting} isShow={isShowGreeting} />
      <button onClick={changeGreeting} type='button'>
        Toggle Show
      </button>
      <h1>{form.title}</h1>
      <p>{form.description}</p>
    </>
  );
};

Greeting.defaultProps = {
  greeting: 'HELLO !!!',
  isShow: true,
};

Greeting.propTypes = {
  greeting: Proptypes.string,
  isShow: Proptypes.bool,
};

export default Form;
