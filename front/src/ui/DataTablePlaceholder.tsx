type DataTablePlaceholderProps = {
  entityName: string
  columns: string[]
}

const DataTablePlaceholder = ({ entityName, columns }: DataTablePlaceholderProps) => {
  return (
    <div className="placeholder">
      <p>
        Здесь будет таблица для сущности <strong>{entityName}</strong> с фильтрами по каждому столбцу и
        пагинацией на 10 / 20 / 50 / 100 строк.
      </p>
      <ul>
        {columns.map((column) => (
          <li key={column}>{column}</li>
        ))}
      </ul>
    </div>
  )
}

export default DataTablePlaceholder

