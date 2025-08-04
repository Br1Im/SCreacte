import React, { useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Button,
  useColorModeValue,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useGeneratorStore } from '../store/generatorStore';
import GenerationProgress from '../components/GenerationProgress';
import QuestViewer from '../components/QuestViewer';
import Header from '../components/Header';

const QuestResultPage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { generatedQuest, generationProgress } = useGeneratorStore();
  const { isGenerating } = generationProgress;
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  // Если нет активной генерации и нет готового квеста, перенаправляем на главную
  useEffect(() => {
    if (!isGenerating && !generatedQuest) {
      navigate('/');
    }
  }, [isGenerating, generatedQuest, navigate]);
  
  const handleBackToHome = () => {
    navigate('/');
  };
  
  return (
    <Box minHeight="100vh" bg={bgColor}>
      <Header />
      
      <Container maxWidth="1200px" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Кнопка возврата */}
          <Flex justify="flex-start">
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={handleBackToHome}
              size="sm"
            >
              Вернуться к генератору
            </Button>
          </Flex>
          
          {/* Отображение прогресса генерации */}
          {(isGenerating || generationProgress.completedSteps.length > 0) && <GenerationProgress />}
          
          {/* Отображение готового квеста */}
          {!isGenerating && generatedQuest && (
            <QuestViewer />
          )}
        </VStack>
      </Container>
    </Box>
  );
});

QuestResultPage.displayName = 'QuestResultPage';

export default QuestResultPage;