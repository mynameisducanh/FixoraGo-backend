import { join } from 'path';

// __dirname : root/dist/config/ + ../../../   come root/uploads
export const rootPublicPath = join(__dirname, '../../../', 'uploads/');
