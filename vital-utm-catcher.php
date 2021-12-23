<?php
/*
	Plugin Name: Vital UTM Catcher
	Plugin URI: https://vtldesign.com
	Description: Simple UTM parameter processor
	Version: 1.1.2
	Author: Vital
	Author URI: https://vtldesign.com
	Text Domain: vital
	License: GPLv2

	Copyright 2019  VITAL  (email : hello@vtldesign.com)

	This program is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License, version 2, as
	published by the Free Software Foundation.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
if (! defined('ABSPATH')) {
	exit;
}

class Vital_Utm_Catcher {

	/**
	 * The version number.
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $_version;

	/**
	 * The plugin assets directory.
	 * @var     string
	 * @access  private
	 * @since   1.0.0
	 */
	private $assets_dir;

	/**
	 * The plugin assets URL.
	 * @var     string
	 * @access  private
	 * @since   1.0.0
	 */
	private $assets_url;

	/**
	 * The UTM parameters.
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $utm_params;

	/**
	 * The cookie expriation time in seconds.
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $cookie_expires;

	/**
	 * The asset file name suffix.
	 * @var     string
	 * @access  private
	 * @since   1.1.0
	 */
	private $suffix;

	/**
	 * Constructor function.
	 * @access  public
	 * @since   1.0.0
	 * @return  void
	 */
	public function __construct() {
		$this->_version = '1.1.2';
		$this->assets_dir = plugin_dir_path(__FILE__);
		$this->assets_url  = plugin_dir_url(__FILE__);
		$this->suffix = (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG) ? '' : '.min';

		// Sets parameters to catch
		$this->utm_params = [
			'utm_source',
			'utm_medium',
			'utm_term',
			'utm_content',
			'utm_campaign',
		];

		// Sets 24-hour expiration on all cookies
		$this->cookie_expires = 86400;

		add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
		add_action('init', [$this, 'catch']);
	}

	/**
	 * Catches URL parameters, filters our UTM values, and sets cookies
	 *
	 * @access  public
	 * @since   1.0.0
	 * @return  void
	 */
	public function catch() {

		foreach ($this->utm_params as $field) {
			if (isset($_GET[$field]) && $_GET[$field] !== '') {
				$cookie_value = htmlspecialchars($_GET[$field], ENT_QUOTES, 'UTF-8');
			} elseif (isset($_COOKIE[$field]) && $_COOKIE[$field] !== '') {
				$cookie_value = $_COOKIE[$field];
			} else {
				$cookie_value = '';
			}

			$domain = parse_url(get_site_url(), PHP_URL_HOST);

			// Remove www subdomain
			if (strtolower(substr($domain, 0, 4)) === 'www.') {
				$domain = substr($domain, 4);
			}

			// Add dot prefix for compatibility with subdomains
			if (substr($domain, 0, 1) !== '.' && $domain !== 'localhost') {
				$domain = '.' . $domain;
			}

			// Remove port
			$port = strpos($domain, ':');
			if ($port !== false) {
				$domain = substr($domain, 0, $port);
			}

			if ($cookie_value !== '') {
				setcookie($field, $cookie_value, strtotime("+{$this->cookie_expires} seconds"), '/', $domain);
				$_COOKIE[$field] = $cookie_value;
			}
		}
	}

	/**
	 * Enqueues and localizes frontend JavaScripts
	 *
	 * @access  public
	 * @since   1.0.0
	 * @return  void
	 */
	public function enqueue_scripts() {

		wp_enqueue_script(
			'vital_utm_catcher',
			$this->assets_url . '/assets/vital-utm-catcher' . $this->suffix . '.js',
			[],
			$this->_version,
			true
		);

		wp_localize_script('vital_utm_catcher', 'VitalUtmCatcher', [
			'utm_params'     => $this->utm_params,
			'cookie_expires' => $this->cookie_expires,
		]);
	}

}

new Vital_Utm_Catcher();
