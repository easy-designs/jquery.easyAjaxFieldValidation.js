Easy Ajax Field Validation
===================================

This script makes it simple to run one-off validation requests 
against specific fields.

The API
-------

To use the script, add the 
`data-ajax-field-validation` attribute to the field and set the 
URL endpoint as the value:

	<input type="text" name="username" required="required"
		data-ajax-field-validation="/api/validation-response/"/>

Then simply call the plugin in your JavaScript

	$( '[data-ajax-field-validation]' ).easyAjaxFieldValidation();

You can configure the way this script works in a few ways. The
first is through use of a configuration object passed to the plugin:

	$( '[data-ajax-field-validation]' ).easyAjaxFieldValidation({
		ui: 'keyup'
	});

The second is by adding additional data attributes to the field itself:

	<input type="text" name="username" required="required"
		data-ajax-field-validation="/api/validation-response/"
		data-ajax-field-validation-ui="keyup" />

Below is a list of configuration options, their names, `data-*` 
attribute equivalents, and default values:

 - **`ui`/`[data-ajax-field-validation-ui]`**<br/>
   Controls the UI of the widget. Options include "button" to generate
   a button that must be clicked and "keyup" to track the user’s 
   typing and check when they pause.<br/>
   Default: "button"
 - **`method`/`[data-ajax-field-validation-method]`**<br/>
   The submission method (e.g. GET, POST).<br/>
   Default: "GET"
 - **`response_param`/`[data-ajax-field-validation-response-param]`**<br/>
   This is  the parameter in the response you want to look for to 
   check validity.<br/>
   Default: "success"
 - **`response_success_value`/`[data-ajax-field-validation-response-success-value]`**<br/>
   This is the value that indicates success when assigned to the
   `response_param`<br/>
   Default: "yes"
 - **`button_text`/`[data-ajax-field-validation-button-text]`**<br/>
   Used only with `ui` value of "button", this config options sets the
   text content of the button.<br/>
   Default: "Check"
 - **`callback` (no corresponding data attribute)**<br/>
   This config option allows you to assign a callback function to perform
   actions when a validation response is received. The function can take
   two arguments. The first will be a boolean indicating whether or not
   the `response_success_value` indicated validity. The second will be the
   data recieved from the ajax call (the standard jQuery `data` argument).
   Default: Annoying alerts. You’ll want to configure this.