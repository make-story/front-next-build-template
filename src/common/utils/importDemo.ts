import { lazy } from 'react';

export const importDemo = (file: string = '') =>
  lazy(() => import(`./demo/${file}`).catch(() => console.log('Error in importing')));
