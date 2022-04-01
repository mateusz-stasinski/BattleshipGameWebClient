export interface ShootResponse {
    isHit: boolean;
    isSunk: boolean;
    isGameOver: boolean;
    x_Position: number;
    y_Position: number;
    status: number;
    shipId: number;
    boardId: number
}