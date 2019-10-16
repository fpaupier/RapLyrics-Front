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

	function SVGEl( el ) {
		this.el = el;
		// the path elements
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

		// the success/error elems
		this.successEl = new SVGEl( this.el.querySelector( 'svg.checkmark' ) );
		this.errorEl = new SVGEl( this.el.querySelector( 'svg.cross' ) );
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
	}

	// runs after the progress reaches 100%
	UIProgressButton.prototype.stop = function( status ) {
		let self = this,
			endLoading = function() {

				if( typeof status === 'number' ) {
					let statusClass = status >= 0 ? 'success' : 'error',
						statusEl = status >=0 ? self.successEl : self.errorEl;

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
		let idx = getRandomInt(LoadingPunchlines.length);
		$('#loading_text').html(LoadingPunchlines[idx]);
	};

	// enable button
	UIProgressButton.prototype._enable = function() {
		this.button.removeAttribute( 'disabled' );
	};

	// add to global namespace
	window.UIProgressButton = UIProgressButton;

	const LoadingPunchlines = ["Calling Jay-Z ...", "Sending ad DM to Logic ..."]
})( window );