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

      this.app.currentState = 'questions';

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

      this.$body = $( 'html, body' );

      this.$answerWrapper = this.$( '.answer-wrapper' );
      this.$answers = this.$( '.answers' );
      this.$questions = this.$( '.question' );
      this.$button = this.$( '.button' );
      this.$buttonLink = this.$button.find( 'a' );

      this.$feedbacks = this.$( '.feedback' );

    },

    setupEvents: function () {

      var click = this.isTouch ? 'touchstart' : 'click';

      $( document ).on( click, '.answer-wrapper:not(.selected) label, .answer-wrapper:not(.selected) span, .answer-wrapper:not(.selected) input', this.activateAnswer.bind( this ) );

      $( document ).on( click, '.button.enabled a', this.buttonClicked.bind( this ) );

    },

    buttonClicked: function () {

      if ( this.app.currentState === 'questions' ) {
        this.next();
      } else if ( this.app.currentState === 'summary' ) {
        this.app.restart();
      }

      // Scroll to top
      if (this.app.currentState === 'questions')
        this.app.scrollTop();

    },

    next: function () {

      var currentIdx = this.app.currentQuestion;
      var nextIdx = currentIdx + 1 >= this.questionsCount ? -1 : currentIdx + 1;

      if ( nextIdx >= 0 ) {
        this.app.showQuestion( nextIdx );
      } else {
        this.app.showSummary();
      }

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

      var $question, $answers, $selectedAnswer, $radio, $selectedFeedback, $allFeedbacks, $visibleFeedbacks, index;

      if ( e instanceof jQuery ) {
        $radio = e;
        $selectedAnswer = e.closest( '.answer-wrapper' );
        $question = e.closest( '.question' );
      } else {
        e.stopPropagation(); // important!
        var $el = $( e.currentTarget );
        $selectedAnswer = $el.closest( '.answer-wrapper' );
        $radio = $selectedAnswer.find( 'input[type=radio]' );
        $question = $el.closest( '.question' );
      }

      $answers = $question.find( '.answer-wrapper' );
      $selectedFeedback = $selectedAnswer.find( '.feedback' );
      $allFeedbacks = $answers.find( '.feedback' );
      $visibleFeedbacks = $allFeedbacks.filter( ':visible' );
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
      this.showFeedback( $visibleFeedbacks, $allFeedbacks, $selectedFeedback );

      // Update steps
      this.app.updateSteps();

      // Update risk level
      this.app.updateLevel();

      // Update button state
      this.updateButton();

    },

    showFeedback: function ( $visibleFeedbacks, $allFeedbacks, $selectedFeedback ) {

      var duration = this.app.currentState === 'questions' ? 400 : 0;

      $allFeedbacks.velocity( 'finish' );

      if ( $visibleFeedbacks.length ) {
        $visibleFeedbacks.velocity( 'slideUp', {duration: duration, complete: function () {
          $selectedFeedback.velocity( 'slideDown', {duration: duration} );
          $allFeedbacks.not( $selectedFeedback ).hide();
        }} );
      } else {
        $selectedFeedback.velocity( 'slideDown', {duration: duration} );
        $allFeedbacks.not( $selectedFeedback ).hide();
      }

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

      // If we are in summary
      if ( this.app.currentState === 'summary' ) {
        this.$button.addClass( 'enabled' );
        this.$buttonLink.html( this.button.repeat );
      }

    },

    show: function ( callback ) {

      this.$el.velocity( "fadeIn", {
        duration: 1000,
        complete: callback
      } );

    },

    hide: function ( callback ) {

      this.$el.velocity( "fadeOut", {
        duration: 1000,
        complete: callback
      } );

    }

  } );
} );

