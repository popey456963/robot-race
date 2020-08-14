import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { RobotFight } from "./Game";
import { RobotFightBoard } from "./Board";
import logger from 'redux-logger';
import { applyMiddleware, compose } from 'redux';
import { Lobby } from 'boardgame.io/react';

const RobotFightClient = Client({
  game: RobotFight,
  board: RobotFightBoard,
  debug: true,
  multiplayer: SocketIO({ server: "localhost:8000" }),
  enhancer: compose(
    applyMiddleware(logger),
    (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  )
});

class App extends React.Component {
  state = { debug: true };

  render() {
    if (this.state.debug) {
      return (
        <div>
          <RobotFightClient playerID="0" />
        </div>
      )
    }

    return (
      <Lobby
        gameServer={`http://${window.location.hostname}:8000`}
        lobbyServer={`http://${window.location.hostname}:8000`}
        gameComponents={[{
          game: RobotFight,
          board: RobotFightBoard
        }]}
      />
    )

    // if (this.state.playerID === null) {
    //   return (
    //     <div>
    //       <p>Play as</p>
    //       <button onClick={() => this.setState({ playerID: "0" })}>
    //         Player 0
    //       </button>
    //       <button onClick={() => this.setState({ playerID: "1" })}>
    //         Player 1
    //       </button>
    //     </div>
    //   );
    // }
    // return (
    //   <div>
    //     <RobotFightClient playerID={this.state.playerID} />
    //   </div>
    // );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
