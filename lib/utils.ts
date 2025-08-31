import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function downloadFile(url: string, filename: string) {
  // Since no auth is needed, we can download directly or use proxy for CORS
  const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(url)}`;
  
  const link = document.createElement('a');
  link.href = proxyUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
