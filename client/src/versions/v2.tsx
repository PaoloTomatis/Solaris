// Importazione pagine
import Home from '../pages/global/Home.page';
import Devices from '../pages/v2/Devices.page';
import DeviceRegister from '../pages/v2/DeviceRegister.page';
import Dashboard from '../pages/v2/Dashboard.page';
import Controls from '../pages/v2/Controls.page';
import DeviceSettings from '../pages/v2/DeviceSettings.page';
import Log from '../pages/v2/Logs.page';
import Stats from '../pages/global/Stats.page';
import Page404 from '../pages/global/Page404.page';
import Credits from '../pages/global/Credits.page';
import UserSettings from '../pages/v2/UserSettings.page';
import Account from '../pages/v2/Account.page';
import Auth from '../pages/v2/Auth.page';
import Warning from '../pages/global/Warning.page';
import Parent from '../components/v2/Parent.comp';
import ProtectedRoute from '../components/v2/ProtectedRoute.comp';

// Dichiarazione pagine router
const pagesv2 = [
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
export default pagesv2;
