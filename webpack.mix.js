 
// // let mix = require('laravel-mix');

// // mix.js('resources/js/app.js', 'public/js/app.js').sass('resources/scss.app.scss','public/css/app.css');
// // //setPublicPath('dist');

// let mix = require('laravel-mix');

// mix.js('resources/js/app.js', 'public/js/app.js').sass('resources/scss/app.scss', 'public/css/app.css');
//   // .setPublicPath('public');
const mix = require('laravel-mix');

mix.webpackConfig({
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      querystring: require.resolve('querystring-es3'),
      timers: require.resolve('timers-browserify'),
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      "vm": require.resolve("vm-browserify"),
      fs: false  // Set fs to false since it's a Node.js module and not required for the browser
    }
  }
});

mix.setPublicPath('public');

// Your usual mix configuration
mix.js('resources/js/app.js', 'public/js/app.js')
  .sass('resources/scss/app.scss', 'public/css/app.css') ;;
