define( [
  'views/appView',
  'mediator-js',
  'resize'


], function ( AppView, Mediator ) {

  'use strict';

  return {

    init: function init( el ) {

      this.el = el;

      // Init mediator + resize
      // Global Events - pub/sub
      this.mediator = new Mediator();
      var ResizeEvent = require( 'resize' );
      new ResizeEvent( this.mediator );

      // Check if in app or on website
      this.isWeb = true;
      if ( typeof window.guardian === "undefined" ) {
        this.isWeb = false;
      }

      // Paths
      this.rootPath = this.isWeb ? '{{remote-root}}' : '{{local-root}}';
      this.assetsPath = this.rootPath + 'assets/';

      // Touch?
      this.isTouch = (('ontouchstart' in window) || ('ontouchstart' in document.documentElement) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
      if ( this.isTouch ) {
        $( 'body' ).addClass( 'touch' );
      } else {
        $( 'body' ).addClass( 'no-touch' );
      }

      // Get JSON questions + lang

      $.ajax( {
        dataType: 'jsonp',
        jsonpCallback: 'callback',
        url: this.assetsPath + 'data/data.json',
        success: this.renderMainView.bind( this )
      } );

    },

    renderMainView: function ( data ) {

//      console.log( data );

      var appView = new AppView( {
        el: this.el,
        mediator: this.mediator,
        isWeb: this.isWeb,
        data: data,
        touch: this.isTouch,
        assetsPath: this.assetsPath
      } );
      appView.render();
    }

  };

} );
