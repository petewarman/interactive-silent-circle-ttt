define( [
  'backbone',
  'mustache',
  'underscore',
  'velocity',

  // Views
  'views/headerView',
  'views/introView',
  'views/questionsView',
  'views/levelView',

  // Templates
  'text!templates/app.html',

  // Icons
  'text!sizeSvg',
  'text!logOnSvg',
  'text!outAndAboutSvg',
  'text!upToDateSvg',
  'text!cloudSvg',
  'text!responsabilitySvg',

  // Others
  'velocity-ui'

//  'views/analytics'
], function ( Backbone, Mustache, _, velocity, HeaderView, IntroView, QuestionsView, LevelView, appTpl, sizeSvg, logOnSvg, outAndAboutSvg, upToDateSvg, cloudSvg, responsabilitySvg ) {
  'use strict';

  return Backbone.View.extend( {

    className: 'guInteractive',

    initialize: function ( options ) {

      this.data = this.prepareData( options.data );
      this.isWeb = options.isWeb;
      this.isTouch = options.isTouch;

    },

    prepareData: function ( data ) {

      var icon = [
        sizeSvg,
        logOnSvg,
        outAndAboutSvg,
        upToDateSvg,
        cloudSvg,
        responsabilitySvg
      ];

      // Prepare questions (add IDs)
      data.questions.forEach( function ( q, i ) {

        q['question-id'] = "question-" + i;
        q['question-index'] = i;
        q['svg'] = icon[i];

        q.answers.forEach( function ( a, j ) {

          a['answer-id'] = q['question-id'] + "-answer-" + j;
          a['answer-index'] = j;

        } );

      } );

      return data;

    },

    setupElements: function () {

      this.$headerSection = this.$( '#header-section' );
      this.$questionsSection = this.$( '#questions-section' );
      this.$summarySection = this.$( '#summary-section' );
      this.$introSection = this.$( '#intro-section' );
      this.$levelSection = this.$( '#level-section' );

    },

    setupEvents: function () {
      var click = this.isTouch ? 'touchstart' : 'click';

      // Disable buttons <a> default behavior
      this.$el.on( click, '.button a', function ( e ) {
        e.preventDefault();
      } );

      // Start button
      this.$el.on( click, '#start', this.start.bind( this ) );

      // Navigate through questions
      this.$el.on( click, '.step.done:not(.summary)', this.showQuestion.bind( this ) );

    },

    render: function () {

      // Render main template
      this.$el.html( Mustache.render( appTpl, {
        button: this.button,
        questions: this.questions,
        isWeb: this.isWeb
      } ) );

      // Setup elements and events
      this.setupElements();

      // Render header, intro and questions
      this.headerView = new HeaderView( {
        el: this.$headerSection[0],
        isWeb: this.isWeb
      } );

//      this.introView = new IntroView( {
//        el: this.$introSection[0],
//        data: this.data
//      } );

      this.headerView.render();
//      this.introView.render();

      this.setupEvents();

      this.start();

      return this;
    },

    renderLevel: function ( callback ) {

      this.levelView = new LevelView( {
        el: this.$levelSection[0],
        app: this,
        data: this.data,
        isWeb: this.isWeb
      } );

      this.levelView.render().show( callback );

    },

    renderQuestions: function () {

      this.questionsView = new QuestionsView( {
        el: this.$questionsSection[0],
        app: this,
        data: this.data,
        isWeb: this.isWeb
      } );

      this.questionsView.render().show( function () {
        this.showQuestion( 0 ); // show the first question

        // Set the first answer active
        this.questionsView.activateFirstAnswer.call( this.questionsView );

        // Scroll to top
        this.scrollTop();

      }.bind( this ) );

    },

    /**
     * The argument "i" can be a jQuery event object (click) or a number (an index in the questions array).
     * @param i
     */
    showQuestion: function ( i ) {

      if ( _.isNumber( i ) ) {

        var index = i;

      } else if ( _.isObject( i ) ) {

        var event = i;
        var $step = $( event.target ).closest( '.step' );
        var index = $step.data( 'index' );

      }

      this.questionsView.setCurrentQuestion( index );
      this.levelView.setCurrentStep( index );
      this.currentQuestion = index;

    },

    updateLevel: function () {
      this.answersTotal = this.getAnswersTotal();

      // Update risk level
      this.levelView.updateLevel( this.answersTotal );
    },

    getAnswersTotal: function () {
      var total = 0;

      this.questionsView.$questions.each( function ( i, el ) {

        var $q = $( el );

        if ( $q.hasClass( 'done' ) ) {
          total += parseInt( $q.find( ':checked' ).val() );
        }

      } );

      return total;
    },

    updateSteps: function () {

      // Remove class 'summary'
      if ( this.currentState === 'questions' ) {
        this.levelView.$steps.removeClass( 'summary' );
      }

      // Set step done or undone, depending on questions answered
      this.data.questions.forEach( function ( q, i ) {
        if ( q.done ) {
          this.levelView.setStepDone( i );
        } else {
          this.levelView.setStepUndone( i );
        }
      }.bind( this ) );

    },

    start: function () {

//      this.introView.hide(  );

      this.renderLevel( this.renderQuestions.bind( this ) );

    },

    updateTexts: function () {

      if ( this.currentState === 'summary' ) {

        var levelPercent = this.levelView.getLevel() || 0;
        var security = "good";

        if ( levelPercent <= 100 * 0.3 ) {
          security = "bad";
        } else if ( levelPercent <= 100 * 0.6 ) {
          security = "medium";
        }

        this.levelView.updateSummaryText( security );

        console.log( 'security level: ' + security );

      }

    },

    showSummary: function () {

      this.currentState = 'summary';
      this.$el.addClass( 'summary' );

      // Update button and step icons
      this.questionsView.updateButton();
      this.levelView.disableSteps();
      this.levelView.setSummaryCurrent();

      // Update texts
      this.updateTexts();

    },

    restart: function () {

      // Undo all questions
      this.data.questions.forEach( function ( q, i ) {
        q.done = false;
      } );

      // Uncheck all radios
      this.questionsView.$answerWrapper.find( 'input[type=radio]' ).prop( 'checked', false );

      // Remove class 'done' from all questions
      this.questionsView.$questions.removeClass( 'done' );

      // Hide all feedbacks
      this.questionsView.$feedbacks.hide();

      // Remove class 'selected' from all answers
      this.questionsView.$answerWrapper.removeClass( 'selected' );

      // Set current state to 'questions'
      this.currentState = 'questions';

      // Activate the first answer
      this.questionsView.activateFirstAnswer();

      // Show first question
      this.showQuestion( 0 );

      // Reset levelView title + texts
      this.levelView.resetTexts();

      // Update button and steps
      this.questionsView.updateButton();
      this.updateSteps();

      // Remove summary class
      this.$el.removeClass( 'summary' );

    },

    scrollTop: function () {
      this.$el.velocity( 'scroll', {duration: 400, easing: "swing"} );
    }

  } );
} );

