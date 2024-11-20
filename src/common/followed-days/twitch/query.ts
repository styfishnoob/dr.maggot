export const TwitchGqlQuery = {
    getUserByLogin: (userLogin: string): string => {
        return JSON.stringify({
            query: `
                query getUesrByLogin($userLogin: String!) {
                        user(login: $userLogin) {
                                id
                                login
                                displayName
                        }
                }
            `,
            variables: {
                userLogin: userLogin,
            },
        });
    },

    getUserById: (userId: string): string => {
        return JSON.stringify({
            query: `
                query getUserById($userId: ID!) {
                        user(id: $userId) {
                                id
                                login
                                displayName
                        }
                }
            `,
            variables: {
                userId: userId,
            },
        });
    },

    getUserByDisplayName: (userDisplayName: string): string => {
        return JSON.stringify({
            query: `
                query getUserByDisplayName($userDisplayName: String!) {
                        user(login: $userDisplayName) {
                                id
                                login
                                displayName
                        }
                }
            `,
            variables: {
                userDisplayName: userDisplayName,
            },
        });
    },

    getUserFollowsByUserLogin: (userLogin: string, after: string | null) => {
        return JSON.stringify({
            query: `
                query getUserFollows($userLogin: String!, $after: Cursor) {
                        user(login: $userLogin) {
                                follows(first: 100, after: $after) {
                                    edges {
                                            cursor
                                            followedAt
                                            node {
                                                login
                                            }
                                    }
                                    pageInfo {
                                            hasNextPage
                                    }
                                }
                        }
                }
            `,
            variables: {
                userLogin,
                after,
            },
        });
    },
};
