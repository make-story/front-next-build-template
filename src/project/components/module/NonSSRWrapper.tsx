import React, { PropsWithChildren } from 'react';
import dynamic from 'next/dynamic';

// https://blog.bitsrc.io/using-non-ssr-friendly-components-with-next-js-916f38e8992c
// https://stackoverflow.com/questions/53139884/next-js-disable-server-side-rendering-on-some-pages
const NonSSRWrapper = ({ children }: PropsWithChildren<{}>) => <React.Fragment>{children}</React.Fragment>;
export default dynamic(() => Promise.resolve(NonSSRWrapper), {
  ssr: false,
});
