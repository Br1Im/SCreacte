import React from 'react';
import { Box, Flex, Heading, Text, useColorMode, IconButton, useStyleConfig, useColorModeValue } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const Header = React.memo(() => {
  const { colorMode, toggleColorMode } = useColorMode();


  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Flex
      as="header"
      width="100%"
      py={4}
      px={8}
      align="center"
      justify="space-between"
      borderBottom="1px"
      borderColor={borderColor}
      bg={useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.7)')}
      backdropFilter="blur(2px)"
      transition="all 0.3s ease !important"
      style={{ 
        transitionProperty: 'all',
        borderWidth: '2px',
        boxShadow: '0 4px 0 rgba(0, 0, 0, 0.2)'
      }}
    >
      <Flex align="center" transition="all 0.3s ease !important" style={{ transitionProperty: 'all' }}>
        <Box mr={2} className="logo-cube" _hover={{ transform: 'rotateY(180deg)' }} transition="all 0.3s ease !important" style={{ transitionProperty: 'all' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}>
            <path 
              d="M12 2L2 7L12 12L22 7L12 2Z" 
              fill={useColorModeValue('#00AA00', '#00FF00')} 
              style={{ transition: 'fill 0.3s' }}
              strokeWidth="0.5"
              stroke="#000000"
            />
            <path 
              d="M2 17L12 22L22 17V7L12 12L2 7V17Z" 
              fill={useColorModeValue('#00AAAA', '#00FFFF')} 
              fillOpacity="0.9" 
              style={{ transition: 'fill 0.3s' }}
              strokeWidth="0.5"
              stroke="#000000"
            />
          </svg>
        </Box>
        <Box transition="all 0.3s ease !important" style={{ transitionProperty: 'all' }}>
          <Heading size="md" fontWeight="bold" style={{ transition: 'color 0.3s', fontFamily: "'Press Start 2P', cursive", fontSize: "16px" }}>
            <Text as="span" color={useColorModeValue('#00AA00', '#00FF00')} style={{ transition: 'color 0.3s' }}>S</Text>
            <Text as="span" color={useColorModeValue('#00AA00', '#00FF00')} style={{ transition: 'color 0.3s' }}>C</Text>
            <Text as="span" color={useColorModeValue('#00AAAA', '#00FFFF')} style={{ transition: 'color 0.3s' }}>reate</Text>
          </Heading>
          <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.300')} style={{ transition: 'color 0.3s', fontFamily: "'VT323', monospace", fontSize: "14px" }}>Генератор игровых сцен</Text>
        </Box>
      </Flex>
      
      <IconButton
        aria-label={`Переключить на ${colorMode === 'light' ? 'темную' : 'светлую'} тему`}
        icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
        onClick={toggleColorMode}
        variant="ghost"
        colorScheme="brand"
        transition="all 0.3s ease !important"
        style={{ transitionProperty: 'all' }}
        sx={{
          '& svg': {
            transition: 'transform 0.3s ease, color 0.3s ease !important',
          },
          border: '2px solid black',
          boxShadow: '2px 2px 0 #000',
          borderRadius: '0 !important'
        }}
        _hover={{
          bg: useColorModeValue('#CCFFCC', '#003300'),
        }}
        _active={{
          transform: 'translate(2px, 2px)',
          boxShadow: '0px 0px 0 #000',
        }}
      />
    </Flex>
  );
});

Header.displayName = 'Header';

export default Header;