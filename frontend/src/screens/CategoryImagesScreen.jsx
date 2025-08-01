import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import Particles from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import { getImagesByCategory } from '../services/api';
import HeaderRow from '../components/HeaderRow';
import '../styles/masonry.css';

const Container = styled(motion.div)`
  background: #F8F1E9; /* Ivory Cream */
  min-height: 100vh;
  color: #1A1A1A; /* Onyx Black */
  font-family: 'Lora', serif;
  position: relative;
  padding-top: 80px; /* Reduced for header clearance */
  overflow-x: hidden;
  background-image: url('https://www.transparenttextures.com/patterns/velvet.png');
  @media (max-width: 768px) {
    padding-top: 70px; /* Reduced for mobile */
  }
`;

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(248, 241, 233, 0.1); /* Ivory Cream glassmorphic */
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(212, 160, 23, 0.3); /* Deep Gold */
`;

const HeroSection = styled(motion.div)`
  position: relative;
  height: 60vh;
  max-height: 600px;
  margin: 20px 5% 10px; /* Reduced margin-top */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: 3px solid #D4A017; /* Deep Gold */
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) {
    height: 40vh;
    margin: 15px 3% 8px;
  }
`;

const HeroImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const CategoryOverlay = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(248, 241, 233, 0.2); /* Ivory Cream glassmorphic */
  backdrop-filter: blur(8px);
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #D4A017; /* Deep Gold */
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #D4A017; /* Deep Gold */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  @media (max-width: 768px) {
    font-size: 1.5rem;
    padding: 8px 15px;
  }
`;

const CategorySection = styled(motion.div)`
  margin: 20px 5% 10px; /* Reduced margin-top */
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 768px) {
    margin: 15px 3% 8px;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  color: #D4A017; /* Deep Gold */
  margin: 20px 0;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CategoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  padding: 0 10px;
`;

const CategoryCard = styled(motion.button)`
  background: rgba(248, 241, 233, 0.2); /* Ivory Cream glassmorphic */
  backdrop-filter: blur(10px);
  border: 1px solid #D4A017; /* Deep Gold */
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover {
    box-shadow: 0 0 20px rgba(42, 111, 94, 0.7); /* Emerald Green */
    transform: translateY(-5px);
  }
`;

const CategoryIcon = styled.i`
  font-size: 2rem;
  color: #D4A017; /* Deep Gold */
  margin-bottom: 10px;
`;

const CategoryText = styled.span`
  font-family: 'Lora', serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: #1A1A1A; /* Onyx Black */
`;

const Title = styled(motion.h1)`
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  color: #D4A017; /* Deep Gold */
  margin: 20px 0 10px; /* Reduced margin-top */
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin: 15px 0 8px;
  }
`;

const MasonryGrid = styled(Masonry)`
  display: flex;
  width: auto;
  margin: 0 5%;
  max-width: 1400px;
  @media (max-width: 768px) {
    margin: 0 3%;
  }
`;

const GridItem = styled(motion.div)`
  background: rgba(248, 241, 233, 0.2); /* Ivory Cream glassmorphic */
  backdrop-filter: blur(10px);
  border: 1px solid #D4A017; /* Deep Gold */
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 0 20px rgba(42, 111, 94, 0.7); /* Emerald Green glow */
  }
`;

const GridImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
`;

const NoImagesText = styled(motion.span)`
  display: block;
  text-align: center;
  color: #1A1A1A; /* Onyx Black */
  font-size: 1.3rem;
  font-family: 'Lora', serif;
  margin: 20px 0;
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
`;

export default function CategoryImagesScreen() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const fetchImages = useCallback(async () => {
    try {
      const response = await getImagesByCategory(category);
      console.log(`API Response for ${category}:`, response);
      if (response.success && Array.isArray(response.data)) {
        setImages(response.data);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('Fetch images error:', error);
      setImages([]);
    }
  }, [category]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images]);

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const particlesOptions = {
    particles: {
      number: { value: 30, density: { enable: true, value_area: 1000 } },
      color: { value: '#D4A017' }, /* Deep Gold */
      shape: { type: 'circle' },
      opacity: { value: 0.3, random: true },
      size: { value: 2, random: true },
      move: { enable: true, speed: 0.5, direction: 'none', random: true, out_mode: 'out' },
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
      modes: { repulse: { distance: 100 }, push: { particles_nb: 2 } },
    },
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const categories = [
    { name: 'Venue', icon: 'fas fa-church', path: '/category-images/Venue' },
    { name: 'Locate Us', icon: 'fas fa-map-marker-alt', path: '/contact' },
    { name: 'Events', icon: 'fas fa-calendar-alt', path: '/category-images/Events' },
    { name: 'Catering', icon: 'fas fa-utensils', path: '/category-images/Catering' },
    { name: 'Ceremonies', icon: 'fas fa-ring', path: '/category-images/Ceremonies' },
    { name: 'Menu', icon: 'fas fa-book', path: '/menu' },
  ];

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <ParticlesContainer>
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
      </ParticlesContainer>
      <HeaderWrapper>
        <HeaderRow />
      </HeaderWrapper>
      {images.length > 0 && (
        <HeroSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence>
            <HeroImage
              key={currentHeroIndex}
              src={images[currentHeroIndex]?.link}
              alt={`${category} hero`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </AnimatePresence>
          <CategoryOverlay
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {category}
          </CategoryOverlay>
        </HeroSection>
      )}
      <CategorySection
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
      >
        <SectionTitle
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Discover Elegance
        </SectionTitle>
        <CategoryList>
          {categories.map((item) => (
            <CategoryCard
              key={item.name}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * categories.indexOf(item) }}
            >
              <CategoryIcon className={item.icon} />
              <CategoryText>{item.name}</CategoryText>
            </CategoryCard>
          ))}
        </CategoryList>
      </CategorySection>
      <Title
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {category} Gallery
      </Title>
      <MasonryGrid
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {images.length > 0 ? (
          images.map((image, index) => (
            <GridItem
              key={image._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <GridImage src={image.link} alt={`${category} image`} />
            </GridItem>
          ))
        ) : (
          <NoImagesText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No images available for {category}
          </NoImagesText>
        )}
      </MasonryGrid>
    </Container>
  );
}