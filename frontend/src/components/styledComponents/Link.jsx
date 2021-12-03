import styled from 'styled-components';
import React from 'react';
import Proptypes from 'prop-types';

const Link = ({ href, className, children }) => (
  <a id={className} href={href} className={className}>
    {children}
  </a>
);

export const StyledLink = styled(Link)`
  color: palevioletred;
  font-weight: bold;
`;

Link.defaultProps = {
  href: '',
  className: '',
  children: {},
};

Link.propTypes = {
  href: Proptypes.string,
  className: Proptypes.string,
  children: Proptypes.object,
};
