<?php

/**
 * RELEVANSSI HELPER FUNCTIONS
 */

/**
 * Index strings from template files
 */

function lb_rlv_add_external_content($content, $post) {
  $template = get_post_meta($post->ID, '_wp_page_template', true);
  $file = locate_template($template);
  if (!$file) return $content;

  ob_start();
  include($template);
  $body = ob_get_clean();
  $body = wp_strip_all_tags($body);

  $content .= ' ' . $body;
  update_post_meta($post->ID, '_template_content_body', $body);
  return $content;
}
add_filter('relevanssi_content_to_index', 'lb_rlv_add_external_content', 10, 2);

function lb_rlv_excerpt_template_content($content, $post) {
  $content .= ' ' . get_post_meta($post->ID, '_template_content_body', true);
  return $content;
}

add_filter('relevanssi_excerpt_content', 'lb_rlv_excerpt_template_content', 10, 2);

/**
 * Relevanssi + REST API
 */
add_action('rest_api_init', 'relevanssi_rest_api_filter_add_filters');

// Add filter to posts
function relevanssi_rest_api_filter_add_filters() {

  // Register new route for search queries
  register_rest_route('relevanssi/v1', 'search', array(
    'methods'             => WP_REST_Server::READABLE,
    'callback'            => 'relevanssi_search_route_callback',
    'permission_callback' => '__return_true',
  ));
}

/**
 * Generate results for the /wp-json/relevanssi/v1/search route.
 *
 * @param WP_REST_Request $request Full details about the request.
 *
 * @return WP_REST_Response|WP_Error The response for the request.
 */
function relevanssi_search_route_callback(WP_REST_Request $request) {

  $parameters = $request->get_query_params();

  // Force the posts_per_page to be no more than 10
  if (isset($parameters['posts_per_page']) && ((int) $parameters['posts_per_page'] >= 1 && (int) $parameters['posts_per_page'] <= 10)) {
    $posts_per_page = intval($parameters['posts_per_page']);
  } else {
    $posts_per_page = 10;
  }

  // default search args
  $args = array(
    's'               =>  $parameters['search'],
    'posts_per_page'  =>  $posts_per_page,
  );

  // run query
  $search_query = new WP_Query();
  $search_query->parse_query($args);
  if (function_exists('relevanssi_do_query')) {
    relevanssi_do_query($search_query);
  }

  $controller = new WP_REST_Posts_Controller('post');
  $posts = array();

  while ($search_query->have_posts()) : $search_query->the_post();
    $data    = $controller->prepare_item_for_response($search_query->post, $request);
    $posts[] = $controller->prepare_response_for_collection($data);
  endwhile;

  // return results
  if (!empty($posts)) {
    return new WP_REST_Response($posts, 200);
  } else {
    // return new WP_Error('No results', 'Nothing found');
    return new WP_REST_Response([], 200);
  }
}
