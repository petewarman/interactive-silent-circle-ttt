define( [
  'backbone',
  'mustache',
  'text!templates/level.html',
  'underscore',
  'velocity',

  // Icon for summary
  'text!summarySvg',

  'velocity-ui'

//  'views/analytics'
], function ( Backbone, Mustache, template, _, velocity, summarySvg ) {
  'use strict';

  return Backbone.View.extend( {

    initialize: function ( options ) {

      this.data = options.data;
      this.questions = options.data.questions;
      this.texts = this.data.view.level;

      this.maxLevel = this.getMaxLevel();
      this.minLevel = this.getMinLevel();
      this.medLevel = this.minLevel + ((this.maxLevel - this.minLevel) / 2);

//      console.log( 'Min: ', this.minLevel );
//      console.log( 'Med:', this.medLevel );
//      console.log( 'Max: ', this.maxLevel );

    },

    setupElements: function () {
      this.$steps = this.$( '.step' );
      this.$levelMask = this.$( '#level-mask' );

      this.$summaryTitle = this.$( '#summary-title' );
      this.$summaryMessage = this.$( '#summary-message' ); //.find( 'span' );
    },

    setupEvents: function () {

    },

    getMaxLevel: function () {
      var max = 0;

      this.questions.forEach( function ( q, i ) {

        var highestValueAnswer = _.max( q.answers, function ( a ) {
          return parseInt( a.value );
        } );

//        console.log( highestValueAnswer.value );

        max += parseInt( highestValueAnswer.value );

      } );

//      console.log( max );

      return max;
    },

    getMinLevel: function () {
      var min = 0;

      this.questions.forEach( function ( q, i ) {

        var lowestValueAnswer = _.min( q.answers, function ( a ) {
          return parseInt( a.value );
        } );

//        console.log( lowestValueAnswer.value );

        min += parseInt( lowestValueAnswer.value );

      } );

//      console.log( min );

      return min;
    },

    render: function () {

      // Render main template
      this.$el.html( Mustache.render( template, {
        questions: this.data.questions,
        texts: this.texts,
        'summary-svg': summarySvg
      } ) );

      this.setupElements();
      this.setupEvents();

      return this;
    },

    updateLevel: function ( answersTotal ) {

      this.currentLevelRatio = answersTotal / this.maxLevel;
      this.setLevel( 100 * this.currentLevelRatio );
    },

    getLevel: function () {
      return parseInt( this.$levelMask[0].style.width );
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

    setSummaryCurrent: function () {
      this.$( '#summary-step' ).addClass( 'current' );
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

    resetTexts: function () {

      this.$summaryTitle.html( '' );
      this.$summaryMessage.html( '' );

    },

    updateSummaryText: function ( security ) {

      this.summaryTitle = this.texts.summary.title[security];
      this.summaryMessage = this.texts.summary.message[security];

      this.$summaryTitle.html( this.summaryTitle );
//      this.$title.addClass( security );
      this.$summaryMessage.html( this.summaryMessage ); //

    },

    show: function ( callback, duration ) {

      this.$el.velocity( "fadeIn", {
        duration: _.isNumber( duration ) ? duration : 400,
        complete: callback
      } );

    },

    hide: function ( callback, duration ) {

      this.$el.velocity( "fadeOut", {
        duration: _.isNumber( duration ) ? duration : 400,
        complete: callback
      } );

    },

  } );
} );

