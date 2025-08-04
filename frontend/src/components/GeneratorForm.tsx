import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  Textarea,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  Icon,
  useToast,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Collapse,
} from '@chakra-ui/react';
import { useGeneratorStore } from '../store/generatorStore';
import type { Setting, QuestStyle, QuestComplexity, QuestTone } from '../types/generator';
import { FaGamepad, FaMapMarker, FaBook, FaUpload, FaEdit, FaUsers, FaBullseye, FaPalette, FaChevronDown, FaChevronUp, FaCog } from 'react-icons/fa';
import { FaWandMagicSparkles, FaGear } from 'react-icons/fa6';
import FileUpload from './FileUpload';

const GeneratorForm = React.memo(() => {
  const navigate = useNavigate();
  const { input, setInput, generateQuest, isLoading, error } = useGeneratorStore();
  const [showCustomSetting, setShowCustomSetting] = useState(input.setting === 'custom');
  const [showCustomQuestStyle, setShowCustomQuestStyle] = useState(input.questStyle === 'custom');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const handleSettingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Setting;
    setInput({ setting: value });
    setShowCustomSetting(value === 'custom');
  };
  
  const handleQuestStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as QuestStyle;
    setInput({ questStyle: value });
    setShowCustomQuestStyle(value === 'custom');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/quest-result');
    generateQuest();
  };
  
  const handleFileGenerate = async () => {
    navigate('/quest-result');
    generateQuest();
  };

  const handleFileContent = (content: string) => {
    setInput({ 
      fileContent: content,
      inputMethod: 'file' as const
    });
  };

  const handleClearFile = () => {
    setInput({ 
      fileContent: '',
      inputMethod: 'form' as const
    });
  };
  
  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      width="100%"
      maxWidth="800px"
      mx="auto"
      backgroundColor={useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.7)')}
      backdropFilter="blur(2px)"
    >
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center" color="brand.500">
          Создание игрового мира
        </Heading>
        <Text textAlign="center" fontSize="md" color="gray.500">
          Заполните параметры для генерации игровых сцен и квестов
        </Text>
        
        <Divider />

        <Tabs variant="enclosed" colorScheme="brand">
          <TabList>
            <Tab>
              <Icon as={FaEdit} mr={2} />
              Заполнить форму
            </Tab>
            <Tab>
              <Icon as={FaUpload} mr={2} />
              Загрузить файл
            </Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <VStack spacing={6} align="stretch">
        
        <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
          <FormControl isRequired>
            <Flex align="center" mb={2}>
              <Icon as={FaGamepad} mr={2} color="brand.500" />
              <FormLabel mb={0}>Сеттинг</FormLabel>
            </Flex>
            <Select 
              value={input.setting} 
              onChange={handleSettingChange}
              focusBorderColor="brand.400"
            >
              <option value="fantasy">Фэнтези</option>
              <option value="cyberpunk">Киберпанк</option>
              <option value="post-apocalyptic">Постапокалипсис</option>
              <option value="sci-fi">Научная фантастика</option>
              <option value="horror">Хоррор</option>
              <option value="western">Вестерн</option>
              <option value="custom">Свой вариант</option>
            </Select>
            <FormHelperText>Выберите мир, в котором будет происходить действие</FormHelperText>
          </FormControl>
          
          {showCustomSetting && (
            <FormControl isRequired={input.setting === 'custom'}>
              <FormLabel>Опишите свой сеттинг</FormLabel>
              <Textarea
                value={input.customSetting || ''}
                onChange={(e) => setInput({ customSetting: e.target.value })}
                placeholder="Например: Мир, где магия и технологии существуют вместе"
                focusBorderColor="brand.400"
              />
            </FormControl>
          )}
        </Flex>
        
        <FormControl isRequired>
          <Flex align="center" mb={2}>
            <Icon as={FaMapMarker} mr={2} color="brand.500" />
            <FormLabel mb={0}>Отправная точка</FormLabel>
          </Flex>
          <Input
            value={input.startingPoint}
            onChange={(e) => setInput({ startingPoint: e.target.value })}
            placeholder="Например: Таверна на окраине города"
            focusBorderColor="brand.400"
          />
          <FormHelperText>Укажите место, с которого начнется приключение</FormHelperText>
        </FormControl>
        
        <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
          <FormControl isRequired>
            <Flex align="center" mb={2}>
              <Icon as={FaBook} mr={2} color="brand.500" />
              <FormLabel mb={0}>Стиль квеста</FormLabel>
            </Flex>
            <Select
              value={input.questStyle}
              onChange={handleQuestStyleChange}
              focusBorderColor="brand.400"
            >
              <option value="detective">Детектив</option>
              <option value="survival">Выживание</option>
              <option value="politics">Политика</option>
              <option value="adventure">Приключение</option>
              <option value="romance">Романтика</option>
              <option value="horror">Хоррор</option>
              <option value="custom">Свой вариант</option>
            </Select>
            <FormHelperText>Выберите тип истории для вашего квеста</FormHelperText>
          </FormControl>
          
          {showCustomQuestStyle && (
            <FormControl isRequired={input.questStyle === 'custom'}>
              <FormLabel>Опишите свой стиль квеста</FormLabel>
              <Textarea
                value={input.customQuestStyle || ''}
                onChange={(e) => setInput({ customQuestStyle: e.target.value })}
                placeholder="Например: Смесь детектива и приключения с элементами хоррора"
                focusBorderColor="brand.400"
              />
            </FormControl>
          )}
        </Flex>
        
        <Divider />
        
        <Button
          variant="ghost"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          p={0}
          h="auto"
          justifyContent="flex-start"
          _hover={{ bg: 'transparent' }}
        >
          <Heading size="md" color="brand.500">
            <Flex align="center">
              <Icon as={FaCog} mr={2} />
              Дополнительные настройки
              <Icon 
                as={showAdvancedSettings ? FaChevronUp : FaChevronDown} 
                ml={2} 
                fontSize="sm"
              />
            </Flex>
          </Heading>
        </Button>
        
        <Collapse in={showAdvancedSettings} animateOpacity>
          <VStack spacing={6} align="stretch" mt={4}>
            <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
               <FormControl>
                 <Flex align="center" mb={2}>
                   <Icon as={FaBullseye} mr={2} color="brand.500" />
                   <FormLabel mb={0}>Главная цель</FormLabel>
                 </Flex>
                 <Input
                   value={input.mainGoal || ''}
                   onChange={(e) => setInput({ mainGoal: e.target.value })}
                   placeholder="Например: Найти древний артефакт"
                   focusBorderColor="brand.400"
                 />
                 <FormHelperText>Опишите основную цель квеста</FormHelperText>
               </FormControl>
               
               <FormControl>
                 <Flex align="center" mb={2}>
                   <Icon as={FaPalette} mr={2} color="brand.500" />
                   <FormLabel mb={0}>Тематика</FormLabel>
                 </Flex>
                 <Input
                   value={input.themes || ''}
                   onChange={(e) => setInput({ themes: e.target.value })}
                   placeholder="Например: Дружба, предательство, месть"
                   focusBorderColor="brand.400"
                 />
                 <FormHelperText>Укажите основные темы квеста</FormHelperText>
               </FormControl>
             </Flex>
             
             <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
               <FormControl>
                 <Flex align="center" mb={2}>
                   <Icon as={FaCog} mr={2} color="brand.500" />
                   <FormLabel mb={0}>Количество сцен</FormLabel>
                 </Flex>
                 <Select
                   value={input.sceneCount || 3}
                   onChange={(e) => setInput({ sceneCount: parseInt(e.target.value) })}
                   focusBorderColor="brand.400"
                 >
                   <option value={3}>3 сцены (Быстрый)</option>
                   <option value={4}>4 сцены (Короткий)</option>
                   <option value={6}>6 сцен (Средний)</option>
                   <option value={8}>8 сцен (Длинный)</option>
                 </Select>
                 <FormHelperText>Выберите продолжительность квеста</FormHelperText>
               </FormControl>
               
               <FormControl>
                 <Flex align="center" mb={2}>
                   <Icon as={FaUsers} mr={2} color="brand.500" />
                   <FormLabel mb={0}>Количество персонажей</FormLabel>
                 </Flex>
                 <Select
                   value={input.characterCount || 3}
                   onChange={(e) => setInput({ characterCount: parseInt(e.target.value) })}
                   focusBorderColor="brand.400"
                 >
                   <option value={2}>2 персонажа (Минимум)</option>
                   <option value={3}>3 персонажа (Стандарт)</option>
                   <option value={5}>5 персонажей (Много)</option>
                   <option value={7}>7 персонажей (Максимум)</option>
                 </Select>
                 <FormHelperText>Количество ключевых персонажей</FormHelperText>
               </FormControl>
             </Flex>
             
             <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
               <FormControl>
                 <FormLabel>Сложность квеста</FormLabel>
                 <Select
                   value={input.complexity || 'medium'}
                   onChange={(e) => setInput({ complexity: e.target.value as QuestComplexity })}
                   focusBorderColor="brand.400"
                 >
                   <option value="simple">Простой (Линейный сюжет)</option>
                   <option value="medium">Средний (Несколько путей)</option>
                   <option value="complex">Сложный (Множество развилок)</option>
                 </Select>
                 <FormHelperText>Сложность сюжетных развилок</FormHelperText>
               </FormControl>
               
               <FormControl>
                 <FormLabel>Тон повествования</FormLabel>
                 <Select
                   value={input.tone || 'serious'}
                   onChange={(e) => setInput({ tone: e.target.value as QuestTone })}
                   focusBorderColor="brand.400"
                 >
                   <option value="light">Легкий (Позитивный)</option>
                   <option value="serious">Серьезный (Драматичный)</option>
                   <option value="dark">Темный (Мрачный)</option>
                   <option value="humorous">Юмористический (Комедийный)</option>
                 </Select>
                 <FormHelperText>Общая атмосфера квеста</FormHelperText>
               </FormControl>
             </Flex>
          </VStack>
        </Collapse>
        
        <Button
          type="submit"
          colorScheme="brand"
          size="lg"
          isLoading={isLoading}
          loadingText="Генерация..."
          mt={4}
        >
          Сгенерировать квест
        </Button>
        
        {error && (
          <Text color="red.500" mt={2}>
            {error}
          </Text>
        )}
              </VStack>
            </TabPanel>
            
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Text textAlign="center" fontSize="md" color="gray.500">
                  Загрузите текстовый файл с описанием вашего мира и квеста
                </Text>
                
                <FileUpload
                  onFileContent={handleFileContent}
                  onClear={handleClearFile}
                  fileContent={input.fileContent}
                />
                
                <Button
                  colorScheme="brand"
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Генерация..."
                  mt={4}
                  isDisabled={!input.fileContent}
                  onClick={handleFileGenerate}
                >
                  Сгенерировать квест из файла
                </Button>
                
                {error && (
                  <Text color="red.500" mt={2}>
                    {error}
                  </Text>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
});

GeneratorForm.displayName = 'GeneratorForm';

export default GeneratorForm;