import { useMemo, useState } from 'react'
import Pagination from './Pagination'
import Modal from './Modal'
import type { Run } from './RunsTable'

type InspectionRunsTableProps = {
  data: Run[]
}

type Filters = {
  id: string
  savVersionId: string
  setId: string
  initiator: string
  status: '' | Run['status']
}

const defaultFilters: Filters = {
  id: '',
  savVersionId: '',
  setId: '',
  initiator: '',
  status: '',
}

const InspectionRunsTable = ({ data }: InspectionRunsTableProps) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [startSort, setStartSort] = useState<'asc' | 'desc' | null>(null)
  const [endSort, setEndSort] = useState<'asc' | 'desc' | null>(null)
  const [calcRunId, setCalcRunId] = useState<string | null>(null)
  const [savVersion, setSavVersion] = useState('')
  const [highlightedRunId, setHighlightedRunId] = useState<string | null>(null)
  const [highlightedAlgorithm, setHighlightedAlgorithm] = useState<string | null>(null)

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [field]: value }))
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
        filters.initiator &&
        !item.initiator.toLowerCase().includes(filters.initiator.toLowerCase())
      )
        return false
      if (filters.status && item.status !== filters.status) return false
      return true
    })
  }, [data, filters])

  const sorted = useMemo(() => {
    let result = [...filtered]
    if (startSort) {
      result.sort((a, b) => {
        if (a.startedAt === b.startedAt) return 0
        return startSort === 'asc'
          ? a.startedAt < b.startedAt
            ? -1
            : 1
          : a.startedAt > b.startedAt
            ? -1
            : 1
      })
    }
    if (endSort) {
      result.sort((a, b) => {
        const aVal = a.completedAt || ''
        const bVal = b.completedAt || ''
        if (aVal === bVal) return 0
        return endSort === 'asc' ? (aVal < bVal ? -1 : 1) : aVal > bVal ? -1 : 1
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

  const canCalculate = (status: Run['status']) => status === 'завершен успешно'

  const toggleStart = () => {
    setStartSort((prev) => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null))
  }

  const toggleEnd = () => {
    setEndSort((prev) => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null))
  }

  const handleConfirmCalc = () => {
    if (calcRunId && savVersion) {
      // TODO: вызов API расчета
      setHighlightedRunId(calcRunId)
      setHighlightedAlgorithm(savVersion)
      setCalcRunId(null)
      setSavVersion('')
    }
  }

  return (
    <div className="table-wrapper">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>id запуска</th>
              <th>версия САВ</th>
              <th>id набора (версия)</th>
              <th onClick={toggleStart} className="data-table-sortable">
                старт
                {startSort === 'asc' && <span className="sort-indicator">▲</span>}
                {startSort === 'desc' && <span className="sort-indicator">▼</span>}
              </th>
              <th onClick={toggleEnd} className="data-table-sortable">
                завершение
                {endSort === 'asc' && <span className="sort-indicator">▲</span>}
                {endSort === 'desc' && <span className="sort-indicator">▼</span>}
              </th>
              <th>статус</th>
              <th>рассчитать</th>
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
              <th />
            </tr>
          </thead>
          <tbody>
            {paged.map((item) => (
              <tr
                key={item.id}
                className={`data-table-row ${
                  highlightedRunId === item.id ? 'runs-row-calculated' : ''
                }`}
              >
                <td>{item.id}</td>
                <td>{item.savVersionId}</td>
                <td>{item.setId ? `${item.setId} v${item.setVersion}` : '—'}</td>
                <td>{new Date(item.startedAt).toLocaleString()}</td>
                <td>{item.completedAt ? new Date(item.completedAt).toLocaleString() : '—'}</td>
                <td>
                  <span
                    className={`badge ${getStatusBadgeClass(item.status)}`}
                    title={`${item.status}, ${item.processedCount}/${item.totalCount}`}
                  >
                    {item.processedCount}/{item.totalCount}
                  </span>
                </td>
                <td>
                  {canCalculate(item.status) && (
                    <span className="runs-calc-cell">
                      <button
                        type="button"
                        className="runs-calc-btn"
                        onClick={() => {
                          setCalcRunId(item.id)
                          setSavVersion('')
                        }}
                        title="Запустить расчет"
                        aria-label="Запустить расчет"
                      >
                        <span className="runs-calc-icon" aria-hidden>
                          📊
                        </span>
                      </button>
                      {highlightedRunId === item.id && highlightedAlgorithm && (
                        <span className="runs-calc-alg-id">{highlightedAlgorithm}</span>
                      )}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={7} className="data-table-empty">
                  Нет данных для отображения
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {calcRunId && (
        <Modal title="Запустить анализ в САВ" onClose={() => setCalcRunId(null)}>
          <div className="modal-form-field">
            <label className="modal-label" htmlFor="insp-sav-version">
              Версия САВ
            </label>
            <select
              id="insp-sav-version"
              className="modal-select"
              value={savVersion}
              onChange={(e) => setSavVersion(e.target.value)}
            >
              <option value="">Выберите версию</option>
              <option value="sav-1.0.0">sav-1.0.0</option>
              <option value="sav-1.1.0">sav-1.1.0</option>
              <option value="sav-2.0.0">sav-2.0.0</option>
            </select>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="app-button app-button-ghost"
              onClick={() => setCalcRunId(null)}
            >
              Отменить
            </button>
            <button
              type="button"
              className="app-button"
              onClick={handleConfirmCalc}
              disabled={!savVersion}
            >
              Запустить
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

export default InspectionRunsTable

