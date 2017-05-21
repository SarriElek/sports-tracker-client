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
    socket.on('news', msg => console.log(msg));
    socket.on('post', msg =>
      dispatch(actions.receiveMessage(msg))
    );
    socket.emit('join', {
      room: 'test'
    });
  }

  handleSubmit(event) {
    const message = {
      room: 'test',
      message: {
        user: 'Jeff',
        content: event.data
      }
    }
    socket.emit('post', message);
  }

  onChange(event) {
    console.log(event);
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
        <MessageBox
          input={ this.props.input }
          onChange={ this.onChange }
          handleSubmit={ this.handleSubmit }
        />
      </div>
    );
  }
}

export default Chat;
