import { useState } from 'react'
import { useParams } from 'react-router-dom'
import SetRunsTable from '../ui/SetRunsTable'
import SetInspectionsTable from '../ui/SetInspectionsTable'
import Modal from '../ui/Modal'
import type { Run } from '../ui/RunsTable'
import type { Inspection } from '../ui/InspectionsTable'

type SetInfo = {
  id: string
  name: string
  version: number
  inspectionCount: number
  updatedAt: string
}

const SetDetailsPage = () => {
  const { id } = useParams()

  const [setInfo] = useState<SetInfo | null>(() =>
    id
      ? {
          id,
          name: 'Набор осмотров Q1',
          version: 2,
          inspectionCount: 2,
          updatedAt: '2026-02-17T12:00:00',
        }
      : null
  )

  const [runs] = useState<Run[]>([
    {
      id: 'run-0001',
      savVersionId: 'sav-1.0.0',
      setId: id ?? 'set-0001',
      setVersion: 2,
      inspectionId: undefined,
      startedAt: '2026-02-17T10:00:00',
      completedAt: '2026-02-17T10:15:00',
      status: 'завершен успешно',
      processedCount: 120,
      totalCount: 120,
      initiator: 'expert01',
    },
  ])

  const [inspections, setInspections] = useState<Inspection[]>([
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
  ])

  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false)
  const [savVersion, setSavVersion] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedInspectionId, setSelectedInspectionId] = useState('')

  const [isInfoCollapsed, setIsInfoCollapsed] = useState(false)
  const [isRunsCollapsed, setIsRunsCollapsed] = useState(false)
  const [isInspectionsCollapsed, setIsInspectionsCollapsed] = useState(false)

  const allAvailable: Inspection[] = [
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
  const availableInspections = allAvailable.filter(
    (i) => !inspections.some((x) => x.id === i.id)
  )

  const handleLaunchCalc = () => {
    setIsCalcModalOpen(false)
    setSavVersion('')
  }

  const handleAddInspection = () => {
    const insp = availableInspections.find((i) => i.id === selectedInspectionId)
    if (insp) {
      setInspections((prev) => [...prev, insp])
      setSelectedInspectionId('')
      setIsAddModalOpen(false)
    }
  }

  if (!setInfo) {
    return (
      <div className="page-card">
        <div className="placeholder">Набор не найден.</div>
      </div>
    )
  }

  return (
    <div>
      <div className="section-card">
        <div className={`section-card-header ${isInfoCollapsed ? 'compact' : ''}`}>
          <button
            type="button"
            className="section-toggle"
            onClick={() => setIsInfoCollapsed((v) => !v)}
            aria-expanded={!isInfoCollapsed}
          >
            <span className="section-title">Набор #{setInfo.id} — общие данные</span>
            <span className="section-toggle-icon" aria-hidden>
              {isInfoCollapsed ? '▶' : '▼'}
            </span>
          </button>
        </div>
        {!isInfoCollapsed && (
          <div className="section-body">
            <div className="set-info-list">
              <div className="set-info-row">
                <span className="set-info-param">Идентификатор набора</span>
                <span className="set-info-value">{setInfo.id}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Наименование набора</span>
                <span className="set-info-value">{setInfo.name}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Текущая версия набора</span>
                <span className="set-info-value">{setInfo.version}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Количество осмотров в наборе</span>
                <span className="set-info-value">{inspections.length}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Дата последнего изменения</span>
                <span className="set-info-value">
                  {new Date(setInfo.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="section-card">
        <div className={`section-card-header ${isRunsCollapsed ? 'compact' : ''}`}>
          <button
            type="button"
            className="section-toggle"
            onClick={() => setIsRunsCollapsed((v) => !v)}
            aria-expanded={!isRunsCollapsed}
          >
            <span className="section-title">Перечень запусков по набору</span>
            <span className="section-toggle-icon" aria-hidden>
              {isRunsCollapsed ? '▶' : '▼'}
            </span>
          </button>
          <div
            className="page-actions"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <button
              type="button"
              className="app-button"
              onClick={() => setIsCalcModalOpen(true)}
            >
              Запустить анализ в САВ
            </button>
          </div>
        </div>
        {!isRunsCollapsed && (
          <div className="section-body">
            <SetRunsTable data={runs} />
          </div>
        )}
      </div>

      <div className="section-card">
        <div className={`section-card-header ${isInspectionsCollapsed ? 'compact' : ''}`}>
          <button
            type="button"
            className="section-toggle"
            onClick={() => setIsInspectionsCollapsed((v) => !v)}
            aria-expanded={!isInspectionsCollapsed}
          >
            <span className="section-title">Перечень осмотров, входящих в набор</span>
            <span className="section-toggle-icon" aria-hidden>
              {isInspectionsCollapsed ? '▶' : '▼'}
            </span>
          </button>
          <div
            className="page-actions"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <button
              type="button"
              className="app-button"
              onClick={() => setIsAddModalOpen(true)}
            >
              Добавить
            </button>
          </div>
        </div>
        {!isInspectionsCollapsed && (
          <div className="section-body">
            <SetInspectionsTable data={inspections} />
          </div>
        )}
      </div>

      {isCalcModalOpen && (
        <Modal title="Запустить анализ в САВ" onClose={() => setIsCalcModalOpen(false)}>
          <div className="modal-form-field">
            <label className="modal-label" htmlFor="sav-version">
              Версия САВ
            </label>
            <select
              id="sav-version"
              className="modal-select"
              value={savVersion}
              onChange={(e) => setSavVersion(e.target.value)}
            >
              <option value="">Выберите версию</option>
              <option value="sav-1.0.0">sav-1.0.0</option>
              <option value="sav-1.1.0">sav-1.1.0</option>
            </select>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="app-button app-button-ghost"
              onClick={() => setIsCalcModalOpen(false)}
            >
              Отменить
            </button>
            <button
              type="button"
              className="app-button"
              onClick={handleLaunchCalc}
              disabled={!savVersion}
            >
              Запустить
            </button>
          </div>
        </Modal>
      )}

      {isAddModalOpen && (
        <Modal title="Добавить осмотр" onClose={() => setIsAddModalOpen(false)}>
          <div className="modal-form-field">
            <label className="modal-label" htmlFor="inspection-select">
              Осмотр
            </label>
            <select
              id="inspection-select"
              className="modal-select"
              value={selectedInspectionId}
              onChange={(e) => setSelectedInspectionId(e.target.value)}
            >
              <option value="">Выберите осмотр</option>
              {availableInspections.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.id} — {i.externalId}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="app-button app-button-ghost"
              onClick={() => setIsAddModalOpen(false)}
            >
              Отменить
            </button>
            <button
              type="button"
              className="app-button"
              onClick={handleAddInspection}
              disabled={!selectedInspectionId}
            >
              Добавить
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SetDetailsPage
