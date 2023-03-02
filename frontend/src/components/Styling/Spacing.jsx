import React from 'react';
import Proptypes from 'prop-types';

const Spacing = ({ scale }) => <div style={{ marginBottom: scale }} />;

Spacing.defaultProps = {
  scale: '3em',
};

Spacing.propTypes = {
  scale: Proptypes.string,
};

export default Spacing;
