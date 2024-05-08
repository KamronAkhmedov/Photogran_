import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function timeAgo(timestamp: number): string {
  const nowInSeconds = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const seconds = nowInSeconds - timestamp;

  if (seconds < 60) {
    return 'just now';
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else {
    const days = Math.floor(seconds / 86400);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
}

export const checkIsLiked = (likeList: string[] | undefined, userId: string) => {
  return likeList?.includes(userId)
}
