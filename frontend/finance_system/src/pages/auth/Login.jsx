import { useState } from "react";
import { login } from "../../services/api";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
localStorage.setItem("userId", response.data.id); 
localStorage.setItem("userName", response.data.name);
localStorage.setItem("userEmail", response.data.email);

window.location.href="/dashboard";
    } catch (err) {
      setError(err.response?.data || "Invalid email or password");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
    <div class="hover-underline">💰 Ledger.Me</div>
      <div className="card" style={{ padding: '32px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Welcome Back</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" className="input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="input" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>Log In</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          Need an account? <a href="/register" style={{ color: '#3b82f6' }}>Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;