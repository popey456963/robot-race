import React from 'react'
import Button from './Button'
// import './GameBoard.css'
import Map from './NewMap'
import { InHandDeck } from './InHandDeck'
import { Registers } from './Registers'
import Gameover from './Gameover'
import Death from './Death'
import { DragDropContext } from 'react-beautiful-dnd'
import { CLOCKWISE, ANTICLOCKWISE } from '../Constants'

const SubmitOrders = props => (
    <Button style={{ display: 'block' }} disabled={props.disabled} onClick={props.onClick} text='Submit Orders' />
)

const RotateViewClockwise = props => (
    <Button style={{ display: 'block' }} onClick={props.onClick} text='Rotate Clockwise' />
)

const RotateViewAnticlockwise = props => (
    <Button style={{ display: 'block' }} onClick={props.onClick} text='Rotate Anticlockwise' />
)

export class GameBoard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    onMoveCardDragEnd = result => {
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
        
        if (isSourceHand && !isDestHand) {
            return this.props.addCardToRegister(JSON.parse(result.draggableId), destination.index)
        }
    
        if (!isSourceHand && isDestHand) {
            return this.props.removeCardFromRegister(source.index)
        }
    
        if (!isSourceHand && !isDestHand) {
            this.props.removeCardFromRegister(source.index)
            return this.props.addCardToRegister(JSON.parse(result.draggableId), destination.index)
        }
    }

    onHandCardClick = (e, card) => {
        this.props.addCardToRegister(card, this.props.cardsInRegisters.length)
    }

    onRegisterCardClick = (e, card) => {
        this.props.removeCardFromRegister(card.index)
    }

    submitOrders = () => {
        this.props.submitOrders()
    }

    render() {
        const { currentPlayer, isPlayerActive, playerRobot, cardsInHand, cardsInRegisters, gameover } = this.props
        const { map, robots } = this.props
        const { rotateBoard } = this.props

        return (
            <span className="ui">
                <Gameover playerRobot={playerRobot} gameover={gameover} />
                <Death playerRobot={playerRobot}/>
                <DragDropContext onDragEnd={this.onMoveCardDragEnd}>
                    <InHandDeck
                        cards={cardsInHand}
                        isPlayerActive={isPlayerActive}
                        onCardClick={this.onHandCardClick}
                    />

                    <div className="fixed bottom center" style={{ zIndex: 50 }}>
                        <div className="floatLeft">
                            <Registers
                                cards={cardsInRegisters}
                                isPlayerActive={isPlayerActive}
                                onCardClick={this.onRegisterCardClick}
                            />
                        </div>

                        <div className="floatLeft">
                            <SubmitOrders disabled={!isPlayerActive} onClick={this.submitOrders} />
                            <RotateViewClockwise onClick={() => rotateBoard(CLOCKWISE)} />
                            <RotateViewAnticlockwise onClick={() => rotateBoard(ANTICLOCKWISE)} />
                        </div>
                    </div>
                </DragDropContext>

                <Map
                    map={map}
                />
            </span>
        )
    }
}