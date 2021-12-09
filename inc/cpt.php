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
// Register Custom Post Type
function staff() {

    $labels = array(
        'name'                  => _x( 'Staff', 'Post Type General Name', 'website' ),
        'singular_name'         => _x( 'Staff', 'Post Type Singular Name', 'website' ),
        'menu_name'             => __( 'Staff', 'website' ),
        'name_admin_bar'        => __( 'Staff', 'website' ),
        'archives'              => __( 'Staff Archives', 'website' ),
        'attributes'            => __( 'Staff Attributes', 'website' ),
        'parent_item_colon'     => __( 'Parent Staff:', 'website' ),
        'all_items'             => __( 'All Staff', 'website' ),
        'add_new_item'          => __( 'Add New Staff', 'website' ),
        'add_new'               => __( 'Add New', 'website' ),
        'new_item'              => __( 'New Staff', 'website' ),
        'edit_item'             => __( 'Edit Staff', 'website' ),
        'update_item'           => __( 'Update Staff', 'website' ),
        'view_item'             => __( 'View Staff', 'website' ),
        'view_items'            => __( 'View Staff', 'website' ),
        'search_items'          => __( 'Search Staff', 'website' ),
        'not_found'             => __( 'Not found', 'website' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'website' ),
        'featured_image'        => __( 'Featured Image', 'website' ),
        'set_featured_image'    => __( 'Set featured image', 'website' ),
        'remove_featured_image' => __( 'Remove featured image', 'website' ),
        'use_featured_image'    => __( 'Use as featured image', 'website' ),
        'insert_into_item'      => __( 'Insert into Staff', 'website' ),
        'uploaded_to_this_item' => __( 'Uploaded to this Staff', 'website' ),
        'items_list'            => __( 'Staff list', 'website' ),
        'items_list_navigation' => __( 'Staff list navigation', 'website' ),
        'filter_items_list'     => __( 'Filter Staff list', 'website' ),
    );
    $args = array(
        'label'                 => __( 'Staff', 'website' ),
        'description'           => __( 'Staff part of The Website' ),
        'labels'                => $labels,
        'supports'              => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
        'taxonomies'            => array( 'region' ),
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
    register_post_type( 'staff', $args );

}
// add_action( 'init', 'staff', 0 );
 