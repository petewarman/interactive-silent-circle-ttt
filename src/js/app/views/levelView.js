define( [
  'backbone',
  'mustache',
  'text!templates/level.html',
  'underscore',
  'velocity',
  'velocity-ui'
//  'views/analytics'
], function ( Backbone, Mustache, template, _, velocity ) {
  'use strict';

  return Backbone.View.extend( {

    initialize: function ( options ) {

      this.data = options.data;
      this.questions = options.data.questions;

      this.maxLevel = this.getMaxLevel();

    },

    setupElements: function () {
      this.$steps = this.$( '.step' );
      this.$levelMask = this.$( '#level-mask' );
    },

    setupEvents: function () {

    },

    getMaxLevel: function () {
      var max = 0;

      this.questions.forEach( function ( q, i ) {

        var highestValueAnswer = _.max( q.answers, function ( a ) {
          return parseInt( a.value );
        } );

        max += parseInt( highestValueAnswer.value );

      } );

//      console.log( max );

      return max;
    },

    render: function () {

      // Render main template
      this.$el.html( Mustache.render( template, {
        questions: this.data.questions,
        view: this.data.view.level
      } ) );

      this.setupElements();
      this.setupEvents();

      return this;
    },

    updateLevel: function ( answersTotal ) {

      this.currentLevelRatio = answersTotal / this.maxLevel;
      this.setLevel( 100 * this.currentLevelRatio );

    },

    setLevel: function ( percent ) {

      this.$levelMask.css( 'width', (Math.min( 100, 100 - percent )) + '%' );

      return this;
    },

    setCurrentStep: function ( idx ) {
      this.$steps.removeClass( 'current' );
      this.$steps.eq( idx ).addClass( 'current' );

      return this;
    },

    setStepDone: function ( idx ) {
      this.$steps.eq( idx ).addClass( 'done' );

      return this;
    },

    setStepUndone: function ( idx ) {
      this.$steps.eq( idx ).removeClass( 'done' );

      return this;
    },

    disableSteps: function () {

      this.$steps.addClass( 'summary' );
      this.$steps.removeClass( 'current' );

    },

    show: function ( callback ) {

      this.$el.velocity( "fadeIn", {
        duration: 0,
        complete: callback
      } );

    },

    hide: function ( callback ) {

      this.$el.velocity( "fadeOut", {
        duration: 400,
        complete: callback
      } );

    }

  } );
} );

