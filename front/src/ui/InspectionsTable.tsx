import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from './Pagination'

export type Inspection = {
  id: string
  externalId: string
  contractor: string
  employeeId: string
  pacId: string
  pacType: 'стационарный' | 'мобильный'
  // нет эталона, совпадает с МР, не совпадает с МР
  isReference: 'нет эталона' | 'совпадает с МР' | 'не совпадает с МР'
  hasDoctorNotes: boolean
  uploadedAt: string // ISO datetime
}

type Filters = {
  id: string
  externalId: string
  contractor: string
  employeeId: string
  pacId: string
  pacType: '' | 'стационарный' | 'мобильный'
  isReference: '' | 'нет эталона' | 'совпадает с МР' | 'не совпадает с МР'
  hasDoctorNotes: '' | 'есть' | 'нет'
  uploadedAtFrom: string
  uploadedAtTo: string
}

type SortDirection = 'asc' | 'desc' | null

type InspectionsTableProps = {
  data: Inspection[]
}

const defaultFilters: Filters = {
  id: '',
  externalId: '',
  contractor: '',
  employeeId: '',
  pacId: '',
  pacType: '',
  isReference: '',
  hasDoctorNotes: '',
  uploadedAtFrom: '',
  uploadedAtTo: '',
}

const InspectionsTable = ({ data }: InspectionsTableProps) => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [dateSort, setDateSort] = useState<SortDirection>(null)
  const [filtersBlockCollapsed, setFiltersBlockCollapsed] = useState(false)

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const toggleDateSort = () => {
    setDateSort((prev) => {
      if (prev === null) return 'asc'
      if (prev === 'asc') return 'desc'
      return null
    })
  }

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filters.id && !item.id.toLowerCase().includes(filters.id.toLowerCase())) return false
      if (
        filters.externalId &&
        !item.externalId.toLowerCase().includes(filters.externalId.toLowerCase())
      )
        return false
      if (
        filters.contractor &&
        !item.contractor.toLowerCase().includes(filters.contractor.toLowerCase())
      )
        return false
      if (
        filters.employeeId &&
        !item.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase())
      )
        return false
      if (filters.pacId && !item.pacId.toLowerCase().includes(filters.pacId.toLowerCase()))
        return false
      if (filters.pacType && item.pacType !== filters.pacType) return false
      if (filters.isReference && item.isReference !== filters.isReference) return false
      if (filters.hasDoctorNotes) {
        const hasNotes = item.hasDoctorNotes ? 'есть' : 'нет'
        if (hasNotes !== filters.hasDoctorNotes) return false
      }
      if (filters.uploadedAtFrom && item.uploadedAt < filters.uploadedAtFrom) return false
      if (filters.uploadedAtTo && item.uploadedAt > filters.uploadedAtTo) return false
      return true
    })
  }, [data, filters])

  const sorted = useMemo(() => {
    if (!dateSort) return filtered
    return [...filtered].sort((a, b) => {
      if (a.uploadedAt === b.uploadedAt) return 0
      if (dateSort === 'asc') {
        return a.uploadedAt < b.uploadedAt ? -1 : 1
      }
      return a.uploadedAt > b.uploadedAt ? -1 : 1
    })
  }, [filtered, dateSort])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize])

  const allFilteredIds = useMemo(() => new Set(filtered.map((i) => i.id)), [filtered])

  const allFilteredSelected = filtered.length > 0 && filtered.every((i) => selectedIds.has(i.id))

  const handleToggleAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allFilteredSelected) {
        allFilteredIds.forEach((id) => next.delete(id))
      } else {
        allFilteredIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  const handleToggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
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
              <span className="table-filters-row-label">дата загрузки</span>
              <span className="table-filters-row-range">
                <input
                  type="datetime-local"
                  className="data-table-filter-input"
                  value={filters.uploadedAtFrom}
                  onChange={(e) => handleFilterChange('uploadedAtFrom', e.target.value)}
                  placeholder="от"
                />
                <input
                  type="datetime-local"
                  className="data-table-filter-input"
                  value={filters.uploadedAtTo}
                  onChange={(e) => handleFilterChange('uploadedAtTo', e.target.value)}
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
              <th>
                <input
                  type="checkbox"
                  aria-label="Выделить все отфильтрованные строки"
                  checked={allFilteredSelected}
                  onChange={handleToggleAllFiltered}
                />
              </th>
              <th>id</th>
              <th>внешний id</th>
              <th>контрагент</th>
              <th>id сотрудника</th>
              <th>id ПАК</th>
              <th>тип ПАК</th>
              <th>эталон</th>
              <th>замечания МР</th>
              <th onClick={toggleDateSort} className="data-table-sortable">
                дата загрузки
                {dateSort === 'asc' && <span className="sort-indicator">▲</span>}
                {dateSort === 'desc' && <span className="sort-indicator">▼</span>}
              </th>
            </tr>
            <tr className="data-table-filters">
              <th />
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
                  value={filters.externalId}
                  onChange={(e) => handleFilterChange('externalId', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.contractor}
                  onChange={(e) => handleFilterChange('contractor', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.employeeId}
                  onChange={(e) => handleFilterChange('employeeId', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.pacId}
                  onChange={(e) => handleFilterChange('pacId', e.target.value)}
                  placeholder="Поиск"
                />
              </th>
              <th>
                <select
                  className="data-table-filter-select"
                  value={filters.pacType}
                  onChange={(e) => handleFilterChange('pacType', e.target.value)}
                >
                  <option value="">Все</option>
                  <option value="стационарный">стационарный</option>
                  <option value="мобильный">мобильный</option>
                </select>
              </th>
              <th>
                <select
                  className="data-table-filter-select"
                  value={filters.isReference}
                  onChange={(e) => handleFilterChange('isReference', e.target.value)}
                >
                  <option value="">Все</option>
                  <option value="нет эталона">нет эталона</option>
                  <option value="совпадает с МР">совпадает с МР</option>
                  <option value="не совпадает с МР">не совпадает с МР</option>
                </select>
              </th>
              <th>
                <select
                  className="data-table-filter-select"
                  value={filters.hasDoctorNotes}
                  onChange={(e) => handleFilterChange('hasDoctorNotes', e.target.value)}
                >
                  <option value="">Все</option>
                  <option value="есть">есть</option>
                  <option value="нет">нет</option>
                </select>
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {paged.map((item) => (
              <tr key={item.id} className="data-table-row">
                <td
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleOne(item.id)
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => {}}
                    aria-label={`Выделить осмотр ${item.id}`}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => navigate(`/inspections/${item.id}`)}
                  >
                    {item.id}
                  </button>
                </td>
                <td>{item.externalId}</td>
                <td>{item.contractor}</td>
                <td>{item.employeeId}</td>
                <td>{item.pacId}</td>
                <td>{item.pacType}</td>
                <td>
                  {item.isReference === 'нет эталона' && (
                    <span className="badge badge-neutral" title="Нет эталона">
                      Ø
                    </span>
                  )}
                  {item.isReference === 'совпадает с МР' && (
                    <span className="badge badge-success" title="Эталон совпадает с МР">
                      ✔
                    </span>
                  )}
                  {item.isReference === 'не совпадает с МР' && (
                    <span className="badge badge-danger" title="Эталон не совпадает с МР">
                      ✕
                    </span>
                  )}
                </td>
                <td>
                  {item.hasDoctorNotes ? (
                    <span className="badge badge-warning" title="Есть замечания МР">
                      !
                    </span>
                  ) : (
                    <span className="badge badge-muted" title="Замечаний нет">
                      —
                    </span>
                  )}
                </td>
                <td>{new Date(item.uploadedAt).toLocaleString()}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={10} className="data-table-empty">
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

export default InspectionsTable

