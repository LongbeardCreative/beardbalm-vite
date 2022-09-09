/**
 * External dependencies
 */
// import styled from '@emotion/styled';

/**
 * WordPress dependencies
 */
import {
  ColorPalette,
  // @ts-ignore
  __experimentalToolsPanel as ToolsPanel,
  // @ts-ignore
  __experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export function ColorPanel({
  color,
  setColor,
}: {
  color?: string;
  setColor: (v?: string) => void;
}) {
  const resetAll = () => {
    setColor(undefined);
  };

  return (
    <ToolsPanel label={__('Text Color', 'beardbalm')} resetAll={resetAll}>
      <div style={{ gridColumn: 'span 2' }}>
        <p>Adjust quote text color.</p>
      </div>
      <ToolsPanelItem
        style={{ gridColumn: 'span 2' }}
        hasValue={() => !!color}
        label={__('Color')}
        onDeselect={() => setColor(undefined)}
        isShownByDefault
      >
        <ColorPalette
          colors={[
            { name: 'red', color: '#f00' },
            { name: 'white', color: '#fff' },
            { name: 'blue', color: '#00f' },
            { name: 'black', color: '#000' },
          ]}
          value={color}
          onChange={(hexColor) => {
            setColor(hexColor);
          }}
        />
      </ToolsPanelItem>
    </ToolsPanel>
  );
}
