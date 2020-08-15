- m x n grid

- map array:
    [[
        {
            type: (PLAIN|CONVEYOR|ETC),
            walls: [true, false, false, false], // nesw
            lasers: [true, false, false, false], // nesw
            pusher: [true, false, false, false], // nesw
            meta: {
                // optional for some tile

                // CONVEYORS
                exitDirection: (NORTH|SOUTH|WEST|EAST)
                inputDirections: [true, false, false, false] // nesw

                // FLAGS
                flagNumber: 0 / 1 / 2

                // GEARS
                rotationDirection: (CLOCKWISE|ANTI_CLOCKWISE)

                // PUSHER
                activationRegisters: [false, true, false, true, false] // 0, 1, 2, 3, 4 register move

                // GRILLS
                level: 0 / 1 / 2 (0 -> empty, 1 -> spanner, 2 -> spanner + hammer)
            }
            
        },
        {},
        {},
    ], ...]

- meta: 
{
    flagCount: 1
}

- robot:
{
    position: { x, y },
    direction: (NORTH|WEST|SOUTH|EAST),
    poweredDown: (true|false)
    damage: 0 - 9
    upgrades: [],
    flags: [],
    checkpoint: { x, y },
    lives: 0 - 3,

}


Fast Conveyor Belts (move 2)
Normal Conveyor Belts (move 1)
Pushers (push if active)
Gears (rotate 90 degrees in the direction of the arrows)
Lasers
Walls
Hole
Repairs
Flags
