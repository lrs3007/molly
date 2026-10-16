export function GridLines({ rows, columns, cell }: { rows: number; columns: number; cell: number }) {
  return <g stroke="#72927a" strokeWidth="1.7" fill="none">
    {Array.from({ length: rows + 1 }, (_, row) => <path key={`r${row}`} d={`M0 ${row * cell}h${columns * cell}`}/>)}
    {Array.from({ length: columns + 1 }, (_, column) => <path key={`c${column}`} d={`M${column * cell} 0v${rows * cell}`}/>)}
  </g>;
}
export default function GridDiagram({ rows, columns }: { rows: number; columns: number }) {
  return <svg className="exercise-grid" viewBox={`-12 -12 ${columns * 38 + 24} ${rows * 38 + 24}`} role="img" aria-label={`${rows}行${columns}列的方格图`}>
    <GridLines rows={rows} columns={columns} cell={38}/>
  </svg>;
}
