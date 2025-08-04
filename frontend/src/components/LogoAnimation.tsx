import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, keyframes, useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface LogoAnimationProps {
  onAnimationComplete: () => void;
}

const LogoAnimation = React.memo(({ onAnimationComplete }: LogoAnimationProps) => {
  const [animationStage, setAnimationStage] = useState(0);
  const { colorMode } = useColorMode();

  useEffect(() => {

    const timers = [];
    
    if (animationStage === 0) {
  
      const timer1 = setTimeout(() => {
        setAnimationStage(1);
      }, 2000);
      timers.push(timer1);
    } else if (animationStage === 1) {
  
      const timer2 = setTimeout(() => {
        setAnimationStage(2);
      }, 2500);
      timers.push(timer2);
    } else if (animationStage === 2) {
  
      const timer3 = setTimeout(() => {
        onAnimationComplete();
      }, 1000);
      timers.push(timer3);
    }

    return () => {
  
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [animationStage, onAnimationComplete]);


  const spinAnimation = keyframes`
    0% { transform: rotateY(0deg) scale(1); }
    25% { transform: rotateY(90deg) scale(1.1); }
    50% { transform: rotateY(180deg) scale(1); }
    75% { transform: rotateY(270deg) scale(1.1); }
    100% { transform: rotateY(360deg) scale(1); }
  `;


  const textRevealAnimation = keyframes`
    0% { width: 0; opacity: 0; clip-path: inset(0 100% 0 0); }
    33% { width: 33%; opacity: 0.3; clip-path: inset(0 66% 0 0); }
    66% { width: 66%; opacity: 0.6; clip-path: inset(0 33% 0 0); }
    100% { width: 100%; opacity: 1; clip-path: inset(0 0 0 0); }
  `;


  const containerVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        duration: 0.5, 
        ease: "easeInOut",
        delayChildren: 0.2
      } 
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeIn" 
      } 
    }
  };

  const cubeVariants = {
    initial: { rotateY: 0, opacity: 0.5, scale: 0.9 },
    animate: { 
      rotateY: 360, 
      opacity: 1,
      scale: 1,
      transition: { 
        rotateY: {
          duration: 2, 
          repeat: Infinity, 
          ease: "linear",
          repeatType: "loop"
        },
        opacity: {
          duration: 0.3,
          ease: "easeIn"
        },
        scale: {
          duration: 0.3,
          ease: "easeInOut"
        }
      } 
    }
  };

  const textVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1, 
      transition: { 
        duration: 0.5, 
        delay: 0.3,
        staggerChildren: 0.1,
        ease: "easeInOut"
      } 
    }
  };

  const letterVariants = {
    initial: { y: 20, opacity: 0, scale: 1.2 },
    animate: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: "easeInOut"
      }
    }
  };

  return (
    <Flex 
      as={motion.div}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit={animationStage === 2 ? "exit" : undefined}
      position="fixed"
      top={0}
      left={0}
      direction="column"
      align="center"
      justify="center"
      zIndex={1000}
      height="100vh"
      width="100vw"
      bg={colorMode === 'dark' ? "#000000" : "#ffffff"}
      transition="all 0.3s ease !important"
      style={{ 
        transitionProperty: 'all', 
        willChange: 'opacity, background-color'
      }}
    >
      <Flex align="center" justify="center" height="100%" width="100%">
        <Box 
          as={motion.div}
          variants={cubeVariants}
          initial="initial"
          animate="animate"
          mr={2}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
            <motion.path 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              d="M12 2L2 7L12 12L22 7L12 2Z" 
              fill={colorMode === 'dark' ? '#00FF00' : '#00AA00'} 
              style={{ transition: 'fill 0.3s', transformOrigin: 'center', shapeRendering: 'crispEdges' }}
              strokeWidth="0.5"
              stroke={colorMode === 'dark' ? '#000000' : '#000000'}
            />
            <motion.path 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
              d="M2 17L12 22L22 17V7L12 12L2 7V17Z" 
              fill={colorMode === 'dark' ? '#00FFFF' : '#00AAAA'} 
              fillOpacity="0.9" 
              style={{ transition: 'fill 0.3s', transformOrigin: 'center', shapeRendering: 'crispEdges' }}
              strokeWidth="0.5"
              stroke={colorMode === 'dark' ? '#000000' : '#000000'}
            />
          </svg>
        </Box>
        <Box overflow="hidden">
          <Flex 
            as={motion.div}
            variants={textVariants}
            initial="initial"
            animate="animate"
          >
            <Text 
              as={motion.span} 
              variants={letterVariants} 
              fontSize="5xl" 
              fontWeight="bold" 
              color={colorMode === 'dark' ? '#914dff' : '#5900E6'}
              style={{ transition: 'color 0.3s', fontFamily: "'Press Start 2P', cursive", fontSize: "24px" }}
            >
              S
            </Text>
            <Text 
              as={motion.span} 
              variants={letterVariants} 
              fontSize="5xl" 
              fontWeight="bold" 
              color={colorMode === 'dark' ? '#914dff' : '#5900E6'}
              style={{ transition: 'color 0.3s', fontFamily: "'Press Start 2P', cursive", fontSize: "24px" }}
            >
              C
            </Text>
            {animationStage >= 1 && (
              <>
                <Text 
                  as={motion.span} 
                  variants={letterVariants} 
                  fontSize="5xl" 
                  fontWeight="bold" 
                  color={colorMode === 'dark' ? '#b180ff' : '#721AFF'}
                  style={{ transition: 'color 0.3s', fontFamily: "'Press Start 2P', cursive", fontSize: "24px" }}
                >
                  reate
                </Text>
              </>
            )}
          </Flex>
          {animationStage >= 1 && (
            <Text 
              as={motion.p}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.5, 
                duration: 0.3, 
                ease: "easeInOut" 
              }}
              fontSize="md" 
              color={colorMode === 'dark' ? 'gray.400' : 'gray.500'}
              sx={{ transition: "color 0.3s", fontFamily: "'VT323', monospace", fontSize: "18px" }}
            >
              Генератор игровых сцен
            </Text>
          )}
        </Box>
      </Flex>
    </Flex>
  );
});

LogoAnimation.displayName = 'LogoAnimation';

export default LogoAnimation;