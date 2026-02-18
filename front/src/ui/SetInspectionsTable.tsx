import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from './Pagination'
import type { Inspection } from './InspectionsTable'

type SetInspectionsTableProps = {
  data: Inspection[]
}

const SetInspectionsTable = ({ data }: SetInspectionsTableProps) => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize])

  const allSelected = data.length > 0 && data.every((i) => selectedIds.has(i.id))
  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(data.map((i) => i.id)))
  }
  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="table-wrapper">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  aria-label="Выделить все"
                  checked={allSelected}
                  onChange={toggleAll}
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
            </tr>
          </thead>
          <tbody>
            {paged.map((item) => (
              <tr key={item.id} className="data-table-row">
                <td
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleOne(item.id)
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
                    <span className="badge badge-neutral" title="Нет эталона">Ø</span>
                  )}
                  {item.isReference === 'совпадает с МР' && (
                    <span className="badge badge-success" title="Эталон совпадает с МР">✔</span>
                  )}
                  {item.isReference === 'не совпадает с МР' && (
                    <span className="badge badge-danger" title="Эталон не совпадает с МР">✕</span>
                  )}
                </td>
                <td>
                  {item.hasDoctorNotes ? (
                    <span className="badge badge-warning" title="Есть замечания МР">!</span>
                  ) : (
                    <span className="badge badge-muted" title="Замечаний нет">—</span>
                  )}
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={9} className="data-table-empty">
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
        total={data.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1)
          setPageSize(size)
        }}
      />
    </div>
  )
}

export default SetInspectionsTable
