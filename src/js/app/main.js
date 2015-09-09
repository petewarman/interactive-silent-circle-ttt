define( [
  'views/appView'


], function ( AppView ) {

  'use strict';

  return {

    init: function init( el ) {

      this.el = el;

      // Check if in app or on website
      this.isWeb = true;
      if ( typeof window.guardian === "undefined" ) {
        this.isWeb = false;
      }

      // Touch?
      this.isTouch = (('ontouchstart' in window) || ('ontouchstart' in document.documentElement) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
      if ( this.isTouch ) {
        $( 'body' ).addClass( 'touch' );
      } else {
        $( 'body' ).addClass( 'no-touch' );
      }

      // Get JSON questions + lang
      this.getJsonData( this.renderMainView.bind( this ) );

    },

    getJsonData: function ( callback ) {

      $.ajax( {
        dataType: 'json',
        url: '{{assets}}/data/data.json',
        success: callback
      } );

    },

    renderMainView: function ( data ) {

      var appView = new AppView( {
        el: this.el,
        isWeb: this.isWeb,
        data: data,
        touch: this.isTouch
      } );
      appView.render();
    }

  };

} );
