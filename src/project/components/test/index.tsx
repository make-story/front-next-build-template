/**
 * 테스트
 */
import React, { useState, useCallback, useEffect, useReducer, useRef, Suspense } from 'react';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

import Module from '../module/index';
import Module1 from '../module1/index';

const DynamicTest = dynamic(() => import('../common/index'), {
  //ssr: false,
  loading: () => <p>Loading...</p>,
  //suspense: true,
});

interface IProps {}

const Test = React.forwardRef<any, any>((props: IProps, ref) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [details, setDetails] = useState<boolean>(false);

  return (
    <>
      {!details ? <button onClick={() => setDetails(true)}>CLICK ME</button> : <DynamicTest />}
      <div style={{ width: '100px', height: '3000px', border: '1px solid' }}></div>
      <Module />
      <Module1 />
    </>
  );
});

export default Test;
