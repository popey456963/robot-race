import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';
import Map from './Map';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging
    ? 'lightgreen'
    : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver
    ? 'lightblue'
    : 'lightgrey',
  padding: grid,
  width: 250
});

export class TicTacToeBoard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: []
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
        .submitOrders();
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
    const {source, destination} = result;

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

  render() {
    console.log(this.props)

    const {playerID} = this.props
    const cards = this.props.G.players[playerID].hand

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
        <Map map={this.props.G.map} robots={this.props.G.robots} />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {inHand.map((card, index) => (
                  <Draggable
                    key={card.type + card.priority}
                    draggableId={JSON.stringify(card)}
                    index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                        {card.type + card.priority}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="droppable2">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {this
                  .state
                  .selected
                  .map((card, index) => (
                    <Draggable
                      key={card.type + card.priority}
                      draggableId={JSON.stringify(card)}
                      index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                          {card.type + card.priority}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button onClick={() => this.onClick(this.props)}>Click me</button>
      </div>
    )
  }
}