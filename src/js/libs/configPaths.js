// Library paths
// If you want to use a new library, add it here.
require.config( {
  paths: {
    'underscore': '../libs/underscore',
    'jquery': '../libs/jquery',
    'backbone': '../libs/backbone',
    'crossdomain': '../libs/Backbone.CrossDomain',
    'velocity': '../libs/velocity',
    'velocity-ui': '../libs/velocity.ui',
    'text': '../libs/text',
    'json': '../libs/json',
    'mustache': '../libs/mustache',
//    'mediator-js': '../libs/mediator',

  },
  shims: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
} );

