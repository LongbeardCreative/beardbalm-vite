<?php

/**
 * LB - Custom Post Types
 *
 * Houses all the CPTs for this project. Includes a starter template to work off.
 *
 *
 * @package WordPress
 * @subpackage beardbalm
 * @since Beard Balm 1.0.0
 * @author Longbeard
 * @url https://www.longbeard.com/
 */

function custom_post_type() {

  $labels = array(
    'name'                  => _x('Staff', 'Post Type General Name', 'beardbalm'),
    'singular_name'         => _x('Staff', 'Post Type Singular Name', 'beardbalm'),
    'menu_name'             => __('Staff', 'beardbalm'),
    'name_admin_bar'        => __('Staff', 'beardbalm'),
    'archives'              => __('Staff Archives', 'beardbalm'),
    'attributes'            => __('Staff Attributes', 'beardbalm'),
    'parent_item_colon'     => __('Parent Staff:', 'beardbalm'),
    'all_items'             => __('All Staff', 'beardbalm'),
    'add_new_item'          => __('Add New Staff', 'beardbalm'),
    'add_new'               => __('Add New', 'beardbalm'),
    'new_item'              => __('New Staff', 'beardbalm'),
    'edit_item'             => __('Edit Staff', 'beardbalm'),
    'update_item'           => __('Update Staff', 'beardbalm'),
    'view_item'             => __('View Staff', 'beardbalm'),
    'view_items'            => __('View Staff', 'beardbalm'),
    'search_items'          => __('Search Staff', 'beardbalm'),
    'not_found'             => __('Not found', 'beardbalm'),
    'not_found_in_trash'    => __('Not found in Trash', 'beardbalm'),
    'featured_image'        => __('Featured Image', 'beardbalm'),
    'set_featured_image'    => __('Set featured image', 'beardbalm'),
    'remove_featured_image' => __('Remove featured image', 'beardbalm'),
    'use_featured_image'    => __('Use as featured image', 'beardbalm'),
    'insert_into_item'      => __('Insert into Staff', 'beardbalm'),
    'uploaded_to_this_item' => __('Uploaded to this Staff', 'beardbalm'),
    'items_list'            => __('Staff list', 'beardbalm'),
    'items_list_navigation' => __('Staff list navigation', 'beardbalm'),
    'filter_items_list'     => __('Filter Staff list', 'beardbalm'),
  );
  $args = array(
    'label'                 => __('Staff', 'beardbalm'),
    'description'           => __('Staff part of The Website'),
    'labels'                => $labels,
    'supports'              => array('title', 'editor', 'thumbnail', 'custom-fields'),
    'taxonomies'            => array('region'),
    'hierarchical'          => false,
    'public'                => true,
    'show_ui'               => true,
    'show_in_menu'          => true,
    'menu_position'         => 1,
    'menu_icon'             => 'dashicons-admin-users',
    'show_in_admin_bar'     => true,
    'show_in_nav_menus'     => true,
    'can_export'            => true,
    'has_archive'           => true,
    'exclude_from_search'   => false,
    'publicly_queryable'    => true,
    'capability_type'       => 'page',
  );
  register_post_type('staff', $args);
}
// add_action( 'init', 'custom_post_type', 0 );
