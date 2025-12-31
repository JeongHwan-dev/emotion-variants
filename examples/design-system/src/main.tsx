import { ThemeProvider } from '@emotion/react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { theme } from '@/theme';
import { App } from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StrictMode>,
  );
}
