import { useState, useEffect } from 'react';
import { Box, Flex, VStack } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import GeneratorForm from '../components/GeneratorForm';
import QuestViewer from '../components/QuestViewer';
import InfoSection from '../components/InfoSection';
import Footer from '../components/Footer';
import LogoAnimation from '../components/LogoAnimation';
import { useGeneratorStore } from '../store/generatorStore';

const HomePage = () => {
  const { generatedQuest } = useGeneratorStore();
  const [showAnimation, setShowAnimation] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setContentVisible(true);
  };
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      setContentVisible(true);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Box width="100%" overflow="auto">
      <AnimatePresence>
        {showAnimation && (
          <LogoAnimation onAnimationComplete={handleAnimationComplete} />
        )}
      </AnimatePresence>
      
      {contentVisible && <Header />}
      
      <Box 
        as="main" 
        minHeight="calc(100vh - 150px)"
        py={8} 
        px={4}
        opacity={contentVisible ? 1 : 0}
        transition="opacity 0.5s ease-in-out"
        width="100%"
        display={contentVisible ? "block" : "none"}
        overflow="auto"
      >
        <VStack spacing={8} align="stretch">
          {!generatedQuest ? (
            <>
              <GeneratorForm />
              <InfoSection />
            </>
          ) : (
            <QuestViewer />
          )}
        </VStack>
      </Box>
      
      {contentVisible && <Footer />}
    </Box>
  );
};

export default HomePage;