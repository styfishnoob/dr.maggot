import { NavLink } from 'react-router-dom';

import bell from '@/assets/icons/bell.svg';
import book from '@/assets/icons/book.svg';
import gem from '@/assets/icons/gem.svg';
import megaphone from '@/assets/icons/megaphone.svg';
import monitor from '@/assets/icons/monitor.svg';
import other from '@/assets/icons/other.svg';
import robot from '@/assets/icons/robot.svg';
import users from '@/assets/icons/users.svg';

import odaibako from '@/assets/link_icons/odaibako.png';
import webstore from '@/assets/link_icons/svg-webstore.svg';

const gradationList = {
    red: 'bg-gradient-to-b from-red-400 via-red-600 to-red-600',
    green: 'bg-gradient-to-b from-green-400 via-green-500 to-green-500',
    blue: 'bg-gradient-to-b from-blue-400 via-blue-500 to-blue-500',
    amber: 'bg-gradient-to-b from-amber-400 to-amber-500',
    gray: 'bg-gradient-to-b from-stone-400 via-stone-600 to-stone-600',
    slate: 'bg-gradient-to-r from-slate-400 to-slate-500',
};

type SidebarColumnProps = {
    to: string;
    title: string;
    src: string;
    gradationKey: keyof typeof gradationList;
};

type ExternalLinkProps = {
    title: string;
    target?: string;
    linkSrc: string;
    imgSrc: string;
};

const SidebarColumn = (props: SidebarColumnProps) => {
    return (
        <li>
            <NavLink
                to={props.to}
                className={({ isActive }) => (isActive ? 'bg-blue-700 text-white' : 'bg-inherit text-black dark:text-white')}
            >
                <div className="text-xm flex items-center gap-x-1.5 rounded-md bg-inherit px-1.5 py-1">
                    <div className={`rounded-md p-1 shadow-sm ${gradationList[props.gradationKey]}`}>
                        <img width={16} height={16} src={props.src} />
                    </div>
                    <div>
                        <span>{props.title}</span>
                    </div>
                </div>
            </NavLink>
        </li>
    );
};

const ExternalLink = (props: ExternalLinkProps) => {
    return (
        <li>
            <a className="text-black dark:text-white" target={props.target ? props.target : '_self'} href={props.linkSrc}>
                <div className="text-xm flex items-center gap-x-1.5 rounded-md bg-inherit px-1.5 py-1">
                    <div className={`rounded-md p-1 shadow-sm ${gradationList.slate}`}>
                        <img width={16} height={16} src={props.imgSrc} />
                    </div>
                    <div>
                        <span>{props.title}</span>
                    </div>
                </div>
            </a>
        </li>
    );
};

const Sidebar = () => {
    return (
        <>
            <div
                id="docs-sidebar"
                className="w-56 min-w-56 max-w-56 overflow-y-auto border-e border-gray-200 bg-stone-100 pb-10 pt-7 dark:border-neutral-700 dark:bg-neutral-900"
            >
                <div className="px-6">
                    <a className="flex-none text-xl font-semibold text-black dark:text-white" href="#" aria-label="Dr.Maggot">
                        <span>Dr.Maggot</span>
                    </a>
                </div>
                <nav className="hs-accordion-group flex w-full flex-col flex-wrap p-6" data-hs-accordion-always-open>
                    <ul className="space-y-3">
                        <li>
                            <ul>
                                <SidebarColumn
                                    to="/"
                                    title={browser.i18n.getMessage('menu_display')}
                                    src={monitor}
                                    gradationKey="green"
                                />
                                <SidebarColumn
                                    to="/filter"
                                    title={browser.i18n.getMessage('menu_filter')}
                                    src={robot}
                                    gradationKey="blue"
                                />
                                <SidebarColumn
                                    to="/danmaku"
                                    title={browser.i18n.getMessage('menu_danmaku')}
                                    src={megaphone}
                                    gradationKey="amber"
                                />
                                <SidebarColumn
                                    to="/other"
                                    title={browser.i18n.getMessage('menu_other')}
                                    src={other}
                                    gradationKey="gray"
                                />
                            </ul>
                        </li>
                        <li>
                            <ul>
                                <SidebarColumn
                                    to="/blocklist-word"
                                    title={browser.i18n.getMessage('menu_blockedWords')}
                                    src={book}
                                    gradationKey="red"
                                />
                                <SidebarColumn
                                    to="/blocklist-user"
                                    title={browser.i18n.getMessage('menu_blockedUsers')}
                                    src={users}
                                    gradationKey="red"
                                />
                                <SidebarColumn
                                    to="/blocklist-emote"
                                    title={browser.i18n.getMessage('menu_blockedEmotes')}
                                    src={gem}
                                    gradationKey="red"
                                />
                            </ul>
                        </li>
                        <li>
                            <ul>
                                <SidebarColumn
                                    to="/notice"
                                    title={browser.i18n.getMessage('menu_notice')}
                                    src={bell}
                                    gradationKey="slate"
                                />
                                <ExternalLink
                                    title="odaibako"
                                    target="_blank"
                                    imgSrc={odaibako}
                                    linkSrc="https://odaibako.net/u/styfish"
                                />
                                <ExternalLink
                                    title="web store"
                                    target="_blank"
                                    imgSrc={webstore}
                                    linkSrc="https://chromewebstore.google.com/detail/drmaggot/lohndmdifcjjclnedjmljpmdjmfpbnai?authuser=1&hl=ja"
                                />
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
