import { useMemo, useState } from 'react'
import Pagination from './Pagination'
import Modal from './Modal'
import type { Run } from './RunsTable'

type SetRunsTableProps = {
  data: Run[]
}

const SetRunsTable = ({ data }: SetRunsTableProps) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [startSort, setStartSort] = useState<'asc' | 'desc' | null>(null)
  const [endSort, setEndSort] = useState<'asc' | 'desc' | null>(null)
  const [calcRunId, setCalcRunId] = useState<string | null>(null)
  const [calcAlgorithm, setCalcAlgorithm] = useState('')

  const sorted = useMemo(() => {
    let result = [...data]
    if (startSort) {
      result.sort((a, b) => {
        if (a.startedAt === b.startedAt) return 0
        return startSort === 'asc'
          ? (a.startedAt < b.startedAt ? -1 : 1)
          : (a.startedAt > b.startedAt ? -1 : 1)
      })
    }
    if (endSort) {
      result.sort((a, b) => {
        const aVal = a.completedAt || ''
        const bVal = b.completedAt || ''
        if (aVal === bVal) return 0
        return endSort === 'asc' ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1)
      })
    }
    return result
  }, [data, startSort, endSort])

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

  const toggleStart = () => {
    setStartSort((prev) => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null))
  }
  const toggleEnd = () => {
    setEndSort((prev) => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null))
  }

  const canCalculate = (status: Run['status']) => status === 'завершен успешно'

  const handleConfirmCalculate = () => {
    if (calcRunId && calcAlgorithm) {
      // TODO: вызов API расчета
      setCalcRunId(null)
      setCalcAlgorithm('')
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
              <th>инициатор</th>
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
          </thead>
          <tbody>
            {paged.map((item) => (
              <tr key={item.id} className="data-table-row">
                <td>{item.id}</td>
                <td>{item.savVersionId}</td>
                <td>
                  {item.inspectionId ? '—' : `${item.setId} v${item.setVersion}`}
                </td>
                <td>{item.initiator}</td>
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
                    <button
                      type="button"
                      className="runs-calc-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCalcRunId(item.id)
                        setCalcAlgorithm('')
                      }}
                      title="Запустить расчет"
                      aria-label="Запустить расчет"
                    >
                      <span className="runs-calc-icon" aria-hidden>📊</span>
                    </button>
                  )}
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

      {calcRunId && (
        <Modal title="Запустить расчет" onClose={() => setCalcRunId(null)}>
          <div className="modal-form-field">
            <label className="modal-label" htmlFor="set-calc-algorithm">
              Алгоритм
            </label>
            <select
              id="set-calc-algorithm"
              className="modal-select"
              value={calcAlgorithm}
              onChange={(e) => setCalcAlgorithm(e.target.value)}
            >
              <option value="">Выберите алгоритм</option>
              <option value="algorithm-v1.0">algorithm-v1.0</option>
              <option value="algorithm-v1.1">algorithm-v1.1</option>
              <option value="algorithm-v2.0">algorithm-v2.0</option>
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
              onClick={handleConfirmCalculate}
              disabled={!calcAlgorithm}
            >
              Рассчитать
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

export default SetRunsTable
