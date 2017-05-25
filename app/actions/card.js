var moment = require('moment-timezone');

const BASEBALL = 'MLB';
const BASKETBALL = 'NBA';
const AMERICAN_FOOTBALL = 'NFL';
const HOCKEY = 'NHL';


export const receiveCard = (data) => ({
  type: 'ADD_CARD',
  game: {
    gameId: Number(data.id),
    league: data.league,
    display: 'BASIC',
    homeTeam: data.homeTeam,
    awayTeam: data.awayTeam,
    homeScore: data.homeScore,
    awayScore: data.awayScore,
    quarter: 0,
    timeRemaining: 0,
    date: data.date,
    plays: []
  }
})

export const getStartingTime = (game) => {
  const date = game.date;
  const time = game.time;
  const city = game.city;
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&sensor=false&key=AIzaSyC6iNRXGotnvA3S6qis6b6jbhtYkkRnCjQ`)
  .then(response => response.json())
  .then(json => {
    const result = json.results[0];
    const latitude = result.geometry.location.lat;
    const longitude = result.geometry.location.lng;
    const location = `${latitude},${longitude}`;
    return fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${location}&timestamp=1331161200&sensor=false&key=AIzaSyC6iNRXGotnvA3S6qis6b6jbhtYkkRnCjQ`)
    .then(response => response.json())
    .then(json => {
      const timezone = json.timeZoneId;
      const startTime = moment.tz(`${date} ${time}`, "YYYY-MM-DD hh:mmA", timezone);
      return startTime.local();
    })
  });
}

export const fetchCardInfo = (game) => (dispatch) =>  {
  getStartingTime(game)
    .then(response  =>  {
      const game_starting_time = response;
        if(game_starting_time.isBefore(moment())){
          const date = game.date.replace(/-/g , '');
          return fetch(`https://www.mysportsfeeds.com/api/feed/pull/${game.league}/latest/game_boxscore.json?gameid=${game.gameId}`, {
             method: 'get',
             headers: {
               'Authorization': 'Basic '+btoa('sportsTracker:sportsTracker'),
               'Accept': 'application/json',
               'Content-Type': 'application/json'
             }
           })
          .then(response => response.json())
          .then(json => {
            const data = {
              id: game.gameId,
              league: game.league,
              display: 'BASIC',
              homeTeam: game.homeTeam,
              awayTeam: game.awayTeam,
              date: game.date,
              plays: []
            }
            switch (game.league){
              case BASEBALL:
                data.homeScore = Number(json.gameboxscore.inningSummary.inningTotals.homeScore);
                data.awayScore = Number(json.gameboxscore.inningSummary.inningTotals.awayScore);
                dispatch(receiveCard(data))
                break;
              case BASKETBALL:
                data.homeScore = Number(json.gameboxscore.quarterSummary.quarterTotals.homeScore);
                data.awayScore = Number(json.gameboxscore.quarterSummary.quarterTotals.awayScore);
                dispatch(receiveCard(data))
                break;
              case HOCKEY:
                data.homeScore = Number(json.gameboxscore.periodSummary.periodTotals.homeScore);
                data.awayScore = Number(json.gameboxscore.periodSummary.periodTotals.awayScore);
                dispatch(receiveCard(data))
                break;
              default:
                break;
            }
          })
        } else {
          const data = {
            id: game.gameId,
            league: game.league,
            display: 'BASIC',
            homeTeam: game.homeTeam,
            awayTeam: game.awayTeam,
            homeScore: 0,
            awayScore: 0,
            date: game.date,
            plays: []
          }
          switch(game.league){
            case BASEBALL:
                data.inning = 0;
                break;
              case BASKETBALL:
                data.quarter = 0;
                break;
              case HOCKEY:
                data.period = 0;
                break;
              default:
                break;
          }
          dispatch(receiveCard(data))
        }
    });
}