import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import ServicesScreen from '../screens/ServicesScreen';
import GalleryScreen from '../screens/GalleryScreen';
import LocateUsScreen from '../screens/LocateUsScreen';
import PricingScreen from '../screens/PricingScreen';
import MemberLogin from '../screens/MemberLogin';
 import MenuScreen from '../screens/MenuScreen';
import AdminNavigator from './AdminNavigator';
import CategoryImagesScreen from '../screens/CategoryImagesScreen';
import '../styles/AppNavigator.css';

export default function AppNavigator() {
  return (
    <Router>
      <div className="app-navigator">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/services" element={<ServicesScreen />} />
          <Route path="/gallery" element={<GalleryScreen />} />
          <Route path="/contact" element={<LocateUsScreen />} />
          <Route path="/pricing" element={<PricingScreen />} />
          <Route path="/member-login" element={<MemberLogin />} />
       

<Route path="/menu" element={<MenuScreen />} />
          <Route path="/category-images/:category" element={<CategoryImagesScreen />} />
          <Route path="/admin" element={<AdminNavigator />} />
          <Route path="/*" element={<AdminNavigator />} />
        </Routes>
      </div>
    </Router>
  );
}