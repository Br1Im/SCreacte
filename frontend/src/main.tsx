import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'


const theme = extendTheme({
  fonts: {
    heading: "'Press Start 2P', cursive",
    body: "'VT323', monospace",
  },
  colors: {
    brand: {
      50: '#f0e4ff',
      100: '#d1b3ff',
      200: '#b180ff',
      300: '#914dff',
      400: '#721aff',
      500: '#5900e6',
      600: '#4500b4',
      700: '#310082',
      800: '#1e0051',
      900: '#0a0021',
    },

    pixel: {
      green: '#00FF00',
      blue: '#0000FF',
      red: '#FF0000',
      yellow: '#FFFF00',
      cyan: '#00FFFF',
      magenta: '#FF00FF',
      black: '#000000',
      white: '#FFFFFF',
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      'html, body': {
        color: props.colorMode === 'dark' ? '#00FF00' : '#000000',
        background: 'transparent !important',
        backgroundColor: 'transparent !important',
        transition: 'all 0.3s ease',
        lineHeight: 'tall',
        imageRendering: 'pixelated',
        WebkitFontSmoothing: 'none',
        MozOsxFontSmoothing: 'grayscale',
      },

      '*': {
        transition: 'all 0.3s ease !important',
        borderRadius: '0px !important',
      },

      'button, .chakra-button': {
        border: '2px solid #000000 !important',
        boxShadow: props.colorMode === 'dark' ? '3px 3px 0px #00FF00 !important' : '3px 3px 0px #000000 !important',
        transform: 'translate(0, 0)',
        transition: 'transform 0.1s ease, box-shadow 0.1s ease !important',
        '&:active': {
          transform: 'translate(2px, 2px)',
          boxShadow: '1px 1px 0px #000000 !important',
        },
      },

      'input, .chakra-input': {
        border: '2px solid #000000 !important',
        backgroundColor: props.colorMode === 'dark' ? '#000000 !important' : '#FFFFFF !important',
        color: props.colorMode === 'dark' ? '#00FF00 !important' : '#000000 !important',
      },

      '.chakra-card, .chakra-container, [role="dialog"]': {
        border: '2px solid #000000 !important',
        boxShadow: '4px 4px 0px #000000 !important',
      },

      'svg, svg *, path, rect, circle, polygon': {
        transition: 'fill 0.3s ease, stroke 0.3s ease, opacity 0.3s ease !important',
      },

      '.chakra-ui-dark *, .chakra-ui-light *': {
        transition: 'all 0.3s ease !important',
      },
    }),
  },
  
  transition: {
    duration: {
      normal: '0.3s',
      slow: '0.5s',
      fast: '0.1s',
    },
    easing: {

      ease: 'ease',
      easeIn: 'easeIn',
      easeOut: 'easeOut',
      easeInOut: 'easeInOut',

      button: 'ease',
    },
    property: {
      common: 'background-color, color, border-color, fill, stroke, opacity, box-shadow, transform',
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider 
      theme={theme} 
      resetCSS={false}
    >
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)
