import React from 'react';

// https://github.com/emibcn/covid/blob/master/app/src/asyncComponent.jsx
// From https://gist.github.com/aadii104/0ed32d46b70ed2f4037dbbbbc1477edc
const asyncComponent = (importComponent: any, module = 'default') =>
  function AsyncComponent(props: any) {
    // Will save the component into a state
    const [C, setComponent] = React.useState<any>(false);

    // Call module import (async), wait for
    // results and set component state
    //
    // useEffect' Callback must not be async, so create an internal
    // anonymous and async function and call it immediatelly
    React.useEffect(() => {
      (async () => {
        const imported = await importComponent();
        const component = imported[module];

        setComponent({ component });
        // No return, no unsubscribe
      })();
      // Only call it once
    }, []);

    // Returns the needed component markup
    // Can be a single child component or null or false
    return C ? <C {...props} /> : <>Loading</>;
  };

const asyncModuleComponent = (importModule: any, modules: any, Wrapped: any) =>
  function AsyncModuleComponent(props: any) {
    // Will save components into a state
    const [components, setComponents] = React.useState<any>(false);

    // Call module import (async), wait for
    // results and set components state
    //
    // useEffect' Callback must not be async, so create an internal
    // anonymous and async function and call it immediatelly
    React.useEffect(() => {
      (async () => {
        // Import all components
        const comps = await importModule();
        // Create a new object only with the modules
        // defined in HOC argument `modules`
        const filtered = Object.fromEntries(Object.entries(comps).filter(([module]) => modules.includes(module)));
        setComponents(filtered);
        // No return, no unsubscribe
      })();
      // Only call it once
    }, []);

    // Once loaded, pass components to wrapped as a prop
    return !components ? <>Loading</> : <Wrapped {...props} {...{ components }} />;
  };

export default asyncComponent;
export { asyncModuleComponent };
