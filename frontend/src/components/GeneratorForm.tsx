import { useState } from 'react';
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
  Divider,
} from '@chakra-ui/react';
import { useGeneratorStore } from '../store/generatorStore';
import { Setting, QuestStyle } from '../types/generator.js';
import { FaGamepad, FaMapMarkedAlt, FaBookOpen } from 'react-icons/fa';

const GeneratorForm = () => {
  const { input, setInput, generateQuest, isLoading, error } = useGeneratorStore();
  const [showCustomSetting, setShowCustomSetting] = useState(input.setting === 'custom');
  const [showCustomQuestStyle, setShowCustomQuestStyle] = useState(input.questStyle === 'custom');
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateQuest();
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
            <Icon as={FaMapMarkedAlt} mr={2} color="brand.500" />
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
              <Icon as={FaBookOpen} mr={2} color="brand.500" />
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
    </Box>
  );
};

export default GeneratorForm;