export type QueryResponse = {
    data: any;
    extension: any;
};

export type User = {
    id: string;
    login: string;
    displayName: string;
};

export type FollowEdge = {
    cursor: string;
    followedAt: string;
    node: {
        login: string;
    };
};

export type PageInfo = {
    hasNextPage: boolean;
};

export type UserFollows = {
    edges: [FollowEdge];
    pageInfo: PageInfo;
};
