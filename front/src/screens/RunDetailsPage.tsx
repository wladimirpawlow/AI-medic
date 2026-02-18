import { useParams } from 'react-router-dom'

const RunDetailsPage = () => {
  const { id } = useParams()

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1 className="page-title">Запуск #{id}</h1>
          <p className="page-subtitle">
            Детальная страница запуска с перечнем осмотров в запуске и их статусом.
          </p>
        </div>
      </div>
      <div className="placeholder">
        Здесь будет информация о запуске, его параметрах и текущем статусе каждого осмотра.
      </div>
    </div>
  )
}

export default RunDetailsPage

