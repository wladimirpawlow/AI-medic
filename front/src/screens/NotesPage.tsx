import { useState, useEffect, useCallback } from 'react'
import NotesTable, { type NoteItem } from '../ui/NotesTable'
import Modal from '../ui/Modal'

const API_BASE = '/api/processing/setpoints/features'

const NotesPage = () => {
  const [data, setData] = useState<NoteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<NoteItem | null>(null)
  const [editForm, setEditForm] = useState({ name: '', group: '', description: '' })

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<NoteItem | null>(null)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', group: '', description: '' })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE}/amount?amount=100`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const apiData = await response.json()
      const transformed: NoteItem[] = (apiData as Array<Record<string, unknown>>)
        .filter((item) => item.active === true)
        .map((item) => ({
          id: item.id as number,
          group: (item.type ?? '') as string,
          name: (item.name ?? '') as string,
          description: (item.description ?? '') as string,
          type: (item.type ?? '') as string,
          priority: item.priority as number | undefined,
          default_threshold: item.default_threshold as number | undefined,
          active: item.active as boolean | undefined,
          code: String(item.id ?? ''),
        }))
      setData(transformed)
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err)
      setError('Не удалось загрузить данные. Попробуйте обновить страницу.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleEdit = (id: number) => {
    const item = data.find((i) => i.id === id)
    if (!item) return
    setEditingItem(item)
    setEditForm({
      name: item.name || '',
      group: item.group || '',
      description: item.description || '',
    })
    setIsEditModalOpen(true)
  }

  const handleEditFormChange = (field: 'name' | 'group' | 'description', value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingItem(null)
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return
    try {
      const payload = {
        name: editForm.name,
        description: editForm.description,
        type: editForm.group,
        priority: editingItem.priority,
        default_threshold: editingItem.default_threshold,
        active: editingItem.active,
      }
      const response = await fetch(`${API_BASE}/${editingItem.id}/settings`, {
        method: 'PUT',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const updatedItem = await response.json() as Record<string, unknown>
      setData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: (updatedItem.name ?? editForm.name) as string,
                group: (updatedItem.type ?? editForm.group) as string,
                description: (updatedItem.description ?? editForm.description) as string,
                type: (updatedItem.type ?? editForm.group) as string,
                priority: (updatedItem.priority ?? item.priority) as number | undefined,
                default_threshold: (updatedItem.default_threshold ?? item.default_threshold) as number | undefined,
                active: (updatedItem.active ?? item.active) as boolean | undefined,
              }
            : item
        )
      )
      setError(null)
      handleCloseEditModal()
    } catch (err) {
      console.error('Ошибка при сохранении изменений:', err)
      setError('Не удалось сохранить изменения. Попробуйте еще раз.')
    }
  }

  const handleDelete = (id: number) => {
    const item = data.find((i) => i.id === id)
    if (!item) return
    setDeletingItem(item)
    setIsDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeletingItem(null)
  }

  const handleConfirmDelete = async () => {
    if (!deletingItem) return
    try {
      const payload = {
        name: deletingItem.name,
        description: deletingItem.description,
        type: deletingItem.type ?? deletingItem.group,
        priority: deletingItem.priority,
        default_threshold: deletingItem.default_threshold,
        active: false,
      }
      const response = await fetch(`${API_BASE}/${deletingItem.id}/settings`, {
        method: 'PUT',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      setData((prev) => prev.filter((item) => item.id !== deletingItem.id))
      setError(null)
      handleCloseDeleteModal()
    } catch (err) {
      console.error('Ошибка при удалении записи:', err)
      setError('Не удалось удалить запись. Попробуйте еще раз.')
    }
  }

  const handleOpenCreateModal = () => {
    setCreateForm({ name: '', group: '', description: '' })
    setIsCreateModalOpen(true)
  }

  const handleCreateFormChange = (field: 'name' | 'group' | 'description', value: string) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false)
    setCreateForm({ name: '', group: '', description: '' })
  }

  const handleSaveCreate = async () => {
    try {
      const payload = {
        name: createForm.name,
        description: createForm.description,
        type: createForm.group,
        active: true,
      }
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      setError(null)
      await fetchData()
      handleCloseCreateModal()
    } catch (err) {
      console.error('Ошибка при создании записи:', err)
      setError('Не удалось создать запись. Попробуйте еще раз.')
    }
  }

  return (
    <div className="page-card">
      <div className="page-header">
        <div />
        <div className="page-actions">
          <button type="button" className="app-button" onClick={handleOpenCreateModal}>
            Создать
          </button>
        </div>
      </div>
      <NotesTable
        data={data}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isEditModalOpen && (
        <Modal title="Редактирование замечания" onClose={handleCloseEditModal}>
          <div className="modal-form-field">
            <label className="modal-label">Группа</label>
            <input
              type="text"
              className="modal-input"
              value={editForm.group}
              maxLength={50}
              onChange={(e) => handleEditFormChange('group', e.target.value)}
            />
          </div>
          <div className="modal-form-field">
            <label className="modal-label">Наименование</label>
            <input
              type="text"
              className="modal-input"
              value={editForm.name}
              maxLength={50}
              onChange={(e) => handleEditFormChange('name', e.target.value)}
            />
          </div>
          <div className="modal-form-field">
            <label className="modal-label">Описание</label>
            <textarea
              className="modal-textarea"
              value={editForm.description}
              maxLength={255}
              rows={4}
              onChange={(e) => handleEditFormChange('description', e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="app-button app-button-ghost" onClick={handleCloseEditModal}>
              Отменить
            </button>
            <button type="button" className="app-button" onClick={handleSaveEdit}>
              Сохранить
            </button>
          </div>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal title="Подтверждение удаления" onClose={handleCloseDeleteModal}>
          <p>
            Вы уверены, что хотите удалить замечание <strong>{deletingItem?.name}</strong>?
          </p>
          <div className="modal-actions">
            <button type="button" className="app-button app-button-ghost" onClick={handleCloseDeleteModal}>
              Отменить
            </button>
            <button type="button" className="app-button" onClick={handleConfirmDelete} style={{ background: '#991b1b' }}>
              Да
            </button>
          </div>
        </Modal>
      )}

      {isCreateModalOpen && (
        <Modal title="Создать замечание" onClose={handleCloseCreateModal}>
          <div className="modal-form-field">
            <label className="modal-label">Группа</label>
            <input
              type="text"
              className="modal-input"
              value={createForm.group}
              maxLength={50}
              onChange={(e) => handleCreateFormChange('group', e.target.value)}
            />
          </div>
          <div className="modal-form-field">
            <label className="modal-label">Наименование</label>
            <input
              type="text"
              className="modal-input"
              value={createForm.name}
              maxLength={50}
              onChange={(e) => handleCreateFormChange('name', e.target.value)}
            />
          </div>
          <div className="modal-form-field">
            <label className="modal-label">Описание</label>
            <textarea
              className="modal-textarea"
              value={createForm.description}
              maxLength={255}
              rows={4}
              onChange={(e) => handleCreateFormChange('description', e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="app-button app-button-ghost" onClick={handleCloseCreateModal}>
              Отменить
            </button>
            <button type="button" className="app-button" onClick={handleSaveCreate}>
              Сохранить
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default NotesPage
