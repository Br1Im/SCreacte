import { Box, Text, Flex, Link, useColorModeValue } from '@chakra-ui/react';

const Footer = () => {
  const bgColor = useColorModeValue('white', 'black');
  const textColor = useColorModeValue('#00AA00', '#00FF00');
  const borderColor = useColorModeValue('#000000', '#000000');
  
  return (
    <Box 
      as="footer" 
      width="100%" 
      py={4} 
      bg={bgColor} 
      borderTop="2px solid"
      borderColor={borderColor}
      boxShadow="0 -4px 0 rgba(0, 0, 0, 0.1)"
      style={{ 
        transition: 'all 0.3s ease',
        backgroundColor: useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.7)'),
        backdropFilter: 'blur(2px)'
      }}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        maxW="1200px"
        mx="auto"
        px={8}
        justify="space-between"
        align="center"
      >
        <Text 
          color={textColor}
           fontFamily="'VT323', monospace"
           fontSize="16px"
          style={{ transition: 'color 0.3s ease' }}
        >
          &copy; {new Date().getFullYear()} SCreate. Все права защищены.
        </Text>
        <Flex mt={{ base: 4, md: 0 }}>
          <Link 
            href="#" 
            mx={2} 
            color={textColor}
             fontFamily="'VT323', monospace"
             fontSize="16px"
            style={{ 
              transition: 'color 0.3s ease',
              textDecoration: 'none',
              border: '1px solid',
              borderColor: borderColor,
              padding: '2px 6px',
              _hover: { backgroundColor: useColorModeValue('#CCFFCC', '#003300') }
            }}
          >
            О проекте
          </Link>
          <Link 
            href="#" 
            mx={2} 
            color={textColor}
             fontFamily="'VT323', monospace"
             fontSize="16px"
            style={{ 
              transition: 'color 0.3s ease',
              textDecoration: 'none',
              border: '1px solid',
              borderColor: borderColor,
              padding: '2px 6px',
              _hover: { backgroundColor: useColorModeValue('#CCFFCC', '#003300') }
            }}
          >
            Документация
          </Link>
          <Link 
            href="#" 
            mx={2} 
            color={textColor}
             fontFamily="'VT323', monospace"
             fontSize="16px"
            style={{ 
              transition: 'color 0.3s ease',
              textDecoration: 'none',
              border: '1px solid',
              borderColor: borderColor,
              padding: '2px 6px',
              _hover: { backgroundColor: useColorModeValue('#CCFFCC', '#003300') }
            }}
          >
            Контакты
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;