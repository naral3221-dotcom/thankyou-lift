import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get basePath for static assets
export function getBasePath(): string {
  return process.env.NODE_ENV === "production" ? "/thankyou/lift" : "";
}

// Prepend basePath to image paths
export function assetPath(path: string): string {
  const base = getBasePath();
  if (path.startsWith("/")) {
    return `${base}${path}`;
  }
  return `${base}/${path}`;
}
