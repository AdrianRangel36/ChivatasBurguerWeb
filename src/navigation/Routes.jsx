import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sales from '../screens/sales';
import Login from '../screens/login';
import Home from '../screens/home';
import Users from '../screens/users';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}
