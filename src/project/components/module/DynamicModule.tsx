import React, { PropsWithChildren, ReactElement, useState, useEffect, Component, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';

// https://blog.bitsrc.io/using-non-ssr-friendly-components-with-next-js-916f38e8992c
// https://stackoverflow.com/questions/53139884/next-js-disable-server-side-rendering-on-some-pages
// <DynamicModule>TEST</DynamicModule>
const Module = ({ children }: PropsWithChildren<{}>) => <React.Fragment>{children}</React.Fragment>;
export const DynamicModule = dynamic(() => Promise.resolve(Module), {
  ssr: false,
});

export default DynamicModule;
