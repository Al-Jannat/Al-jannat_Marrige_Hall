import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Header = styled(motion.header)`
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(248, 241, 233, 0.2);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-bottom: 1px solid rgba(232, 185, 35, 0.3);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const LogoContainer = styled.div`
  flex-grow: 1;
  text-align: center;
`;

export const Logo = styled(motion.img)`
  height: 44px;
  border: 2px solid #e8b923;
  border-radius: 8px;
  padding: 4px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 36px;
  }
`;

export const RightControls = styled.div`
  position: absolute;
  top: 12px;
  right: 20px;

  @media (max-width: 768px) {
    right: 14px;
    top: 10px;
  }
`;

export const LogoutButton = styled(motion.button)`
  background: none;
  border: none;
  color: #1a1a1a;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #d4a017;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const LogoutDropdown = styled(motion.div)`
  position: absolute;
  top: 40px;
  right: 0;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(232, 185, 35, 0.3);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 101;
  width: 120px;
`;

export const LogoutItem = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  padding: 10px 15px;
  text-align: left;
  font-family: 'Lora', serif;
  font-size: 0.9rem;
  color: #1a1a1a;
  cursor: pointer;

  &:hover {
    background: rgba(42, 111, 94, 0.7);
    color: white;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 8px 12px;
  }
`;
