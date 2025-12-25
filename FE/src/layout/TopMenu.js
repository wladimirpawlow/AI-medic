import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TopMenu.css';

const TopMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Моковые данные пользователя (в реальном приложении будут из контекста/состояния)
  const [user] = useState({
    name: 'Иван Иванов',
    role: 'Администратор'
  });

  const menuItems = [
    { path: '/remarks', label: 'Замечания' },
    { path: '/inspections', label: 'Осмотры' },
    { path: '/statistics', label: 'Статистика' },
    { path: '/selections', label: 'Выборки' },
  ];

  // Закрытие выпадающего меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    // Здесь будет логика выхода
    console.log('Выход из системы');
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="top-menu">
      <div className="menu-container">
        <div className="menu-left">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`menu-button ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="menu-right">
          <div className="login-dropdown" ref={dropdownRef}>
            <button
              className="login-button"
              onClick={toggleDropdown}
            >
              Логин
            </button>
            {isDropdownOpen && (
              <div className="dropdown-content">
                <div className="dropdown-item">
                  <strong>Имя:</strong> {user.name}
                </div>
                <div className="dropdown-item">
                  <strong>Роль:</strong> {user.role}
                </div>
                <div className="dropdown-divider"></div>
                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;

