define( [
  'backbone',
  'mustache',
  'text!templates/intro.html',
  'underscore',
  'velocity',
  'velocity-ui'
//  'views/analytics'
], function ( Backbone, Mustache, template, _, velocity ) {
  'use strict';

  return Backbone.View.extend( {

    initialize: function ( options ) {

      this.data = options.data;

    },

    setupElements: function () {

    },

    setupEvents: function () {

    },

    show: function(callback) {

      this.$el.velocity("fadeIn", {
        duration: 200,
        complete: callback
      });

    },

    hide: function(callback) {

      this.$el.velocity("fadeOut", {
        duration: 200,
        complete: callback
      });

    },

    render: function () {

      // Render main template
      this.$el.html( Mustache.render( template, {
        title: this.data.view.intro.title,
        subtitle: this.data.view.intro.subtitle,
        button: this.data.button
      } ) );

      this.setupElements();
      this.setupEvents();

      return this;
    }
  } );
} );

