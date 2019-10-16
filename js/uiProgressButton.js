/**
 * uiProgressButton.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;( function( window ) {
	let isUserWarnedOfLatency = true;
	const waitingMsg = "First call may take up to 50s ...";

	'use strict';

	let transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		support = { transitions : Modernizr.csstransitions };

	function extend( a, b ) {
		for( let key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}


	function UIProgressButton( el, options ) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this._init();
	}

	UIProgressButton.prototype.options = {
		// time in ms that the status (success or error will be displayed) - should be at least higher than the transition-duration value defined for the stroke-dashoffset transition of both checkmark and cross strokes 
		statusTime : 1500
	};

	UIProgressButton.prototype._init = function() {
		// the button
		this.button = this.el.querySelector( 'button' );

		// init events
		this._initEvents();

		// enable button
		this._enable();
	};

	UIProgressButton.prototype._initEvents = function() {
		let self = this;
		this.button.addEventListener( 'click', function() { self._submit(); } );
	};

	UIProgressButton.prototype._submit = function() {
		// by adding the loading class the button will transition to a "circle"
		classie.addClass( this.el, 'loading' );
		
		let self = this,
			onEndBtnTransitionFn = function( ev ) {
				if( support.transitions ) {
					//if( ev.propertyName !== 'width' ) return false;
					this.removeEventListener( transEndEventName, onEndBtnTransitionFn );
				}
				
				// disable the button - this should have been the first thing to do when clicking the button.
				// however if we do so Firefox does not seem to fire the transitionend event.
				this.setAttribute( 'disabled', '' );

				if( typeof self.options.callback === 'function' ) {
					self.options.callback( self );
				}
				else {
					// fill it (time will be the one defined in the CSS transition-duration property)
					self.resetInputMessage();
					self.stop();
				}
			};

		if( support.transitions ) {
			this.button.addEventListener( transEndEventName, onEndBtnTransitionFn );
		}
		else {
			onEndBtnTransitionFn();
		}
	};

	// runs after the progress reaches 100%
	UIProgressButton.prototype.stop = function( status ) {
		let self = this,
			endLoading = function() {

				if( typeof status === 'number' ) {
					let statusClass = status >= 0 ? 'success' : 'error';

					// add respective class to the element
					classie.addClass( self.el, statusClass );

					// after options.statusTime remove status and enable the button.
					setTimeout( function() {
						classie.remove( self.el, statusClass );
						self._enable();
					}, self.options.statusTime );
				}
				else {
					self._enable();
				}
				// finally remove class loading.
				classie.removeClass( self.el, 'loading' );
			};

		// give it a time (ideally the same like the transition time) so that the last progress increment animation is still visible.
		setTimeout( endLoading, 300 );
	};

	UIProgressButton.prototype.resetInputMessage = function() {
		 $('#loading_text').html("Create a brand new punchline");
	};

	UIProgressButton.prototype.setLoadingPunchline = function() {
		// Display a random punchline to ease user waiting //
		let placeholder = "";

		if (isUserWarnedOfLatency){
			let idx = getRandomInt(LoadingPunchlines.length);
			placeholder =  LoadingPunchlines[idx];
		} else {
			placeholder = waitingMsg;
		}
		isUserWarnedOfLatency = !isUserWarnedOfLatency;
		$('#loading_text').html(placeholder);
	};

	// enable button
	UIProgressButton.prototype._enable = function() {
		this.button.removeAttribute( 'disabled' );
		isUserWarnedOfLatency = true;  // For call at warm state, don't display the cold warm-up message
		this.resetInputMessage();
	};

	// add to global namespace
	window.UIProgressButton = UIProgressButton;

	const LoadingPunchlines = [
		"Calling Jay-Z ...",
		"Sending ad DM to Logic ...",
		"Hustling with Eminem ...",
		"Taunting DMX ...",
		"Riding the streets ... ",
		"Preparing a new EP ...",
		"Asking the crew ...",
		"Matrixing the MC ...",
		"Adjusting the prod ...",
		"Beeping the squad ...",
		"Calling Travis ...",
		"Starting the prod ...",
		"Grabbing a pen ...",
		"Asking Young Thug for a feat ...",
		"Starting the Boom Box ...",
		"Launching a Rap Contenders ...",
		"Dropping a hot track ...",
		"Kicking with the squad ...",
		"Finding inspiration ...",
		"Getting my notepad ...",
		"Hustling ...",
		"Answering Drake's mail ...",
		"Kicking it ...",
		"Rewriting some part ...",
		"Freestyling ...",
		"Warming up ...",
		"Hanging around ...",
		"MCing ...",
		"Asking friend's opinion ...",
		"Polishing ...",
		"Finishing stuff ...",
		"Hiring watch boy ...",
		"Looking for a feat ...",
		"Changing my mic ...",
		"Entering the studio ...",
		"Smoking ...",
		"Dealing ...",
		"Shutting ...",
		"Ganging ...",
		"Eating ramen in the studio ...",
		"Partying in the backstage ...",
		"Eating mom's spaghetti ...",
		"Entering the stage ...",
		"Warming the pit ...",
	]
})( window );