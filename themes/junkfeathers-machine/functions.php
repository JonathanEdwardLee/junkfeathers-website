<?php
/**
 * Junkfeathers Machine child theme functions.
 *
 * Parent theme: GeneratePress
 * Version: 0.5.0
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

add_filter(
	'generate_copyright',
	'junkfeathers_machine_footer_copyright'
);

/**
 * Filter the GeneratePress footer copyright to display the custom Junkfeathers message.
 *
 * @since 0.2.0
 *
 * @return string The custom footer copyright HTML.
 */
function junkfeathers_machine_footer_copyright() {
	return sprintf(
		'© %s Junkfeathers. Pet the <a href="%s" target="_blank" rel="noopener noreferrer">SnorklePrawn</a>.',
		wp_date( 'Y' ),
		esc_url( 'https://snorkleprawn.com' )
	);
}
