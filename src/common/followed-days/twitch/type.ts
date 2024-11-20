export type QueryResponse = {
    data: any;
    extension: any;
};

export type User = {
    id: string;
    login: string;
    displayName: string;
};

type FollowEdge = {
    followedAt: string;
    node: {
        login: string;
    };
};

type PageInfo = {
    hasNextPage: boolean;
};

export type UserFollows = {
    edges: [FollowEdge];
    pageInfo: PageInfo;
};
