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
//  'views/summaryView',

  // Templates
  'text!templates/app.html',

  // Others
  'velocity-ui'

//  'views/analytics'
], function ( Backbone, Mustache, _, velocity, HeaderView, IntroView, QuestionsView, LevelView, appTpl ) {
  'use strict';

  return Backbone.View.extend( {

    className: 'guInteractive',

    initialize: function ( options ) {

      this.data = this.prepareData( options.data );
      this.isWeb = options.isWeb;
      this.isTouch = options.isTouch; //

    },

    prepareData: function ( data ) {

      // Prepare questions (add IDs)
      data.questions.forEach( function ( q, i ) {

        q['question-id'] = "question-" + i;
        q['question-index'] = i;

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
      this.$el.on( click, '.step.done', this.showQuestion.bind( this ) );

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

      this.introView = new IntroView( {
        el: this.$introSection[0],
        data: this.data
      } );

      this.headerView.render();
      this.introView.render();

      this.setupEvents();

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
        this.questionsView.activateFirstAnswer.call(this.questionsView);

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
        var $step = $( event.target );
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

      this.data.questions.forEach( function ( q, i ) {
        if ( q.done ) {
          this.levelView.setStepDone( i );
        }
      }.bind( this ) );

    },

    start: function () {

      this.introView.hide( this.renderLevel.bind( this, this.renderQuestions.bind( this ) ) );

    }

  } );
} );

