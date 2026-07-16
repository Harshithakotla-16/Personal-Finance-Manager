import { FiMenu, FiBell, FiLogOut, FiUser } from 'react-icons/fi';

const Header = ({ userName, onMenuToggle, onLogout }) => {
  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="btn btn-secondary"
          onClick={onMenuToggle}
          style={{ display: 'none' }}
        >
          <FiMenu />
        </button>
        <div className="navbar-brand">
          <span style={{ fontSize: '24px' }}>💰</span>
          <span>Ledger.Me</span>
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-icon">
        </div>
        <div className="navbar-user">
          <FiUser />
          <span>{userName || 'User'}</span>
        </div>
        <button
          className="btn btn-outline"
          onClick={onLogout}
          style={{ padding: '8px 16px' }}
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Header;
