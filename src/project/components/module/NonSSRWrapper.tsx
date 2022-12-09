import React, { PropsWithChildren } from 'react';
import dynamic from 'next/dynamic';

/*
export interface DynamicModulePropsInterface {
  placeholder: any;
  children?: (() => React.ReactNode | React.ReactNode[]) | React.ReactNode | React.ReactNode[];
  component: () => any;
  fallback: ReactElement<any>;
  [prop: string]: any;
  style?: any;
}
export interface DynamicModuleStateInterface {
  initializing: boolean;
  Component: React.LazyExoticComponent<any>;
}
*/

/**
 * NonSSRWrapper
 */
// https://blog.bitsrc.io/using-non-ssr-friendly-components-with-next-js-916f38e8992c
// https://stackoverflow.com/questions/53139884/next-js-disable-server-side-rendering-on-some-pages
// <NonSSRWrapper>TEST</NonSSRWrapper>
const Module = ({ children }: PropsWithChildren<{}>) => <React.Fragment>{children}</React.Fragment>;
export default dynamic(() => Promise.resolve(Module), {
  ssr: false,
});
