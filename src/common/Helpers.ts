import {IGuess,IShip, IShipPosition, IRuleset, rulesets, IUser, IGame,
     GuessResult, IShipPlacements} from "./Models";
import * as _ from "lodash";

export function isValidShipLocation(x:number, y:number, ship:IShip, rotation:number, 
    boardWidth:number, boardHeight:number, placements:IShipPosition[])
{
    var occupiedGrid = getOccupiedGrid(boardWidth, boardHeight, placements);
    for(var i=0; i<ship.size; i++)
    {
        var chunkX = x + (rotation==90?0:i);
        var chunkY = y + (rotation==0?0:i);
        if (chunkX<0 || chunkY<0 || chunkY>=boardHeight || chunkX>=boardWidth)
            return false;

        if (occupiedGrid[chunkY][chunkX])
            return false;
    }
       
    return true;
}

export function getGuessResult(guess:IGuess, game:IGame, placements:IShipPosition[]) : GuessResult
{
    var occupiedGrid = getOccupiedGrid(game.ruleset.boardWidth, game.ruleset.boardHeight, placements);
    return occupiedGrid[guess.y][guess.x] ? GuessResult.Hit : GuessResult.Miss;
}

export function getOtherPlayerIndex(user:IUser, players:IUser[])
{
    var i = players.findIndex(p => p.id==user.id);
    return i == 0 ? 1 : 0;
}

export function getOccupiedGrid(boardWidth:number, boardHeight:number,
    placements:IShipPosition[]) : boolean[][]
{
    var grid = getEmptyGrid(boardWidth, boardHeight);
    
    for (var p of placements)
    {
        for (var i = 0; i < p.ship.size; i++) {
             p.rotation == 90 ? grid[p.y+i][p.x] = true : 
                grid[p.y][p.x+i] = true
        }
    }  

    return grid;
}

export function getEmptyGrid(boardWidth:number, boardHeight:number) : boolean[][]
{
    var grid : boolean[][] = [];
    for(var yi=0; yi<boardHeight; yi++)
    {
        grid.push([]);
        for(var xi=0; xi<boardHeight; xi++)
            grid[yi].push(false);
    }
    return grid;
}

export function getGuesses(user:IUser, game:IGame) : IGuess[]
{
    return game.guesses.filter(g => g.player.id == user.id);
}

export function getOpponent(user:IUser, game:IGame) : IUser
{
    const i = getOtherPlayerIndex(user, game.players)
    return game.players[i];
}

export function isMyTurn(me:IUser, game:IGame) : boolean
{
    if (game.guesses.length == 0)
        return game.players.length > 1 && game.players[0].id == me.id;
    
    var lastGuess = game.guesses[game.guesses.length-1];
    return lastGuess.player.id != me.id;
}

export function getNextShip(ruleset:IRuleset, currentShip:IShip) : IShip
{
    var indx = ruleset.ships.findIndex(s => s.id==currentShip.id);
    var nextIndx = indx + 1;
    return nextIndx >= ruleset.ships.length ? null : ruleset.ships[nextIndx];
}

export function canGuessAt(x:number, y:number, guesses:IGuess[], player:IUser)
{
    return guesses.filter(g => g.player.id==player.id)
        .find(g => g.x==x && g.y==y) == null;
}

export function wait(ms:number) : Promise<void>
{
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => resolve(), ms);
    });
}

export function getPlacements(user:IUser, game:IGame) : IShipPlacements
{
    return game.placements.find(p => p.player.id == user.id);
}

export function didHitShip(ship:IShipPosition, x:number, y:number)
{
    for(var i=0; i<ship.ship.size; i++)
    {
        if (ship.rotation==90 && ship.x==x && (ship.y+i)==y)
            return true;
        if (ship.rotation==0 && (ship.x+i)==x && ship.y==y)
            return true;
    }
    return false;
}

export function getDestroyedShips(placments:IShipPlacements, guesses:IGuess[]) : IShipPosition[]
{
    return placments.ships.filter(s => {
        for(var i=0; i<s.ship.size; i++)
        {
            if (guesses.filter(g => g.player.id != placments.player.id)
                .find(g => g.x == s.x+(s.rotation==90?0:i) && g.y == s.y+(s.rotation==90?i:0))==null)
                return false;
        }
        return true;
    });
}

export function areAllShipsAreDestroyed(ruleset:IRuleset, placements:IShipPlacements, guesses:IGuess[]) : boolean
{
    var destroyedShips = getDestroyedShips(placements, guesses)
    return destroyedShips.length == ruleset.ships.length;
}

export function getWinner(game:IGame, placements:IShipPlacements[]) : IUser
{
    var destroyed = getPlayerWithAllShipsDestroyed(game, placements);
    if (!destroyed)
        return null;

    return getOpponent(destroyed, game);
}

export function getPlayerWithAllShipsDestroyed(game:IGame, placements:IShipPlacements[]) : IUser
{
    return game.players
        .find(player => areAllShipsAreDestroyed(game.ruleset, getPlacements(player, game), game.guesses));
}