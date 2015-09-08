define( [
  'backbone',
  'mustache',
  'text!templates/summary.html',
  'underscore',
  'velocity',
  'velocity-ui'
//  'views/analytics'
], function ( Backbone, Mustache, template, _, velocity ) {
  'use strict';

  return Backbone.View.extend( {

    initialize: function ( options ) {

      this.isWeb = options.isWeb;
      this.button = options.data.button;
      this.questions = options.data.questions;
      this.app = options.app;

      return this;
    },

    render: function () {

      // Render main template
      this.$el.html( Mustache.render( template, {
        button: this.button,
        questions: this.questions,
        isWeb: this.isWeb
      } ) );

      this.setupElements();
      this.setupEvents();

      return this;
    },

    setupElements: function () {

    },

    setupEvents: function () {

    },

    show: function ( callback ) {

      this.$el.velocity( "fadeIn", {
        duration: 800,
        complete: callback
      } );

    },

    hide: function ( callback ) {

      this.$el.velocity( "fadeOut", {
        duration: 800,
        complete: callback
      } );

    }

  } );
} );

