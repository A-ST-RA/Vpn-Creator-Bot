'use strict';

/* eslint-disable no-unused-vars */
module.exports = (config, webpack) => {
  config.plugins.push(new webpack.NormalModuleReplacementPlugin(
    /^tippy\.js$/,
    'tippy.js/dist/tippy-bundle.umd.min.js'
  ));
  
  return config;
};
