import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ContactForm from './components/ContactForm';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-16">
      <ContactForm />
    </main>
  </StrictMode>,
);
