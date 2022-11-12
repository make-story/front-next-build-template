/**
 * 테스트
 */
 import React, { useState, useCallback, useEffect, useReducer, useRef, Suspense } from 'react';
 import { ReactNode } from 'react';
 import Router, { useRouter } from 'next/router';
 import { useDispatch, useSelector } from 'react-redux';
 import dynamic from 'next/dynamic';

const DynamicTest = dynamic(() => import('../event/index'), {
  //ssr: false,
  loading: () => <p>Loading...</p>,
  //suspense: true,
});

interface IProps {}

const Test = React.forwardRef<any, any>((props: IProps, ref) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [details, setDetails] = useState<boolean>(false);

  return <>{!details ? <button onClick={() => setDetails(true)}>CLICK ME</button> : <DynamicTest />}</>;
});

export default Test;
