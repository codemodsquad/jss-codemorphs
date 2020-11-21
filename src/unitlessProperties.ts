// copped from jss-plugin-default-unit
export default new Set([
  // Animation properties
  'animation-iteration-count',

  // Border Properties
  'border-image-outset',
  'border-image-slice',
  'border-image-width',

  // Mask properties
  'mask-border-outset',
  'mask-border-width',
  'mask-box-outset',
  'mask-box-width',

  // Flexbox properties
  'flex',
  'flex-grow',
  'flex-positive',
  'flex-shrink',
  'flex-negative',
  'order',

  // Column properties
  'column-count',

  // Font and text properties
  'font-size-adjust',
  'font-weight',
  'line-height',

  // Some random properties
  'counter-increment',
  'counter-reset',
  'opacity',
  'orphans',
  'nav-index',
  'tab-size',
  'widows',
  'z-index',
  'zoom',

  // CSS2 Screen reader
  'pitch-range',
  'richness',
  'speech-rate',
  'stress',
  'volume',

  // Grid properties
  'grid-row',
  'grid-column',

  // SVG properties
  'fill-opacity',
  'flood-opacity',
  'stop-opacity',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
  'shape-image-threshold',
]) as Set<string>
