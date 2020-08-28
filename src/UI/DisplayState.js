import React from 'react'
import PropTypes from 'prop-types'
import { GameBoard } from './GameBoard'
import { NE, CLOCKWISE } from '../Constants'
import { ROTATION_CONTEXT } from './ReactConstants'
import { rotateMatrix } from '../utils'
import cloneDeep from 'clone-deep'
import { rotateAngleClockwise, getAngleIndex, rotateCoordinatesClockwise } from '../Position'
import { getDisplayMap } from '../Map'

import './Button.css'
import './Card.css'
import './GameBoard.css'
import './index.css'
import './MapEditor.css'
import './Cell.css'
import './Tooltips.css'

export class DisplayState extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            rotation: NE,
            registers: []
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

    rotateBoard(direction) {
        const rotationAmount = direction === CLOCKWISE ? 1 : 3

        this.setState({
            rotation: rotateAngleClockwise(this.state.rotation, rotationAmount)
        })
    }

    addCardToRegister(card, position) {
        console.log('addCardToRegister', card, position)
        let registers = [...this.state.registers]
        registers.splice(position, 0, card)
        registers = registers.map((register, index) => ({ ...register, index }))
    
        if (registers.length > 5) {
            if (position === 5) {
                // pop the penultimate entry
                registers.splice(4, 1)
            } else {
                // pop the last entry
                registers.splice(5, 1)
            }
        }

        this.setState({ registers })
    }

    removeCardFromRegister(position) {
        let registers = [...this.state.registers]
        registers.splice(position, 1)
        registers = registers.map((register, index) => ({ ...register, index }))
        this.setState({ registers })
    }

    submitOrders() {
        if (this.props.isActive) {
            this.props.moves.submitOrders(this.state.registers, this.props.playerID)
        } else {
            alert('not your turn to submit orders')
        }
    }

    render() {
        const { G, ctx, playerID } = this.props
        const activePlayers = ctx.activePlayers || {}
        const rotationAmount = getAngleIndex(this.state.rotation)
        const mapSize = { y: G.map.length, x: G.map[0].length }


        /* rotate map */
        let displayMap = cloneDeep(G.map)

        for (let i = 0; i < rotationAmount; i++) {
            displayMap = rotateMatrix(displayMap)
        }

        for (let rowIndex in displayMap) {
            for (let tileIndex in displayMap[rowIndex]) {
                const tile = displayMap[rowIndex][tileIndex]

                tile.position = rotateCoordinatesClockwise(tile.position, mapSize, rotationAmount)
            }
        }

        /* rotate robots */
        const displayRobots = cloneDeep(G.robots)
        for (let robotId in displayRobots) {
            const robot = displayRobots[robotId]
            robot.position = rotateCoordinatesClockwise(robot.position, mapSize, rotationAmount)
            robot.checkpoint = rotateCoordinatesClockwise(robot.checkpoint, mapSize, rotationAmount)
        }

        displayMap = getDisplayMap(displayMap, displayRobots, playerID, this.state.rotation)

        const isPlayerActive = playerID in activePlayers
        const cardsInHand = G.players[playerID].hand
            .filter(card =>
                !this.state.registers.some(register =>
                    register.type === card.type && register.priority === card.priority
                )
            )

        return (
            <ROTATION_CONTEXT.Provider value={this.state.rotation}>
                <GameBoard
                    currentPlayer={playerID}
                    isPlayerActive={isPlayerActive}
                    playerRobot={displayRobots[playerID]}
                    cardsInHand={cardsInHand}
                    cardsInRegisters={this.state.registers}

                    map={displayMap}
                    robots={displayRobots}

                    rotateBoard={this.rotateBoard.bind(this)}
                    addCardToRegister={this.addCardToRegister.bind(this)}
                    removeCardFromRegister={this.removeCardFromRegister.bind(this)}
                    submitOrders={this.submitOrders.bind(this)}
                />
            </ROTATION_CONTEXT.Provider>
        )
    }
}