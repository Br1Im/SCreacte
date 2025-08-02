import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { ColorModeScript } from '@chakra-ui/react';

function App() {
  return (
    <>
      <ColorModeScript initialColorMode="light" />
      <Routes>
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
