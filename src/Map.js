import React from 'react';

function findRobots(pos, robots) {
    for (let [key, robot] of Object.entries(robots)) {
        if (robot.position.x === pos.x && robot.position.y === pos.y) {
            robot.user = key
            return robot
        }
    }

    return undefined
}

function renderTile(tile, pos, robot) {
    return <td key={pos.x + ',' + pos.y}>{tile.type + JSON.stringify(robot)}</td>
}

export default class Map extends React.Component {
    render() {
        const { map, robots } = this.props


        return (
        <table><tbody>{map.map((row, rowId) => 
            <tr key={rowId}>{row.map((tile, columnId) =>
                renderTile(tile, { y: rowId, x: columnId }, findRobots({ y: rowId, x: columnId }, robots))
            )}</tr>            
        )}</tbody></table>
        )
    }
}



/*<table>
<tr>
  <td>Jill</td>
  <td>Smith</td>
  <td>50</td>
</tr>
<tr>
  <td>Eve</td>
  <td>Jackson</td>
  <td>94</td>
</tr>
</table> */