import * as moment from 'moment-timezone';

export const generateCustomString = (length: number): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
};

export const generateTimestamp = () => {
  const now = new Date();
  const timestamp = now.getTime().toString(36);
  return timestamp;
};

export const generateId = () => {
  const uuid = generateCustomString(15);
  const timestamp = generateTimestamp();
  const uuidWithTimestamp = uuid + timestamp;
  return uuidWithTimestamp.substring(0, 26);
};