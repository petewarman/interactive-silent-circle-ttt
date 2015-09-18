// Library paths
// If you want to use a new library, add it here.
require.config( {
  paths: {
    'underscore': '../libs/underscore',
    'jquery': '../libs/jquery',
    'backbone': '../libs/backbone',
//    'crossdomain': '../libs/Backbone.CrossDomain',
    'velocity': '../libs/velocity',
//    'velocity-ui': '../libs/velocity.ui',
    'text': '../libs/text',
//    'json': '../libs/json',
    'mustache': '../libs/mustache',
    'mediator-js': '../libs/mediator',

    // Events
    'resize': '../app/events/resize',

    // Icons - SVG
    'sizeSvg': '../../imgs/icons/size.svg',
    'logOnSvg': '../../imgs/icons/log-on.svg',
    'outAndAboutSvg': '../../imgs/icons/out-and-about.svg',
    'upToDateSvg': '../../imgs/icons/up-to-date.svg',
    'cloudSvg': '../../imgs/icons/cloud.svg',
    'responsabilitySvg': '../../imgs/icons/responsability.svg',
    'summarySvg': '../../imgs/icons/summary.svg'

  },
  shims: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
} );

