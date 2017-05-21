import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import Chat from '../components/Chat';

const socket = io.connect('http://localhost:8080');

class ChatBar extends React.Component {

  componentDidMount() {
    // something
  }

  render() {
    return (
      <Chat { ...this.props } socket={ socket } />
    );
  }
}

function mapStateToProps(state) {
  return {
    rooms: state.chat.rooms,
    active: state.chat.active
  };
}

export default connect(mapStateToProps)(ChatBar);
