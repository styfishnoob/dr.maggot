import SettingsCard from "./SettingsCard";

type Props = {
    settingsCards: React.ComponentProps<typeof SettingsCard>[];
};

export const Settings = (props: Props) => {
    return (
        <div className="flex flex-col w-full min-w-[800px]">
            {props.settingsCards.map((prop, index) => (
                <SettingsCard key={index} title={prop.title} description={prop.description} feature={prop.feature} />
            ))}
        </div>
    );
};

export default Settings;
