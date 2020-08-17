import React from 'react'
import PropTypes from 'prop-types'
import './Board.css'
import './Card.css'
import Map from './Map'
import CardHand from './CardHand'
import { DragDropContext } from 'react-beautiful-dnd'
import { ROTATION_CONTEXT } from './ReactConstants'
import { rotateTileAngle } from '../utils'

export class RobotFightBoard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: [this.props.G.players[this.props.playerID].hand[0]],
      rotation: 'SE'
    }
  }

  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isMultiplayer: PropTypes.bool
  }

  onClick = (props) => {
    if (this.isActive()) {
      this
        .props
        .moves
        .submitOrders(this.state.selected, this.props.playerID);
    }
  }

  isActive() {
    if (!this.props.isActive)
      return false;
    return true;
  }

  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside of list, do nothing
    if (!destination) {
      return;
    }

    const isSourceHand = source.droppableId === 'in_hand'
    const isDestHand = destination.droppableId === 'in_hand'

    if (isSourceHand && isDestHand) {
      return
    }

    let newSelected = [...this.state.selected]

    if (isSourceHand && !isDestHand) {
      newSelected.splice(destination.index, 0, JSON.parse(result.draggableId))
    }

    if (!isSourceHand && isDestHand) {
      newSelected.splice(source.index, 1)
    }

    if (!isSourceHand && !isDestHand) {
      newSelected.splice(source.index, 1)
      newSelected.splice(destination.index, 0, JSON.parse(result.draggableId))
    }

    this.setState({ selected: newSelected })
  }

  onCardClick = (e, card) => {
    this.setState({ selected: this.state.selected.concat([card]) })
  }

  rotateBoard(clockwise) {
    const rotation = rotateTileAngle(this.state.rotation, clockwise ? 1 : 3)

    this.setState({
      rotation
    })
  }

  render() {
    console.log(this.props)

    const { playerID, ctx } = this.props
    let { activePlayers } = ctx
    const cards = this.props.G.players[playerID].hand
    const playerRobot = this.props.G.robots[playerID]

    if (activePlayers === null) activePlayers = {}

    if (!cards) {
      return <p>No cards</p>
    }

    const inHand = cards.filter(card =>
      !this.state.selected.some(selected =>
        selected.type === card.type && selected.priority === card.priority
      )
    )

    return (
      <div>
        <ROTATION_CONTEXT.Provider value={this.state.rotation}>
          <span style={{ position: 'fixed', zIndex: 25 }}>
            {this.props.ctx.gameover ? <h1 style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>{`Player ${this.props.ctx.gameover.winner.user} has won the game!`}</h1> : null}

            <DragDropContext onDragEnd={this.onDragEnd}>
              <CardHand
                cards={inHand}
                id='in_hand'
                isActive={playerID in activePlayers}
                onClick={this.onCardClick}
                style={{
                  position: 'fixed',
                  top: '0px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              />

              <div style={{
                position: 'fixed',
                bottom: '0px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}>
                <div style={{
                  float: 'left'
                }}>
                  <CardHand
                    cards={this.state.selected}
                    id='to_play'
                    isActive={playerID in activePlayers}
                  />
                </div>

                <div style={{
                  float: 'left'
                }}>
                  <button style={{ display: 'block' }} disabled={!(playerID in activePlayers)} onClick={() => this.onClick(this.props)}>Submit Orders</button>
                  <button style={{ display: 'block' }} onClick={() => this.rotateBoard(false)}>Rotate Anticlockwise</button>
                  <button style={{ display: 'block' }} onClick={() => this.rotateBoard(true)}>Rotate Clockwise</button>
                </div>
              </div>
            </DragDropContext>

          </span>
          <Map map={this.props.G.map} robots={this.props.G.robots} playerRobot={playerRobot} />

        </ROTATION_CONTEXT.Provider>
      </div>
    )
  }
}