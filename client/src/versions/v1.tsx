// Importazione pagine
import Home from '../pages/global/Home.page';
import Devices from '../pages/v1/Devices.page';
import DeviceRegister from '../pages/v1/DeviceRegister.page';
import Dashboard from '../pages/v1/Dashboard.page';
import Controls from '../pages/v1/Controls.page';
import DeviceSettings from '../pages/v1/DeviceSettings.page';
import Log from '../pages/v1/Logs.page';
import Stats from '../pages/global/Stats.page';
import Page404 from '../pages/global/Page404.page';
import Credits from '../pages/global/Credits.page';
import UserSettings from '../pages/v1/UserSettings.page';
import Account from '../pages/v1/Account.page';
import Auth from '../pages/v1/Auth.page';
import Warning from '../pages/global/Warning.page';
import Parent from '../components/global/Parent.comp';
import ProtectedRoute from '../components/v1/ProtectedRoute.comp';

// Dichiarazione pagine router
const pagesV1 = [
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
];

// Esportazione pagine router
export default pagesV1;
