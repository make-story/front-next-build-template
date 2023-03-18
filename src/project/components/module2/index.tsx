import * as React from 'react';
import { render } from 'react-dom';
//import { Facebook, Instagram } from 'react-content-loader';
import LocationObserver from './intersectionObserver';
//import AsyncComponent from './asyncComponent';
import DynamicModule from './dynamicModule';

//import './styles.css';

// Intersection Observer & Dynamic Module Loading
// https://codesandbox.io/s/2wp1zoj09j?file=/src/index.tsx:0-1545
function App() {
  return (
    <div className='App'>
      <DynamicModule placeholder={<></>} component={() => import('./asyncComponent')} />
      <DynamicModule placeholder={<></>} component={() => import('./asyncComponent')} />
      <LocationObserver onIntersection={() => console.log('intersection 1')}>
        <DynamicModule placeholder={<></>} component={() => import('./asyncComponent')} />
      </LocationObserver>
      <LocationObserver onIntersection={() => console.log('intersection 2')}>
        <DynamicModule placeholder={<></>} component={() => import('./asyncComponent')} />
      </LocationObserver>
      <LocationObserver onIntersection={() => console.log('intersection 3')}>
        <DynamicModule placeholder={<></>} component={() => import('./asyncComponent')} />
      </LocationObserver>
    </div>
  );
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);
