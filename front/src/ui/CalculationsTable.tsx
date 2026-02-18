import { useMemo, useState } from 'react'
import Pagination from './Pagination'

export type Calculation = {
  runId: string
  /** Наименование набора или ID осмотра */
  setOrInspection: string
  /** Версия набора (только для запусков по набору; для запусков по осмотру — пусто) */
  setVersion?: number
  algorithm: string
  calculatedAt: string
  fileName: string
  downloadUrl?: string
}

type Filters = {
  runId: string
  setOrInspection: string
  setVersion: string
  algorithm: string
  calculatedAtFrom: string
  calculatedAtTo: string
}

type CalculationsTableProps = {
  data: Calculation[]
}

const defaultFilters: Filters = {
  runId: '',
  setOrInspection: '',
  setVersion: '',
  algorithm: '',
  calculatedAtFrom: '',
  calculatedAtTo: '',
}

const CalculationsTable = ({ data }: CalculationsTableProps) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filtersBlockCollapsed, setFiltersBlockCollapsed] = useState(false)

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filters.runId && !item.runId.toLowerCase().includes(filters.runId.toLowerCase()))
        return false
      if (
        filters.setOrInspection &&
        !item.setOrInspection.toLowerCase().includes(filters.setOrInspection.toLowerCase())
      )
        return false
      if (
        filters.setVersion !== '' &&
        String(item.setVersion ?? '') !== filters.setVersion
      )
        return false
      if (
        filters.algorithm &&
        !item.algorithm.toLowerCase().includes(filters.algorithm.toLowerCase())
      )
        return false
      if (filters.calculatedAtFrom && item.calculatedAt < filters.calculatedAtFrom) return false
      if (filters.calculatedAtTo && item.calculatedAt > filters.calculatedAtTo) return false
      return true
    })
  }, [data, filters])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

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
              <span className="table-filters-row-label">дата расчета</span>
              <span className="table-filters-row-range">
                <input
                  type="datetime-local"
                  className="data-table-filter-input"
                  value={filters.calculatedAtFrom}
                  onChange={(e) => handleFilterChange('calculatedAtFrom', e.target.value)}
                  placeholder="от"
                />
                <input
                  type="datetime-local"
                  className="data-table-filter-input"
                  value={filters.calculatedAtTo}
                  onChange={(e) => handleFilterChange('calculatedAtTo', e.target.value)}
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
              <th>запуск</th>
              <th>набор/осмотр</th>
              <th>версия</th>
              <th>алгоритм</th>
              <th>дата расчета</th>
              <th>идентификатор</th>
            </tr>
            <tr className="data-table-filters">
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.runId}
                  onChange={(e) => handleFilterChange('runId', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.setOrInspection}
                  onChange={(e) => handleFilterChange('setOrInspection', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.setVersion}
                  onChange={(e) => handleFilterChange('setVersion', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.algorithm}
                  onChange={(e) => handleFilterChange('algorithm', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {paged.map((item, index) => (
              <tr key={`${item.runId}-${item.calculatedAt}-${index}`} className="data-table-row">
                <td>{item.runId}</td>
                <td>{item.setOrInspection}</td>
                <td>{item.setVersion != null ? item.setVersion : '—'}</td>
                <td>{item.algorithm}</td>
                <td>{new Date(item.calculatedAt).toLocaleString()}</td>
                <td>
                  {item.downloadUrl ? (
                    <a
                      href={item.downloadUrl}
                      download={item.fileName}
                      className="link-button"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.fileName}
                    </a>
                  ) : (
                    <span>{item.fileName}</span>
                  )}
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
    </div>
  )
}

export default CalculationsTable
