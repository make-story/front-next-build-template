const express = require('express');
const next = require('next');
const helmet = require('helmet');
const fs = require('fs');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const moment = require('moment-timezone');
const http = require('http');
const https = require('https');

const cors = require('cors');
const AWSXRay = require('aws-xray-sdk');
const UAParser = require('ua-parser-js');

const { createServer } = require('http');
const { parse } = require('url');

// env 설정
const envPath = path.join(__dirname, `.envs/.env.${process.env.NODE_ENV}`);
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  //process.exit();
}
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// node 예외처리
process.on('uncaughtException', error => {
  console.log('uncaughtException ', error);
});

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Next.js를 Express와 연결 - 같은 포트에서 실행
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  // express
  const server = express();

  server.use(cors(corsOptions)); // cors
  server.use(express.json()); // json request body 파싱
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser()); // process.env.COOKIE_SECRET
  server.use(express.static(path.join(__dirname, 'public'))); // public 정적 경로
  /*server.use('/', function (req, res, next) { // HTTP 호출 미들웨어 기능적 요소 주입 
    return next();
  });*/

  server.get('/', function (req, res, next) {
    //console.log('originalUrl', req.originalUrl);
    //console.log('path', req.path);
    //console.log('params', req.params);

    const { page } = req.params || {};
    const { host = '' } = req.headers || {};

    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    console.log('node > redirect!!');
    return res.redirect('/test');
  });

  // 더미데이터
  server.get('/dummy/*', (req, res) => {
    const { params } = req;
    const filename = params[0] || '';
    if (fs.existsSync(path.join(__dirname, `./dummy/${filename}.json`))) {
      fs.readFile(path.join(__dirname, `./dummy/${filename}.json`), (error, data) => {
        return res.json(data);
      });
    } else {
      return res.json({ error: filename });
    }
  });

  /*server.get('/', function (req, res, next) {
        return res.redirect('/main');
  });*/
  server.get('*', (req, res) => {
    return handle(req, res);
  });
  server.post('*', (req, res) => {
    return handle(req, res);
  });

  // http
  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
  /*createServer(server).listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });*/
  /*createServer(async (req, res) => {
        try {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true);
        const { pathname, query } = parsedUrl;

        if (pathname === '/a') {
            await app.render(req, res, '/a', query);
        } else if (pathname === '/b') {
            await app.render(req, res, '/b', query);
        } else {
            await handle(req, res, parsedUrl);
        }
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    }).listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
    })*/
});
