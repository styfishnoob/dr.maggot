import * as TwitchGqlSchema from "./type";
import { TwitchGqlQuery } from "./query";

export class TwitchGql {
    public followDaysMaps: Map<string, Map<string, number>> = new Map([]);
    private endpoint = "https://gql.twitch.tv/gql";
    private clientId = "kd1unb4b3q4t58fwlpcbzcbnm76a8fp";

    private async query(query: string): Promise<any> {
        const response = await fetch(this.endpoint, {
            method: "POST",
            headers: {
                "Client-ID": this.clientId,
                "Content-Type": "application/json",
            },
            body: query,
        });

        if (!response.ok) dcon.error(`[Twitci-Gql]: HTTP Error ${query}`);

        const queryResponse: TwitchGqlSchema.QueryResponse = await response.json();
        if (queryResponse.data) return queryResponse.data;

        throw new Error("[Twitch-Gql]: request failure");
    }

    async getUserByLogin(userLogin: string): Promise<TwitchGqlSchema.User> {
        const query = TwitchGqlQuery.getUserByLogin(userLogin);
        const response = await this.query(query);
        if (response?.user) return response.user as TwitchGqlSchema.User;
        throw new Error(`[Twitch-Gql]: Error`);
    }

    async getUserById(userId: string) {
        const query = TwitchGqlQuery.getUserById(userId);
        const response = await this.query(query);
        if (response?.user) return response.user as TwitchGqlSchema.User;
        throw new Error(`[Twitch-Gql]: Error`);
    }

    async getUserByDisplayName(userDisplayName: string) {
        const query = TwitchGqlQuery.getUserByDisplayName(userDisplayName);
        const response = await this.query(query);
        if (response?.user) return response.user as TwitchGqlSchema.User;
        throw new Error(`[Twitch-Gql]: Error`);
    }

    async getUserFollowsByUserLogin(userLogin: string): Promise<Map<string, number>> {
        let followDaysMap: Map<string, number> = new Map([]);
        let hasNextPage = true;

        while (hasNextPage) {
            const query = TwitchGqlQuery.getUserFollowsByUserLogin(userLogin);
            const response = await this.query(query);
            const follows: TwitchGqlSchema.UserFollows = response.user.follows;

            for (const edge of follows.edges) {
                const login = edge.node.login;
                const followedAt = new Date(edge.followedAt).getTime();
                const today = new Date().getTime();
                const elapsed = Math.floor((today - followedAt) / (1000 * 3600 * 24));
                followDaysMap.set(login, elapsed);
            }

            const { hasNextPage: nextPage } = response.user.follows.pageInfo;
            hasNextPage = nextPage;
        }

        return followDaysMap;
    }

    hasFollowDays(userLogin: string, channelLogin: string, requiredDays: number): boolean {
        const followDaysMap = this.followDaysMaps.get(userLogin);
        const followDays = followDaysMap?.get(channelLogin);
        if (!followDaysMap || followDays == null) return false;
        return followDays >= requiredDays;
    }
}
