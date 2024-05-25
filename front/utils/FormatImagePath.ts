const BASE_URL = 'http://10.0.2.2:3001';

export const formatImagePath = (path: string) => {
  return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
};
