import type { Meta, StoryObj } from '@storybook/react'
import { TextField } from './textfield'
import { Stack } from '../stack/stack'
import { Typography } from '../typography/typography'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'

const meta = {
  title:     'Components/TextField',
  component:  TextField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size:        { control: 'select', options: ['sm', 'md', 'lg'] },
    state:       { control: 'select', options: ['default', 'error', 'success', 'warning'] },
    label:       { control: 'text' },
    hint:        { control: 'text' },
    error:       { control: 'text' },
    placeholder: { control: 'text' },
    disabled:    { control: 'boolean' },
    fullWidth:   { control: 'boolean' },
    compact:     { control: 'boolean' },
    planet:      { control: 'select', options: ALL_CELESTIAL_BODIES },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default playground ───────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label:       'Email address',
    placeholder: 'you@example.com',
    hint:        'We will never share your email.',
    size:        'md',
    planet:      'mercury',
  },
  render: (args) => (
    <Stack data-void-planet={args.planet as string} style={{ width: '320px' }}>
      <TextField {...args} />
    </Stack>
  ),
}

// ─── Planet themes ────────────────────────────────────────────────────────────

export const PlanetThemes: Story = {
  render: () => (
    <Stack direction="column" gap={6} style={{ padding: '24px' }}>
      {ALL_CELESTIAL_BODIES.map(planet => (
        <Stack key={planet} direction="row" align="flex-start" gap={4} data-void-planet={planet}>
          {/* planet label */}
          <Typography
            size="xs"
            color="secondary"
            uppercase
            tracking="wide"
            style={{ width: '72px', flexShrink: 0, paddingTop: '22px' }}
          >
            {planet}
          </Typography>

          {/* default */}
          <TextField
            label="Default"
            placeholder="Placeholder"
            size="md"
            style={{ width: '180px' }}
          />

          {/* with hint */}
          <TextField
            label="Username"
            placeholder="void_user"
            hint="Choose a unique name"
            size="md"
            style={{ width: '200px' }}
          />

          {/* error */}
          <TextField
            label="Email"
            placeholder="you@example.com"
            error="This field is required"
            size="md"
            style={{ width: '180px' }}
          />

          {/* success */}
          <TextField
            label="Handle"
            placeholder="@void_user"
            state="success"
            hint="Available!"
            size="md"
            style={{ width: '180px' }}
          />
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}

// ─── Compact ──────────────────────────────────────────────────────────────────

export const Compact: Story = {
  render: () => (
    <Stack direction="column" gap={6} style={{ padding: '24px' }}>
      {ALL_CELESTIAL_BODIES.map(planet => (
        <Stack key={planet} direction="row" align="center" gap={4} data-void-planet={planet}>
          <Typography
            size="xs"
            color="secondary"
            uppercase
            tracking="wide"
            style={{ width: '72px', flexShrink: 0 }}
          >
            {planet}
          </Typography>

          <TextField compact placeholder="Default"          size="md" style={{ width: '160px' }} />
          <TextField compact placeholder="Error state"     size="md" error="Required"  style={{ width: '160px' }} />
          <TextField compact placeholder="Success state"   size="md" state="success"   style={{ width: '160px' }} />
          <TextField compact placeholder="Warning state"   size="md" state="warning"   style={{ width: '160px' }} />
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}
