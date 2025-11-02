// Importazione moduli
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './style.css';
import Home from './pages/Home.page';
import Devices from './pages/Devices.page';
import DeviceRegister from './pages/DeviceRegister.page';
import Dashboard from './pages/Dashboard.page';
import Controls from './pages/Controls.page';
import DeviceSettings from './pages/DeviceSettings.page';
import Log from './pages/Log.page';
import Stats from './pages/Stats.page';
import Page404 from './pages/Page404.page';
import Credits from './pages/Credits.page';
import UserSettings from './pages/UserSettings.page';
import Account from './pages/Account.page';
import Auth from './pages/Auth.page';
import Warning from './pages/Warning.page';
import Parent from './components/Parent.comp';
import ProtectedRoute from './components/ProtectedRoute.comp';

// Creazione router
const router = createBrowserRouter([
    { path: '/warning', element: <Warning /> },
    {
        element: <Parent />,
        children: [
            { path: '/', element: <Home /> },
            {
                path: '/devices',
                element: (
                    <ProtectedRoute>
                        <Devices />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/devices/add',
                element: (
                    <ProtectedRoute>
                        <DeviceRegister />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/dashboard/:id',
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/dashboard/:id/controls',
                element: (
                    <ProtectedRoute>
                        <Controls />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/dashboard/:id/settings',
                element: (
                    <ProtectedRoute>
                        <DeviceSettings />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/dashboard/:id/log',
                element: (
                    <ProtectedRoute>
                        <Log />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/dashboard/:id/stats',
                element: (
                    <ProtectedRoute>
                        <Stats />
                    </ProtectedRoute>
                ),
            },
            { path: '/credits', element: <Credits /> },
            {
                path: '/settings',
                element: (
                    <ProtectedRoute>
                        <UserSettings />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/account',
                element: (
                    <ProtectedRoute>
                        <Account />
                    </ProtectedRoute>
                ),
            },
            { path: '/auth/:type', element: <Auth /> },
            { path: '/auth', element: <Auth /> },
            { path: '*', element: <Page404 /> },
        ],
    },
]);

// Renderizzazione router
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}></RouterProvider>
    </StrictMode>
);
