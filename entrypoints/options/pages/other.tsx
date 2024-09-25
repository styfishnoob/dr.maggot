import Main from '@/entrypoints/options/components/Main/Main';
import Sidebar from '@/entrypoints/options/components/Sidebar/Sidebar';
import Topbar from '@/entrypoints/options/components/Topbar/Topbar';
import SettingsList from '@/entrypoints/options/components/SettingsList/SettingsList';
import SettingsCard from '@/entrypoints/options/components/SettingsCard/SettingsCard';
import PlatformCheckboxList from '@/entrypoints/features/PlatformCheckboxList/PlatformCheckboxList';

type SettingsCardProps = {
    title: string;
    description: string;
    feature: JSX.Element;
};

const SettingsCards: SettingsCardProps[] = [
    {
        title: `${browser.i18n.getMessage('other_quickBlock')}`,
        description: `${browser.i18n.getMessage('other_quickBlock_description')}`,
        feature: <PlatformCheckboxList<Other> storageKey="Other" itemKey="quickBlock" />,
    },
    {
        title: `${browser.i18n.getMessage('other_autoBonus')}`,
        description: `${browser.i18n.getMessage('other_autoBonus_description')}`,
        feature: (
            <PlatformCheckboxList<Other>
                storageKey="Other"
                itemKey="autoBonus"
                disabled={{ youtube: true, twitch: false, openrec: true, twicas: true }}
            />
        ),
    },
    {
        title: `${browser.i18n.getMessage('other_countdown')}`,
        description: `${browser.i18n.getMessage('other_countdown_description')}`,
        feature: (
            <PlatformCheckboxList<Other>
                storageKey="Other"
                itemKey="countdown"
                disabled={{ youtube: true, twitch: false, openrec: true, twicas: true }}
            />
        ),
    },
];

const Filter = () => {
    return (
        <main className="flex h-screen">
            <Sidebar />
            <Main>
                <Topbar title={browser.i18n.getMessage('menu_other')} />
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
