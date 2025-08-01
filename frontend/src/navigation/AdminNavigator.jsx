import React, { createContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../screens/AdminDashboard';
import EditMenuScreen from '../screens/EditMenuScreen';
import HomeImageScreen from '../screens/HomeImageScreen';
import PostersScreen from '../screens/PostersScreen';
import BookingsScreen from '../screens/BookingsScreen';
import AdminLogin from '../screens/AdminLogin';
import AdminSignup from '../screens/AdminSignup';
import AddDishScreen from '../screens/AddDishScreen';
import AddCategoryScreen from '../screens/AddCategoryScreen';
import CategoryImagesScreen from '../screens/CategoryImagesScreen';
import '../styles/AdminNavigator.css';

export const AuthContext = createContext();

export default function AdminNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Force false for testing

  useEffect(() => {
    console.log('AdminNavigator: isAuthenticated:', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <div className="admin-navigator">
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-signup" element={<AdminSignup />} />
            </>
          ) : (
            <>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/edit-menu" element={<EditMenuScreen />} />
              <Route path="/add-dish" element={<AddDishScreen />} />
              <Route path="/add-category" element={<AddCategoryScreen />} />
              <Route path="/home-image" element={<HomeImageScreen />} />
              <Route path="/posters" element={<PostersScreen />} />
              <Route path="/bookings" element={<BookingsScreen />} />
              <Route path="/category-images" element={<CategoryImagesScreen />} />
            </>
          )}
          <Route path="*" element={<AdminLogin />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}