import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from './Pagination'
import Modal from './Modal'

export type SetItem = {
  id: string
  name: string
  version: number
  inspectionCount: number
  updatedAt: string
}

type Filters = {
  id: string
  name: string
  version: string
  inspectionCount: string
  updatedAtFrom: string
  updatedAtTo: string
}

type SetsTableProps = {
  data: SetItem[]
  onDelete: (id: string) => void
}

const defaultFilters: Filters = {
  id: '',
  name: '',
  version: '',
  inspectionCount: '',
  updatedAtFrom: '',
  updatedAtTo: '',
}

const SetsTable = ({ data, onDelete }: SetsTableProps) => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filtersBlockCollapsed, setFiltersBlockCollapsed] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filters.id && !item.id.toLowerCase().includes(filters.id.toLowerCase())) return false
      if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase()))
        return false
      if (filters.version !== '' && String(item.version) !== filters.version) return false
      if (
        filters.inspectionCount !== '' &&
        String(item.inspectionCount) !== filters.inspectionCount
      )
        return false
      if (filters.updatedAtFrom && item.updatedAt < filters.updatedAtFrom) return false
      if (filters.updatedAtTo && item.updatedAt > filters.updatedAtTo) return false
      return true
    })
  }, [data, filters])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const handleRowClick = (id: string) => {
    navigate(`/sets/${id}`)
  }

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDeleteConfirmId(id)
  }

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  return (
    <div className="table-wrapper">
      <div className="table-filters-block">
        <button
          type="button"
          className="table-filters-block-header"
          onClick={() => setFiltersBlockCollapsed((c) => !c)}
          aria-expanded={!filtersBlockCollapsed}
        >
          <span className="table-filters-block-title">Фильтры</span>
          <span className="table-filters-block-toggle" aria-hidden>
            {filtersBlockCollapsed ? '▶' : '▼'}
          </span>
        </button>
        {!filtersBlockCollapsed && (
          <div className="table-filters-block-body">
            <div className="table-filters-row">
              <span className="table-filters-row-label">дата изменения</span>
              <span className="table-filters-row-range">
                <input
                  type="datetime-local"
                  className="data-table-filter-input"
                  value={filters.updatedAtFrom}
                  onChange={(e) => handleFilterChange('updatedAtFrom', e.target.value)}
                  placeholder="от"
                />
                <input
                  type="datetime-local"
                  className="data-table-filter-input"
                  value={filters.updatedAtTo}
                  onChange={(e) => handleFilterChange('updatedAtTo', e.target.value)}
                  placeholder="до"
                />
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>id</th>
              <th>наименование</th>
              <th>версия</th>
              <th>количество осмотров</th>
              <th>дата изменения</th>
              <th />
            </tr>
            <tr className="data-table-filters">
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.id}
                  onChange={(e) => handleFilterChange('id', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.version}
                  onChange={(e) => handleFilterChange('version', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.inspectionCount}
                  onChange={(e) => handleFilterChange('inspectionCount', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {paged.map((item) => (
              <tr
                key={item.id}
                className="data-table-row"
                onClick={() => handleRowClick(item.id)}
              >
                <td>
                  <button
                    type="button"
                    className="link-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRowClick(item.id)
                    }}
                  >
                    {item.id}
                  </button>
                </td>
                <td>{item.name}</td>
                <td>{item.version}</td>
                <td>{item.inspectionCount}</td>
                <td>{new Date(item.updatedAt).toLocaleString()}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="sets-delete-btn"
                    onClick={(e) => handleDeleteClick(e, item.id)}
                    title="Удалить набор"
                    aria-label="Удалить набор"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={6} className="data-table-empty">
                  Нет данных для отображения
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1)
          setPageSize(size)
        }}
      />

      {deleteConfirmId && (
        <Modal title="Удалить набор?" onClose={() => setDeleteConfirmId(null)}>
          <p>Вы уверены, что хотите удалить этот набор?</p>
          <div className="modal-actions">
            <button
              type="button"
              className="app-button app-button-ghost"
              onClick={() => setDeleteConfirmId(null)}
            >
              Отменить
            </button>
            <button
              type="button"
              className="app-button"
              onClick={handleConfirmDelete}
              style={{ background: '#991b1b' }}
            >
              Удалить
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SetsTable
