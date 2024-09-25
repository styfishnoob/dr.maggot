import Sidebar from "@/entrypoints/options/components/Sidebar/Sidebar";
import Main from "@/entrypoints/options/components/Main/Main";
import Topbar from "@/entrypoints/options/components/Topbar/Topbar";

type NoticeCardProps = {
    title: string;
    children: JSX.Element;
};

const Notice = () => {
    return (
        <main className="flex h-screen">
            <Sidebar />
            <Main>
                <Topbar title={browser.i18n.getMessage("menu_notice")} />
                <div className="overflow-auto">
                    <NoticeCard title="2024/9/16">
                        <ul>
                            <li>以下の修正を行いました。</li>
                            <br />
                            <li>・ブロックボタンが表示されない不具合</li>
                            <li>・その他CSSがうまく反映されない不具合</li>
                            <li>・メモリリークの原因と思われる処理の修正</li>
                            <br />
                            <li>メモリリークの原因と思しき箇所があったので、修正を加えました。</li>
                            <li>
                                私の環境ではメモリリークが改善した傾向が見られましたが、もしメモリリークが起こった際は報告してくださると大変助かります。
                            </li>
                        </ul>
                    </NoticeCard>
                    <NoticeCard title="2024/8/6">
                        <ul>
                            <li>以下の修正を行いました。</li>
                            <br />
                            <li>・正規表現周りの修正</li>
                            <li>・メモリリークの原因と思われる処理の修正</li>
                            <br />
                            <li>
                                ブロックワードなどが動作しない原因が正規表現の処理にあったため修正しました。
                            </li>
                            <li>
                                おそらく正常に動作すると思いますが、もしまた動かないなどありましたら申し訳ありませんが報告をお願いいたします。
                            </li>
                            <li>また、正常に動作した場合も報告してくださると大変助かります。</li>
                        </ul>
                    </NoticeCard>
                    <NoticeCard title="2024/7/31">
                        <ul>
                            <li>以下の修正を行いました。</li>
                            <br />
                            <li>・Youtubeで弾幕のCSSが適用されない不具合</li>
                            <li>・正規表現が適用されない不具合</li>
                            <li>・Twitchアーカイブの対応</li>
                            <li>・エモートが含まれているとき、文字数制限が効かない不具合</li>
                            <br />
                            <li></li>
                            <li>
                                正規表現の不具合を修正するにあたり仕様を変更しました。そのため、以前から登録してある正規表現のデータが使えなくなります。
                            </li>
                            <li>
                                フォーマットを regex(...) から /.../
                                に変更しましたので、申し訳ありませんが再登録をお願いします。
                            </li>
                            <br />
                            <li>
                                突貫工事で修正したため、また新しいバグが発生する可能性があります。
                            </li>
                            <li>
                                その際はまたお題箱かレビューを投稿してくださるととても助かります。たくさんのレビューありがとうございます。
                            </li>
                            <br />
                            <li>
                                最後に、firefoxに対応して欲しい旨のレビューがいくつか寄せられていたので、今後firefoxにも対応していく予定です。
                            </li>
                            <li>少し時間がかかるかもしれませんが、お待ちいただければ幸いです。</li>
                        </ul>
                    </NoticeCard>
                    <NoticeCard title="2024/7/29">
                        <ul>
                            <li>
                                今回のアップデートで、ツイキャスの対応、各プラットフォームごとに設定を保存できるようになりました。
                            </li>
                            <li>
                                ただ、システムを大きく一新したため、申し訳ありませんがブロックリスト以外の設定がリセットされます。(ディスプレイ設定など)
                            </li>
                            <li>
                                ブロックリストについても各プラットフォームごとに登録できるようになりました。以前まで使われていたデータはすべてのプラットフォームで適応される「All」という設定に保存されています。
                            </li>
                            <li>
                                そのまま「All」に保存していても問題はありませんが、各プラットフォームごとに設定を分けたい場合はお手数ですが手動で登録していただく必要があります。
                            </li>
                            <li>
                                バグや改善点など発見しましたらお題箱かレビューを投稿していただけると大変助かります。たくさんのレビューありがとうございます。
                            </li>
                        </ul>
                    </NoticeCard>
                    <NoticeCard title="2024/1/29">
                        <ul>
                            <li>
                                ver12.0.4.1にて、音ズレが発生するバグに関してのパッチを入れました。
                            </li>
                            <li>
                                {" "}
                                しかし、まだ原因が確定できておらずパッチ適用後も音ズレが発生する可能性があります。
                            </li>
                            <li>
                                もし、こういう状況下になったら確実に音ズレが発生する、というようなことを発見しましたら、お教えいただけると大変助かります。
                            </li>
                            <li> ご迷惑をおかけし申し訳ありませんが、よろしくお願いいたします。</li>
                        </ul>
                    </NoticeCard>
                </div>
            </Main>
        </main>
    );
};

const NoticeCard = (props: NoticeCardProps) => {
    return (
        <div className="flex flex-col min-w-[800px] mx-6 mt-6 bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
            <div className="p-4 md:p-5">
                <span className="text-lg font-bold text-blue-500">{props.title}</span>
                <div className="mt-2 text-black dark:text-white">{props.children}</div>
            </div>
        </div>
    );
};

export default Notice;
