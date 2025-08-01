import styled from 'styled-components';

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const DashboardBody = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  overflow: hidden;
`;

export const MainContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #f9f9f9;
`;

export const DashboardTitle = styled.h1`
  font-family: 'Lora', serif;
  font-size: 1.8rem;
  color: #2a2a2a;
`;
