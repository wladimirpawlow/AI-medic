import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InspectionRunsTable from '../ui/InspectionRunsTable'
import type { Run } from '../ui/RunsTable'
import InspectionNotesTable, { type InspectionNote } from '../ui/InspectionNotesTable'
import Modal from '../ui/Modal'

type InspectionInfo = {
  id: string
  externalId: string
  contractorId: string
  employeeId: string
  orgId: string
  mrId: string
  medOrgId: string
  pacId: string
  pacType: string
  inspectionType: string
  conditions: string
  measurements: string
}

const InspectionDetailsPage = () => {
  const { id } = useParams()

  const [info] = useState<InspectionInfo | null>(() =>
    id
      ? {
          id,
          externalId: 'ext-0001',
          contractorId: 'cont-0001',
          employeeId: 'emp-0001',
          orgId: 'org-0001',
          mrId: 'mr-0001',
          medOrgId: 'medorg-0001',
          pacId: 'pac-0001',
          pacType: 'стационарный',
          inspectionType: 'первичный',
          conditions: 'Температура 22°C, влажность 45%, освещенность 500 лк',
          measurements: 'Алкоголь: 0.0‰, давление: 120/80, температура: 36.6°C',
        }
      : null
  )

  const [runs] = useState<Run[]>([
    {
      id: 'run-0101',
      savVersionId: 'sav-1.0.0',
      setId: '',
      setVersion: 0,
      inspectionId: id ?? 'inspection-0001',
      startedAt: '2026-02-18T09:00:00',
      completedAt: '2026-02-18T09:05:00',
      status: 'завершен успешно',
      processedCount: 1,
      totalCount: 1,
      initiator: 'expert01',
    },
    {
      id: 'run-0102',
      savVersionId: 'sav-1.1.0',
      setId: '',
      setVersion: 0,
      inspectionId: id ?? 'inspection-0001',
      startedAt: '2026-02-17T15:30:00',
      completedAt: undefined,
      status: 'обработка',
      processedCount: 0,
      totalCount: 1,
      initiator: 'expert02',
    },
    {
      id: 'run-0103',
      savVersionId: 'sav-1.0.0',
      setId: '',
      setVersion: 0,
      inspectionId: id ?? 'inspection-0001',
      startedAt: '2026-02-17T10:15:00',
      completedAt: '2026-02-17T10:20:00',
      status: 'завершен успешно',
      processedCount: 1,
      totalCount: 1,
      initiator: 'expert01',
    },
    {
      id: 'run-0104',
      savVersionId: 'sav-1.2.0',
      setId: '',
      setVersion: 0,
      inspectionId: id ?? 'inspection-0001',
      startedAt: '2026-02-16T08:45:00',
      completedAt: undefined,
      status: 'в очереди',
      processedCount: 0,
      totalCount: 1,
      initiator: 'user01',
    },
    {
      id: 'run-0105',
      savVersionId: 'sav-1.0.1',
      setId: '',
      setVersion: 0,
      inspectionId: id ?? 'inspection-0001',
      startedAt: '2026-02-15T14:00:00',
      completedAt: '2026-02-15T14:06:00',
      status: 'остановлен',
      processedCount: 1,
      totalCount: 1,
      initiator: 'admin',
    },
    {
      id: 'run-0106',
      savVersionId: 'sav-1.3.0',
      setId: '',
      setVersion: 0,
      inspectionId: id ?? 'inspection-0001',
      startedAt: '2026-02-14T09:30:00',
      completedAt: '2026-02-14T09:35:00',
      status: 'завершен успешно',
      processedCount: 1,
      totalCount: 1,
      initiator: 'expert03',
    },
    {
      id: 'run-0107',
      savVersionId: 'sav-1.1.1',
      setId: '',
      setVersion: 0,
      inspectionId: id ?? 'inspection-0001',
      startedAt: '2026-02-13T11:10:00',
      completedAt: undefined,
      status: 'обработка',
      processedCount: 0,
      totalCount: 1,
      initiator: 'expert02',
    },
    {
      id: 'run-0108',
      savVersionId: 'sav-1.2.1',
      setId: '',
      setVersion: 0,
      inspectionId: id ?? 'inspection-0001',
      startedAt: '2026-02-12T16:20:00',
      completedAt: '2026-02-12T16:25:00',
      status: 'завершен успешно',
      processedCount: 1,
      totalCount: 1,
      initiator: 'expert01',
    },
  ])

  const [notes, setNotes] = useState<InspectionNote[]>([])

  const [isGlobalSavModalOpen, setIsGlobalSavModalOpen] = useState(false)
  const [globalSavVersion, setGlobalSavVersion] = useState('')
  const [activeFrame, setActiveFrame] = useState<string | null>(null)

  const loadNotes = useCallback(async () => {
    try {
      const response = await fetch('/api/processing/setpoints/features/amount?amount=100', {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const apiData = await response.json()
      const transformed: InspectionNote[] = (apiData as Array<Record<string, unknown>>)
        .filter((item) => item.active === true)
        .map((item) => ({
          id: String(item.id ?? ''),
          group: String(item.type ?? ''),
          name: String(item.name ?? ''),
          reference: null,
          mrDecision: null,
          aiDecision: null,
          analysisSummary: '',
        }))

      // Добавим несколько примеров заполненных данных для демонстрации колонок
      if (transformed.length > 0) {
        transformed[0] = {
          ...transformed[0],
          reference: true,
          mrDecision: true,
          aiDecision: true,
          analysisSummary: '0.9 (0–35с), 0.7 (35–55с)',
        }
      }
      if (transformed.length > 1) {
        transformed[1] = {
          ...transformed[1],
          reference: false,
          mrDecision: true,
          aiDecision: false,
          analysisSummary: '0.6 (10–25с)',
        }
      }
      if (transformed.length > 2) {
        transformed[2] = {
          ...transformed[2],
          reference: null,
          mrDecision: null,
          aiDecision: false,
          analysisSummary: '0.8 (5–20с)',
        }
      }

      setNotes(transformed)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Ошибка при загрузке замечаний для осмотра:', err)
    }
  }, [])

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  if (!info) {
    return (
      <div className="page-card">
        <div className="placeholder">Осмотр не найден.</div>
      </div>
    )
  }

  return (
    <div>
      <div className="inspection-main-grid">
        {/* Общие данные по осмотру */}
        <div className="section-card">
          <div className="section-card-header">
            <h2 className="section-title">Осмотр #{info.id} — общие данные</h2>
          </div>
          <div className="section-body">
            <div className="set-info-list inspection-info">
              <div className="set-info-row">
                <span className="set-info-param">Внутренний id медосмотра</span>
                <span className="set-info-value">{info.id}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Внешний идентификатор медосмотра</span>
                <span className="set-info-value">{info.externalId}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Идентификатор контрагента</span>
                <span className="set-info-value">{info.contractorId}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Идентификатор сотрудника</span>
                <span className="set-info-value">{info.employeeId}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Идентификатор организации</span>
                <span className="set-info-value">{info.orgId}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Идентификатор МР</span>
                <span className="set-info-value">{info.mrId}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Идентификатор мед-организации</span>
                <span className="set-info-value">{info.medOrgId}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Идентификатор ПАК</span>
                <span className="set-info-value">{info.pacId}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Тип ПАК</span>
                <span className="set-info-value">{info.pacType}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Тип осмотра</span>
                <span className="set-info-value">{info.inspectionType}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Условия проведения</span>
                <span className="set-info-value">{info.conditions}</span>
              </div>
              <div className="set-info-row">
                <span className="set-info-param">Результаты измерений</span>
                <span className="set-info-value">{info.measurements}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Материалы (справа от общих данных) */}
        <div className="section-card">
          <div className="section-card-header">
            <h2 className="section-title">Материалы</h2>
          </div>
          <div className="section-body">
            <div className="materials-layout">
              <div className="materials-main">
                <div className="materials-title">Видеозапись</div>
                <div className="materials-placeholder">Плеер видеозаписи (заглушка)</div>

                <div className="materials-title materials-subtitle">Таймкоды видеозаписи</div>
                <ul className="materials-list">
                  <li>00:10 — начало осмотра</li>
                  <li>00:45 — измерение давления</li>
                  <li>01:20 — завершение осмотра</li>
                </ul>

                <div className="materials-title materials-subtitle">
                  Кадры высокого разрешения (таймкоды)
                </div>
                <ul className="materials-list">
                  <li>
                    <button
                      type="button"
                      className="frame-thumb-btn"
                      onClick={() => setActiveFrame('00:12.150')}
                    >
                      <span className="frame-thumb-icon" aria-hidden>
                        ▢
                      </span>
                      <span className="frame-thumb-label">00:12.150</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="frame-thumb-btn"
                      onClick={() => setActiveFrame('00:32.480')}
                    >
                      <span className="frame-thumb-icon" aria-hidden>
                        ▢
                      </span>
                      <span className="frame-thumb-label">00:32.480</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="frame-thumb-btn"
                      onClick={() => setActiveFrame('00:48.900')}
                    >
                      <span className="frame-thumb-icon" aria-hidden>
                        ▢
                      </span>
                      <span className="frame-thumb-label">00:48.900</span>
                    </button>
                  </li>
                </ul>
              </div>
              <div className="materials-side">
                <div className="materials-title">Фото сотрудника</div>
                <div className="materials-photo-placeholder">Фото сотрудника (заглушка)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Перечень запусков по осмотру */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-title">Перечень запусков по осмотру</h2>
          <div className="page-actions">
            <button
              type="button"
              className="app-button"
              onClick={() => setIsGlobalSavModalOpen(true)}
            >
              Запустить анализ САВ
            </button>
          </div>
        </div>
        <div className="section-body">
          <InspectionRunsTable data={runs} />
        </div>
      </div>

      {/* Замечания */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-title">Замечания</h2>
        </div>
        <div className="section-body">
          <InspectionNotesTable data={notes} />
        </div>
      </div>

      {activeFrame && (
        <Modal title="Кадр высокого разрешения" onClose={() => setActiveFrame(null)}>
          <div className="frame-modal-image-placeholder">Изображение кадра (заглушка)</div>
          <p className="frame-modal-caption">{activeFrame}</p>
        </Modal>
      )}

      {isGlobalSavModalOpen && (
        <Modal title="Запустить анализ САВ" onClose={() => setIsGlobalSavModalOpen(false)}>
          <div className="modal-form-field">
            <label className="modal-label" htmlFor="global-sav-version">
              Версия САВ
            </label>
            <select
              id="global-sav-version"
              className="modal-select"
              value={globalSavVersion}
              onChange={(e) => setGlobalSavVersion(e.target.value)}
            >
              <option value="">Выберите версию</option>
              <option value="sav-1.0.0">sav-1.0.0</option>
              <option value="sav-1.1.0">sav-1.1.0</option>
              <option value="sav-2.0.0">sav-2.0.0</option>
            </select>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="app-button app-button-ghost"
              onClick={() => setIsGlobalSavModalOpen(false)}
            >
              Отменить
            </button>
            <button
              type="button"
              className="app-button"
              onClick={() => {
                // TODO: запуск анализа САВ по осмотру
                setIsGlobalSavModalOpen(false)
                setGlobalSavVersion('')
              }}
              disabled={!globalSavVersion}
            >
              Запустить
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default InspectionDetailsPage


