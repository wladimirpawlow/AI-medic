import { useParams } from 'react-router-dom'

const InspectionDetailsPage = () => {
  const { id } = useParams()

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1 className="page-title">Осмотр #{id}</h1>
          <p className="page-subtitle">Детальная страница осмотра с просмотром деталей.</p>
        </div>
      </div>
      <div className="placeholder">
        Здесь будет детальная карточка медосмотра с основной информацией, результатами и связанными сущностями.
      </div>
    </div>
  )
}

export default InspectionDetailsPage

