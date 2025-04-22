const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
const { createRequestHandler } = require('@remix-run/express');
const ip = require('ip');

const BUILD_DIR = path.join(__dirname, 'build');

const app = express();

app.use(cors({ maxAge: 86400 }));
app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use(
    '/build',
    express.static(path.resolve(__dirname, 'public/build'), {
        immutable: true,
        maxAge: '1y',
    }),
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static(path.resolve(__dirname, 'public'), { maxAge: '1h' }));

app.use(morgan('tiny'));

app.all(
    '*',
    process.env.NODE_ENV === 'development'
        ? (req, res, next) => {
              purgeRequireCache();

              return createRequestHandler({
                  build: require(BUILD_DIR),
                  mode: process.env.NODE_ENV,
              })(req, res, next);
          }
        : createRequestHandler({
              build: require(BUILD_DIR),
              mode: process.env.NODE_ENV,
          }),
);
const port = process.env.PORT || 7733;

app.listen(port, () => {
    console.log(`服务已在 ${port} 端口启动

  本地访问: http://localhost:${port}
  外部访问: http://${ip.address()}:${port}
  `);
});

function purgeRequireCache() {
    // purge require cache on requests for "server side HMR" this won't let
    // you have in-memory objects between requests in development,
    // alternatively you can set up nodemon/pm2-dev to restart the server on
    // file changes, but then you'll have to reconnect to databases/etc on each
    // change. We prefer the DX of this, so we've included it for you by default
    for (const key in require.cache) {
        if (key.startsWith(BUILD_DIR)) {
            delete require.cache[key];
        }
    }
}
