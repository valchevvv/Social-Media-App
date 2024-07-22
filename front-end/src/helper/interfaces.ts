export interface Comment {
    _id: string,
    author: {
        _id: string,
        username: string,
        profilePicture: string
    }
    post?: string,
    content: string,
    createdAt: string,
    __v: number
}

export interface Like {
    _id: string;
    username: string;
    profilePicture: string;
}

export interface Post {
    _id: string;
    author: {
        _id: string;
        username: string;
        profilePicture: string;
    },
    content: string;
    image: string;
    likes: string[];
    comments: Comment[];
    createdAt: string;
}