import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import {
  FaBars,
  FaTachometerAlt,
  FaUtensils,
  FaList,
  FaImage,
  FaImages,
  FaCalendar,
  FaTimes
} from 'react-icons/fa';
import styled from 'styled-components';

const SidebarContainer = styled(motion.div)`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 250px;
  background-color: #1a1a2e;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 100;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  @media (max-width: 768px) {
    width: 220px;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  padding: 16px;
  font-size: 20px;
  cursor: pointer;
`;

const SidebarHeader = styled.div`
  padding: 16px;
  font-size: 20px;
  font-weight: bold;
  background: #16213e;
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
`;

const SidebarButton = styled(motion.button)`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #fff;
  padding: 12px 0;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  gap: 10px;

  &:hover {
    color: #ffd369;
  }
`;

const SidebarFooter = styled.div`
  padding: 16px;
  text-align: center;
  font-size: 14px;
  background: #16213e;
`;

const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.3);
  z-index: 50;
  @media (min-width: 769px) {
    display: none;
  }
`;

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const slideAnim = useAnimation();

  const menuItems = [
    { name: 'Dashboard', icon: FaTachometerAlt, route: '/admin-dashboard' },
    { name: 'Edit Menu', icon: FaBars, route: '/edit-menu' },
    { name: 'Add Dish', icon: FaUtensils, route: '/add-dish' },
    { name: 'Add Category', icon: FaList, route: '/add-category' },
    { name: 'Home Image', icon: FaImage, route: '/home-image' },
    { name: 'Posters', icon: FaImages, route: '/posters' },
    { name: 'Bookings', icon: FaCalendar, route: '/bookings' },
  ];

  useEffect(() => {
    slideAnim.start({
      x: isOpen ? 0 : -260,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    });
  }, [isOpen]);

  const handleNavigate = (route) => {
    navigate(route);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <>
      <SidebarContainer animate={slideAnim} initial={{ x: -260 }}>
        <div>
          <ToggleButton onClick={() => setIsOpen(false)}>
            <FaTimes />
          </ToggleButton>

          <SidebarHeader>Al Jannat Admin</SidebarHeader>

          <SidebarNav>
            {menuItems.map((item, index) => (
              <SidebarButton
                key={index}
                onClick={() => handleNavigate(item.route)}
                whileHover={{ scale: 1.05 }}
              >
                <item.icon />
                {item.name}
              </SidebarButton>
            ))}
          </SidebarNav>
        </div>

        <div>
          <ToggleButton onClick={() => setIsOpen(false)}>
            <FaTimes />
          </ToggleButton>
          <SidebarFooter>© 2025 Al Jannat</SidebarFooter>
        </div>
      </SidebarContainer>

      {!isOpen && (
        <ToggleButton
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            zIndex: 200,
            backgroundColor: '#1a1a2e',
            padding: 12,
            borderRadius: '50%',
          }}
        >
          <FaBars />
        </ToggleButton>
      )}

      {isOpen && window.innerWidth < 768 && <Overlay onClick={() => setIsOpen(false)} />}
    </>
  );
}
