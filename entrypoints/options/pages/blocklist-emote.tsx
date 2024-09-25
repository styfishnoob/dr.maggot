import Main from '@/entrypoints/options/components/Main/Main';
import Sidebar from '@/entrypoints/options/components/Sidebar/Sidebar';
import Topbar from '@/entrypoints/options/components/Topbar/Topbar';
import Table from '@/entrypoints/options/components/Table/Table';

const BlocklistEmote = () => {
    return (
        <main className="flex h-screen">
            <Sidebar />
            <Main>
                <Topbar title={browser.i18n.getMessage('menu_blockedEmotes')} />
                <Table storageKey="emote" placeholder={browser.i18n.getMessage('blockedEmotes_input_placeholder')} />
            </Main>
        </main>
    );
};
export default BlocklistEmote;
