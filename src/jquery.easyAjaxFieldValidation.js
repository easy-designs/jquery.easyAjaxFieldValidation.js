/*! Easy Ajax Field Validation (c) Aaron Gustafson (@AaronGustafson). MIT License. https://github.com/easy-designs/jquery.easyAjaxFieldValidation.js */

/* Easy Ajax Field Validation
 * 
 * This script makes it simple to run one-off validation requests 
 * against specific fields.
 * 
 * The API
 * =======
 * 
 * To use the script, add the 
 * `data-ajax-field-validation` attribute to the field and set the 
 * URL endpoint as the value:
 * 
 * 	<input type="text" name="username" required="required"
 *		data-ajax-field-validation="/api/validation-response/"/>
 * 
 * Then simply call the plugin in your JavaScript
 * 
 * 	$( '[data-ajax-field-validation]' ).easyAjaxFieldValidation();
 * 
 * You can configure the way this script works in a few ways. The
 * first is through use of a configuration object passed to the plugin:
 * 
 * 	$( '[data-ajax-field-validation]' ).easyAjaxFieldValidation({
 * 		ui: 'keyup'
 * 	});
 * 
 * The second is by adding additional data attributes to the field itself:
 * 
 * 	<input type="text" name="username" required="required"
 *		data-ajax-field-validation="/api/validation-response/"
 *		data-ajax-field-validation-ui="keyup" />
 * 
 * Below is a list of configuration options, their names, `data-*` 
 * attribute equivalents, and default values:
 * 
 *  - `ui`/`[data-ajax-validate-ui]`
 *    Controls the UI of the widget. Options include "button" to generate
 *    a button that must be clicked and "keyup" to track the user’s 
 *    typing and check when they pause.
 *    Default: "button"
 *  - `method`/`[data-ajax-validate-method]`
 *    The submission method (e.g. GET, POST).
 *    Default: "GET"
 *  - `response_param`/`[data-ajax-validate-response-param]`
 *    This is  the parameter in the response you want to look for to 
 *    check validity.
 *    Default: "success"
 *  - `response_success_value`/`[data-ajax-validate-response-success-value]`
 *    This is the value that indicates success when assigned to the
 *    `response_param`
 *    Default: "yes"
 *  - `button_text`/`[data-ajax-validate-button-text]`
 *    Used only with `ui` value of "button", this config options sets the
 *    text content of the button.
 *    Default: "Check"
 *  - `button_inner_wrapper`/`[data-ajax-validate-button-inner-wrapper]`
 *    If you want an element placed inside the button, supply the selector 
 * 	  here and the script will create it
 *    Default: none
 *  - `button_outer_wrapper`/`[data-ajax-validate-button-outer-wrapper]`
 *    If you want an element placed around the button, supply the selector 
 * 	  here and the script will create it
 *    Default: none
 *  - `callback` (no corresponding data attribute)
 *    This config option allows you to assign a callback function to perform
 *    actions when a validation response is received. The function can take
 *    two arguments. The first will be a boolean indicating whether or not
 *    the `response_success_value` indicated validity. The second will be the
 *    data recieved from the ajax call (the standard jQuery `data` argument).
 * 	  The third argument is a jQuery object referencing the field.
 *    Default: Annoying alerts. You’ll want to configure this.
 * 
 **/
;(function( $, UNDEFINED ){
	
	var script_name = 'easyAjaxFieldValidation',
		observing_key = script_name + '-observing',
		data_attr = 'ajax-field-validation',
		// config
		ui_options = [
			'button',
			'keyup'
		],
		defaults = {
			ui: ui_options[0],
			method: 'GET',
			response_param: 'success',
			response_success_value: 'yes',
			button_text: 'Check',
			button_inner_wrapper: false,
			button_outer_wrapper: false,
			callback: function( success, response, $field ){
				if ( success )
				{
					alert( 'The check passed!' );
				}
				else
				{
					alert( 'The check failed!' );
				}
			}
		},
		// markup
		$body = $('body'),
		$button = $('<button type="button"/>');
	
	$.fn.easyAjaxFieldValidation = function( config )
	{
		
		config = $.extend( defaults, config );
		
		var $fields = $(this),
			observing = $body.data( observing_key ) || [];
		
		function check( $field, url )
		{
			
			var to_send = {},
				// allow inline overrides
				method = $field.data( data_attr + '-method' ) || config.method,
				response_param = $field.data( data_attr + '-response-param' ) || config.response_param,
				response_success_value = $field.data( data_attr + '-response-success-value' ) || config.response_success_value;
			
			to_send[$field.attr('name')] = $field.val();
			
			$.ajax( url, {
				cache: false,
				data: to_send,
				type: method.toUpperCase(),
				success: function( response ){
					var success = ( response[response_param] != UNDEFINED &&
									response[response_param] == response_success_value );
					config.callback( success, response, $field );
				}
			});

		}
		
		return $fields.each(function(){

			var $field = $(this),
				$parent = $field.parent(),
				$b,
				$i, i, i_len,
				url = $field.data( data_attr ) || config.url,
				// inline overrides
				ui = $field.data( data_attr + '-ui' ) || config.ui,
				button_text = $field.data( data_attr + '-button-text' ) || config.button_text,
				button_inner_wrapper = $field.data( data_attr + '-button-inner-wrapper' ) || config.button_inner_wrapper,
				button_outer_wrapper = $field.data( data_attr + '-button-outer-wrapper' ) || config.button_outer_wrapper,
				// timer for keyup
				timer,
				// regexes
				re_element = /([^:.#\[]+)/,
				re_id = /\#([^:.#\[]+)/,
				re_classes = /\.([^:.#\[]+)/g,
				one = "$1";
			
			// we need a URL
			if ( url == UNDEFINED )
			{
				return;
			}
			
			if ( $.inArray( ui, ui_options ) == -1 )
			{
				ui = ui_options[0];
			}

			// Button method
			if ( ui == 'button' )
			{
				$b = $button.clone();

				// Inner Wrapper
				if ( button_inner_wrapper )
				{
					// create the element
					$i = $( '<' + button_inner_wrapper.match( re_element )[0] + '/>' );
					
					// add ids
					i = button_inner_wrapper.match( re_id );
					if ( i &&
						 i.length )
					{
						$i.attr( 'id', i[0].replace( re_id, one ) );
					}
					
					// add classes
					i = button_inner_wrapper.match( re_classes );
					if ( i )
					{
						i_len = i.length;
						while ( i_len-- )
						{
							$i.addClass( i[i_len].replace( re_classes, one ) );
						}
					}

					// append the text
					$i.text( button_text )
					// add to the button
						.appendTo( $b );
				}
				else
				{
					$b.text( button_text );
				}
				
				// Outer Wrapper
				if ( button_outer_wrapper )
				{
					// create the element
					$i = $( '<' + button_outer_wrapper.match( re_element )[0] + '/>' );
					
					// add ids
					i = button_outer_wrapper.match( re_id );
					if ( i &&
						 i.length )
					{
						$i.attr( 'id', i[0].replace( re_id, one ) );
					}
					
					// add classes
					i = button_outer_wrapper.match( re_classes );
					if ( i )
					{
						i_len = i.length;
						while ( i_len-- )
						{
							$i.addClass( i[i_len].replace( re_classes, one ) );
						}
					}
					
					$i.appendTo( $parent );
					
					$parent = $i;
				}
					
				$b.on( 'click keypress', function(e){
					
					// only look for the enter keypress
					if ( e.type == 'keypress' &&
						 e.which != 13 )
					{
						return;
					}
					
					// run the Ajax
					check( $field, url );
					
				 })
				.appendTo( $parent );
				
			}
			else if ( ui == 'keyup' )
			{
				$field.on( 'keyup', function(){
					
					// we don’t want to run constantly, so we’ll pause a bit
					if ( timer )
					{
						clearTimeout( timer );
						timer = null;
					}
					timer = setTimeout( function(){
						
						// run the Ajax
						check( $field, url );
						
					}, 500 );
					
				});
			}
		
		});
		
	};
	
}( jQuery ));