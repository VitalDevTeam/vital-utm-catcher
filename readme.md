# Vital UTM Catcher

A simple UTM parameter processor plugin for WordPress. "Catches" a specific set of URL parameters on an entry page and makes them accessible throughout the website for the entire user session.

By default the plugin will already handle the following URL parameters: `'utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign'`.

Default cookie expiration time is 24 hours.

## Installation

1. Download the latest release from the repository's [release page](https://github.com/VitalDevTeam/vital-utm-catcher/releases).
2. Install plugin in WordPress using the downloaded ZIP file

## Usage

* Customize the plugin's settings in `vital-utm-catcher.php`.
* The list of URL parameters the plugin catches are stored in the `$utm_params` variable.
* The cookie lifetime is stored in the `$cookie_expires` variable.
