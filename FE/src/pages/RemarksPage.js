import React, { useState, useMemo, useEffect } from 'react';
import './Page.css';
import './RemarksPage.css';

const RemarksPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояние модального окна редактирования
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    group: '',
    description: '',
  });

  // Состояние модального окна подтверждения удаления
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  // Состояние модального окна создания
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    group: '',
    description: '',
  });

  // Состояние для сортировки
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Состояние для фильтров поиска
  const [filters, setFilters] = useState({
    group: '',
    name: '',
    code: '',
    description: ''
  });

  // Функция загрузки данных (переиспользуемая)
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        '/api/processing/setpoints/features/amount?amount=100',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData = await response.json();

      const transformedData = apiData
        .filter(item => item.active === true)
        .map(item => ({
          id: item.id,
          // отображаемая группа
          group: item.type ?? '',
          // поля, которые могут редактироваться
          name: item.name ?? '',
          description: item.description ?? '',
          // дополнительные поля, которые нужны для PUT-запроса и остаются исходными
          type: item.type ?? '',
          priority: item.priority,
          default_threshold: item.default_threshold,
          active: item.active,
          // идентификатор в таблице
          code: String(item.id ?? ''),
        }));

      setData(transformedData);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      setError('Не удалось загрузить данные. Попробуйте обновить страницу.');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchData();
  }, []);

  // Обработка сортировки
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Обработка изменения фильтров
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Фильтрация и сортировка данных
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      return (
        item.group.toLowerCase().includes(filters.group.toLowerCase()) &&
        item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        item.code.toLowerCase().includes(filters.code.toLowerCase()) &&
        item.description.toLowerCase().includes(filters.description.toLowerCase())
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, filters, sortConfig]);

  // Обработка редактирования
  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    if (!itemToEdit) return;

    setEditingItem(itemToEdit);
    setEditForm({
      name: itemToEdit.name || '',
      group: itemToEdit.group || '',
      description: itemToEdit.description || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      const payload = {
        name: editForm.name,
        description: editForm.description,
        type: editForm.group,
        priority: editingItem.priority,
        default_threshold: editingItem.default_threshold,
        active: editingItem.active
      };

      const response = await fetch(
        `/api/processing/setpoints/features/${editingItem.id}/settings`,
        {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Получаем актуальные данные из ответа и обновляем таблицу
      const updatedItem = await response.json();

      setData((prevData) =>
        prevData.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: updatedItem.name ?? editForm.name,
                group: updatedItem.type ?? editForm.group,
                description: updatedItem.description ?? editForm.description,
                type: updatedItem.type ?? editForm.group,
                priority: updatedItem.priority ?? item.priority,
                default_threshold: updatedItem.default_threshold ?? item.default_threshold,
                active: updatedItem.active ?? item.active,
              }
            : item
        )
      );

      handleCloseEditModal();
    } catch (err) {
      console.error('Ошибка при сохранении изменений:', err);
      window.alert('Не удалось сохранить изменения. Попробуйте еще раз.');
    }
  };

  // Обработка удаления — открытие модального окна подтверждения
  const handleDelete = (id) => {
    const itemToDelete = data.find((item) => item.id === id);
    if (!itemToDelete) return;

    setDeletingItem(itemToDelete);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    try {
      const payload = {
        name: deletingItem.name,
        description: deletingItem.description,
        type: deletingItem.type || deletingItem.group,
        priority: deletingItem.priority,
        default_threshold: deletingItem.default_threshold,
        active: false,
      };

      const response = await fetch(
        `/api/processing/setpoints/features/${deletingItem.id}/settings`,
        {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // После успешного обновления скрываем строку (т.к. active = false)
      setData((prevData) =>
        prevData.filter((item) => item.id !== deletingItem.id)
      );

      handleCloseDeleteModal();
    } catch (err) {
      console.error('Ошибка при удалении записи:', err);
      window.alert('Не удалось удалить запись. Попробуйте еще раз.');
    }
  };

  // Обработка создания
  const handleOpenCreateModal = () => {
    setCreateForm({
      name: '',
      group: '',
      description: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateFormChange = (field, value) => {
    setCreateForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateForm({
      name: '',
      group: '',
      description: '',
      description: true
        });
  };

  const handleSaveCreate = async () => {
    try {
      const payload = {
        name: createForm.name,
        description: createForm.description,
        type: createForm.group,
        active: true
      };

      const response = await fetch(
        '/api/processing/setpoints/features',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // После успешного создания обновляем данные таблицы
      await fetchData();

      handleCloseCreateModal();
    } catch (err) {
      console.error('Ошибка при создании записи:', err);
      window.alert('Не удалось создать запись. Попробуйте еще раз.');
    }
  };

  // Иконка сортировки
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="sort-icon">⇅</span>;
    }
    return <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Замечания</h1>
        <button className="create-button" onClick={handleOpenCreateModal}>
          Создать
        </button>
      </div>
      {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка данных...</div>}
      {error && <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>}
      <div className="remarks-table-container">
        <table className="remarks-table">
          <thead>
            <tr>
              <th>
                <div className="th-content">
                  <span>Группа</span>
                  <button 
                    className="sort-button" 
                    onClick={() => handleSort('group')}
                    title="Сортировать"
                  >
                    <SortIcon columnKey="group" />
                  </button>
                </div>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Поиск..."
                  value={filters.group}
                  onChange={(e) => handleFilterChange('group', e.target.value)}
                  maxLength={50}
                />
              </th>
              <th>
                <div className="th-content">
                  <span>Наименование</span>
                  <button 
                    className="sort-button" 
                    onClick={() => handleSort('name')}
                    title="Сортировать"
                  >
                    <SortIcon columnKey="name" />
                  </button>
                </div>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Поиск..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  maxLength={50}
                />
              </th>
              <th>
                <div className="th-content">
                  <span>Описание</span>
                  <button 
                    className="sort-button" 
                    onClick={() => handleSort('description')}
                    title="Сортировать"
                  >
                    <SortIcon columnKey="description" />
                  </button>
                </div>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Поиск..."
                  value={filters.description}
                  onChange={(e) => handleFilterChange('description', e.target.value)}
                  maxLength={255}
                />
              </th>
              <th>
                <div className="th-content">
                  <span>Идентификатор</span>
                  <button 
                    className="sort-button" 
                    onClick={() => handleSort('code')}
                    title="Сортировать"
                  >
                    <SortIcon columnKey="code" />
                  </button>
                </div>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Поиск..."
                  value={filters.code}
                  onChange={(e) => handleFilterChange('code', e.target.value)}
                  maxLength={50}
                />
              </th>
              <th className="actions-header">Действия</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredAndSortedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">Нет данных для отображения</td>
              </tr>
            ) : (
              filteredAndSortedData.map(item => (
                <tr key={item.id}>
                  <td>{item.group}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.code}</td>
                  <td className="actions-cell">
                    <button
                      className="action-button edit-button"
                      onClick={() => handleEdit(item.id)}
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(item.id)}
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <div className="remarks-modal-overlay">
          <div className="remarks-modal">
            <div className="remarks-modal-header">
              <h2>Редактирование замечания</h2>
            </div>
            <div className="remarks-modal-body">
              <div className="remarks-modal-field">
                <label>Группа</label>
                <input
                  type="text"
                  value={editForm.group}
                  maxLength={50}
                  onChange={(e) => handleEditFormChange('group', e.target.value)}
                />
              </div>
              <div className="remarks-modal-field">
                <label>Наименование</label>
                <input
                  type="text"
                  value={editForm.name}
                  maxLength={50}
                  onChange={(e) => handleEditFormChange('name', e.target.value)}
                />
              </div>
              <div className="remarks-modal-field">
                <label>Описание</label>
                <textarea
                  value={editForm.description}
                  maxLength={255}
                  onChange={(e) => handleEditFormChange('description', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <div className="remarks-modal-footer">
              <button className="remarks-modal-button cancel" onClick={handleCloseEditModal}>
                Отменить
              </button>
              <button className="remarks-modal-button save" onClick={handleSaveEdit}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="remarks-modal-overlay">
          <div className="remarks-modal">
            <div className="remarks-modal-header">
              <h2>Подтверждение удаления</h2>
            </div>
            <div className="remarks-modal-body">
              <p>
                Вы уверены, что хотите удалить замечание{' '}
                <strong>{deletingItem?.name}</strong>?
              </p>
            </div>
            <div className="remarks-modal-footer">
              <button
                className="remarks-modal-button cancel"
                onClick={handleCloseDeleteModal}
              >
                Отменить
              </button>
              <button
                className="remarks-modal-button save"
                onClick={handleConfirmDelete}
              >
                Да
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="remarks-modal-overlay">
          <div className="remarks-modal">
            <div className="remarks-modal-header">
              <h2>Создать замечание</h2>
            </div>
            <div className="remarks-modal-body">
              <div className="remarks-modal-field">
                <label>Группа</label>
                <input
                  type="text"
                  value={createForm.group}
                  maxLength={50}
                  onChange={(e) => handleCreateFormChange('group', e.target.value)}
                />
              </div>
              <div className="remarks-modal-field">
                <label>Наименование</label>
                <input
                  type="text"
                  value={createForm.name}
                  maxLength={50}
                  onChange={(e) => handleCreateFormChange('name', e.target.value)}
                />
              </div>
              <div className="remarks-modal-field">
                <label>Описание</label>
                <textarea
                  value={createForm.description}
                  maxLength={255}
                  onChange={(e) => handleCreateFormChange('description', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <div className="remarks-modal-footer">
              <button className="remarks-modal-button cancel" onClick={handleCloseCreateModal}>
                Отменить
              </button>
              <button className="remarks-modal-button save" onClick={handleSaveCreate}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemarksPage;

