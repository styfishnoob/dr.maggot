import { createHashRouter, RouterProvider } from 'react-router-dom';
import Display from '@/entrypoints/options/pages/display';
import Filter from '@/entrypoints/options/pages/filter';
import Danmaku from '@/entrypoints/options/pages/danmaku';
import Other from '@/entrypoints/options/pages/other';
import Notice from '@/entrypoints/options/pages/notice';
import BlocklistWord from '@/entrypoints/options/pages/blocklist-word';
import BlocklistUser from '@/entrypoints/options/pages/blocklist-user';
import BlocklistEmote from '@/entrypoints/options/pages/blocklist-emote';

const router = createHashRouter([
    {
        path: '/',
        element: <Display />,
    },
    {
        path: 'filter',
        element: <Filter />,
    },
    {
        path: 'danmaku',
        element: <Danmaku />,
    },
    {
        path: 'other',
        element: <Other />,
    },
    {
        path: 'blocklist-word',
        element: <BlocklistWord />,
    },
    {
        path: 'blocklist-user',
        element: <BlocklistUser />,
    },
    {
        path: 'blocklist-emote',
        element: <BlocklistEmote />,
    },
    {
        path: 'notice',
        element: <Notice />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
