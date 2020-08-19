import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './Card';

const getListStyle = isDraggingOver => ({
    background: isDraggingOver
        ? 'rgba(173, 216, 230, 0.9)'
        : 'rgba(211, 211, 211, 0.6)',
    padding: 8,
    display: 'flex',
    overflow: 'auto',
    minHeight: '211.5px',
    minWidth: '154.5px'
});

export default class CardHand extends React.Component {
    render() {
        const { cards, id, isActive, style, onClick } = this.props

        return (
            <Droppable droppableId={id} direction="horizontal">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={{ ...style, ...getListStyle(snapshot.isDraggingOver) }}
                    >
                        {
                            cards.map((card, index) => (
                                <Draggable
                                    isDragDisabled={!isActive}
                                    key={card.type + card.priority}
                                    draggableId={JSON.stringify(card)}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div onClick={e => onClick(e, card)} style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                                            <Card provided={provided} card={card} />
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        }
                        {provided.placeholder}
                    </div>
                )
                }
            </Droppable>
        )
    }
}