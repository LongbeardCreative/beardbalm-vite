/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { BlockSaveProps } from '@wordpress/blocks';
import { TestimonialAttributes } from './types';

const Save: React.FunctionComponent<BlockSaveProps<TestimonialAttributes>> = (
  props
) => {
  const {
    attributes: { quote, mediaURL, authorName, authorByline, color },
  } = props;

  const blockProps = useBlockProps.save();

  return (
    <figure {...blockProps}>
      <blockquote className="testimonial-header">
        <RichText.Content tagName="p" value={quote} style={{ color }} />
      </blockquote>
      <figcaption className="testimonial-footer">
        <div className="testimonial-footer__left">
          <div className="testimonial-author-name">
            <RichText.Content tagName="span" value={authorName} />
          </div>
          <div className="testimonial-author-byline">
            <RichText.Content tagName="span" value={authorByline} />
          </div>
        </div>
        <div className="testimonial-footer__right">
          {mediaURL && (
            <div className="testimonial-image-wrapper">
              <img
                src={mediaURL}
                alt={__('Recipe Image', 'beardbalm')}
                className="testimonial-image"
              />
            </div>
          )}
        </div>
      </figcaption>
    </figure>
  );
};

export default Save;
