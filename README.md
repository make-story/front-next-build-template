# 프론트 빌드 템플릿 : Next.js 개발환경
Node.js(웹서버)  
Express(미들웨어)  
Next.js(React 프레임워크)  
React(UI 라이브러리), Redux, Redux-Saga  
TypeScript(정적 타입, 컴파일언어)  
ESLint / Prettier  
PM2(노드 프로세스 관리, 클러스터링)  

- AWS 환경  
- Node.js 버전: 14.20.1
  https://nodejs.org/download/release/latest-v14.x/  
  https://github.com/nodejs/release#release-schedule    
- Next.js 버전: 10.0.7  
- React 버전: 16.13.1  
- Redux 버전: 4.0.5  
- React-Redux 버전: 7.2.0  
- Redux-Saga 버전: 1.1.3  
- Typescript 버전: 4.1.3  
- ESLint 버전: 7.16.0  
- Prettier 버전: 2.2.1  

`파일 의존성 동기화 중요!`  
- yarn.lock 파일 중요  
- package.json 의존성 파일 각각 설치 필요할 수 있음
- npm-list.txt 파일 참고

-----

## .env
https://nextjs.org/docs/basic-features/environment-variables#environment-variable-load-order  
참고 : /src 폴더를 사용하는 경우 Next.js 는 폴더가 아닌 상위 폴더에서만 .env 파일을 로드 합니다.  
  
### NODE_ENV=production
.env.production.local   
.env.local  
.env.production  
.env  

### NODE_ENV=development
.env.development.local  
.env.local  
.env.development  
.env  

### NODE_ENV=test
.env.test.local  
.env.test  
.env  

## 브라우저에 환경 변수 노출
https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser  
브라우저에 변수를 노출하려면 변수에 접두사를 붙여야 합니다. `NEXT_PUBLIC_`  

예: 
process.env.NEXT_PUBLIC_ANALYTICS_ID

-----

# typescript
> tsc 명령 전역 실행
```
$ yarn global add typescript@4.1.3
$ tsc
```
> tsc 명령 지역 실행
```
$ yarn global typescript@4.1.3
$ ./node_modules/.bin/tsc
```

# babel
```
yarn add @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript
```
@babel/preset-env : ES5+ 를 변환할 때 사용한다.  
@babel/preset-react : React 를 변환할 때 사용한다.  
@babel/preset-typescript : Typescript 를 변환할 때 사용한다.  
@babel/runtime  
@babel/plugin-transform-runtime   

> Babel 7.4.0부터 @babel/polyfill은 deprecated 되었다.  
https://poiemaweb.com/babel-polyfill  


## .babelrc
```
{
  "presets": [
    "next/babel"
  ],
  "plugins": [
    ["babel-plugin-styled-components", { "fileName": true, "displayName": true, "pure": true , "ssr": true, "preprocess": false }],
    ["module-resolver", {
      "root": [".", "./node_modules/apcp-common-react"],
      "alias": {
        "common": "./node_modules/apcp-common-react"
      },
      "extensions": [".js", ".ts", ".tsx"]
    }],
    ["@babel/plugin-transform-runtime", {
        "regenerator": true
    }]
  ]
}
```
extensions 항목에 '.js' 필수로 넣어줘야 함  
apcp-common-react 모듈이 next.config.js 내부 babel 로더에 따라, js파일로 빌드되기 때문   


# 로컬 pm2 테스트
```
$ cross-env NODE_ENV=development next build && cross-env NODE_ENV=development pm2 start server.js
```
```
$ pm2 logs
$ pm2 delete all
```


# jenkins build
```
$ npm install
$ NODE_ENV=staging npm run build
```

