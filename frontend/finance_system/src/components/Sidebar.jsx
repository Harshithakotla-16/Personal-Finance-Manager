import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiList,
  FiBarChart2,
  FiUser,
  FiLogOut,
} from 'react-icons/fi';

const Sidebar = ({ onLogout }) => {
  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FiHome /> },
    { path: '/income', name: 'Income', icon: <FiTrendingUp /> },
    { path: '/expenses', name: 'Expenses', icon: <FiTrendingDown /> },
    { path: '/budget', name: 'Budget', icon: <FiDollarSign /> },
    { path: '/transactions', name: 'Transactions', icon: <FiList /> },
    { path: '/reports', name: 'Reports', icon: <FiBarChart2 /> },
    { path: '/profile', name: 'Profile', icon: <FiUser /> },
  ];

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path} className="sidebar-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
        <li className="sidebar-item">
          <button className="sidebar-link" id='logoutbtn' onClick={onLogout}>
            <span className="sidebar-icon">
              <FiLogOut />
            </span>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
