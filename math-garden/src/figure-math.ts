export type Point = [number, number];
export type Segment = [Point, Point];
const cross = (a: Point, b: Point) => a[0] * b[1] - a[1] * b[0];
const sub = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];
const on = (p: Point, [a, b]: Segment) => Math.abs(cross(sub(p, a), sub(b, a))) < 1e-7 && p[0] >= Math.min(a[0], b[0]) - 1e-7 && p[0] <= Math.max(a[0], b[0]) + 1e-7 && p[1] >= Math.min(a[1], b[1]) - 1e-7 && p[1] <= Math.max(a[1], b[1]) + 1e-7;
export function triangleSegments(figure: number): Segment[] {
  const top: Point = [0, 0], bottom: Point = [0, 6], base: Point[] = [-2, -1, 0, 1, 2].map(x => [x, 4]);
  const segments: Segment[] = [...base.map(p => [top, p] as Segment), ...base.map(p => [bottom, p] as Segment), [base[0], base[4]], [[-1, 2], [1, 2]], [top, bottom]];
  if (figure >= 2) segments.push([base[1], [1, 2]]);
  if (figure >= 3) segments.push([[-1, 2], base[3]]);
  return segments;
}
const triangleCache = new Map<number, Point[][]>();
export function enumerateTriangles(figure: number) {
  const cached = triangleCache.get(figure);
  if (cached) return cached;
  const triangles = trianglesFromSegments(triangleSegments(figure));
  triangleCache.set(figure, triangles);
  return triangles;
}
export function trianglesFromSegments(segments: Segment[]) {
  const points = new Map<string, Point>();
  const add = (p: Point) => points.set(p.map(v => v.toFixed(7)).join(','), p);
  segments.forEach(s => s.forEach(add));
  for (const [a, b] of segments) for (const [c, d] of segments) {
    const r = sub(b, a), s = sub(d, c), det = cross(r, s);
    if (Math.abs(det) < 1e-9) continue;
    const t = cross(sub(c, a), s) / det, p: Point = [a[0] + t * r[0], a[1] + t * r[1]];
    if (on(p, [a, b]) && on(p, [c, d])) add(p);
  }
  const vertices = [...points.values()], triangles: Point[][] = [];
  for (let a = 0; a < vertices.length; a++) for (let b = a + 1; b < vertices.length; b++) for (let c = b + 1; c < vertices.length; c++) {
    const t = [vertices[a], vertices[b], vertices[c]];
    if (Math.abs(cross(sub(t[1], t[0]), sub(t[2], t[0]))) < 1e-7) continue;
    if ([[0, 1], [1, 2], [0, 2]].every(([i, j]) => segments.some(s => on(t[i], s) && on(t[j], s)))) triangles.push(t);
  }
  const area = (t: Point[]) => Math.abs(cross(sub(t[1], t[0]), sub(t[2], t[0]))) / 2;
  const center = (t: Point[], axis: number) => t.reduce((sum,p) => sum+p[axis],0)/3;
  triangles.sort((a,b) => {
    const difference = area(a)-area(b);
    return Math.abs(difference)>1e-7 ? difference : center(a,1)-center(b,1) || center(a,0)-center(b,0);
  });
  return triangles;
}
export function lShapeSquares() {
  const cells = new Set<string>();
  for (let row = 0; row < 6; row++) for (let column = row < 3 ? 3 : 0; column < 5; column++) cells.add(`${column},${row}`);
  const squares: { column: number; row: number; size: number }[] = [];
  for (let size = 1; size <= 5; size++) for (let row = 0; row + size <= 6; row++) for (let column = 0; column + size <= 5; column++) {
    let valid = true;
    for (let y = row; y < row + size; y++) for (let x = column; x < column + size; x++) if (!cells.has(`${x},${y}`)) valid = false;
    if (valid) squares.push({ column, row, size });
  }
  return { cells, squares };
}
