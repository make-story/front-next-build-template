import React from 'react';
import dynamic from 'next/dynamic';

// https://blog.logrocket.com/dynamic-imports-code-splitting-next-js/
export default function Home() {
  const TestComponent = dynamic(() => import('./TestComponent'));
  const SayWelcome = dynamic(() => import('./TestComponent').then(response => response.SayWelcome));
  return (
    <div>
      <TestComponent />
      <SayWelcome />
    </div>
  );
}
