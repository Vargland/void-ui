import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Toast, ToastContainer } from './toast'
import { Stack } from '../stack/stack'
import { Button } from '../button/button'
import { Typography } from '../typography/typography'
import { useToast } from '../../hooks/use-toast'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'
import type { ToastPosition, ToastVariant } from '../../typings/components/toast'

const meta = {
  title:     'Components/Toast',
  component:  Toast,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control:     'select',
      options:     ['default', 'success', 'error', 'warning', 'info'],
      description: 'Semantic variant controlling color and icon',
    },
    duration: {
      control:     'number',
      description: 'Auto-dismiss delay in ms (0 = no auto-dismiss)',
    },
    title:       { control: 'text' },
    description: { control: 'text' },
    planet: {
      control:     'select',
      options:     ALL_CELESTIAL_BODIES,
      description: 'Override the planet theme for this component',
    },
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default playground ───────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    title:    'Notification',
    variant:  'default',
    duration: 0,
  },
  render: (args) => (
    <Stack style={{ padding: '24px', maxWidth: '420px' }}>
      <Toast {...args} />
    </Stack>
  ),
}

// ─── Variants ─────────────────────────────────────────────────────────────────

const ALL_VARIANTS: ToastVariant[] = ['default', 'success', 'error', 'warning', 'info']

export const Variants: Story = {
  render: () => (
    <Stack direction="column" gap={3} style={{ padding: '24px', maxWidth: '420px' }}>
      {ALL_VARIANTS.map(variant => (
        <Toast
          key={variant}
          variant={variant}
          title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} toast`}
          duration={0}
        />
      ))}
    </Stack>
  ),
}

// ─── With description ─────────────────────────────────────────────────────────

export const WithDescription: Story = {
  render: () => (
    <Stack direction="column" gap={3} style={{ padding: '24px', maxWidth: '420px' }}>
      <Toast
        variant="success"
        title="File saved"
        description="Your changes have been saved to the cloud."
        duration={0}
      />
      <Toast
        variant="error"
        title="Upload failed"
        description="The file size exceeds the 10 MB limit. Please compress and retry."
        duration={0}
      />
      <Toast
        variant="warning"
        title="Session expiring"
        description="Your session will expire in 5 minutes. Save your work."
        duration={0}
      />
      <Toast
        variant="info"
        title="New version available"
        description="Version 2.4.0 is available. Restart to apply the update."
        duration={0}
      />
    </Stack>
  ),
}

// ─── With action ──────────────────────────────────────────────────────────────

export const WithAction: Story = {
  render: () => (
    <Stack direction="column" gap={3} style={{ padding: '24px', maxWidth: '420px' }}>
      <Toast
        variant="default"
        title="Message deleted"
        description="The message has been moved to trash."
        duration={0}
        action={{ label: 'Undo', onClick: () => alert('Undone!') }}
      />
      <Toast
        variant="error"
        title="Connection lost"
        description="Unable to reach the server."
        duration={0}
        action={{ label: 'Retry', onClick: () => alert('Retrying...') }}
      />
    </Stack>
  ),
}

// ─── Auto-dismiss ─────────────────────────────────────────────────────────────

export const AutoDismiss: Story = {
  render: () => {
    const [visible, setVisible] = React.useState(true)

    return (
      <Stack direction="column" gap={4} style={{ padding: '24px', maxWidth: '420px' }}>
        <Typography size="sm" color="secondary">
          This toast auto-dismisses after 4 seconds.
        </Typography>
        {visible && (
          <Toast
            variant="info"
            title="Auto-dismissing"
            description="This notification will disappear on its own."
            duration={4000}
            onClose={() => setVisible(false)}
          />
        )}
        {!visible && (
          <Button variant="secondary" onClick={() => setVisible(true)}>
            Show again
          </Button>
        )}
      </Stack>
    )
  },
}

// ─── All positions ────────────────────────────────────────────────────────────

const ALL_POSITIONS: ToastPosition[] = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
  'top-center',
  'bottom-center',
]

export const AllPositions: Story = {
  render: () => {
    const [active, setActive] = React.useState<ToastPosition | null>(null)

    return (
      <Stack direction="column" gap={3} align="center" style={{ padding: '24px' }}>
        <Typography size="sm" color="secondary">
          Click a button to preview a toast at that position.
        </Typography>

        <Stack direction="row" gap={2} style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {ALL_POSITIONS.map(pos => (
            <Button
              key={pos}
              variant="secondary"
              size="sm"
              onClick={() => setActive(pos)}
            >
              {pos}
            </Button>
          ))}
        </Stack>

        {active && (
          <ToastContainer
            toasts={[{
              id:       'preview',
              title:    `Position: ${active}`,
              description: 'Toast positioned here.',
              variant:  'info',
              duration: 0,
            }]}
            onDismiss={() => setActive(null)}
            position={active}
          />
        )}
      </Stack>
    )
  },
  parameters: { layout: 'fullscreen' },
}

// ─── Live demo (useToast) ─────────────────────────────────────────────────────

export const LiveDemo: Story = {
  render: () => {
    const { toasts, toast, dismiss, dismissAll } = useToast()

    return (
      <Stack direction="column" gap={4} style={{ padding: '24px' }}>
        <Typography variant="heading" size="lg">
          useToast live demo
        </Typography>

        <Stack direction="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => toast('Notification', { description: 'Default message.' })}
          >
            Default
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => toast.success('Saved!', { description: 'Your changes were saved.' })}
          >
            Success
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => toast.error('Error', { description: 'Something went wrong.' })}
          >
            Error
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast.warning('Warning', {
                description: 'Proceed with caution.',
                duration:    8000,
              })
            }
          >
            Warning
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast.info('Did you know?', {
                description: 'void-ui supports 11 planets.',
                action: { label: 'Learn more', onClick: () => alert('Docs!') },
              })
            }
          >
            Info + action
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast('Persistent', {
                description: 'This will not auto-dismiss.',
                duration:    0,
              })
            }
          >
            No auto-dismiss
          </Button>
        </Stack>

        {toasts.length > 0 && (
          <Button variant="ghost" size="sm" onClick={dismissAll}>
            Dismiss all ({toasts.length})
          </Button>
        )}

        <ToastContainer
          toasts={toasts}
          onDismiss={dismiss}
          position="bottom-right"
        />
      </Stack>
    )
  },
  parameters: { layout: 'fullscreen' },
}

// ─── Planet themes ────────────────────────────────────────────────────────────

export const PlanetThemes: Story = {
  render: () => (
    <Stack direction="column" gap={3} style={{ padding: '24px' }}>
      {ALL_CELESTIAL_BODIES.map(planet => (
        <Stack
          key={planet}
          direction="row"
          align="center"
          gap={2}
          data-void-planet={planet}
          style={{
            padding:      '12px 20px',
            background:   'var(--void-color-background-surface)',
            borderRadius: 'var(--void-radius-md)',
            border:       '1px solid var(--void-color-border-default)',
            flexWrap:     'nowrap',
          }}
        >
          <Typography
            size="xs"
            color="secondary"
            uppercase
            tracking="wide"
            style={{ width: '72px', flexShrink: 0 }}
          >
            {planet}
          </Typography>

          {ALL_VARIANTS.map(variant => (
            <Toast
              key={variant}
              variant={variant}
              title={variant.charAt(0).toUpperCase() + variant.slice(1)}
              duration={0}
              style={{ minWidth: 0, maxWidth: '180px' }}
            />
          ))}
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}
