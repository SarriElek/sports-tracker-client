import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CardBox from '../components/cards/CardBox';
import { joinRoom, leaveRoom, postJoinRoom } from '../actions/chat';
import { togglePlayByPlay, removeCard, repositionCard } from '../actions/cards';
import { socketAction } from '../middlewares/websocket';
import api from '../lib/api';
import { receiveCard } from '../actions/card';

class Dashboard extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const HOST = location.origin.replace('8081', '8080');
    const { dispatch } = this.props;
    api.get('${HOST}/leagues/mlb/users/34').then((response) => {
      response.response.forEach(card => {
        api.post(`${HOST}/leagues/${card.league}/games/${card.gameId}`, card).then((response) => {
          dispatch(receiveCard(response.response));
        });
      })
    });
  }

  render() {
    return (
      <CardBox { ...this.props } />
    )}
};

const mapStateToProps = state => ({
  allCards: state.cards,
  socket: state.chat.socket,
  chatActive: state.chat.active !== 0
});

const mapDispatchToProps = dispatch => ({
  joinRoom,
  leaveRoom,
  togglePlayByPlay,
  removeCard,
  repositionCard,
  dispatch,
  postJoinRoom: socketAction(postJoinRoom)
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
