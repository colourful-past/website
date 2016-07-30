export interface IUser
{
    id?: string;
    name: string;
}

export interface IGame
{
    id: string;
    state: GameState;
    ruleset: IRuleset;
    players: IUser[];
    winner: IUser;
    lastTurnTimeMs: number;
    guesses: IGuess[];
    placements: IShipPlacements[];
    fakeOpponentPlacements: IShipPlacements;
}

// export interface IBoard extends Array<Array<CellValue>>
// {
// }

export enum GuessResult
{
    Miss,
    Hit
}

export interface IGuess
{
    x: number;
    y: number;
    player: IUser;
    result?: GuessResult;
}

export interface ISession
{
    token: string;
}

export enum GameState
{
    PlacingShips,
    SearchingForOpponent,
    Playing,
    Ended
}

export interface IShip
{
    id: string;
    label: string;
    size: number;
}

export const aircraftCarrier : IShip = {
    id: "aircraft-carrier",
    label: "Aircraft Carrier",
    size: 5
};

export const battleship : IShip = {
    id: "battleship",
    label: "Battleship",
    size: 4
};

export const submarine : IShip = {
    id: "submarine",
    label: "Submarine",
    size: 3
};

export const destroyer : IShip = {
    id: "destroyer",
    label: "Destroyer",
    size: 3
};

export const patrolBoat : IShip = {
    id: "patrol-boat",
    label: "Patrol Boat",
    size: 2
};

export const shipTypes : IShip[] = [aircraftCarrier, battleship, submarine, destroyer, patrolBoat];

export interface IRuleset
{
    id: string;
    ships: IShip[];
    boardWidth: number;
    boardHeight: number;
    turnLimitSeconds: number;
}

export const classicRuleset : IRuleset = {
    id: "classic",
    boardWidth: 10,
    boardHeight: 10,
    turnLimitSeconds: 60 * 60 * 24,
    ships: [aircraftCarrier, battleship, submarine, destroyer, patrolBoat]
}

export const rulesets : IRuleset[] = [classicRuleset];

export interface IShipPlacements
{   
    player: IUser;
    ships: IShipPosition[];
}

export interface IShipPosition
{   
    x:number,
    y:number;
    ship:IShip;
    rotation: number;
}