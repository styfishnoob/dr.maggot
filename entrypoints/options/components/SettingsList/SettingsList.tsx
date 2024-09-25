import React from 'react';

type Props = {
    children: React.ReactNode;
};

const SettingsList = (props: Props) => {
    return <ul className="flex w-full min-w-[800px] flex-col p-6">{props.children}</ul>;
};

export default SettingsList;
