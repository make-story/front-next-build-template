# Next.js 개발환경
`파일 의존성 동기화 중요!`  
- yarn.lock 파일 중요  
- package.json 의존성 파일 각각 설치 필요할 수 있음
- npm-list.txt 파일 참고


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