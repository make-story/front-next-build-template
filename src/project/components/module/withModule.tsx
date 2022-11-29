import React, { ComponentProps, ComponentType, useCallback, useEffect, useState } from 'react';

export default function withModule<P extends {}>(WrappedComponent: ComponentType<P>) {
  return (props: ComponentProps<typeof WrappedComponent>) => {
    useEffect(() => {
      console.log('render!');
    }, []);
    return <WrappedComponent {...props} />;
  };
}
