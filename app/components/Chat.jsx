import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from './Message';
import MessageBox from './MessageBox';
import Rooms from './Rooms';

class Chat extends Component {
  static propTypes = {
    rooms: PropTypes.array.isRequired,
    socket: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { socket, user, dispatch } = this.props;
    socket.emit('chat mounted', user);
    socket.on('new message', msg =>
      dispatch(actions.receiveMessage(msg))
    );
  }

  render() {
    const messages = this.props.rooms[this.props.active].messages;
    return (
      <div>
        <Rooms />
        <div className="message-list">
          <ul>
            { messages.map(message =>
              <Message message={ message } />
            )}
          </ul>
        </div>
        <MessageBox />
      </div>
    );
  }
}

export default Chat;
