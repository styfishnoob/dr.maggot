import * as S from "./schema";
import { TwitchGqlQuery } from "./query";

export class TwitchGql {
    public followDaysMaps: S.FollowDaysMap = new Map();
    public channelIDMap: S.ChannelIDMap = new Map();
    public moderatorsMap: S.ModeratorMap = new Map();
    private endpoint = "https://gql.twitch.tv/gql";
    private clientId = "kd1unb4b3q4t58fwlpcbzcbnm76a8fp";

    private async query<T>(query: string): Promise<Record<string, T>> {
        const response = await fetch(this.endpoint, {
            method: "POST",
            headers: {
                "Client-ID": this.clientId,
                "Content-Type": "application/json",
            },
            body: query,
        });

        if (!response.ok) dcon.error(`[Twitci-Gql]: HTTP Error ${query}`);

        const queryResponse: S.QueryResponse = await response.json();
        if (queryResponse.data) return queryResponse.data as Record<string, T>;

        dcon.error(queryResponse);
        throw new Error("[Twitch-Gql]: request failure");
    }

    // login -> 一般的なID
    async getUserByLogin(userLogin: string): Promise<S.User> {
        const query = TwitchGqlQuery.getUserByLogin(userLogin);
        const response = await this.query<S.User>(query);
        if (response?.user) return response.user;
        throw new Error(`[Twitch-Gql]: Error`);
    }

    // id -> アカウント時設定するIDではなく、ランダムな数値
    async getUserById(userId: string) {
        const query = TwitchGqlQuery.getUserById(userId);
        const response = await this.query<S.User>(query);
        if (response?.user) return response.user;
        throw new Error(`[Twitch-Gql]: Error`);
    }

    // DisplayName -> 設定した表示名
    async getUserByDisplayName(userDisplayName: string) {
        const query = TwitchGqlQuery.getUserByDisplayName(userDisplayName);
        const response = await this.query<S.User>(query);
        if (response?.user) return response.user;
        throw new Error(`[Twitch-Gql]: Error`);
    }

    async getUserFollowsByUserLogin(userLogin: S.UserLogin, channelLogin: S.ChannelLogin) {
        let followDaysMapItem: S.FollowDaysMapItem = new Map();
        let hasNextPage = true;
        let afterCursor: string | null = null;

        // ChannelIDが未取得なら取得する
        if (!this.channelIDMap.has(channelLogin)) {
            const response = await this.getUserByLogin(channelLogin);
            this.channelIDMap.set(channelLogin, response.id);
        }

        while (hasNextPage) {
            const channelID = this.channelIDMap.get(channelLogin)!;
            const query = TwitchGqlQuery.getUserFollowsByUserLogin(userLogin, channelID, afterCursor);
            const response = await this.query<S.User>(query);
            const follows: S.UserFollows = response.user.follows;

            if (response.user.isModerator) {
                this.moderatorsMap.set(userLogin, channelLogin);
            }

            for (const edge of follows.edges) {
                const login = edge.node.login;
                const followedAt = new Date(edge.followedAt).getTime();
                const today = new Date().getTime();
                const elapsedTime = Math.floor((today - followedAt) / (1000 * 3600 * 24));

                followDaysMapItem.set(login, elapsedTime);
            }

            const pageInfo: S.PageInfo = response.user.follows.pageInfo;
            hasNextPage = pageInfo.hasNextPage;

            if (hasNextPage) {
                afterCursor = follows.edges[follows.edges.length - 1].cursor;
            }
        }

        this.followDaysMaps.set(userLogin, followDaysMapItem);
    }

    hasFollowDays(userLogin: S.UserLogin, channelLogin: S.ChannelLogin, requiredDays: number): boolean {
        const followDaysMap = this.followDaysMaps.get(userLogin);
        const item = followDaysMap?.get(channelLogin);
        if (!followDaysMap || item == null) return false;
        return item >= requiredDays;
    }
}
