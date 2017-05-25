const defaultState = {
  allCards: []
};

function cards(state = defaultState, action) {
  switch (action.type) {
    case 'ADD_CARD':
      if (state.find(card => card.gameId === action.game.gameId)) {
        return [...state];
      }
      return  [...state, action.game];
    default:
      return state;
  }
}

export default cards;
