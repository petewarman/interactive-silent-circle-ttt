define( function ( require ) {

  var _ = require( 'underscore' );

  var Event = function ( mediator ) {

    this.mediator = mediator;

    this.initialize();

  };

  Event.prototype = {
    initialize: function () {

      this.callback = _.debounce( this.onResize, 100 ).bind( this );

      window.addEventListener( 'resize', this.callback );

    },
    onResize: function () {

      this.mediator.publish( 'resize', {
        width: window.innerWidth, //this.$win.width(),
        height: window.innerHeight //this.$win.height()
      } );

    }
  };

  return Event;

} );