import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../navigation/AdminNavigator';
import { FaSignOutAlt } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import {
  Header,
  LogoContainer,
  Logo,
  RightControls,
  LogoutButton,
  LogoutDropdown,
  LogoutItem,
} from '../styles/AdminHeader';

export default function AdminHeader() {
  const navigate = useNavigate();
  const slideAnim = useAnimation();
  const pulseAnim = useAnimation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    slideAnim.start({ y: 0, transition: { duration: 0.6 } });
    pulseAnim.start({
      scale: [1, 1.05, 1],
      transition: { duration: 2, ease: 'easeInOut', repeat: Infinity },
    });
  }, [slideAnim, pulseAnim]);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/admin-login');
  };

  return (
    <Header initial={{ y: -100 }} animate={slideAnim}>
      <LogoContainer>
        <Link to="/">
          <Logo src="/aljannat.png" alt="Al Jannat Logo" animate={pulseAnim} />
        </Link>
      </LogoContainer>

      <RightControls>
        <LogoutButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDropdown}
        >
          <FaSignOutAlt size={22} />
        </LogoutButton>

        {dropdownVisible && (
          <LogoutDropdown
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <LogoutItem onClick={handleLogout}>Logout</LogoutItem>
          </LogoutDropdown>
        )}
      </RightControls>
    </Header>
  );
}
