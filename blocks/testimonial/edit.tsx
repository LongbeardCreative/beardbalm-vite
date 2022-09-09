/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
  RichText,
  MediaUpload,
  useBlockProps,
  ColorPalette,
  InspectorControls,
} from '@wordpress/block-editor';
import {
  // @ts-expect-error
  __experimentalBoxControl as BoxControl,
  // @ts-expect-error
  __experimentalToolsPanel as ToolsPanel,
  // @ts-expect-error
  __experimentalToolsPanelItem as ToolsPanelItem,
  // @ts-expect-error
  __experimentalUnitControl as UnitControl,
  // @ts-expect-error
  __experimentalDimensionControl as DimensionControl,
  Button,
} from '@wordpress/components';
import { BlockEditProps } from '@wordpress/blocks';
import { TestimonialAttributes } from './types';
import { DimensionPanel } from './DimensionPanel';
import { ColorPanel } from './ColorPanel';

const Edit: React.FunctionComponent<BlockEditProps<TestimonialAttributes>> = (
  props
) => {
  const {
    attributes: { quote, mediaID, mediaURL, authorName, authorByline, color },
    setAttributes,
  } = props;

  const blockProps = useBlockProps();

  const onChangeQuote: RichText.Props<'p'>['onChange'] = (value) => {
    setAttributes({ quote: value });
  };

  const onSelectImage: MediaUpload.Props<false>['onSelect'] = (media) => {
    setAttributes({
      mediaURL: media.url,
      mediaID: media.id,
    });
  };

  const onChangeAuthorName: RichText.Props<'span'>['onChange'] = (value) => {
    setAttributes({ authorName: value });
  };
  const onChangeAuthorByline: RichText.Props<'span'>['onChange'] = (value) => {
    setAttributes({ authorByline: value });
  };

  // const partialRight =
  //   (fn, ...partialArgs) =>
  //   (...args) =>
  //     fn(...args, ...partialArgs);

  // const updateSpacing = (dimension, size, device = '') => {
  //   setAttributes({
  //     [`${dimension}${device}`]: size,
  //   });
  // };

  return (
    <figure {...blockProps}>
      <InspectorControls key="setting">
        <ColorPanel
          color={color}
          setColor={(value?: string) => setAttributes({ color: value })}
        ></ColorPanel>
        {/* <DimensionPanel></DimensionPanel> */}
      </InspectorControls>
      <blockquote className="testimonial-header">
        <RichText
          tagName="p"
          placeholder={__('Write quote …', 'beardbalm')}
          value={quote}
          onChange={onChangeQuote}
          style={{ color }}
        />
      </blockquote>
      <figcaption className="testimonial-footer">
        <div className="testimonial-footer__left">
          <div className="testimonial-author-name">
            <RichText
              tagName="span"
              placeholder={__('Author name ...', 'beardbalm')}
              value={authorName}
              onChange={onChangeAuthorName}
            />
          </div>
          <div className="testimonial-author-byline">
            <RichText
              tagName="span"
              placeholder={__('Byline ...', 'beardbalm')}
              value={authorByline}
              onChange={onChangeAuthorByline}
            />
          </div>
        </div>
        <div className="testimonial-footer__right">
          <MediaUpload
            onSelect={onSelectImage}
            allowedTypes={['image']}
            value={mediaID}
            render={({ open }) => (
              <Button
                className={
                  mediaID ? 'testimonial-image-wrapper' : 'button button-large'
                }
                onClick={open}
              >
                {!mediaID ? (
                  __('Upload Image', 'beardbalm')
                ) : (
                  <img
                    src={mediaURL}
                    alt={__('Upload Recipe Image', 'beardbalm')}
                    className="testimonial-image"
                  />
                )}
              </Button>
            )}
          />
        </div>
      </figcaption>
    </figure>
  );
};

export default Edit;
