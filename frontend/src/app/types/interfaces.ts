export interface UserInterface {
  id?: number;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  channelId?: string;
  googleId?: string;
  googleToken?: string;
  refreshToken?: string;
  accessToken?: string;
}

export interface VideoInterface {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  url?: string;
  views?: number;
  likes?: number;
  duration?: number;
  userId: number;
  user?: UserInterface;
  comment?: CommentInterface;
}

export interface CommentInterface {
  id: number;
  text: string;
  userId?: number;
  user?: UserInterface;
  videoId?: number;
  video?: VideoInterface;
}
