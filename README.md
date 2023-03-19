# Next.js 개발환경 구축 템플릿

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

---

## Node.js 설치

https://nodejs.org/dist/v14.20.1/

- Node.js v14.20.1 to /usr/local/bin/node
- npm v6.14.17 to /usr/local/bin/npm

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

---

## Next.js, React 설치

```
$ yarn add react react-dom next
```

---

## TypeScript 설치 및 환경설정

https://nextjs.org/docs/basic-features/typescript

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

```
$ yarn add --dev typescript @types/react @types/react-dom @types/node
```

tsconfig.json

```
$ touch tsconfig.json
```

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

## ESLint 설치 및 환경설정

https://nextjs.org/docs/basic-features/eslint

```
$ yarn add --dev eslint-config-next
```

또는

```
$ yarn add --dev eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-next @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint
```

.eslintrc.js

```javascript
module.exports = {
  env: {
    // 전역 변수 사용을 정의합니다. 추가하지 않으면 ESLint 규칙에 걸리게 됩니다.
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended', // 해당 플러그인의 권장 규칙을 사용합니다.
  ],
  parser: '@typescript-eslint/parser', // ESLint 파서를 지정합니다.
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // JSX를 파싱할 수 있습니다.
    },
    ecmaVersion: 12, // Modern ECMAScript를 파싱할 수 있습니다.
    sourceType: 'module', // import, export를 사용할 수 있습니다.
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // ESLint 규칙을 지정합니다. extends에서 지정된 규칙을 덮어 쓸수도 있습니다.
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect', // 현재 사용하고 있는 react 버전을 eslint-plugin-react가 자동으로 감지합니다.
    },
  },
};
```

---

# Next.js Confog 수정

https://nextjs.org/docs/api-reference/next.config.js/introduction

next.config.js

```javascript
const nextConfig = {
  /* config options here */
};

module.exports = nextConfig;
```

---

# Next.js Babel 수정

https://nextjs.org/docs/advanced-features/customizing-babel-config

babel.config.js

```javascript
module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['babel-plugin-styled-components', { fileName: true, displayName: true, pure: true, ssr: true, preprocess: false }],
    [
      'module-resolver',
      {
        root: ['.', './node_modules/apcp-common-react'],
        alias: {
          common: './node_modules/apcp-common-react',
        },
        extensions: ['.js', '.ts', '.tsx'],
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
  ],
};
```

extensions 항목에 '.js' 필수로 넣어줘야 함  
apcp-common-react 모듈이 next.config.js 내부 babel 로더에 따라, js파일로 빌드되기 때문

```
$ yarn add @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript
```

@babel/preset-env : ES5+ 를 변환할 때 사용한다.  
@babel/preset-react : React 를 변환할 때 사용한다.  
@babel/preset-typescript : Typescript 를 변환할 때 사용한다.  
@babel/runtime  
@babel/plugin-transform-runtime

> Babel 7.4.0부터 @babel/polyfill은 deprecated 되었다.  
> https://poiemaweb.com/babel-polyfill

---

# Express 설치

```
$ yarn add dotenv @types/express express
```

server.js

```javascript

```

---

# Node.js 프로세스 관리 PM2

```
$ cross-env NODE_ENV=development next build && cross-env NODE_ENV=development pm2 start server.js
```

```
$ pm2 logs
$ pm2 delete all
```

---

# Jenkins Build

```
$ npm install
$ NODE_ENV=staging npm run build
```
