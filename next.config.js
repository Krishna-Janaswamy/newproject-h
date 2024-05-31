// const { i18n } = require("./next-i18next.config");
// module.exports = {
//   // i18n,
//    output: 'export',
//   // distDir: 'dist',
//   // pageExtensions: ['page.js'],
//   trailingSlash: true,
//   reactStrictMode: true,
// };

require('dotenv').config();
const withBundleAnalyzer = require('@next/bundle-analyzer');


/** @type {import('next').NextConfig} */
module.exports = () => {
  const plugins = [
    withBundleAnalyzer({
      enabled: process.env.ANALYZE === 'true'
    })
  ];

  return plugins.reduce((acc, next) => next(acc), {
    trailingSlash: true,
    reactStrictMode: true,
    webpack: (cfg, {isServer}) => {
      const config = cfg;
      config.resolve.symlinks = false;
      if (!isServer) {
        config.resolve.fallback.fs = false;
      }
      return config;
    },
    publicRuntimeConfig: {

     
    },
    modularizeImports: {
      '@mui/icons-material': {
        transform: '@mui/icons-material/{{member}}'
      },
      '@mui/material': {
        transform: '@mui/material/{{member}}'
      },
      '@mui/lab': {
        transform: '@mui/lab/{{member}}'
      }
    }
  });
};
