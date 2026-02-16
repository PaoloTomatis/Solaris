// Importazione moduli
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './style.css';
import { ACTIVE_VERSION, versions } from './versions';

// Creazione router
const router = createBrowserRouter(versions[ACTIVE_VERSION - 1]);

// Renderizzazione router
createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}></RouterProvider>,
);
