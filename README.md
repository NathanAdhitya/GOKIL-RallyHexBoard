**Warning: Spaghetti Code Ahead. Approach at your own risk!**

Please avoid using this program directly for production. The reasons are obvious. This program was rushed and there are defects everywhere. You may use this as an example and inspiration to create your own game.

(This game's language is a slight mix between Bahasa Indonesia and English, therefore, please expect snippets or parts that are in Indonesian.)

# GOKIL Hexagon Board
This project was created for a rally competition held in our school. The program here is used to track scores and introduce an investment-like game mechanic.

## Software Used
(This list is incomplete, this is just a general overview)
1. Node.js LTS v14
2. React + create-react-app with TypeScript
3. Socket.IO
4. pixi.js
5. honeycomb-grid

## Game Mechanics

### Quirks to Know

1. Teams are indexed starting from 1, even in a JS array. This team index is stored in the database as well for easier management.
2. There is no authentication for the operators, apparently.
3. There is no web panel for the operators, operations are directly performed using MongoDB's command line or a custom made HTTP request.
4. We forgot culling exists.
5. Certain tasks might be performed more than once due to a bug in the class initialization. We forgot to make it a singleton.

### Basic Game mechanics

1. After every rally round, each teams are issued points. This is done by a HTTP POST to `/advanceRound` request to the backend. This request will advance the round by calculating all the gains from the previous round, added to the balance, and add per-round points. The format of the request is a JSON body containing an array of points to add.
2. After the round has been advanced, players can build in the map. They can only build on tiles adjacent to properties they already have. If they would like to build somewhere where they do not have any adjacent, they have to use the relocation feature. The feature will let them build a road anywhere for an extra cost.
3. Rinse and repeat. Each building produce a fixed amount of money multiplied by buffs, this will stack up each round, and the highest after several set rounds will be picked as the winner.

If you have any interest in knowing what a segment of code does, feel free to contact me via GitHub.