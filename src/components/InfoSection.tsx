import {
  Box,
  Heading,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Icon,
  useColorModeValue,
  Code,
} from '@chakra-ui/react';
import { FaCheckCircle, FaInfoCircle, FaLightbulb } from 'react-icons/fa';

const InfoSection = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('brand.500', 'brand.300');
  
  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      width="100%"
      maxWidth="800px"
      mx="auto"
      mt={8}
      mb={12}
    >
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color={accentColor} textAlign="center">
          О проекте SCreate
        </Heading>
        
        <Text>
          SCreate — это инструмент для генерации игровых сцен и квестов по заданному сеттингу.
          Просто укажите мир, отправную точку и стиль квеста, а наш генератор создаст
          структурированный квест с логичными переходами между сценами и вариантами действий.
        </Text>
        
        <Accordion allowMultiple defaultIndex={[0]} borderColor={borderColor}>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="semibold">
                <Icon as={FaInfoCircle} color={accentColor} mr={2} />
                Как использовать генератор
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={accentColor} />
                  <Text as="span" fontWeight="semibold">Выберите сеттинг</Text> — мир, в котором будет происходить действие (фэнтези, киберпанк, постапокалипсис и др.)
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={accentColor} />
                  <Text as="span" fontWeight="semibold">Укажите отправную точку</Text> — место, с которого начнется приключение (например, «Таверна в городе, охваченном чумой»)
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={accentColor} />
                  <Text as="span" fontWeight="semibold">Выберите стиль квеста</Text> — жанр и направленность истории (детектив, выживание, приключение и др.)
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={accentColor} />
                  <Text as="span" fontWeight="semibold">Нажмите «Сгенерировать квест»</Text> — и получите готовую структуру с персонажами, локациями и сценами
                </ListItem>
              </List>
            </AccordionPanel>
          </AccordionItem>
          
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="semibold">
                <Icon as={FaLightbulb} color={accentColor} mr={2} />
                Структура генерируемых квестов
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <List spacing={3}>
                <ListItem>
                  <Text as="span" fontWeight="semibold">Сцены</Text> — ключевые моменты истории с описанием и вариантами действий
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="semibold">Персонажи</Text> — NPC с описанием, ролью и мотивацией
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="semibold">Локации</Text> — места, где происходит действие
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="semibold">Предметы</Text> — объекты, которые можно найти и использовать
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="semibold">Выборы</Text> — варианты действий, влияющие на развитие сюжета
                </ListItem>
              </List>
              
              <Box mt={4} p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                <Text fontWeight="semibold" mb={2}>Пример структуры JSON для квеста:</Text>
                <Code p={3} borderRadius="md" fontSize="xs" width="100%" display="block" whiteSpace="pre" overflowX="auto">
                  {`{
  "id": "quest-1",
  "title": "Поиск артефакта",
  "description": "Описание квеста...",
  "setting": "fantasy",
  "scenes": [
    {
      "id": "scene-1",
      "title": "Начало пути",
      "description": "Описание сцены...",
      "choices": [
        { "id": "choice-1", "text": "Вариант действия", "nextSceneId": "scene-2" }
      ]
    }
  ],
  "characters": [...],
  "locations": [...],
  "items": [...]
}`}
                </Code>
              </Box>
            </AccordionPanel>
          </AccordionItem>
          
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="semibold">
                <Icon as={FaInfoCircle} color={accentColor} mr={2} />
                Возможности использования
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={accentColor} />
                  <Text as="span" fontWeight="semibold">Для разработчиков игр</Text> — быстрое создание структуры квестов и сюжетных линий
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={accentColor} />
                  <Text as="span" fontWeight="semibold">Для мастеров настольных игр</Text> — генерация приключений для кампаний D&D и других RPG
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={accentColor} />
                  <Text as="span" fontWeight="semibold">Для писателей</Text> — создание структуры интерактивных историй и новелл
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={accentColor} />
                  <Text as="span" fontWeight="semibold">Для обучения</Text> — изучение структуры нарративного дизайна и сторителлинга
                </ListItem>
              </List>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Box>
  );
};

export default InfoSection;