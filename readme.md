# Vital UTM Catcher

A simple UTM parameter processor plugin for WordPress. "Catches" a specific set of URL parameters on an entry page and makes them accessible throughout the website for the entire user session.

By default the plugin will already handle the following URL parameters: `'utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign'`.

Default cookie expiration time is 24 hours.

Add `?utm_catcher_params` to any link `href` URL and the plugin will replace it with any caught UTM parameters.

## Installation

1. Download the latest release from the repository's [release page](https://github.com/VitalDevTeam/vital-utm-catcher/releases).
2. Install plugin in WordPress using the downloaded ZIP file

## Usage

* Customize the plugin's settings in `vital-utm-catcher.php`.
* The list of URL parameters the plugin catches are stored in the `$utm_params` variable.
* The cookie lifetime is stored in the `$cookie_expires` variable.
* Add `?utm_catcher_params` to any link `href` URL and the plugin will replace it with any caught UTM parameters.

## Changelog

### 1.1.2
* Update setcookie with domain path

### 1.1.1
* Adds check for empty cookie before setting PHP cookie. Could cause caching issues with nginx/Varnish.

### 1.1.0
* Adds support for `utm_catcher_params` token replacement in link URLs.
* Adds minified version of plugin's JavaScript.

### 1.0.0
* Initial release.
