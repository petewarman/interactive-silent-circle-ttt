define( [
  'backbone',
  'mustache',
  'text!templates/header.html',
  'underscore',
  'velocity',
  'velocity-ui'
//  'views/analytics'
], function ( Backbone, Mustache, template, _, velocity ) {
  'use strict';

  return Backbone.View.extend( {

    initialize: function ( options ) {

      this.isWeb = options.isWeb;
      this.assetsPath = options.assetsPath;

    },

    setupElements: function () {

    },

    setupEvents: function () {
//      var click = this.isTouch ? 'touchstart' : 'click';

    },

    render: function () {

      // Render main template
      this.$el.html( Mustache.render( template, {
        questions: this.data,
        isWeb: this.isWeb,
        assets: this.assetsPath
      } ) );

      this.setupElements();
      this.setupEvents();

      return this;
    }
  } );
} );

