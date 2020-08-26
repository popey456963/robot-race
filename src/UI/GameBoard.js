import React from 'react'
import Button from './Button'
import './GameBoard.css'
import Map from './NewMap'
import { InHandDeck } from './InHandDeck'
import { Registers } from './Registers'
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

    onMoveCardDragEnd() {

    }

    onHandCardClick() {

    }

    onRegisterCardClick() {

    }

    submitOrders() {

    }

    render() {
        const { currentPlayer, isPlayerActive, playerRobot, cardsInHand, cardsInRegisters } = this.props
        const { map, robots } = this.props
        const { rotateBoard, addCardToRegister } = this.props

        return (
            <span className="ui">
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
                            <SubmitOrders disabled={isPlayerActive} onClick={this.submitOrders} />
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