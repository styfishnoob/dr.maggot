import Dashboard from "../components/Dashboard/Dashboard";
import Main from "../components/Main/Main";
import Navigation from "../components/Navigation/Navigation";

type Props = {
    date: string;
    title: string;
    changes: string[];
    descriptions: string[];
};

const noticeCards: Props[] = [
    {
        date: "2024/12/10",
        title: "以下の修正と新しい機能の追加を行いました。",
        changes: [
            "サブスク限定をオンにしていると関係のない要素まで非表示にしてしまう不具合",
            "フォロー日数制限機能の修正",
            "弾幕の表示上限数を設定できる機能を追加",
            "弾幕の色付けや表示位置の固定といった装飾機能の追加",
        ],
        descriptions: [
            "フォロー日数制限機能ですが、コメントの投稿者が配信者かモデレーターの場合は削除されないように修正しました。",
            "これにより、例えばNightbotは削除されないようになります。",
            "また、遊び機能として弾幕のカラーリングや真ん中に固定表示するといった装飾機能を追加しました。",
            "基本必要ない機能だと思うのでデフォルトでオフになっていますが、仲間内で遊びたい時などに使ってみてください。",
            "装飾の指定にはコマンドを書いていただく必要がありますので、装飾したい際はコマンドリストを見ながら試してみてください。",
        ],
    },
    {
        date: "2024/11/20",
        title: "以下の修正・変更を行いました。",
        changes: [
            "Twitchにて、エモートが弾幕で表示されない不具合",
            "弾幕機能の改善",
            "フォロー日数制限機能の追加(Twitch限定)",
        ],
        descriptions: [
            "要望の声をいくつかいただいた、フォロー日数制限機能を実装しました。この機能は現在Twitchのみに対応しています。",
            "他プラットフォームでも使えるようにしていく予定ですが、技術的に不可能な場合もあるので全てのプラットフォームで対応することは難しいかもしれません。",
            "また弾幕機能の改善についてですが、コメント衝突判定の処理を修正し、できる限りコメントが重ならないようになりました。",
        ],
    },
    {
        date: "2024/11/01",
        title: "以下の修正・変更を行いました。",
        changes: [
            "Youtubeにて、ブロックボタンを押した際ポップアップが表示され、押すことができない不具合を修正",
            "Kickにてブロックボタンが返信ボタンと重なっていた問題を修正",
            "ポップアップにブロックワード・ブロックエモートを追加できる項目を追加",
        ],
        descriptions: [],
    },
    {
        date: "2024/10/30",
        title: "以下の修正を行いました。",
        changes: ["Twitchにてエモート制限が動作しない不具合"],
        descriptions: [
            "最近Twitchで頻繁にサイトの変更が行われています。",
            "できる限り早く対応いたしますが、ご不便をおかけする場合がございます。ご容赦ください。",
        ],
    },
    {
        date: "2024/10/13",
        title: "以下の修正・更新を行いました。",
        changes: ["Twitchのボーナスが自動でクリックされない不具合", "Kickへの対応"],
        descriptions: [
            "新しく対応したKickにて、設定不足で不具合が発生する可能性があります。発見した場合は報告していただけると大変助かります。",
            "いつもたくさんのレビュー・報告をしてくださり、毎度助かっております。ありがとうございます。",
        ],
    },
    {
        date: "2024/09/16",
        title: "以下の修正を行いました。",
        changes: [
            "ブロックボタンが表示されない不具合",
            "その他CSSがうまく反映されない不具合",
            "メモリリークの原因と思われる処理の修正",
        ],
        descriptions: [
            "メモリリークの原因と思しき箇所があったので、修正を加えました。",
            "私の環境ではメモリリークが改善した傾向が見られましたが、もしメモリリークが発生した際は報告してくださると大変助かります。",
        ],
    },
    {
        date: "2024/08/06",
        title: "以下の修正を行いました。",
        changes: ["正規表現周りの修正", "メモリリークの原因と思われる処理の修正"],
        descriptions: [
            "ブロックワードなどが動作しない原因が正規表現の処理にあったため修正しました。",
            "おそらく正常に動作すると思いますが、もしまた動かないバグがありましたら申し訳ありませんが報告をお願いいたします。",
            "また正常に動作した場合も報告してくださると大変助かります。",
        ],
    },
    {
        date: "2024/07/31",
        title: "以下の修正を行いました。",
        changes: [
            "Youtubeで弾幕のCSSが適用されない不具合",
            "正規表現が適用されない不具合",
            "Twitchアーカイブの対応",
            "エモートが含まれているとき、文字数制限が効かない不具合",
        ],
        descriptions: [
            "正規表現の不具合を修正するにあたり、仕様を変更しました。そのため、以前から登録してある正規表現のデータが使えなくなります。",
            "フォーマットをregex(...)から/.../に変更しましたので、申し訳ありませんが、再登録をお願いします。",
            "突貫工事で修正したため、また新しいバグが発生する可能性があります。",
            "その際はまた申し訳ありませんが報告してくださると大変助かります。",
        ],
    },
    {
        date: "2024/07/29",
        title: "以下の修正・変更を行いました。",
        changes: ["ツイキャスに対応", "各プラットフォームごとに設定を保存できるように"],
        descriptions: [
            "システムを一新したため、申し訳ありませんがブロックリスト以外の設定がリセットされます(ディスプレイ設定など)",
            "ブロックリストについても各プラットフォームごとに登録できるようになりました。以前まで使われていたデータはすべてのプラットフォームで適用される「All」という設定に保存されています。",
            "そのまま「All」に保存していても問題はありませんが、各プラットフォームごとに設定を分けたい場合はお手数ですが手動で再設定していただく必要があります。",
            "バグや改善点など発見されましたら報告してくださると大変助かります。たくさんのレビューありがとうございます。",
        ],
    },
    {
        date: "2024/01/29",
        title: "以下の修正を行いました。",
        changes: ["音ズレが発生するバグの修正"],
        descriptions: [
            "音ズレが発生するバグを修正しました。",
            "しかし、まだ原因が確定できておらず、このアップデート後も音ズレが発生する可能性があります。",
            "もし、こういった状況下になったら確実に音ズレが発生する、というようなことを発見しましたら、報告していただけると大変助かります。",
            "ご迷惑をおかけして申し訳ありませんが、よろしくお願いいたします。",
        ],
    },
];

const NoticeCard = (props: Props) => {
    return (
        <div className="flex flex-col mb-5 bg-white border rounded-md dark:bg-neutral-900 dark:border-neutral-700">
            <div className="rounded-t-md px-5 py-3 border-b text-lg font-bold text-blue-500 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800">
                <span>{props.date}</span>
            </div>
            <div className="flex flex-col p-5">
                <div className="mb-3">
                    <span>{props.title}</span>
                </div>
                <ul className="rounded-md border p-2 bg-slate-100 dark:border-neutral-600 dark:bg-zinc-900">
                    {props.changes.map((change, index) => (
                        <li key={index}>
                            <span className="text-green-500">&gt;　</span>
                            {change}
                        </li>
                    ))}
                </ul>
                {props.descriptions.length > 0 && (
                    <div className="mt-3">
                        {props.descriptions.map((desc, index) => (
                            <div key={index}>{desc}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const Notice = () => {
    return (
        <Main>
            <Navigation />
            <Dashboard title={browser.i18n.getMessage("navigation_notice")}>
                {noticeCards.map((card, index) => (
                    <NoticeCard
                        key={index}
                        date={card.date}
                        title={card.title}
                        changes={card.changes}
                        descriptions={card.descriptions}
                    />
                ))}
            </Dashboard>
        </Main>
    );
};

export default Notice;
