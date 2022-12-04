import React, { ReactElement, useState, useEffect, Component, lazy, Suspense } from 'react';

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

const DynamicModule = ({ component }: any) => {
  const [] = useState();
};

export default DynamicModule;
