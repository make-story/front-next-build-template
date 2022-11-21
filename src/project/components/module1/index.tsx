import React from 'react';
import dynamic from 'next/dynamic';
import DyanamicSection from './DyanamicSection';

const TestComponent = dynamic(() => import('./TestComponent'));

// https://minify.tistory.com/46
const Index = () => {
  return (
    <>
      <DyanamicSection>
        <TestComponent />
      </DyanamicSection>
    </>
  );
};

export default Index;
