import React from 'react'
import './MessageBox.css'

const Winner = (props) => (
    <span>
        <i className="fa fa-check fa-2x"></i>
        <span className="message-text"><strong>Winner:</strong>
            {
                ` You have won!`
            }
        </span>
    </span>
)

const Loser = (props) => (
    <span>
        <i className="fa fa-check fa-2x"></i>
        <span className="message-text"><strong>Loser:</strong>
            {
                ` The ${props.gameover.winner.colour} player has won!`
            }
        </span>
    </span>
)

const Outline = (props) => {
    return (
        <div
            className={"message-box " + `message-box-${props.type}`}
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 200,
                lineHeight: 3
            }}>
                {props.children}
        </div>
    )
}

export default class Gameover extends React.Component {
    render() {
        const { gameover, playerRobot } = this.props

        if (!gameover) return null

        if (gameover.draw) {
            return (
                <Outline type='warn'>
                    <span>
                        <i className="fa fa-check fa-2x"></i>
                        <span className="message-text"><strong>Draw:</strong>
                            {
                                ` Nobody wins!`
                            }
                        </span>
                    </span>
                </Outline>
            )
        }

        const winner = playerRobot.user === gameover.winner.user

        console.log('gameover', gameover)

        return (
            <Outline type={winner ? 'success' : 'error'}>
                { winner ? <Winner gameover={gameover} /> : <Loser gameover={gameover} /> }
            </Outline>
        )
    }
}