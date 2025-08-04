import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  useColorModeValue,
  Icon,
  Grid,
  GridItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import { useGeneratorStore } from '../store/generatorStore';
import { Scene, Character, Location, Item } from '../types/generator.js';
import { FaMapMarkerAlt, FaUser, FaBook, FaArrowRight, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import QuestGraph from './QuestGraph';

const QuestViewer = () => {
  const { generatedQuest, resetQuest } = useGeneratorStore();
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('brand.500', 'brand.300');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  if (!generatedQuest) return null;
  
  
  if (!currentSceneId && generatedQuest.scenes.length > 0) {
    setCurrentSceneId(generatedQuest.scenes[0].id);
  }
  
  const currentScene = generatedQuest.scenes.find(scene => scene.id === currentSceneId);
  const currentLocation = currentScene 
    ? generatedQuest.locations.find(loc => loc.id === currentScene.locationId)
    : null;
  
  const sceneCharacters = currentScene?.characters
    ? generatedQuest.characters.filter(char => currentScene.characters?.includes(char.id))
    : [];
  
  const sceneItems = currentScene?.items
    ? generatedQuest.items.filter(item => currentScene.items?.includes(item.id))
    : [];
  
  const handleChoiceClick = (nextSceneId: string) => {
    setCurrentSceneId(nextSceneId);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const getSettingLabel = (setting: string): string => {
    const settingMap: Record<string, string> = {
      'fantasy': 'Фэнтези',
      'cyberpunk': 'Киберпанк',
      'post-apocalyptic': 'Постапокалипсис',
      'sci-fi': 'Научная фантастика',
      'horror': 'Хоррор',
      'western': 'Вестерн',
      'custom': 'Пользовательский',
    };
    return settingMap[setting] || setting;
  };
  
  const getQuestStyleLabel = (style: string): string => {
    const styleMap: Record<string, string> = {
      'detective': 'Детектив',
      'survival': 'Выживание',
      'politics': 'Политика',
      'adventure': 'Приключение',
      'romance': 'Романтика',
      'horror': 'Хоррор',
      'custom': 'Пользовательский',
    };
    return styleMap[style] || style;
  };
  
  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      width="100%"
      maxWidth="1000px"
      mx="auto"
      mt={8}
    >
      
      <VStack spacing={4} align="stretch" mb={8}>
        <Flex justify="space-between" align="center">
          <Heading size="xl" color="brand.500">{generatedQuest.title}</Heading>
          <Button
            onClick={resetQuest}
            variant="outline"
            colorScheme="brand"
            size="sm"
          >
            Создать новый квест
          </Button>
        </Flex>
        
        <Text fontSize="lg">{generatedQuest.description}</Text>
        
        <HStack spacing={4} mt={2}>
          <Badge colorScheme="purple">{getSettingLabel(generatedQuest.setting)}</Badge>
          <Badge colorScheme="blue">{getQuestStyleLabel(generatedQuest.questStyle)}</Badge>
        </HStack>
      </VStack>
      
      <Divider mb={6} />
      
      
      <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={6}>
        
        <GridItem>
          {currentScene && (
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="lg" mb={4}>{currentScene.title}</Heading>
                <Text fontSize="md" whiteSpace="pre-line">{currentScene.description}</Text>
              </Box>
              
  
              {currentLocation && (
                <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                  <Flex align="center" mb={2}>
                    <Icon as={FaMapMarkerAlt} color={accentColor} mr={2} />
                    <Heading size="sm">Локация: {currentLocation.name}</Heading>
                  </Flex>
                  <Text fontSize="sm">{currentLocation.description}</Text>
                </Box>
              )}
              
  
              {sceneCharacters.length > 0 && (
                <Box>
                  <Heading size="md" mb={3}>
                    <Flex align="center">
                      <Icon as={FaUser} color={accentColor} mr={2} />
                      <Text>Персонажи</Text>
                    </Flex>
                  </Heading>
                  <Accordion allowMultiple>
                    {sceneCharacters.map(character => (
                      <AccordionItem key={character.id} border="none" mb={2}>
                        <AccordionButton
                          bg={useColorModeValue('gray.50', 'gray.700')}
                          borderRadius="md"
                          _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
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
              
  
              {sceneItems.length > 0 && (
                <Box>
                  <Heading size="md" mb={3}>
                    <Flex align="center">
                      <Icon as={FaBook} color={accentColor} mr={2} />
                      <Text>Предметы</Text>
                    </Flex>
                  </Heading>
                  <List spacing={2}>
                    {sceneItems.map(item => (
                      <ListItem key={item.id}>
                        <Box
                          p={3}
                          bg={useColorModeValue('gray.50', 'gray.700')}
                          borderRadius="md"
                        >
                          <Flex align="center">
                            <Icon as={item.isKey ? FaCheckCircle : FaInfoCircle} color={accentColor} mr={2} />
                            <Box>
                              <Text fontWeight="bold">{item.name}</Text>
                              <Text fontSize="sm">{item.description}</Text>
                              {item.effect && (
                                <Text fontSize="xs" color="brand.500" mt={1}>
                                  Эффект: {item.effect}
                                </Text>
                              )}
                            </Box>
                          </Flex>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
  
              {currentScene.choices && currentScene.choices.length > 0 ? (
                <Box mt={4}>
                  <Heading size="md" mb={4}>Что будете делать?</Heading>
                  <VStack spacing={3} align="stretch">
                    {currentScene.choices.map(choice => (
                      <Button
                        key={choice.id}
                        onClick={() => handleChoiceClick(choice.nextSceneId)}
                        colorScheme="brand"
                        variant="outline"
                        justifyContent="flex-start"
                        rightIcon={<FaArrowRight />}
                        whiteSpace="normal"
                        textAlign="left"
                        height="auto"
                        py={3}
                      >
                        {choice.text}
                      </Button>
                    ))}
                  </VStack>
                </Box>
              ) : currentScene.isEnding ? (
                <Box
                  p={4}
                  bg={useColorModeValue('gray.100', 'gray.700')}
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderColor="brand.500"
                  mt={4}
                >
                  <Heading size="md" mb={2}>Конец истории</Heading>
                  <Text>Вы достигли одного из возможных завершений квеста.</Text>
                  <Button
                    onClick={resetQuest}
                    colorScheme="brand"
                    mt={4}
                  >
                    Начать новый квест
                  </Button>
                </Box>
              ) : null}
            </VStack>
          )}
        </GridItem>
        
        
        <GridItem>
          <Box
            p={4}
            bg={useColorModeValue('gray.50', 'gray.700')}
            borderRadius="md"
            position={{ lg: 'sticky' }}
            top={{ lg: '20px' }}
          >
            <Heading size="md" mb={4}>Навигация по сценам</Heading>
            <Button
              colorScheme="teal"
              mb={4}
              onClick={onOpen}
              width="100%"
            >
              Развернуть ветки квеста
            </Button>
            <VStack spacing={2} align="stretch">
              {generatedQuest.scenes.map(scene => (
                <Button
                  key={scene.id}
                  onClick={() => setCurrentSceneId(scene.id)}
                  variant={currentSceneId === scene.id ? 'solid' : 'ghost'}
                  colorScheme={currentSceneId === scene.id ? 'brand' : 'gray'}
                  justifyContent="flex-start"
                  fontSize="sm"
                  py={2}
                  px={3}
                >
                  {scene.title}
                </Button>
              ))}
            </VStack>
          </Box>
        </GridItem>
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Граф квеста</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <QuestGraph />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default QuestViewer;