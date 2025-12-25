import React, { useState, useMemo } from 'react';
import './Page.css';
import './RemarksPage.css';

const RemarksPage = () => {
  // Тестовые данные
  const [data, setData] = useState([
    {
      id: 1,
      group: 'Группа А',
      name: 'Наименование 1',
      code: 'CODE-001',
      description: 'Описание первого замечания с подробной информацией о проблеме'
    },
    {
      id: 2,
      group: 'Группа Б',
      name: 'Наименование 2',
      code: 'CODE-002',
      description: 'Описание второго замечания с детальным описанием обнаруженных недостатков'
    },
    {
      id: 3,
      group: 'Группа А',
      name: 'Наименование 3',
      code: 'CODE-003',
      description: 'Описание третьего замечания'
    },
    {
      id: 4,
      group: 'Группа В',
      name: 'Наименование 4',
      code: 'CODE-004',
      description: 'Описание четвертого замечания с полной информацией о выявленных проблемах и рекомендациях'
    },
    {
      id: 5,
      group: 'Группа Б',
      name: 'Наименование 5',
      code: 'CODE-005',
      description: 'Описание пятого замечания'
    }
  ]);

  // Состояние для сортировки
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Состояние для фильтров поиска
  const [filters, setFilters] = useState({
    group: '',
    name: '',
    code: '',
    description: ''
  });

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
    console.log('Редактирование записи:', id);
    // Здесь будет логика редактирования
  };

  // Обработка удаления
  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      setData(prevData => prevData.filter(item => item.id !== id));
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
      <h1>Замечания</h1>
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
                  <span>Код</span>
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
              <th className="actions-header">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">Нет данных для отображения</td>
              </tr>
            ) : (
              filteredAndSortedData.map(item => (
                <tr key={item.id}>
                  <td>{item.group}</td>
                  <td>{item.name}</td>
                  <td>{item.code}</td>
                  <td>{item.description}</td>
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
    </div>
  );
};

export default RemarksPage;

