import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';

const Header = styled(motion.header)`
  background: rgba(248, 241, 233, 0.2); /* Ivory Cream glassmorphic */
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(232, 185, 35, 0.3); /* Light Gold with opacity */
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: #E8B923; /* Light Gold */
    opacity: 0.7;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Logo = styled.img`
  height: 50px;
  cursor: pointer;
`;

const SecondLogo = styled(motion.img)`
  height: 40px;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  position: relative;
`;

const LoginIcon = styled(motion.i)`
  color: #1A1A1A; /* Onyx Black */
  font-size: 1.5rem;
  cursor: pointer;
  &:hover {
    color: #D4A017; /* Deep Gold */
  }
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: 40px;
  right: 0;
  background: rgba(248, 241, 233, 0.2); /* Ivory Cream glassmorphic */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(232, 185, 35, 0.3); /* Light Gold */
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 101;
`;

const DropdownItem = styled(motion.div)`
  padding: 10px 20px;
  color: #1A1A1A; /* Onyx Black */
  font-family: 'Lora', serif;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background: rgba(42, 111, 94, 0.7); /* Emerald Green */
  }
`;

export default function HeaderRow() {
  const navigate = useNavigate();
  const pulseControls = useAnimation();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    pulseControls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 2, ease: 'easeInOut', repeat: Infinity },
    });
  }, [pulseControls]);

  const handleLoginIconPress = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  return (
    <Header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LeftContainer>
        <Logo
          src="/logo2.png"
          alt="Al Jannat Logo"
          onClick={() => navigate('/')}
        />
      </LeftContainer>
      <SecondLogo
        src="/aljannat.png"
        alt="Al Jannat Secondary Logo"
        animate={pulseControls}
        onClick={() => navigate('/')}
      />
      <Nav>
        <LoginIcon
          className="fas fa-sign-in-alt"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLoginIconPress}
        />
        {isDropdownVisible && (
          <Dropdown
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <DropdownItem
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate('/member-login');
                setIsDropdownVisible(false);
              }}
            >
              Login
            </DropdownItem>
            <DropdownItem
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate('/admin-login');
                setIsDropdownVisible(false);
              }}
            >
              Admin
            </DropdownItem>
          </Dropdown>
        )}
      </Nav>
    </Header>
  );
}