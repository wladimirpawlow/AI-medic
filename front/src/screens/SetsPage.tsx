import { useState } from 'react'
import SetsTable, { type SetItem } from '../ui/SetsTable'
import Modal from '../ui/Modal'

const SetsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createName, setCreateName] = useState('')

  const [sets, setSets] = useState<SetItem[]>([
    {
      id: 'set-0001',
      name: 'Набор осмотров Q1',
      version: 2,
      inspectionCount: 45,
      updatedAt: '2026-02-17T12:00:00',
    },
    {
      id: 'set-0002',
      name: 'Пилотный набор',
      version: 1,
      inspectionCount: 12,
      updatedAt: '2026-02-16T09:30:00',
    },
  ])

  const handleCreate = () => {
    if (!createName.trim()) return
    setSets((prev) => [
      ...prev,
      {
        id: `set-${Date.now()}`,
        name: createName.trim(),
        version: 1,
        inspectionCount: 0,
        updatedAt: new Date().toISOString().slice(0, 19),
      },
    ])
    setCreateName('')
    setIsCreateOpen(false)
  }

  const handleDelete = (id: string) => {
    setSets((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="page-card">
      <div className="page-header">
        <div />
        <div className="page-actions">
          <button
            type="button"
            className="app-button"
            onClick={() => setIsCreateOpen(true)}
          >
            Создать набор
          </button>
        </div>
      </div>
      <SetsTable data={sets} onDelete={handleDelete} />

      {isCreateOpen && (
        <Modal title="Создать набор" onClose={() => setIsCreateOpen(false)}>
          <div className="modal-form-field">
            <label className="modal-label" htmlFor="set-name">
              Имя набора
            </label>
            <input
              id="set-name"
              type="text"
              className="modal-input"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="Введите наименование набора"
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="app-button app-button-ghost"
              onClick={() => setIsCreateOpen(false)}
            >
              Отменить
            </button>
            <button
              type="button"
              className="app-button"
              onClick={handleCreate}
              disabled={!createName.trim()}
            >
              Создать
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SetsPage
