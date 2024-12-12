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

    getUserFollowsByUserLogin: (userLogin: string, channelID: string, after: string | null) => {
        return JSON.stringify({
            query: `
                query getUserFollowsByUserLogin($userLogin: String!, $channelID: String!, $after: Cursor) {
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
                                isModerator(channelID: $channelID)
                        }
                }
            `,
            variables: {
                userLogin,
                channelID,
                after,
            },
        });
    },
};
