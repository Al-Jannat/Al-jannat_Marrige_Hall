import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/Sidebar';
import {
  DashboardContainer,
  DashboardBody,
  MainContent,
  DashboardTitle,
} from '../styles/AdminDashboard';

export default function AdminDashboard() {
  const greetingAnim = useAnimation();

  useEffect(() => {
    greetingAnim.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    });
  }, [greetingAnim]);

  return (
    <DashboardContainer>
      <AdminHeader />
      <DashboardBody>
        <Sidebar />
        <MainContent>
          <DashboardTitle
            as={motion.h1}
            initial={{ opacity: 0, y: 20 }}
            animate={greetingAnim}
          >
            Welcome to Al Jannat Admin Dashboard
          </DashboardTitle>
        </MainContent>
      </DashboardBody>
    </DashboardContainer>
  );
}
