import { useParams } from 'react-router-dom'

const SetDetailsPage = () => {
  const { id } = useParams()

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1 className="page-title">Набор #{id}</h1>
          <p className="page-subtitle">Детальная страница набора с перечнем осмотров и возможностью корректировки.</p>
        </div>
      </div>
      <div className="placeholder">
        Здесь будет детальное описание набора и список всех включенных осмотров с возможностью изменения состава.
      </div>
    </div>
  )
}

export default SetDetailsPage

