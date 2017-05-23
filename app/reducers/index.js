import { combineReducers } from 'redux';
import chat from './chat';
import user from './user';
import sidebar from './side_bar';

const sportsApp = combineReducers({
  user,
  chat,
  sidebar
});

export default sportsApp;
