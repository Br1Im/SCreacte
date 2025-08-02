import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';
import { FaFileUpload, FaFileAlt, FaTimes } from 'react-icons/fa';

interface FileUploadProps {
  onFileContent: (content: string) => void;
  onClear: () => void;
  fileContent?: string;
}

const FileUpload = ({ onFileContent, onClear, fileContent }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const dragBgColor = useColorModeValue('blue.50', 'blue.900');
  const dragBorderColor = useColorModeValue('blue.300', 'blue.400');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Проверяем тип файла
    if (!file.name.toLowerCase().endsWith('.txt')) {
      setError('Пожалуйста, загрузите только .txt файлы');
      return;
    }

    // Проверяем размер файла (максимум 1MB)
    if (file.size > 1024 * 1024) {
      setError('Размер файла не должен превышать 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileContent(content);
    };
    reader.onerror = () => {
      setError('Ошибка при чтении файла');
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    onClear();
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <VStack spacing={4} width="100%">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />

      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={() => setError(null)}
          />
        </Alert>
      )}

      {!fileContent ? (
        <Box
          border="2px dashed"
          borderColor={dragActive ? dragBorderColor : borderColor}
          borderRadius="lg"
          p={8}
          textAlign="center"
          bg={dragActive ? dragBgColor : bgColor}
          transition="all 0.2s"
          cursor="pointer"
          onClick={handleButtonClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          _hover={{
            borderColor: dragBorderColor,
            bg: dragBgColor,
          }}
        >
          <VStack spacing={4}>
            <Icon as={FaFileUpload} boxSize={8} color="blue.500" />
            <Text fontSize="lg" fontWeight="medium">
              Перетащите .txt файл сюда или нажмите для выбора
            </Text>
            <Text fontSize="sm" color="gray.500">
              Поддерживаются только текстовые файлы (.txt) размером до 1MB
            </Text>
            <Button colorScheme="blue" variant="outline" size="sm">
              Выбрать файл
            </Button>
          </VStack>
        </Box>
      ) : (
        <Box
          border="1px solid"
          borderColor={borderColor}
          borderRadius="lg"
          p={4}
          bg={bgColor}
          width="100%"
        >
          <HStack justify="space-between" mb={3}>
            <HStack>
              <Icon as={FaFileAlt} color="green.500" />
              <Text fontWeight="medium">Файл загружен</Text>
            </HStack>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={handleClear}
              leftIcon={<FaTimes />}
            >
              Удалить
            </Button>
          </HStack>
          <Box
            maxH="200px"
            overflowY="auto"
            p={3}
            bg={useColorModeValue('white', 'gray.800')}
            borderRadius="md"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
          >
            <Text fontSize="sm" whiteSpace="pre-wrap">
              {fileContent.length > 500 
                ? `${fileContent.substring(0, 500)}...` 
                : fileContent
              }
            </Text>
            {fileContent.length > 500 && (
              <Text fontSize="xs" color="gray.500" mt={2}>
                Показаны первые 500 символов из {fileContent.length}
              </Text>
            )}
          </Box>
        </Box>
      )}
    </VStack>
  );
};

export default FileUpload; 