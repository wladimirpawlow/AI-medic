import { NavLink, Outlet } from 'react-router-dom'
import './layout.css'

const AppLayout = () => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-left">
          <div className="app-logo">MedControl</div>
          <nav className="app-nav">
            <NavLink to="/inspections" className="app-nav-link">
              Осмотры
            </NavLink>
            <NavLink to="/sets" className="app-nav-link">
              Наборы
            </NavLink>
            <NavLink to="/runs" className="app-nav-link">
              Запуски
            </NavLink>
            <NavLink to="/group-runs" className="app-nav-link">
              Запуски наборов
            </NavLink>
            <NavLink to="/calculations" className="app-nav-link">
              Расчеты
            </NavLink>
            <NavLink to="/notes" className="app-nav-link">
              Замечания
            </NavLink>
          </nav>
        </div>
        <div className="app-header-user">
          <div className="app-user-info">
            <span className="app-user-login">user@example.com</span>
            <span className="app-user-role">Эксперт</span>
          </div>
          <button className="app-button app-button-ghost" type="button">
            Выйти
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout

