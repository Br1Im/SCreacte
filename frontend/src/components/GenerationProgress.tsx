import React, { useMemo } from 'react';
import {
  Box,
  VStack,
  Text,
  Progress,
  Heading,
  Flex,
  Badge,
  useColorModeValue,
  Spinner,
  Icon,
  Divider,
  keyframes,
  Image,
  SimpleGrid,

  ListIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useGeneratorStore } from '../store/generatorStore';
import { FaCheckCircle, FaCog, FaRocket, FaBook, FaMapMarkerAlt, FaUser, FaGem } from 'react-icons/fa';

const MotionBox = motion(Box);

// Анимация пульсации
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Анимация появления текста
const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const GenerationProgress = React.memo(() => {
  const { generationProgress, generatedQuest } = useGeneratorStore();
  const { currentStep, completedSteps, streamedContent, isGenerating } = generationProgress;
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('brand.500', 'brand.300');
  const progressBg = useColorModeValue('gray.100', 'gray.700');
  const logoBgColor = useColorModeValue('purple.50', 'purple.900');
  const logoBorderColor = useColorModeValue('purple.200', 'purple.600');
  const sceneBgColor = useColorModeValue('gray.100', 'gray.700');
  const sectionBgColor = useColorModeValue('gray.50', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.600');
  
  // Мемоизируем вычисления для предотвращения ненужных перерендеров
  const progress = useMemo(() => {
    const totalSteps = 6; // Общее количество шагов в процессе генерации
    return Math.min(100, (completedSteps.length / totalSteps) * 100);
  }, [completedSteps.length]);
  
  // Мемоизируем определение типа контента
  const isJsonContent = useMemo(() => {
    return streamedContent.trim().startsWith('{');
  }, [streamedContent]);
  
  // Мемоизируем извлечение логотипа
  const logo = useMemo(() => {
    try {
      if (!isJsonContent) return null;
      
      const parsed = JSON.parse(streamedContent);
      return parsed.logo || null;
    } catch (e) {
      // Пытаемся найти логотип в частично сформированном JSON
      const logoMatch = streamedContent.match(/"logo"\s*:\s*"([^"]+)"/); 
      return logoMatch ? logoMatch[1] : null;
    }
  }, [isJsonContent, streamedContent]);
  
  // Мемоизируем получение иконки для текущего шага
  const StepIcon = useMemo(() => {
    const getStepIcon = (step: string) => {
      if (step.includes('Подготовка')) return FaCog;
      if (step.includes('Отправка')) return FaRocket;
      if (step.includes('Генерация') || step.includes('Формирование')) return FaBook;
      if (step.includes('Завершение') || step.includes('Обработка')) return FaMapMarkerAlt;
      return FaCheckCircle;
    };
    return getStepIcon(currentStep);
  }, [currentStep]);
  
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      borderWidth="1px"
      borderColor={borderColor}
      width="100%"
      maxWidth="1000px"
      mx="auto"
      mt={8}
    >
      <VStack spacing={6} align="stretch">
        <Flex align="center" justify="space-between">
          <Heading size="md" color={accentColor}>
            🎮 Генерация квеста
          </Heading>
          <Badge 
            colorScheme={isGenerating ? "blue" : "green"} 
            variant="solid"
            animation={isGenerating ? `${pulse} 2s infinite` : undefined}
          >
            {isGenerating ? "В процессе" : "Завершено"}
          </Badge>
        </Flex>
        
        <Box>
          <Flex justify="space-between" mb={2}>
            <Text fontSize="sm" color="gray.500">Прогресс</Text>
            <Text fontSize="sm" color="gray.500">{Math.round(progress)}%</Text>
          </Flex>
          <Progress 
            value={progress} 
            colorScheme="brand" 
            size="lg" 
            borderRadius="full" 
            hasStripe={isGenerating}
            isAnimated={isGenerating}
            bg={progressBg}
          />
        </Box>
        
        <Flex align="center" gap={3}>
          <Box 
            animation={isGenerating ? `${pulse} 1.5s infinite` : undefined}
            color={accentColor}
          >
            {/* Всегда рендерим оба элемента, но управляем их видимостью через CSS */}
            <Spinner 
              size="md" 
              color={accentColor} 
              thickness="3px" 
              opacity={isGenerating ? 1 : 0}
              position={isGenerating ? 'static' : 'absolute'}
              zIndex={isGenerating ? 1 : -1}
            />
            <Icon 
              as={StepIcon} 
              boxSize={5} 
              opacity={isGenerating ? 0 : 1}
              position={isGenerating ? 'absolute' : 'static'}
              zIndex={isGenerating ? -1 : 1}
            />
          </Box>
          <Text fontWeight="bold" fontSize="lg">{currentStep}</Text>
        </Flex>
        

        
        {/* Отображение логотипа */}
        {logo && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Divider my={4} />
            <Text fontSize="md" fontWeight="bold" mb={4} color={accentColor}>
              🎨 Логотип квеста
            </Text>
            <Flex justify="center">
              <Box
                p={4}
                bg={logoBgColor}
                borderRadius="lg"
                borderWidth="2px"
                borderColor={logoBorderColor}
                maxWidth="300px"
              >
                <Image
                  src={logo}
                  alt="Логотип квеста"
                  maxHeight="200px"
                  objectFit="contain"
                  borderRadius="md"
                  fallback={
                    <Box
                      height="200px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg={sceneBgColor}
                      borderRadius="md"
                    >
                      <Text color="gray.500">Загрузка логотипа...</Text>
                    </Box>
                  }
                />
              </Box>
            </Flex>
          </MotionBox>
        )}
        
        {/* Отображение информации о квесте */}
        {generatedQuest && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Divider my={4} />
            
            {/* Заголовок и описание */}
            {generatedQuest.title && (
              <Box mb={6}>
                <Text fontSize="lg" fontWeight="bold" mb={2} color={accentColor}>
                  📖 {generatedQuest.title}
                </Text>
                {generatedQuest.description && (
                  <Text fontSize="sm" color="gray.600">
                    {generatedQuest.description}
                  </Text>
                )}
              </Box>
            )}
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {/* Персонажи */}
              {generatedQuest.characters && generatedQuest.characters.length > 0 && (
                <Box>
                  <Heading size="md" mb={3}>
                    <Flex align="center">
                      <Icon as={FaUser} color={accentColor} mr={2} />
                      <Text>Персонажи</Text>
                    </Flex>
                  </Heading>
                  <Accordion allowMultiple>
                    {generatedQuest.characters.map((character, index) => (
                      <AccordionItem key={character.id || index} border="none" mb={2}>
                        <AccordionButton
                          bg={sectionBgColor}
                          borderRadius="md"
                          _hover={{ bg: hoverBgColor }}
                        >
                          <Box flex="1" textAlign="left">
                            <Text fontWeight="bold">{character.name}</Text>
                            <Text fontSize="xs" color="gray.500">{character.role}</Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4} pt={2}>
                          <Text fontSize="sm">{character.description}</Text>
                          {character.motivation && (
                            <Text fontSize="sm" mt={2}>
                              <Text as="span" fontWeight="bold">Мотивация:</Text> {character.motivation}
                            </Text>
                          )}
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Box>
              )}
              
              {/* Предметы */}
              {generatedQuest.items && generatedQuest.items.length > 0 && (
                <Box>
                  <Heading size="md" mb={3}>
                    <Flex align="center">
                      <Icon as={FaGem} color={accentColor} mr={2} />
                      <Text>Предметы</Text>
                    </Flex>
                  </Heading>
                  <Accordion allowMultiple>
                    {generatedQuest.items.map((item, index) => (
                      <AccordionItem key={item.id || index} border="none" mb={2}>
                        <AccordionButton
                          bg={sectionBgColor}
                          borderRadius="md"
                          _hover={{ bg: hoverBgColor }}
                        >
                          <Box flex="1" textAlign="left">
                            <Flex align="center">
                              <Icon as={item.isKey ? FaCheckCircle : FaGem} color={accentColor} mr={2} />
                              <Text fontWeight="bold">{item.name}</Text>
                              {item.isKey && (
                                <Badge ml={2} colorScheme="purple" size="sm">
                                  Ключевой
                                </Badge>
                              )}
                            </Flex>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4} pt={2}>
                          <Text fontSize="sm">{item.description}</Text>
                          {item.effect && (
                            <Text fontSize="sm" mt={2}>
                              <Text as="span" fontWeight="bold">Эффект:</Text> {item.effect}
                            </Text>
                          )}
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Box>
              )}
            </SimpleGrid>

          </MotionBox>
        )}
        

        

      </VStack>
    </MotionBox>
  );
});

GenerationProgress.displayName = 'GenerationProgress';

export default GenerationProgress;