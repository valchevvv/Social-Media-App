export interface Comment {
  _id: string;
  author: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  post: string;
  content: string;
  createdAt: string;
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
  };
  content: string;
  image: string;
  likes: string[];
  commentsCount: number;
  likesCount: number;
  createdAt: string;
}
