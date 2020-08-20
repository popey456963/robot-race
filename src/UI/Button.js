import React from 'react'
import './Button.css'

export default class Button extends React.Component {
    render() {
        const { text, onClick, disabled, style } = this.props

        return (
            <span className="buton-cover button-3d" style={{ paddingBottom: '10px' }}>
                <button
                    className={`btn ${disabled ? 'btn--gray' : 'btn--primary'}`}
                    style={style}
                    disabled={disabled}
                    onClick={onClick}
                >
                    <span className="btn__txt--inactive">{text}</span>
                </button>
            </span>
        )
    }
}