import Main from '@/entrypoints/options/components/Main/Main';
import Sidebar from '@/entrypoints/options/components/Sidebar/Sidebar';
import Topbar from '@/entrypoints/options/components/Topbar/Topbar';
import Table from '@/entrypoints/options/components/Table/Table';

const BlocklistWord = () => {
    return (
        <main className="flex h-screen">
            <Sidebar />
            <Main>
                <Topbar title={browser.i18n.getMessage('menu_blockedWords')} />
                <Table storageKey="word" placeholder={browser.i18n.getMessage('blockedWords_input_placeholder')} />
            </Main>
        </main>
    );
};
export default BlocklistWord;
