import styled from 'styled-components';
import { motion } from 'framer-motion';

export const SidebarWrapper = styled.div`
  position: relative;
`;

export const SidebarToggle = styled.button`
  position: fixed;
  bottom: 18px;
  left: 18px;
  z-index: 105;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(232, 185, 35, 0.3);
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  color: #1a1a1a;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

export const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 250px;
  background: rgba(248, 241, 233, 0.7);
  backdrop-filter: blur(12px);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.08);
  z-index: 104;
`;

export const SidebarContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

export const SidebarHeader = styled.h2`
  font-size: 1.4rem;
  font-family: 'Lora', serif;
  color: #1a1a1a;
  margin-bottom: 20px;
`;

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SidebarButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: none;
  color: #1a1a1a;
  font-size: 1rem;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(42, 111, 94, 0.1);
  }
`;

export const SidebarIcon = styled.div`
  font-size: 1.2rem;
`;

export const SidebarText = styled.span`
  font-family: 'Lora', serif;
`;

export const SidebarFooter = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: #666;
`;

export const SidebarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 250px;
  width: calc(100% - 250px);
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 103;
`;
