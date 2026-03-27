import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from './modal'
import { Button } from '../button/button'
import { Stack } from '../stack/stack'
import { Typography } from '../typography/typography'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'
import type { ModalSize } from '../../typings/components/modal'

const meta = {
  title:     'Components/Modal',
  component:  Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
      description: 'Controls the max-width of the dialog',
    },
    planet: {
      control: 'select',
      options: ALL_CELESTIAL_BODIES,
      description: 'Override the planet theme for this component',
    },
    isOpen:               { control: 'boolean' },
    closeOnOverlayClick:  { control: 'boolean' },
    closeOnEscape:        { control: 'boolean' },
    title:                { control: 'text' },
    description:          { control: 'text' },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default playground ───────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false)

    return (
      <div data-void-planet={args.planet ?? 'mercury'}>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          title={args.title ?? 'Default Modal'}
          size={args.size ?? 'md'}
        >
          <Typography>
            This is the modal body. You can put any content here — forms, lists,
            rich text, or custom components.
          </Typography>
        </Modal>
      </div>
    )
  },
  args: {
    title:               'Default Modal',
    size:                'md',
    planet:              'mercury',
    closeOnOverlayClick: true,
    closeOnEscape:       true,
  },
}

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => {
    const sizes: ModalSize[] = ['sm', 'md', 'lg', 'full']
    const [activeSize, setActiveSize] = React.useState<ModalSize | null>(null)

    return (
      <Stack direction="row" gap={2} wrap data-void-planet="mercury">
        {sizes.map(size => (
          <Button key={size} variant="secondary" onClick={() => setActiveSize(size)}>
            Open {size}
          </Button>
        ))}

        {sizes.map(size => (
          <Modal
            key={size}
            isOpen={activeSize === size}
            onClose={() => setActiveSize(null)}
            title={`Size: ${size}`}
            size={size}
          >
            <Typography>
              This modal uses the <strong>{size}</strong> size preset.
              {size === 'sm' && ' Max-width: 400px.'}
              {size === 'md' && ' Max-width: 560px.'}
              {size === 'lg' && ' Max-width: 720px.'}
              {size === 'full' && ' Fills the entire viewport.'}
            </Typography>
          </Modal>
        ))}
      </Stack>
    )
  },
  parameters: { layout: 'padded' },
}

// ─── With footer ──────────────────────────────────────────────────────────────

export const WithFooter: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <div data-void-planet="mercury">
        <Button onClick={() => setOpen(true)}>Open with Footer</Button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Confirm action"
          size="md"
          footer={
            <Stack direction="row" gap={2}>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </Stack>
          }
        >
          <Typography>
            Are you sure you want to proceed? This action cannot be undone.
          </Typography>
        </Modal>
      </div>
    )
  },
  parameters: { layout: 'padded' },
}

// ─── With description ─────────────────────────────────────────────────────────

export const WithDescription: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <div data-void-planet="mercury">
        <Button onClick={() => setOpen(true)}>Open with Description</Button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Delete account"
          description="Permanently deletes your account and all associated data. This cannot be reversed."
          size="sm"
          footer={
            <Stack direction="row" gap={2}>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Delete account
              </Button>
            </Stack>
          }
        >
          <Typography>
            All your data — including projects, settings, and profile information —
            will be permanently removed. This action <strong>cannot be undone</strong>.
          </Typography>
        </Modal>
      </div>
    )
  },
  parameters: { layout: 'padded' },
}

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <Stack direction="column" gap={3} align="center" data-void-planet="mercury">
        <Typography size="sm" color="secondary">
          Modal is currently: <strong>{open ? 'open' : 'closed'}</strong>
        </Typography>

        <Stack direction="row" gap={2}>
          <Button variant="primary" onClick={() => setOpen(true)}>
            Open
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close programmatically
          </Button>
        </Stack>

        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Controlled Modal"
          size="md"
          footer={
            <Button variant="primary" onClick={() => setOpen(false)}>
              Done
            </Button>
          }
        >
          <Stack direction="column" gap={3}>
            <Typography>
              This modal is fully controlled by the parent component.
              You can close it via the X button, the overlay, the Escape key,
              or the button below.
            </Typography>
            <Typography size="sm" color="secondary">
              Use the "Close programmatically" button outside to close without
              interacting with the modal itself.
            </Typography>
          </Stack>
        </Modal>
      </Stack>
    )
  },
  parameters: { layout: 'padded' },
}

// ─── Planet themes ────────────────────────────────────────────────────────────

export const PlanetThemes: Story = {
  render: () => {
    const [activePlanet, setActivePlanet] = React.useState<string | null>(null)

    return (
      <Stack direction="column" gap={3} style={{ padding: '24px' }}>
        <Typography size="sm" color="secondary">
          Each button opens a modal wrapped in that planet's theme scope.
        </Typography>

        <Stack direction="row" gap={2} wrap>
          {ALL_CELESTIAL_BODIES.map(planet => (
            <span key={planet} data-void-planet={planet}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActivePlanet(planet)}
              >
                {planet}
              </Button>
            </span>
          ))}
        </Stack>

        {ALL_CELESTIAL_BODIES.map(planet => (
          <Modal
            key={planet}
            isOpen={activePlanet === planet}
            onClose={() => setActivePlanet(null)}
            title={`Planet: ${planet}`}
            planet={planet}
            size="sm"
            footer={
              <Button
                variant="primary"
                onClick={() => setActivePlanet(null)}
                planet={planet}
              >
                Close
              </Button>
            }
          >
            <Typography>
              This modal is themed with the <strong>{planet}</strong> planet tokens.
              The overlay, surface, borders and text all adapt to the planet's color palette.
            </Typography>
          </Modal>
        ))}
      </Stack>
    )
  },
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}
