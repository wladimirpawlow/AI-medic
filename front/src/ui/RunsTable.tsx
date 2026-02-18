import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from './Pagination'
import Modal from './Modal'

export type Run = {
  id: string
  savVersionId: string
  setId: string
  setVersion: number
  inspectionId?: string
  startedAt: string
  completedAt?: string
  status: 'в очереди' | 'обработка' | 'завершен успешно' | 'остановлен'
  processedCount: number
  totalCount: number
  initiator: string
}

type Filters = {
  id: string
  savVersionId: string
  setId: string
  inspectionId: string
  status: '' | Run['status']
  initiator: string
  startedFrom: string
  startedTo: string
  completedFrom: string
  completedTo: string
}

type SortDirection = 'asc' | 'desc' | null

type RunsTableProps = {
  data: Run[]
}

const defaultFilters: Filters = {
  id: '',
  savVersionId: '',
  setId: '',
  inspectionId: '',
  status: '',
  initiator: '',
  startedFrom: '',
  startedTo: '',
  completedFrom: '',
  completedTo: '',
}

const RunsTable = ({ data }: RunsTableProps) => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [startSort, setStartSort] = useState<SortDirection>(null)
  const [endSort, setEndSort] = useState<SortDirection>(null)
  const [stopConfirmRunId, setStopConfirmRunId] = useState<string | null>(null)
  const [filtersBlockCollapsed, setFiltersBlockCollapsed] = useState(false)

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const toggleStartSort = () => {
    setStartSort((prev) => {
      const next = prev === null ? 'asc' : prev === 'asc' ? 'desc' : null
      return next
    })
  }

  const toggleEndSort = () => {
    setEndSort((prev) => {
      const next = prev === null ? 'asc' : prev === 'asc' ? 'desc' : null
      return next
    })
  }

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filters.id && !item.id.toLowerCase().includes(filters.id.toLowerCase())) return false
      if (
        filters.savVersionId &&
        !item.savVersionId.toLowerCase().includes(filters.savVersionId.toLowerCase())
      )
        return false
      if (filters.setId && !item.setId.toLowerCase().includes(filters.setId.toLowerCase()))
        return false
      if (
        filters.inspectionId &&
        !(item.inspectionId || '').toLowerCase().includes(filters.inspectionId.toLowerCase())
      )
        return false
      if (filters.status && item.status !== filters.status) return false
      if (
        filters.initiator &&
        !item.initiator.toLowerCase().includes(filters.initiator.toLowerCase())
      )
        return false
      if (filters.startedFrom && item.startedAt < filters.startedFrom) return false
      if (filters.startedTo && item.startedAt > filters.startedTo) return false
      if (filters.completedFrom && (item.completedAt || '') < filters.completedFrom) return false
      if (filters.completedTo && (item.completedAt || '') > filters.completedTo) return false
      return true
    })
  }, [data, filters])

  const sorted = useMemo(() => {
    let result = [...filtered]
    if (startSort) {
      result.sort((a, b) => {
        if (a.startedAt === b.startedAt) return 0
        if (startSort === 'asc') return a.startedAt < b.startedAt ? -1 : 1
        return a.startedAt > b.startedAt ? -1 : 1
      })
    }
    if (endSort) {
      result.sort((a, b) => {
        const aVal = a.completedAt || ''
        const bVal = b.completedAt || ''
        if (aVal === bVal) return 0
        if (endSort === 'asc') return aVal < bVal ? -1 : 1
        return aVal > bVal ? -1 : 1
      })
    }
    return result
  }, [filtered, startSort, endSort])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize])

  const getStatusBadgeClass = (status: Run['status']) => {
    switch (status) {
      case 'в очереди':
        return 'badge-neutral'
      case 'обработка':
        return 'badge-warning'
      case 'завершен успешно':
        return 'badge-success'
      case 'остановлен':
        return 'badge-danger'
      default:
        return 'badge-muted'
    }
  }

  const canStop = (status: Run['status']) =>
    status === 'в очереди' || status === 'обработка'

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
              <span className="table-filters-row-label">старт</span>
              <span className="table-filters-row-range">
                <input
                  type="datetime-local"
                  className="data-table-filter-input"
                  value={filters.startedFrom}
                  onChange={(e) => handleFilterChange('startedFrom', e.target.value)}
                  placeholder="от"
                />
                <input
                  type="datetime-local"
                  className="data-table-filter-input"
                  value={filters.startedTo}
                  onChange={(e) => handleFilterChange('startedTo', e.target.value)}
                  placeholder="до"
                />
              </span>
            </div>
            <div className="table-filters-row">
              <span className="table-filters-row-label">завершение</span>
              <span className="table-filters-row-range">
                <input
                  type="datetime-local"
                  className="data-table-filter-input"
                  value={filters.completedFrom}
                  onChange={(e) => handleFilterChange('completedFrom', e.target.value)}
                  placeholder="от"
                />
                <input
                  type="datetime-local"
                  className="data-table-filter-input"
                  value={filters.completedTo}
                  onChange={(e) => handleFilterChange('completedTo', e.target.value)}
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
              <th>id запуска</th>
              <th>версия САВ</th>
              <th>id набора (версия)</th>
              <th>id осмотра</th>
              <th>инициатор</th>
              <th onClick={toggleStartSort} className="data-table-sortable">
                старт
                {startSort === 'asc' && <span className="sort-indicator">▲</span>}
                {startSort === 'desc' && <span className="sort-indicator">▼</span>}
              </th>
              <th onClick={toggleEndSort} className="data-table-sortable">
                завершение
                {endSort === 'asc' && <span className="sort-indicator">▲</span>}
                {endSort === 'desc' && <span className="sort-indicator">▼</span>}
              </th>
              <th>статус</th>
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
                  value={filters.savVersionId}
                  onChange={(e) => handleFilterChange('savVersionId', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.setId}
                  onChange={(e) => handleFilterChange('setId', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.inspectionId}
                  onChange={(e) => handleFilterChange('inspectionId', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.initiator}
                  onChange={(e) => handleFilterChange('initiator', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th />
              <th />
              <th>
                <select
                  className="data-table-filter-select"
                  value={filters.status}
                  onChange={(e) =>
                    handleFilterChange('status', e.target.value as Filters['status'])
                  }
                >
                  <option value="">Все</option>
                  <option value="в очереди">в очереди</option>
                  <option value="обработка">обработка</option>
                  <option value="завершен успешно">завершен успешно</option>
                  <option value="остановлен">остановлен</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item) => (
              <tr key={item.id} className="data-table-row">
                <td>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => navigate(`/runs/${item.id}`)}
                  >
                    {item.id}
                  </button>
                </td>
                <td>{item.savVersionId}</td>
                <td>
                  {item.setId} v{item.setVersion}
                </td>
                <td>{item.inspectionId ?? '—'}</td>
                <td>{item.initiator}</td>
                <td>{new Date(item.startedAt).toLocaleString()}</td>
                <td>{item.completedAt ? new Date(item.completedAt).toLocaleString() : '—'}</td>
                <td>
                  <span className="runs-status-cell">
                    <span
                      className={`badge ${getStatusBadgeClass(item.status)}`}
                      title={`${item.status}, ${item.processedCount}/${item.totalCount}`}
                    >
                      {item.processedCount}/{item.totalCount}
                    </span>
                    {canStop(item.status) && (
                      <button
                        type="button"
                        className="runs-stop-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setStopConfirmRunId(item.id)
                        }}
                        title="Остановить запуск"
                        aria-label="Остановить запуск"
                      >
                        <span className="runs-stop-icon" aria-hidden>■</span>
                      </button>
                    )}
                  </span>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={8} className="data-table-empty">
                  Нет данных для отображения
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {stopConfirmRunId && (
        <Modal
          title="Остановить запуск?"
          onClose={() => setStopConfirmRunId(null)}
        >
          <p>Вы уверены, что хотите остановить процесс обработки?</p>
          <div className="modal-actions">
            <button
              type="button"
              className="app-button app-button-ghost"
              onClick={() => setStopConfirmRunId(null)}
            >
              Отменить
            </button>
            <button
              type="button"
              className="app-button"
              onClick={() => {
                // TODO: вызов API остановки
                setStopConfirmRunId(null)
              }}
            >
              Остановить
            </button>
          </div>
        </Modal>
      )}

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

export default RunsTable

