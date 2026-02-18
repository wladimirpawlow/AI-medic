type PaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

const Pagination = ({ page, pageSize, total, onPageChange, onPageSizeChange }: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const handlePrev = () => {
    onPageChange(Math.max(1, page - 1))
  }

  const handleNext = () => {
    onPageChange(Math.min(totalPages, page + 1))
  }

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)

  return (
    <div className="pagination">
      <div className="pagination-left">
        <span className="pagination-label">Показать</span>
        <select
          className="pagination-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pagination-label">строк на странице</span>
      </div>
      <div className="pagination-right">
        <span className="pagination-range">
          {from}–{to} из {total}
        </span>
        <button
          type="button"
          className="pagination-button"
          onClick={handlePrev}
          disabled={page === 1}
        >
          Назад
        </button>
        <button
          type="button"
          className="pagination-button"
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Вперед
        </button>
      </div>
    </div>
  )
}

export default Pagination

