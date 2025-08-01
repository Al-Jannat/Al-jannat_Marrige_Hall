import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import Particles from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import HeaderRow from '../components/HeaderRow';
import { getPosters, getRandomImages } from '../services/api';

const HomeContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F8F1E9; /* Ivory Cream */
  font-family: 'Open Sans', sans-serif;
  color: #333333;
  position: relative;
`;

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  z-index: 1;
`;

const ScrollContent = styled.div`
  padding: 0;
`;

const SectionTitle = styled.h2`
  font-family: 'Great Vibes', cursive;
  font-size: 2rem;
  color: #E8B923; /* Soft Gold */
  margin: 20px 0;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const PosterSection = styled(motion.div)`
  margin-bottom: 20px;
  position: relative;
`;

const PosterContainer = styled.div`
  width: 98vw;
  height: 75vh;
  margin: 0 auto 20px auto;
  overflow: hidden;
  position: relative;
  border: 2px solid #F8C8DC; /* Blush Pink */
  border-radius: 1px;
  background: url('https://www.transparenttextures.com/patterns/floral.png');
`;

const PosterOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(248, 200, 220, 0.3); /* Blush Pink overlay */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #333333;
`;

const PosterTagline = styled.h3`
  font-family: 'Great Vibes', cursive;
  font-size: 2rem;
  margin-bottom: 10px;
`;

const PosterImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const CategorySection = styled(motion.div)`
  margin-bottom: 40px;
  padding: 0 20px;
  position: sticky;
  top: 60px;
  z-index: 10;
  background:#F8F1E9; /* Ivory Cream */
`;

const CategoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  padding: 0 10px;
`;

const CategoryCard = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover {
    background: #98D7C2; /* Mint Green */
    transform: translateY(-5px);
  }
`;

const CategoryIcon = styled.i`
  font-size: 2rem;
  color: #E8B923; /* Soft Gold */
  margin-bottom: 10px;
`;

const CategoryText = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333333;
`;

const GridSection = styled(motion.div)`
  margin-bottom: 40px;
  padding: 0 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 0 10px;
`;

const GridItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 20px rgba(152, 215, 194, 0.7);
  }
`;

const GridImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: transform 0.3s ease;
  ${GridItem}:hover & {
    transform: scale(1.1);
  }
`;

const NoImagesText = styled.span`
  display: block;
  text-align: center;
  color: #333333;
  font-size: 1.2rem;
  margin: 20px 0;
`;

const Footer = styled.div`
  background: linear-gradient(180deg, #F8C8DC 0%, #F5F5F5 100%); /* Blush Pink to Pearl White */
  color: #333333;
  padding: 20px;
  text-align: center;
  position: sticky;
  bottom: 0;
`;

const FooterText = styled.span`
  font-size: 1rem;
`;

const SocialIcons = styled.div`
  margin-top: 10px;
`;

const SocialIcon = styled.i`
  color: #E8B923; /* Soft Gold */
  font-size: 1.5rem;
  margin: 0 10px;
  transition: color 0.3s ease;
  &:hover {
    color: #98D7C2; /* Mint Green */
  }
`;

const BookNowButton = styled(motion.button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(45deg, #E8B923, #F8C8DC); /* Soft Gold to Blush Pink */
  color: #333333;
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-family: 'Open Sans', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 20;
  &:hover {
    background: #98D7C2; /* Mint Green */
  }
`;

export default function HomeScreen() {
  const navigate = useNavigate();
  const [posters, setPosters] = useState([]);
  const [randomImages, setRandomImages] = useState([]);
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
const categories = [
  { name: 'Venue', icon: 'fas fa-church', path: '/category-images/Venue' },
  
  { name: 'Events', icon: 'fas fa-calendar-alt', path: '/category-images/Events' },
  { name: 'Catering', icon: 'fas fa-utensils', path: '/category-images/Catering' },
  { name: 'Ceremonies', icon: 'fas fa-ring', path: '/category-images/Ceremonies' },
  { name: 'Locate Us', icon: 'fas fa-map-marker-alt', path: '/contact' },
  { name: 'Menu', icon: 'fas fa-book', path: '/menu' },
];

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const particlesOptions = {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: '#E8B923' }, /* Soft Gold */
      shape: { type: 'circle' },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      move: { enable: true, speed: 1, direction: 'none', random: true, out_mode: 'out' },
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
      modes: { repulse: { distance: 100 }, push: { particles_nb: 4 } },
    },
  };

  const transitionVariants = [
    { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } },
    { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5 } },
    { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5 } },
    { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5 } },
  ];

  const getRandomVariant = () => {
    return transitionVariants[Math.floor(Math.random() * transitionVariants.length)];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPosterIndex((prev) => (prev + 1) % (posters.length || 1));
    }, 5000);

    fetchPosters();
    fetchRandomImages();

    return () => clearInterval(interval);
  }, [posters.length]);

  const fetchPosters = async () => {
    try {
      const response = await getPosters();
      if (response.success && Array.isArray(response.data)) {
        setPosters(response.data);
      } else {
        setPosters([]);
      }
    } catch (err) {
      console.error('Fetch posters error:', err);
      setPosters([]);
    }
  };

  const fetchRandomImages = async () => {
    try {
      const response = await getRandomImages();
      if (response.success && Array.isArray(response.data)) {
        setRandomImages(response.data.slice(0, 10));
      } else {
        setRandomImages([]);
      }
    } catch (err) {
      console.error('Fetch random images error:', err);
      setRandomImages([]);
    }
  };

  return (
    <HomeContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ParticlesContainer>
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
      </ParticlesContainer>
      <HeaderRow />
      <ScrollContainer>
        <ScrollContent>
          {posters.length > 0 ? (
            <PosterSection
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SectionTitle>Al-Jannat Marrige Hall</SectionTitle>
              <PosterContainer>
                <AnimatePresence>
                  <PosterImage
                    key={currentPosterIndex}
                    src={posters[currentPosterIndex]?.link}
                    alt="Poster"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                <PosterOverlay>
                  <PosterTagline>Where Love Blossoms</PosterTagline>
                  <p>Elegant venues for your dream wedding</p>
                </PosterOverlay>
              </PosterContainer>
            </PosterSection>
          ) : (
            <NoImagesText>No posters available</NoImagesText>
          )}
          <CategorySection
            initial={{ scale: 0.8, opacity: 0, boxShadow: '0 0 0 rgba(152, 215, 194, 0)' }}
            animate={{ scale: 1, opacity: 1, boxShadow: '0 0 20px rgba(152, 215, 194, 0.5)' }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
          >
            <SectionTitle>Explore Our Services</SectionTitle>
            <CategoryList>
              {categories.map((item) => (
                <CategoryCard
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(152, 215, 194, 0.7)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CategoryIcon className={item.icon} />
                  <CategoryText>{item.name}</CategoryText>
                </CategoryCard>
              ))}
            </CategoryList>
          </CategorySection>
          <GridSection
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <SectionTitle>Our Gallery</SectionTitle>
            <Grid>
              {randomImages.length > 0 ? (
                randomImages.map((item) => {
                  const variant = getRandomVariant();
                  return (
                    <GridItem
                      key={item._id}
                      initial={variant.initial}
                      animate={variant.animate}
                      transition={variant.transition}
                      onClick={() => navigate('/gallery')}
                    >
                      <GridImage src={item.link} alt="Gallery" />
                    </GridItem>
                  );
                })
              ) : (
                <NoImagesText>No images available</NoImagesText>
              )}
            </Grid>
          </GridSection>
          <Footer>
            <FooterText>© 2025 Al Jannat Marriage Hall. All Rights Reserved.</FooterText>
            <SocialIcons>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <SocialIcon className="fab fa-facebook-f" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <SocialIcon className="fab fa-instagram" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <SocialIcon className="fab fa-twitter" />
              </a>
            </SocialIcons>
          </Footer>
          <BookNowButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/contact')}
          >
            Book Now
          </BookNowButton>
        </ScrollContent>
      </ScrollContainer>
    </HomeContainer>
  );
}