import React from 'react'
import './MessageBox.css'
import { MAX_DAMAGE } from '../Constants'

const DeathMessage = (props) => (
    <span>
        <i className="fa fa-check fa-2x"></i>
        <span className="message-text"><strong>You Died:</strong>
            {
                ` You will respawn next round.`
            }
        </span>
    </span>
)

const EternalDeathMessage = (props) => (
    <span>
        <i className="fa fa-check fa-2x"></i>
        <span className="message-text"><strong>You Died:</strong>
            {
                ` You have lost all of your lives and will not respawn.`
            }
        </span>
    </span>
)

export default class Death extends React.Component {
    render() {
        const { playerRobot } = this.props

        if (playerRobot.damage !== MAX_DAMAGE) return null

        return (
            <div
                className={"message-box" + ` message-box-error`}
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 200,
                    lineHeight: 3
                }}>
                {playerRobot.lives === 0 ? <EternalDeathMessage /> : <DeathMessage />}
            </div>
        )
    }
}