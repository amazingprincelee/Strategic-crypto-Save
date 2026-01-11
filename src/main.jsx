import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import  store  from './redux/store.js'
import './index.css'
import App from './App.jsx'

// Initialize dark mode
const initializeTheme = () => {
  // Check if user has a theme preference in localStorage
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    // Default to dark mode as primary theme
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};

// Initialize theme before rendering
initializeTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
