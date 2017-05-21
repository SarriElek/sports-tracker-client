import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from './Message';
import MessageBox from './MessageBox';
import Rooms from './Rooms';
import * as actions from '../actions/chat';

class Chat extends Component {
  static propTypes = {
    rooms: PropTypes.array.isRequired,
    socket: PropTypes.object.isRequired
  };

  constructor() {
    super(props)

    this.handleSubmit.bind(this);
    this.onChange.bind(this);

  }

  componentDidMount() {
    const { socket, user, dispatch } = this.props;
    socket.emit('post', 'posting!');
    socket.on('news', msg => console.log(msg));
    socket.on('post', msg =>
      dispatch(actions.receiveMessage(msg))
    );
    socket.emit('join', {
      room: 'test'
    });
  }

  handleSubmit(event) {
    const { socket, user, dispatch } = this.props;
    event.preventDefault();
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
    const { socket, user, dispatch } = this.props;
    dispatch(actions.inputChange(event.target.value))
    // console.log(event);
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
