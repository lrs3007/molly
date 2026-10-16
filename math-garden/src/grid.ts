export interface GridShape { row: number; column: number; height: number; width: number }
export function gridShapes(rows: number, columns: number, squareOnly: boolean): GridShape[] {
  const shapes: GridShape[] = [];
  for (let height = 1; height <= rows; height++) for (let width = 1; width <= columns; width++) {
    if (squareOnly && width !== height) continue;
    for (let row = 0; row + height <= rows; row++) for (let column = 0; column + width <= columns; column++) shapes.push({ row, column, height, width });
  }
  return shapes;
}
