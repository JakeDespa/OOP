import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import ApiClient from './services/ApiClient';

interface AppState {
  isAuthenticated: boolean;
  loading: boolean;
  theme: 'light' | 'dark';
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isAuthenticated: false,
      loading: true,
      theme: 'light',
    };
  }

  componentDidMount() {
    this.checkAuth();
    this.loadTheme();
  }

  loadTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.applyTheme(savedTheme);
    }
  };

  applyTheme = (theme: 'light' | 'dark') => {
    this.setState({ theme });
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  };

  checkAuth = () => {
    const token = localStorage.getItem('token');
    this.setState({ isAuthenticated: !!token, loading: false });
  }

  handleLogin = () => {
    this.setState({ isAuthenticated: true });
  }

  handleLogout = () => {
    ApiClient.logout();
    this.setState({ isAuthenticated: false });
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    return (
      <Router>
        <Routes>
          <Route path="/login" element={!this.state.isAuthenticated ? <LoginPage onLogin={this.handleLogin} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!this.state.isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={this.state.isAuthenticated ? <Dashboard onLogout={this.handleLogout} onThemeChange={this.applyTheme} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={this.state.isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
