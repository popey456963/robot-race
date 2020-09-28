import React from 'react'
import PropTypes from 'prop-types'
import { GameBoard } from './GameBoard'
import { NE, CLOCKWISE, ROBOT_MOVE, ROBOT_TURN, ROBOT_CHECKPOINT, ROBOT_HEALTH, ROBOT_DEATH } from '../Constants'
import { ROTATION_CONTEXT } from './ReactConstants'
import { rotateMatrix } from '../utils'
import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'
import { rotateAngleClockwise, getAngleIndex, rotateCoordinatesClockwise } from '../Position'
import { getDisplayMap } from '../Map'

import './Button.css'
import './Card.css'
import './GameBoard.css'
import './index.css'
import './MapEditor.css'
import './Cell.css'
import './Tooltips.css'
import { enactRobotCheckpointEvent, enactRobotHealthEvent, enactRobotMoveEvent, enactRobotTurnEvent, enactRobotDeath, enactRobotDeathEvent } from '../Moves'

export class DisplayState extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            rotation: NE,
            registers: [],

            robots: props.G.robots,
            moves: [],
            currentTurn: -1
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

    componentDidMount() {
        this.displayTimer = setInterval(this.checkMoves.bind(this), 500)
    }

    componentWillUnmount() {
        clearInterval(this.displayTime)
    }

    checkMoves() {
        if (this.state.moves.length) {
            const move = this.state.moves[0]

            const tmpState = {
                robots: cloneDeep(this.state.robots)
            }

            console.log(tmpState)

            switch (move.type) {
                case ROBOT_MOVE:
                    enactRobotMoveEvent(tmpState, move)  
                    break                  
                case ROBOT_TURN:
                    enactRobotTurnEvent(tmpState, move)
                    break                  
                case ROBOT_CHECKPOINT:
                    enactRobotCheckpointEvent(tmpState, move)
                    break                  
                case ROBOT_HEALTH:
                    console.log("Health move: ", move)
                    enactRobotHealthEvent(tmpState, move, false)
                    break
                case ROBOT_DEATH:
                    enactRobotDeathEvent(tmpState, move)
                    break   
            }

            console.log('simulating', move)

            this.setState({ moves: this.state.moves.slice(1), robots: tmpState.robots })
            console.log("this.state.moves", this.state.moves)
        }
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

    componentWillReceiveProps(newProps) {
        const { G, ctx } = newProps

        const newState = {}

        if (this.state.robots.length === 0) {
            newState.robots = G.robots
        }

        /* do we have actions to simulate */
        if (this.state.currentTurn !== ctx.turn) {
            // a new turn has happened, let's see if there are any moves to simulate
            newState.currentTurn = ctx.turn
            newState.moves = this.state.moves.concat(G.robotMoves || [])
        }

        this.setState(newState)
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
        const displayRobots = cloneDeep(this.state.robots)
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
                    gameover={ctx.gameover}

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