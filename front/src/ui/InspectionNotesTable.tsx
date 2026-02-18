import { useEffect, useMemo, useState } from 'react'
import Pagination from './Pagination'

export type InspectionNote = {
  id: string
  group: string
  name: string
  /** эталон: true/false, null — не задан */
  reference: boolean | null
  /** решение МР (только чтение) */
  mrDecision: boolean | null
  /** решение ИИ-медик (только чтение) */
  aiDecision: boolean | null
  /** результты анализа (таймкоды и вероятности) */
  analysisSummary: string
}

type Filters = {
  group: string
  name: string
}

type InspectionNotesTableProps = {
  data: InspectionNote[]
}

const defaultFilters: Filters = {
  group: '',
  name: '',
}

const InspectionNotesTable = ({ data }: InspectionNotesTableProps) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [rows, setRows] = useState<InspectionNote[]>(data)
  const [isEditingReference, setIsEditingReference] = useState(false)

  useEffect(() => {
    setRows(data)
  }, [data])

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleToggleReference = (id: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              reference: !row.reference,
            }
          : row
      )
    )
  }

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (filters.group && !row.group.toLowerCase().includes(filters.group.toLowerCase()))
        return false
      if (filters.name && !row.name.toLowerCase().includes(filters.name.toLowerCase()))
        return false
      return true
    })
  }, [rows, filters])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const renderReferenceCell = (reference: boolean | null) => {
    if (reference === null) return '—'
    return reference ? 'да' : 'нет'
  }

  const renderDecisionCell = (value: boolean | null, reference: boolean | null) => {
    const mismatch = reference != null && value != null && reference !== value
    let text = '—'
    if (value !== null) {
      text = value ? 'да' : 'нет'
    }
    return (
      <span className="notes-decision-cell">
        <span>{text}</span>
        {mismatch && (
          <span
            className="notes-decision-icon-alert"
            aria-label="Не соответствует эталону"
            title="Не соответствует эталону"
          >
            !
          </span>
        )}
      </span>
    )
  }

  return (
    <div className="table-wrapper">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>группа</th>
              <th>наименование</th>
              <th>
                <div className="notes-ref-header">
                  <span>эталон</span>
                  <button
                    type="button"
                    className="notes-ref-edit-btn"
                    onClick={() => setIsEditingReference((v) => !v)}
                    title={isEditingReference ? 'Сохранить эталон' : 'Редактировать эталон'}
                    aria-label={isEditingReference ? 'Сохранить эталон' : 'Редактировать эталон'}
                  >
                    {isEditingReference ? 'Сохранить' : '✏'}
                  </button>
                </div>
              </th>
              <th>решение МР</th>
              <th>решение ИИ-медик</th>
              <th>результаты анализа</th>
            </tr>
            <tr className="data-table-filters">
              <th>
                <input
                  className="data-table-filter-input"
                  value={filters.group}
                  onChange={(e) => handleFilterChange('group', e.target.value)}
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
              <th />
              <th />
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {paged.map((row) => (
              <tr key={row.id} className="data-table-row">
                <td>{row.group}</td>
                <td>{row.name}</td>
                <td>
                  {isEditingReference ? (
                    <span className="notes-decision-cell">
                      <input
                        type="checkbox"
                        checked={!!row.reference}
                        onChange={() => handleToggleReference(row.id)}
                      />
                    </span>
                  ) : (
                    <span>{renderReferenceCell(row.reference)}</span>
                  )}
                </td>
                <td>{renderDecisionCell(row.mrDecision, row.reference)}</td>
                <td>{renderDecisionCell(row.aiDecision, row.reference)}</td>
                <td>{row.analysisSummary || '—'}</td>
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

export default InspectionNotesTable

