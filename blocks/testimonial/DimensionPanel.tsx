/**
 * External dependencies
 */
// import styled from '@emotion/styled';

/**
 * WordPress dependencies
 */
import * as React from 'react';
import {
  __experimentalBoxControl as BoxControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem,
  __experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export function DimensionPanel() {
  const [height, setHeight] = React.useState();
  const [width, setWidth] = React.useState();
  const [padding, setPadding] = React.useState();
  const [margin, setMargin] = React.useState();

  const resetAll = () => {
    setHeight(undefined);
    setWidth(undefined);
    setPadding(undefined);
    setMargin(undefined);
  };

  return (
    <ToolsPanel label={__('Dimensions')} resetAll={resetAll}>
      <div style={{ gridColumn: 'span 2' }}>
        Select dimensions or spacing related settings from the menu for
        additional controls.
      </div>
      <ToolsPanelItem
        style={{ gridColumn: 'span 1' }}
        hasValue={() => !!height}
        label={__('Height')}
        onDeselect={() => setHeight(undefined)}
        isShownByDefault
      >
        <UnitControl label={__('Height')} onChange={setHeight} value={height} />
      </ToolsPanelItem>
      <ToolsPanelItem
        style={{ gridColumn: 'span 1' }}
        hasValue={() => !!width}
        label={__('Width')}
        onDeselect={() => setWidth(undefined)}
        isShownByDefault
      >
        <UnitControl label={__('Width')} onChange={setWidth} value={width} />
      </ToolsPanelItem>
      <ToolsPanelItem
        style={{ gridColumn: 'span 2' }}
        hasValue={() => !!padding}
        label={__('Padding')}
        onDeselect={() => setPadding(undefined)}
      >
        <BoxControl
          label={__('Padding')}
          onChange={setPadding}
          values={padding}
          allowReset={false}
        />
      </ToolsPanelItem>
      <ToolsPanelItem
        style={{ gridColumn: 'span 2' }}
        hasValue={() => !!margin}
        label={__('Margin')}
        onDeselect={() => setMargin(undefined)}
      >
        <BoxControl
          label={__('Margin')}
          onChange={setMargin}
          values={margin}
          allowReset={false}
        />
      </ToolsPanelItem>
    </ToolsPanel>
  );
}
