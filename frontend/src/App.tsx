import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuestResultPage from './pages/QuestResultPage';
import { ColorModeScript } from '@chakra-ui/react';

function App() {
  return (
    <>
      <ColorModeScript initialColorMode="light" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quest-result" element={<QuestResultPage />} />
      </Routes>
    </>
  );
}

export default App;
