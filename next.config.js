const path = require('path');
const dotenv = require('dotenv');

const isDev = process.env.NODE_ENV === 'development';
//dotenv.config({ path: path.join(__dirname, `.envs/.env.${process.env.NODE_ENV}`), silent: true });

module.exports = {
  //basePath: '/',
  // 웹팩설정
  webpack: (config, { isServer }) => {
    //config.devtool = 'hidden-source-map'; // 'eval'
    config.resolve.alias = {
      ...config.resolve.alias,
      // https://velog.io/@bigbrothershin/Next.js-Webpack-%EC%84%A4%EC%A0%95%EB%93%A4
      //'next/head': 'next/dist/next-server/lib/head.js',
      //'next/router': 'next/dist/client/router.js',
      //'next/config': 'next/dist/next-server/lib/runtime-config.js',
      //'next/dynamic': 'next/dist/next-server/lib/dynamic.js',
      //next: path.resolve(__dirname, './node_modules/next'),

      // 내부(저장소) NPM 의존성 대응: 프로젝트 개발파일 중, node_modules(내부 저장소 NPM) 의존성이 있고, alias 사용중이라면, 해당항목 필수추가 되어야함!
      'src/common': path.resolve(__dirname, './node_modules/common-react'),
      common: path.resolve(__dirname, './node_modules/common-react'),
      utils: path.resolve(__dirname, './node_modules/common-react/utils'),
    };
    config.module.rules.push({
      test: /\.(jpe?g|png|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            exclude: /node_modules/,
            publicPath: process.env.NEXT_PUBLIC_S3_URL
              ? process.env.NEXT_PUBLIC_S3_URL + '/public/static/images/'
              : '/kr/ko/_next/static/images/',
            outputPath: 'static/images/',
            name: '[name].[ext]?ver=[hash]',
            // name: '[name]-[hash].[ext]',
          },
        },
      ],
    });
    config.module.rules.push({
      test: /\.(svg)$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: {
                removeViewBox: false,
              },
            },
          },
        },
        // 'url-loader',
      ],
    });
    // 내부(저장소) NPM 의존성 대응
    config.module.rules.push({
      test: /\.(ts|tsx)?$/,
      include: path.resolve(__dirname, './node_modules/common-react'), // react, typescript 기반 코드로된 모듈
      use: [
        {
          loader: 'babel-loader', // ts-loader 사용할 경우, npm run dev 에러
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
            plugins: [
              [
                // 'ReferenceError: regeneratorRuntime is not defined' 에러 해결
                // @babel/runtime, @babel/plugin-transform-runtime 사용 - @babel/polyfill 은 사용중지됨.
                '@babel/plugin-transform-runtime',
                {
                  regenerator: true,
                },
              ],
            ],
          },
        },
      ],
    });
    if (!isServer) {
      config.node = {
        fs: 'empty',
        'fs-extra': 'empty',
      };
    }
    return config;
  },
  // 리다이렉트
  // https://nextjs.org/docs/api-reference/next.config.js/redirects
  /*async redirects() {
    return [
      {
        source: '/main',
        destination: '/display/main',
        permanent: true,
      },
    ];
  },*/
  //
  experimental: {
    // 스크롤 복원
    scrollRestoration: true,
  },
};
