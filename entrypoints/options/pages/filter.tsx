import Main from '@/entrypoints/options/components/Main/Main';
import Sidebar from '@/entrypoints/options/components/Sidebar/Sidebar';
import Topbar from '@/entrypoints/options/components/Topbar/Topbar';
import SettingsList from '@/entrypoints/options/components/SettingsList/SettingsList';
import SettingsCard from '@/entrypoints/options/components/SettingsCard/SettingsCard';
import PlatformCheckboxList from '@/entrypoints/features/PlatformCheckboxList/PlatformCheckboxList';
import InputLimit from '@/entrypoints/features/InputLimit/InputLimit';

type SettingsCardProps = {
    title: string;
    description: string;
    feature: JSX.Element;
};

const SettingsCards: SettingsCardProps[] = [
    {
        title: `${browser.i18n.getMessage('filter_filter')}`,
        description: `${browser.i18n.getMessage('filter_filter_description')}`,
        feature: <PlatformCheckboxList<Filter> storageKey="Filter" itemKey="filter" />,
    },
    {
        title: `${browser.i18n.getMessage('filter_subOnly')}`,
        description: `${browser.i18n.getMessage('filter_subOnly_description')}`,
        feature: <PlatformCheckboxList<Filter> storageKey="Filter" itemKey="subOnly" />,
    },
    {
        title: `${browser.i18n.getMessage('filter_range')}`,
        description: `${browser.i18n.getMessage('filter_range_description')}`,
        feature: <PlatformCheckboxList<Filter> storageKey="Filter" itemKey="range" />,
    },
    {
        title: `${browser.i18n.getMessage('filter_charLimit')}`,
        description: `${browser.i18n.getMessage('filter_charLimit_description')}`,
        feature: <InputLimit<Filter> storageKey="Filter" itemKey="charLimit" />,
    },
    {
        title: `${browser.i18n.getMessage('filter_emoteLimit')}`,
        description: `${browser.i18n.getMessage('filter_emoteLimit_description')}`,
        feature: <InputLimit<Filter> storageKey="Filter" itemKey="emoteLimit" />,
    },
];

const Filter = () => {
    return (
        <main className="flex h-screen">
            <Sidebar />
            <Main>
                <Topbar title={browser.i18n.getMessage('menu_filter')} />
                <SettingsList>
                    {SettingsCards.map((item, index) => (
                        <SettingsCard key={index} title={item.title} description={item.description}>
                            {item.feature}
                        </SettingsCard>
                    ))}
                </SettingsList>
            </Main>
        </main>
    );
};

export default Filter;
