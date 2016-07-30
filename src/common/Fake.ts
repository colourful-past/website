import {IGame, IGuess, GuessResult, IUser, GameState, 
    classicRuleset, IShipPosition, rulesets, IRuleset} from "./Models";
import * as helpers from "./Helpers";

// export function getEmptyGuesses(w:number, h:number) : IBoard
// {
//     var board : IBoard = [];
//     for(var yi=0; yi<h; yi++)
//     {
//         board.push([]);
//         board[yi] = [];

//         for(var xi=0; xi<w; xi++)
//             board[yi].push(CellValue.Empty);
//     }
//     return board;
// }

export function getFakeNewGame(playera:IUser) : IGame
{
    return {
        id: Math.round(Math.random()*10000) + "",
        state: GameState.PlacingShips,
        ruleset: classicRuleset,
        lastTurnTimeMs: 0,
        guesses: [],
        players: [playera],
        winner: null,
        placements: [],
        fakeOpponentPlacements: null
    }
}

export function getFakeUser(name:string = null) : IUser
{
    return {
        id: Math.random() + "",
        name: name || "Guest " + Math.round(Math.random()*1000),
    }
}

export function getFakePlacements(ruleset:IRuleset) : IShipPosition[]
{
    var placements: IShipPosition[] = [];
    for(var ship of ruleset.ships)
    {
        var p : IShipPosition = null;
        do
        {
            p = {
                rotation: Math.random() < 0.5 ? 90 : 0,
                x: Math.round(Math.random() * (ruleset.boardWidth-1)), 
                y: Math.round(Math.random() * (ruleset.boardHeight-1)),
                ship
            }
        } 
        while(helpers.isValidShipLocation(p.x,p.y,ship,p.rotation,ruleset.boardWidth,
            ruleset.boardWidth, placements)==false)
        placements.push(p);
    }
    return placements;
}

export function getFakeGuess(game:IGame, player:IUser) : IGuess
{
    var x: number;
    var y: number;
    do
    {
        x = Math.round(Math.random() * (game.ruleset.boardWidth-1));
        y = Math.round(Math.random() * (game.ruleset.boardHeight-1));
    }
    while(helpers.canGuessAt(x,y,game.guesses, player)==false)

    return {
        x, y, player
    }
}