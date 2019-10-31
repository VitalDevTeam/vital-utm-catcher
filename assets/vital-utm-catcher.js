(function() {
	var utm_params = VitalUtmCatcher.utm_params,
		cookie_expires = VitalUtmCatcher.cookie_expires;

	var url_params = getUrlParameters(window.location.href);

	utm_params.forEach(function(param) {
		var cookie_field = pluckUtmValue(param, url_params);

		if (cookie_field !== '') {
			setCookie(param, cookie_field, cookie_expires);
		}
	});

	/**
	 * Get the URL parameters
	 *
	 * @param  {string} url The URL
	 * @return {object}     The URL parameters
	 */
	function getUrlParameters(url) {
		var params = {};
		var parser = document.createElement('a');
		parser.href = url;
		var query = parser.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			params[pair[0]] = decodeURIComponent(pair[1]);
		}
		return params;
	};

	/**
	 * Pluck the UTM value out of the list of parameters
	 *
	 * @param {string} value Parameter value to pluck
	 * @param {object} url_params List of parameters
	 */
	function pluckUtmValue(value, url_params) {
		if (url_params[value] !== undefined) {
			return url_params[value];
		}
		return '';
	}

	/**
	 * Sets cookie
	 *
	 * @param {string} name Cookie name
	 * @param {string} value Cookie value
	 * @param {integer} seconds Cookie expiration in seconds
	 */
	function setCookie(name, value, seconds) {
		var expires;
		if (seconds) {
			var date = new Date();
			date.setTime(date.getTime() + (seconds * 1000));
			expires = '; expires=' + date.toGMTString();
		} else {
			expires = '';
		}
		document.cookie = name + '=' + value + expires + '; path=/';
	}

})();
