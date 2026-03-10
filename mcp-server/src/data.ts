import type { ComponentMeta, TokenMeta } from './types.js'

// ─── Components ───────────────────────────────────────────────────────────────

export const COMPONENTS_DATA: ComponentMeta[] = [
  {
    name: 'Button',
    description: 'Triggers an action or event. Supports multiple variants, sizes, loading state and icon slots.',
    props: [
      { name: 'variant',    type: "'primary' | 'secondary' | 'ghost' | 'outlined' | 'danger'", required: false, default: 'primary',     description: 'Visual style of the button' },
      { name: 'size',       type: "'sm' | 'md' | 'lg'",                                         required: false, default: 'md',           description: 'Size of the button' },
      { name: 'children',   type: 'ReactNode',                                                   required: true,                          description: 'Content inside the button' },
      { name: 'fullWidth',  type: 'boolean',                                                     required: false, default: 'false',        description: 'Renders a full-width block button' },
      { name: 'loading',    type: 'boolean',                                                     required: false, default: 'false',        description: 'Shows a loading spinner and disables interaction' },
      { name: 'iconBefore', type: 'ReactNode',                                                   required: false,                         description: 'Icon placed before the label' },
      { name: 'iconAfter',  type: 'ReactNode',                                                   required: false,                         description: 'Icon placed after the label' },
      { name: 'as',         type: 'React.ElementType',                                           required: false, default: "'button'",     description: 'Renders as a different HTML element or component' },
    ],
    variants: ['primary', 'secondary', 'ghost', 'outlined', 'danger'],
    examples: [
      { title: 'Basic',      code: '<Button>Click me</Button>' },
      { title: 'Variants',   code: `<Button variant="primary">Primary</Button>\n<Button variant="secondary">Secondary</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="outlined">Outlined</Button>\n<Button variant="danger">Danger</Button>` },
      { title: 'Sizes',      code: `<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="lg">Large</Button>` },
      { title: 'Loading',    code: '<Button loading>Saving…</Button>' },
      { title: 'Full width', code: '<Button fullWidth>Submit</Button>' },
      { title: 'As link',    code: '<Button as="a" href="/dashboard">Go to dashboard</Button>' },
    ],
  },
  {
    name: 'Badge',
    description: 'Small label for status, counts or metadata. Supports solid, subtle and outlined variants with semantic tones.',
    props: [
      { name: 'children', type: 'ReactNode',                                              required: true,                   description: 'Content inside the badge' },
      { name: 'variant',  type: "'solid' | 'subtle' | 'outlined'",                       required: false, default: 'subtle', description: 'Visual style' },
      { name: 'size',     type: "'sm' | 'md'",                                            required: false, default: 'md',    description: 'Size of the badge' },
      { name: 'tone',     type: "'default' | 'success' | 'warning' | 'error' | 'info'",  required: false, default: 'default', description: 'Semantic color tone' },
      { name: 'dot',      type: 'boolean',                                                required: false, default: 'false', description: 'Shows a small dot instead of content' },
    ],
    variants: ['solid', 'subtle', 'outlined'],
    examples: [
      { title: 'Basic',   code: '<Badge>New</Badge>' },
      { title: 'Tones',   code: `<Badge tone="success">Active</Badge>\n<Badge tone="error">Failed</Badge>\n<Badge tone="warning">Pending</Badge>\n<Badge tone="info">Info</Badge>` },
      { title: 'Dot',     code: '<Badge dot tone="success" />' },
      { title: 'Solid',   code: '<Badge variant="solid" tone="error">3</Badge>' },
    ],
  },
  {
    name: 'Avatar',
    description: 'Displays a user image, initials fallback or generic placeholder. Supports size, shape and presence status.',
    props: [
      { name: 'src',      type: 'string',                               required: false,              description: 'Image source URL' },
      { name: 'alt',      type: 'string',                               required: false,              description: 'Alt text for the image' },
      { name: 'initials', type: 'string',                               required: false,              description: 'Fallback initials (max 2 chars)' },
      { name: 'size',     type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",   required: false, default: 'md',     description: 'Size of the avatar' },
      { name: 'shape',    type: "'circle' | 'square'",                  required: false, default: 'circle', description: 'Shape of the avatar' },
      { name: 'status',   type: "'online' | 'offline' | 'busy' | 'away'", required: false,           description: 'Presence status indicator' },
    ],
    examples: [
      { title: 'With image',    code: '<Avatar src="/avatar.jpg" alt="John Doe" />' },
      { title: 'Initials',      code: '<Avatar initials="GR" />' },
      { title: 'With status',   code: '<Avatar initials="GR" status="online" />' },
      { title: 'Square large',  code: '<Avatar src="/avatar.jpg" shape="square" size="lg" />' },
    ],
  },
  {
    name: 'Typography',
    description: 'Renders text with design-system scale for size, weight, color and spacing. Polymorphic — renders as any HTML element.',
    props: [
      { name: 'as',       type: "'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'p'|'span'|'label'|'legend'|'figcaption'", required: false, default: 'p', description: 'HTML element to render as' },
      { name: 'size',     type: "'xs'|'sm'|'base'|'md'|'lg'|'xl'|'2xl'|'3xl'|'4xl'",                       required: false, default: 'base', description: 'Font size token' },
      { name: 'color',    type: "'primary'|'secondary'|'muted'|'disabled'|'inverse'|'accent'",              required: false, default: 'primary', description: 'Semantic text color' },
      { name: 'weight',   type: "'regular'|'medium'|'semibold'|'bold'",                                     required: false, default: 'regular', description: 'Font weight' },
      { name: 'leading',  type: "'none'|'tight'|'snug'|'normal'|'relaxed'",                                 required: false, default: 'normal', description: 'Line height' },
      { name: 'tracking', type: "'tighter'|'tight'|'normal'|'wide'|'wider'|'widest'",                       required: false, default: 'normal', description: 'Letter spacing' },
      { name: 'truncate', type: 'boolean',                                                                   required: false, default: 'false', description: 'Truncate with ellipsis on overflow' },
      { name: 'uppercase',type: 'boolean',                                                                   required: false, default: 'false', description: 'Uppercase transform' },
      { name: 'mono',     type: 'boolean',                                                                   required: false, default: 'false', description: 'Monospace font family' },
    ],
    examples: [
      { title: 'Heading',    code: '<Typography as="h1" size="3xl" weight="bold">Page Title</Typography>' },
      { title: 'Muted',      code: '<Typography color="muted" size="sm">Last updated 2 days ago</Typography>' },
      { title: 'Accent',     code: '<Typography color="accent" weight="semibold">New feature</Typography>' },
      { title: 'Truncate',   code: '<Typography truncate>Very long text that will be cut off…</Typography>' },
      { title: 'Mono',       code: '<Typography mono size="sm">npm install @open-void-ui/library</Typography>' },
    ],
  },
  {
    name: 'Divider',
    description: 'Horizontal or vertical separator line. Supports variants and an optional label.',
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'",    required: false, default: 'horizontal', description: 'Direction of the divider' },
      { name: 'variant',     type: "'solid' | 'dashed' | 'dotted'", required: false, default: 'solid',      description: 'Line style' },
      { name: 'label',       type: 'ReactNode',                     required: false,                        description: 'Optional label rendered inside the divider' },
      { name: 'labelAlign',  type: "'start' | 'center' | 'end'",   required: false, default: 'center',     description: 'Alignment of the label' },
      { name: 'flush',       type: 'boolean',                       required: false, default: 'false',      description: 'Removes gap — renders a continuous line' },
    ],
    examples: [
      { title: 'Basic',      code: '<Divider />' },
      { title: 'With label', code: '<Divider label="Or continue with" />' },
      { title: 'Dashed',     code: '<Divider variant="dashed" />' },
      { title: 'Vertical',   code: '<Divider orientation="vertical" />' },
    ],
  },
  {
    name: 'Spinner',
    description: 'Animated loading indicator. Supports ring, dots and pulse variants at five sizes.',
    props: [
      { name: 'variant', type: "'ring' | 'dots' | 'pulse'",        required: false, default: 'ring', description: 'Visual style of the spinner' },
      { name: 'size',    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", required: false, default: 'md',  description: 'Size of the spinner' },
      { name: 'label',   type: 'string',                            required: false,                 description: 'Accessible label (screen-reader only)' },
    ],
    examples: [
      { title: 'Basic',   code: '<Spinner />' },
      { title: 'Large',   code: '<Spinner size="lg" />' },
      { title: 'Dots',    code: '<Spinner variant="dots" />' },
      { title: 'Labeled', code: '<Spinner label="Loading content…" />' },
    ],
  },
  {
    name: 'TextField',
    description: 'Text input with label, hint, error and icon prefix/suffix slots. Supports three sizes and four validation states.',
    props: [
      { name: 'size',      type: "'sm' | 'md' | 'lg'",                             required: false, default: 'md',      description: 'Size of the text field' },
      { name: 'state',     type: "'default' | 'error' | 'success' | 'warning'",    required: false, default: 'default', description: 'Validation state' },
      { name: 'label',     type: 'string',                                          required: false,                    description: 'Label shown above the field' },
      { name: 'hint',      type: 'string',                                          required: false,                    description: 'Helper text shown below the field' },
      { name: 'error',     type: 'string',                                          required: false,                    description: 'Error message — also sets state to "error"' },
      { name: 'prefix',    type: 'ReactNode',                                       required: false,                    description: 'Icon or element prepended inside the field' },
      { name: 'suffix',    type: 'ReactNode',                                       required: false,                    description: 'Icon or element appended inside the field' },
      { name: 'fullWidth', type: 'boolean',                                         required: false, default: 'false',  description: 'Makes the field fill its container width' },
      { name: 'compact',   type: 'boolean',                                         required: false, default: 'false',  description: 'Hides label and hint — only the field is rendered' },
    ],
    examples: [
      { title: 'Basic',      code: '<TextField label="Email" placeholder="you@example.com" />' },
      { title: 'Error',      code: '<TextField label="Email" error="Invalid email address" />' },
      { title: 'With prefix',code: '<TextField label="Search" prefix={<SearchIcon />} />' },
      { title: 'Full width', code: '<TextField label="Name" fullWidth />' },
    ],
  },
  {
    name: 'Stack',
    description: 'Flexbox layout primitive. Controls direction, gap, alignment and justification using design-system tokens.',
    props: [
      { name: 'as',        type: 'ElementType',                                                                                       required: false, default: 'div',    description: 'HTML element to render as' },
      { name: 'direction', type: "'row' | 'column' | 'row-reverse' | 'column-reverse'",                                              required: false, default: 'column', description: 'Flex direction' },
      { name: 'gap',       type: '0|1|2|3|4|5|6|8|10|12|16|20|24',                                                                  required: false, default: '0',      description: 'Gap between children (maps to --void-space-* tokens)' },
      { name: 'align',     type: "'normal'|'start'|'end'|'center'|'baseline'|'stretch'",                                             required: false, default: 'normal', description: 'align-items' },
      { name: 'justify',   type: "'normal'|'start'|'end'|'center'|'space-between'|'space-around'|'space-evenly'|'stretch'",          required: false, default: 'normal', description: 'justify-content' },
      { name: 'wrap',      type: 'boolean',                                                                                           required: false, default: 'false',  description: 'flex-wrap' },
      { name: 'full',      type: 'boolean',                                                                                           required: false, default: 'false',  description: 'Makes the stack take full width/height' },
    ],
    examples: [
      { title: 'Row',           code: '<Stack direction="row" gap={4}>\n  <Button>One</Button>\n  <Button>Two</Button>\n</Stack>' },
      { title: 'Column center', code: '<Stack gap={2} align="center">\n  <Typography>Title</Typography>\n  <Typography color="muted">Subtitle</Typography>\n</Stack>' },
      { title: 'Full width',    code: '<Stack direction="row" justify="space-between" full>\n  <Typography>Left</Typography>\n  <Typography>Right</Typography>\n</Stack>' },
    ],
  },
]

// ─── Tokens ───────────────────────────────────────────────────────────────────

export const TOKENS_DATA: TokenMeta[] = [
  // Colors — action
  { name: '--void-color-action-primary',        value: '#6666ff', category: 'color/action',     description: 'Primary action color (buttons, links)' },
  { name: '--void-color-action-primary-hover',  value: '#8888ff', category: 'color/action',     description: 'Hover state for primary actions' },
  { name: '--void-color-action-primary-active', value: '#4444dd', category: 'color/action',     description: 'Active/pressed state for primary actions' },
  { name: '--void-color-action-secondary',      value: '#2e2e2e', category: 'color/action',     description: 'Secondary action background' },
  // Colors — background
  { name: '--void-color-background-base',       value: '#0a0a0a', category: 'color/background', description: 'Page background' },
  { name: '--void-color-background-surface',    value: '#1a1a1a', category: 'color/background', description: 'Card/panel surface' },
  { name: '--void-color-background-overlay',    value: '#242424', category: 'color/background', description: 'Dropdown/modal overlay' },
  // Colors — border
  { name: '--void-color-border-default',        value: '#2e2e2e', category: 'color/border',     description: 'Default border' },
  { name: '--void-color-border-strong',         value: '#3d3d3d', category: 'color/border',     description: 'Prominent border' },
  { name: '--void-color-border-focus',          value: '#6666ff', category: 'color/border',     description: 'Focus ring color' },
  // Colors — text
  { name: '--void-color-text-primary',          value: '#f5f5f5', category: 'color/text',       description: 'Primary text' },
  { name: '--void-color-text-secondary',        value: '#a3a3a3', category: 'color/text',       description: 'Secondary text' },
  { name: '--void-color-text-muted',            value: '#737373', category: 'color/text',       description: 'Muted/placeholder text' },
  { name: '--void-color-text-disabled',         value: '#525252', category: 'color/text',       description: 'Disabled text' },
  { name: '--void-color-text-inverse',          value: '#0a0a0a', category: 'color/text',       description: 'Text on colored backgrounds' },
  { name: '--void-color-text-accent',           value: '#6666ff', category: 'color/text',       description: 'Accent/link text color' },
  // Colors — status
  { name: '--void-color-status-success',        value: '#22c55e', category: 'color/status',     description: 'Success state' },
  { name: '--void-color-status-warning',        value: '#f59e0b', category: 'color/status',     description: 'Warning state' },
  { name: '--void-color-status-error',          value: '#ef4444', category: 'color/status',     description: 'Error state' },
  // Radius
  { name: '--void-radius-none',  value: '0px',    category: 'radius', description: 'No border radius' },
  { name: '--void-radius-sm',    value: '2px',    category: 'radius', description: 'Small radius' },
  { name: '--void-radius-md',    value: '4px',    category: 'radius', description: 'Medium radius — buttons, inputs' },
  { name: '--void-radius-lg',    value: '8px',    category: 'radius', description: 'Large radius — cards' },
  { name: '--void-radius-xl',    value: '12px',   category: 'radius', description: 'Extra large radius — modals' },
  { name: '--void-radius-full',  value: '9999px', category: 'radius', description: 'Pill / circle' },
  // Spacing
  { name: '--void-space-1',  value: '4px',  category: 'spacing', description: '4px' },
  { name: '--void-space-2',  value: '8px',  category: 'spacing', description: '8px' },
  { name: '--void-space-3',  value: '12px', category: 'spacing', description: '12px' },
  { name: '--void-space-4',  value: '16px', category: 'spacing', description: '16px' },
  { name: '--void-space-6',  value: '24px', category: 'spacing', description: '24px' },
  { name: '--void-space-8',  value: '32px', category: 'spacing', description: '32px' },
  // Font sizes
  { name: '--void-font-size-xs',   value: '11px', category: 'typography', description: 'Extra small' },
  { name: '--void-font-size-sm',   value: '13px', category: 'typography', description: 'Small' },
  { name: '--void-font-size-base', value: '14px', category: 'typography', description: 'Base — default body text' },
  { name: '--void-font-size-md',   value: '16px', category: 'typography', description: 'Medium' },
  { name: '--void-font-size-lg',   value: '18px', category: 'typography', description: 'Large' },
  { name: '--void-font-size-xl',   value: '20px', category: 'typography', description: 'Extra large' },
  { name: '--void-font-size-2xl',  value: '24px', category: 'typography', description: '2xl' },
  { name: '--void-font-size-3xl',  value: '30px', category: 'typography', description: '3xl' },
  { name: '--void-font-size-4xl',  value: '36px', category: 'typography', description: '4xl' },
]
