import { useState } from 'react'
import InspectionsTable, { type Inspection } from '../ui/InspectionsTable'
import Modal from '../ui/Modal'

const InspectionsPage = () => {
  const [isAddToSetOpen, setIsAddToSetOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  // TODO: заменить на загрузку данных с бэкенда
  const mockData: Inspection[] = [
    {
      id: 'c1f0b6c2-0001-4000-8000-000000000001',
      externalId: 'ext-0001',
      contractor: 'ООО МедКонтрагент 1',
      employeeId: 'emp-0001',
      pacId: 'pac-0001',
      pacType: 'стационарный',
      isReference: 'совпадает с МР',
      hasDoctorNotes: true,
      uploadedAt: '2026-02-17T09:30:00',
    },
    {
      id: 'c1f0b6c2-0002-4000-8000-000000000002',
      externalId: 'ext-0002',
      contractor: 'ООО МедКонтрагент 2',
      employeeId: 'emp-0002',
      pacId: 'pac-0002',
      pacType: 'мобильный',
      isReference: 'нет эталона',
      hasDoctorNotes: false,
      uploadedAt: '2026-02-16T14:15:00',
    },
    {
      id: 'c1f0b6c2-0003-4000-8000-000000000003',
      externalId: 'ext-0003',
      contractor: 'ООО МедКонтрагент 3',
      employeeId: 'emp-0003',
      pacId: 'pac-0003',
      pacType: 'стационарный',
      isReference: 'не совпадает с МР',
      hasDoctorNotes: true,
      uploadedAt: '2026-02-15T11:45:00',
    },
  ]

  return (
    <div className="page-card">
      <div className="page-header">
        <div />
        <div className="page-actions">
          <button
            className="app-button"
            type="button"
            onClick={() => setIsUploadOpen(true)}
          >
            Загрузить осмотры
          </button>
          <button
            className="app-button app-button-ghost"
            type="button"
            onClick={() => setIsAddToSetOpen(true)}
          >
            Добавить выбранное в набор
          </button>
        </div>
      </div>
      <InspectionsTable data={mockData} />

      {isAddToSetOpen && (
        <Modal title="Добавить выбранное в набор" onClose={() => setIsAddToSetOpen(false)}>
          <div className="modal-form-field">
            <label className="modal-label" htmlFor="set-select">
              Набор
            </label>
            <select id="set-select" className="modal-select" defaultValue="">
              <option value="" disabled>
                Выберите набор
              </option>
              <option value="set-1">Набор 1</option>
              <option value="set-2">Набор 2</option>
            </select>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="app-button app-button-ghost"
              onClick={() => setIsAddToSetOpen(false)}
            >
              Отменить
            </button>
            <button
              type="button"
              className="app-button"
              onClick={() => setIsAddToSetOpen(false)}
            >
              Добавить
            </button>
          </div>
        </Modal>
      )}

      {isUploadOpen && (
        <Modal title="Загрузить осмотры" onClose={() => setIsUploadOpen(false)}>
          <div className="modal-form-field">
            <label className="modal-label" htmlFor="external-ids">
              Массив внешних идентификаторов
            </label>
            <textarea
              id="external-ids"
              className="modal-textarea"
              placeholder='Например: ["ext-0001","ext-0002"] или список post-строк'
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="app-button app-button-ghost"
              onClick={() => setIsUploadOpen(false)}
            >
              Отменить
            </button>
            <button
              type="button"
              className="app-button"
              onClick={() => setIsUploadOpen(false)}
            >
              Загрузить
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default InspectionsPage

