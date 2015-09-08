define( [
  'backbone',
  'mustache',
  'text!templates/questions.html',
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

      this.questionsCount = this.questions.length;

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

      this.$answerWrapper = this.$( '.answer-wrapper' );
      this.$answers = this.$( '.answers' );
      this.$questions = this.$( '.question' );
      this.$button = this.$( '.button' );
      this.$buttonLink = this.$button.find( 'a' );

    },

    setupEvents: function () {

      var click = this.isTouch ? 'touchstart' : 'click';

      $( document ).on( click, '.answer-wrapper:not(.selected) label, .answer-wrapper:not(.selected) span', this.activateAnswer.bind( this ) );

      $( document ).on( click, '.button.enabled a', this.next.bind( this ) );

    },

    next: function () {

      var currentIdx = this.app.currentQuestion;
      var nextIdx = currentIdx + 1 >= this.questionsCount ? -1 : currentIdx + 1;

      if ( nextIdx >= 0 ) {
        this.app.showQuestion( nextIdx );
      } else {
        this.renderSummary();
      }

      console.log( nextIdx );

    },

    renderSummary: function () {

      console.log( 'render summary' );

    },

    activateFirstAnswer: function () {

      var $firstRadio = this.$answerWrapper.first().find( 'input[type=radio]' ).eq( 0 );

      // Activate the first answer in the first question
      this.activateAnswer( $firstRadio );

    },

    /**
     * The argument "e" can be a jQuery event object (click) or directly the jQuery object of the radio button to be activated.
     * @param e
     */
    activateAnswer: function ( e ) {

      var $question, $answers, $selectedAnswer, $radio, $feedback, $feedbacks, index;

      if ( e instanceof jQuery ) {
        $radio = e;
        $selectedAnswer = e.closest( '.answer-wrapper' );
        $question = e.closest( '.question' );
      } else {
        var $el = $( e.currentTarget );
        $selectedAnswer = $el.closest( '.answer-wrapper' );
        $radio = $selectedAnswer.find( 'input[type=radio]' );
        $question = $el.closest( '.question' );
      }

      $answers = $question.find( '.answer-wrapper' );
      $feedback = $selectedAnswer.find( '.feedback' );
      $feedbacks = $answers.find( '.feedback' );
      index = $question.data( 'index' );

      // Activate the radio
      $radio.prop( 'checked', true );

      // Activate the answer
      $answers.removeClass( 'selected' );
      $selectedAnswer.addClass( 'selected' );

      // Set question as done
      this.questions[index].done = true;
      $question.addClass( 'done' );

      // Show feedback
      $feedbacks.hide();
      $feedback.velocity( 'slideDown', {duration: 400} );

      // Update steps
      this.app.updateSteps();

      // Update answers total +
      this.app.updateLevel();

      // Update button state
      this.updateButton();

    },

    setCurrentQuestion: function ( idx ) {

      this.$questions.removeClass( 'current' );
      this.$questions.eq( idx ).addClass( 'current' );
      this.app.currentQuestion = idx;

      // Update button state
      this.updateButton();

      return this;

    },

    getCurrentQuestion: function () {

      return this.$questions.index( 'current' );

    },

    updateButton: function () {

      // If it is the last question, change the label
      if ( this.app.currentQuestion === this.questionsCount - 1 ) {
        this.$buttonLink.html( this.button.results );
      } else {
        this.$buttonLink.html( this.button.next );
      }

      // If the question has been answered, enable the button
      if ( this.questions[this.app.currentQuestion].done ) {
        this.$button.addClass( 'enabled' );
      } else {
        this.$button.removeClass( 'enabled' );
      }

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

