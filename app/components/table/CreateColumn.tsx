export interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
}

export function createColumn<T>(
  header: string,
  accessor: (row: T) => React.ReactNode
): Column<T> {
  return { header, accessor };
}
