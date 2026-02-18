import { useMemo, useState } from 'react'
import Pagination from './Pagination'

export type NoteItem = {
  id: number
  group: string
  name: string
  description: string
  code: string
  type?: string
  priority?: number
  default_threshold?: number
  active?: boolean
}

type NotesTableProps = {
  data: NoteItem[]
  loading: boolean
  error: string | null
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const NotesTable = ({ data, loading, error, onEdit, onDelete }: NotesTableProps) => {
  const [filters, setFilters] = useState({
    group: '',
    name: '',
    code: '',
    description: '',
  })
  const [sortConfig, setSortConfig] = useState<{ key: keyof NoteItem; direction: 'asc' | 'desc' } | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleFilterChange = (key: string, value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSort = (key: keyof NoteItem) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    setPage(1)
  }

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filters.group && !item.group.toLowerCase().includes(filters.group.toLowerCase())) return false
      if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) return false
      if (filters.code && !item.code.toLowerCase().includes(filters.code.toLowerCase())) return false
      if (filters.description && !item.description.toLowerCase().includes(filters.description.toLowerCase())) return false
      return true
    })
  }, [data, filters])

  const sorted = useMemo(() => {
    if (!sortConfig) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? ''
      const bVal = b[sortConfig.key] ?? ''
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, sortConfig])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize])

  const SortIcon = ({ columnKey }: { columnKey: keyof NoteItem }) => {
    if (sortConfig?.key !== columnKey) return <span className="sort-indicator">⇅</span>
    return <span className="sort-indicator">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
  }

  if (error) {
    return (
      <div className="table-wrapper">
        <div className="placeholder" style={{ color: '#991b1b' }}>{error}</div>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <div className="data-table-th-sort" onClick={() => handleSort('group')}>
                  группа <SortIcon columnKey="group" />
                </div>
              </th>
              <th>
                <div className="data-table-th-sort" onClick={() => handleSort('name')}>
                  наименование <SortIcon columnKey="name" />
                </div>
              </th>
              <th>
                <div className="data-table-th-sort" onClick={() => handleSort('description')}>
                  описание <SortIcon columnKey="description" />
                </div>
              </th>
              <th>
                <div className="data-table-th-sort" onClick={() => handleSort('code')}>
                  идентификатор <SortIcon columnKey="code" />
                </div>
              </th>
              <th className="actions-header">Действия</th>
            </tr>
            <tr className="data-table-filters">
              <th>
                <input
                  className="data-table-filter-input"
                  placeholder="Поиск"
                  value={filters.group}
                  onChange={(e) => handleFilterChange('group', e.target.value)}
                  maxLength={50}
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  placeholder="Поиск"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  maxLength={50}
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  placeholder="Поиск"
                  value={filters.description}
                  onChange={(e) => handleFilterChange('description', e.target.value)}
                  maxLength={255}
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  placeholder="Поиск"
                  value={filters.code}
                  onChange={(e) => handleFilterChange('code', e.target.value)}
                  maxLength={50}
                />
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="data-table-empty">
                  Загрузка данных...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={5} className="data-table-empty">
                  Нет данных для отображения
                </td>
              </tr>
            ) : (
              paged.map((item) => (
                <tr key={item.id} className="data-table-row">
                  <td>{item.group}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.code}</td>
                  <td className="notes-actions-cell">
                    <button
                      type="button"
                      className="notes-action-btn notes-edit-btn"
                      onClick={() => onEdit(item.id)}
                      title="Редактировать"
                      aria-label="Редактировать"
                    >
                      ✏
                    </button>
                    <button
                      type="button"
                      className="notes-action-btn sets-delete-btn"
                      onClick={() => onDelete(item.id)}
                      title="Удалить"
                      aria-label="Удалить"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={sorted.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1)
          setPageSize(size)
        }}
      />
    </div>
  )
}

export default NotesTable
