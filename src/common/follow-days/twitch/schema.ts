export type UserID = Brand<string, "UserID">;
export type UserLogin = Brand<string, "UserLogin">;
export type ChannelID = UserID; // わかりやすいようチャンネルの方も型を作っておく
export type ChannelLogin = UserLogin; // わかりやすいようチャンネルの型も作っておく

export type FollowDaysMapItem = Map<ChannelLogin, number>; // number -> 経過日数
export type FollowDaysMap = Map<UserLogin, FollowDaysMapItem>;
export type ChannelIDMap = Map<ChannelLogin, UserID>; // ChannelIDはisModerator取得に必要
export type ModeratorMap = Map<UserLogin, ChannelLogin>;

export type QueryResponse = {
    data: any;
    extension: any;
};

export type User = {
    id: UserID;
    login: UserLogin;
    displayName: string;
    follows: UserFollows;
    isModerator: boolean;
};

export type UserFollows = {
    edges: [FollowEdge];
    pageInfo: PageInfo;
};

export type FollowEdge = {
    cursor: string;
    followedAt: string;
    node: {
        login: ChannelLogin;
    };
};

export type PageInfo = {
    hasNextPage: boolean;
};
