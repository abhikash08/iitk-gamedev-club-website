const BASE_URL = import.meta.env.BASE_URL;

export const getImagePath = (path = '') => {
  if (!path) return '';
  // If path starts with /, remove it and prepend BASE_URL
  if (path.startsWith('/')) {
    return `${BASE_URL}${path.slice(1)}`;
  }
  // If path is already relative, prepend BASE_URL
  return `${BASE_URL}${path}`;
};

export const getAssetPath = (path = '') => {
  // Generic asset path resolver for any static asset
  return getImagePath(path);
};

// For production builds, vite will optimize relative paths automatically
// Just make sure to use BASE_URL for any absolute paths starting with /
export const useBaseUrl = () => BASE_URL;
