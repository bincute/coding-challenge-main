import { ChakraProvider } from '@chakra-ui/react';
import { defaultTheme } from '@cosmology/react';

function CosmologyApp({ Component, pageProps }) {
  // Add this in node_modules/react-dom/index.js
const React1 = require('react');

// Add this in your component file
require('react-dom');
const React2 = require('react');
console.log('version', React1 === React2);

  return (
    <ChakraProvider theme={defaultTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default CosmologyApp;
