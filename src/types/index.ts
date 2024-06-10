import { SetStateAction } from "react";

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  accountId: string;
  name: string;
  bio: string;
  imagePath: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IRecentPost = {
  creator: string;
  postId: string
  caption: string;
  location?: string;
  tags?: [];
  imagePath: string
  imageUrl: string,
  likes: string[],
  createdAt: {
    nanoseconds: number,
    seconds: number
  },
  username: string,
  name: string,
  userImage: string
};

export type IPost = {
  creator?: string;
  postId?: string
  caption?: string;
  location?: string;
  tags?: [];
  imagePath?: string
  imageUrl?: string,
  likes?: string[],
  createdAt?: {
    nanoseconds: number,
    seconds: number
  },
};

export type IUpdatePost = {
  postId?: string;
  caption: string;
  imagePath: string;
  imageUrl: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl?: string;
  bio?: string;
};

export type UserData = {
  accountId: string,
  email: string,
  name: string,
  username: string,
  imageUrl?: string,
  imagePath?: string,
  bio?: string
}

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IContextType = {
  user: IUser,
  isLoading: boolean,
  setUser: React.Dispatch<React.SetStateAction<IUser>>,
  isAuthenticated: boolean,
  setIsAuthenticated: React.Dispatch<SetStateAction<boolean>>,
  checkAuthUser: () => Promise<boolean>

}