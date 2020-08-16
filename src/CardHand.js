import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './Card';

const getListStyle = isDraggingOver => ({
    background: isDraggingOver
        ? 'rgba(173, 216, 230, 0.9)'
        : 'rgba(211, 211, 211, 0.6)',
    padding: 8,
    width: 150,
    display: 'flex',
    overflow: 'auto'
});

export default class CardHand extends React.Component {
    render() {
        const { cards, id, isActive, style } = this.props

        return (
            <Droppable droppableId={id} direction="horizontal">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} style={{ ...getListStyle(snapshot.isDraggingOver), style }}>
                        {cards.map((card, index) => (
                            <Draggable
                                isDragDisabled={!isActive}
                                key={card.type + card.priority}
                                draggableId={JSON.stringify(card)}
                                index={index}>
                                {(provided, snapshot) => (
                                    <div>
                                        <Card provided={provided} card={card} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        )
    }
}