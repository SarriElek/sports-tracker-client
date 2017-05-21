import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ message }) => (
  <li>
    { message.content }
  </li>
);

Message.propTypes = {
  message: PropTypes.object.isRequired
};

export default Message;
