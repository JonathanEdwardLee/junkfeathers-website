<?php
/**
 * Junkfeathers Machine child theme functions.
 *
 * Parent theme: GeneratePress
 * Version: 0.1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Load the child theme stylesheet.
 */
add_action( 'wp_enqueue_scripts', 'junkfeathers_machine_enqueue_styles', 20 );

function junkfeathers_machine_enqueue_styles() {
	wp_enqueue_style(
		'junkfeathers-machine-style',
		get_stylesheet_uri(),
		array(),
		wp_get_theme()->get( 'Version' )
	);
}
