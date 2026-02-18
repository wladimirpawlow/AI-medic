import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from './Pagination'
import type { Run } from './RunsTable'

type SetRunsTableProps = {
  data: Run[]
}

const SetRunsTable = ({ data }: SetRunsTableProps) => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [startSort, setStartSort] = useState<'asc' | 'desc' | null>(null)
  const [endSort, setEndSort] = useState<'asc' | 'desc' | null>(null)

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
