// Importazione moduli
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './style.css';
import Dashboard from './pages/Dashboard.page';
import Controls from './pages/Controls.page';
import DeviceSettings from './pages/DeviceSettings.page';
import Log from './pages/Log.page';
import Stats from './pages/Stats.page';
import Page404 from './pages/Page404.page';
import Privacy from './pages/Privacy.page';
import Cookies from './pages/Cookies.page';
import Credits from './pages/Credits.page';
import UserSettings from './pages/UserSettings.page';
import Account from './pages/Account.page';
import Auth from './pages/Auth.page';
import Warning from './pages/Warning.page';

// Creazione router
const router = createBrowserRouter([
    { path: '/', element: <Dashboard /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/dashboard/:id', element: <Dashboard /> },
    { path: '/dashboard/:id/controls', element: <Controls /> },
    { path: '/dashboard/:id/settings', element: <DeviceSettings /> },
    { path: '/dashboard/:id/log', element: <Log /> },
    { path: '/dashboard/:id/stats', element: <Stats /> },
    { path: '/privacy', element: <Privacy /> },
    { path: '/cookies', element: <Cookies /> },
    { path: '/credits', element: <Credits /> },
    { path: '/settings', element: <UserSettings /> },
    { path: '/account', element: <Account /> },
    { path: '/auth/:type', element: <Auth /> },
    { path: '/auth', element: <Auth /> },
    { path: '/warning', element: <Warning /> },
    { path: '*', element: <Page404 /> },
]);

// Renderizzazione router
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}></RouterProvider>
    </StrictMode>
);
