import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';
import './Card.css';
import Map from './Map';
import Card from './Card';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ROTATION_CONTEXT } from './ReactConstants'
import { rotateTileAngle } from './utils'

const getListStyle = isDraggingOver => ({
  background: isDraggingOver
    ? 'rgba(173, 216, 230, 0.9)'
    : 'rgba(211, 211, 211, 0.6)',
  padding: 8,
  width: 150,
  display: 'flex',
  overflow: 'visible'
});

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
  };

  onClick = (props) => {
    if (this.isActive()) {
      this
        .props
        .moves
        .submitOrders(this.state.selected, this.props.playerID);
    }
  };

  isActive() {
    if (!this.props.isActive)
      return false;
    return true;
  }

  getList = id => {
    if (id === 'droppable')
      return this.props.G.players[this.props.playerID].hand
    if (id === 'droppable2')
      return this.state.selected
  }

  onDragEnd = result => {
    console.log('onDragEnd', result)
    const { source, destination } = result;

    // dropped outside of list, do nothing
    if (!destination) {
      return;
    }

    const isSourceHand = source.droppableId === 'droppable'
    const isDestHand = destination.droppableId === 'droppable'

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
  };

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

    if (activePlayers === null) activePlayers = {}

    if (!cards) {
      return <p>No cards</p>
    }

    const inHand = cards.filter(card => {
      // cards not in selected
      for (let selectedCard of this.state.selected) {
        if (selectedCard.type === card.type && selectedCard.priority === card.priority)
          return false
      }

      return true
    })

    return (
      <div>
        <ROTATION_CONTEXT.Provider value={this.state.rotation}>
          <div>
            {this.props.ctx.gameover ? <h1>{`Player ${this.props.ctx.gameover.winner.user} has won the game!`}</h1> : null}

            <h3>Cards in Hand</h3>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable" direction="horizontal">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                    {inHand.map((card, index) => (
                      <Draggable
                        isDragDisabled={!(playerID in activePlayers)}
                        key={card.type + card.priority}
                        draggableId={JSON.stringify(card)}
                        index={index}>
                        {(provided, snapshot) => (
                          <Card provided={provided} card={card} />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <h3>Cards to Play</h3>
              <Droppable droppableId="droppable2" direction="horizontal">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                    {this
                      .state
                      .selected
                      .map((card, index) => (
                        <Draggable
                          isDragDisabled={!(playerID in activePlayers)}
                          key={card.type + card.priority}
                          draggableId={JSON.stringify(card)}
                          index={index}>
                          {(provided, snapshot) => (
                            <Card provided={provided} card={card} />
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <button disabled={!(playerID in activePlayers)} onClick={() => this.onClick(this.props)}>Submit Orders</button>
          <button onClick={() => this.rotateBoard(false)}>Rotate Anticlockwise</button>
          <button onClick={() => this.rotateBoard(true)}>Rotate Clockwise</button>
          <Map map={this.props.G.map} robots={this.props.G.robots} />

        </ROTATION_CONTEXT.Provider>
      </div>
    )
  }
}