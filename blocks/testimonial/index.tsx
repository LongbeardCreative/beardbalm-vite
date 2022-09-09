/**
 * WordPress dependencies
 */
import { Block, BlockIcon, registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import * as json from './block.json';
import Edit from './edit';
import Save from './save';

import './style.scss';
import './editor.scss';
import { TestimonialAttributes } from './types';

const { name, title, category, attributes, icon, ...rest } = json;

// Register the block
registerBlockType(name, {
  edit: Edit,
  save: Save,
  title,
  category,
  attributes: attributes as Block<TestimonialAttributes>['attributes'],
  icon: icon as BlockIcon,
  ...rest,
});
