export interface User {
  id?: number;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  channelId?: string;
  googleId?: string;
  googleToken?: string;
  refreshToken?: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  url?: string;
  views?: number;
  likes?: number;
  duration?: number;
  userId: number;
  user?: User;
  comment?: Comment;
}

export interface Comment {
  id: number;
  text: string;
  userId?: number;
  user?: User;
  videoId?: number;
  video?: Video;
}
