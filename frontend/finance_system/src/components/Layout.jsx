import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
const userId = localStorage.getItem("userId");
if(!userId){
    navigate("/login");
}
  }, [navigate]);

const handleLogout = () => {
    localStorage.clear();

    window.location.replace("/login");
};

const user = {
    name: localStorage.getItem("userName")
};
  return (
    <div className="layout">
      <Navbar
        userName={user.name}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
      />
      <Sidebar onLogout={handleLogout} />
      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;
