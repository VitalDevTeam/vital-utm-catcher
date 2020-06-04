/* globals VitalUtmCatcher */
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

	/**
	 * Gets cookie value
	 * http://www.quirksmode.org/js/cookies.html
	 *
	 * @param  {string} name Cookie name
	 */
	function getCookie(name) {
		var nameEQ = name + '=';
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1,c.length);
			}
			if (c.indexOf(nameEQ) === 0) {
				return c.substring(nameEQ.length,c.length);
			}
		}
		return null;
	}

	/**
	 * Encodes an array of URL parameters.
	 * @param {object} params Parameters to be encoded.
	 * @return {string} Encoded parameters.
	 */
	function encodeQueryData(params) {
		const ret = [];

		for (let p in params) {
			ret.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]));
		}

		return ret.join('&');
	}

	/**
	 * Returns caught non-null parameters.
	 * @return {object} Parameters
	 */
	function get_caught_params() {
		let params = {
			utm_source: getCookie('utm_source'),
			utm_medium: getCookie('utm_medium'),
			utm_term: getCookie('utm_term'),
			utm_content: getCookie('utm_content'),
			utm_campaign: getCookie('utm_campaign'),
		};

		for (var propName in params) {
			if (params[propName] === null || params[propName] === undefined) {
				delete params[propName];
			}
		}

		return params;
	}

	function onDocumentReady() {
		let links = document.querySelectorAll('a[href*=utm_catcher_params]'),
			params = get_caught_params(),
			url_params = encodeQueryData(params);

		links.forEach(function(link, i) {
			link.href = link.href.replace('utm_catcher_params', url_params);
		});
    }

    document.addEventListener('DOMContentLoaded', onDocumentReady);

})();
