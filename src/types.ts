/********************
 * File : type.ts
 * Created : Fri Apr 11 2025
 * Modified : Sat Apr 12 2025
 * Author : Khaled Fathi
 * Email : dev@khaledfathi.com
 * 
 * App types 
********************/
export enum Marker {
    X = 'X',
    O = 'O',
    DRAW = 'Draw'
}

export type Winner = {
    isGameEnd: boolean;
    playerMarker?: Marker;
    WinnerlinePositions?: Array<number>;
}

export type RoundRecord = {
    winner: Winner;
    startMarker: Marker;
    stepsPosition: Array<number>;
}