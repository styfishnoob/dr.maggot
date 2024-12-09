import { createHashRouter, RouterProvider } from "react-router-dom";

import Display from "@/entrypoints/options/pages/display";
import Filter from "./pages/filter";
import Danmaku from "./pages/danmaku";
import Other from "./pages/other";
import BlocklistWord from "./pages/blocklist-word";
import BlocklistUser from "./pages/blocklist-user";
import BlocklistEmote from "./pages/blocklist-emote";
import Notice from "./pages/notice";
import CommandList from "./pages/command-list";

const router = createHashRouter([
    {
        path: "/",
        element: <Display />,
    },
    {
        path: "filter",
        element: <Filter />,
    },
    {
        path: "danmaku",
        element: <Danmaku />,
    },
    {
        path: "other",
        element: <Other />,
    },
    {
        path: "blocklist-word",
        element: <BlocklistWord />,
    },
    {
        path: "blocklist-user",
        element: <BlocklistUser />,
    },
    {
        path: "blocklist-emote",
        element: <BlocklistEmote />,
    },
    {
        path: "notice",
        element: <Notice />,
    },
    {
        path: "command-list",
        element: <CommandList />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
