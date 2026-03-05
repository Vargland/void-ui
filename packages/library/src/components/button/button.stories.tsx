import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta = {
  title:     'Components/Button',
  component:  Button,
  tags:      [],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// ─── Base ─────────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: 'Button',
    variant:  'primary',
    size:     'md',
  },
}

// ─── Variants ────────────────────────────────────────────────────────────────

export const Primary: Story = {
  args: { children: 'Primary', variant: 'primary' },
}

export const Secondary: Story = {
  args: { children: 'Secondary', variant: 'secondary' },
}

export const Ghost: Story = {
  args: { children: 'Ghost', variant: 'ghost' },
}

export const Danger: Story = {
  args: { children: 'Delete', variant: 'danger' },
}

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

// ─── States ──────────────────────────────────────────────────────────────────

export const Loading: Story = {
  args: { children: 'Saving…', loading: true },
}

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
}

export const FullWidth: Story = {
  args:       { children: 'Full Width', fullWidth: true },
  parameters: { layout: 'padded' },
}

// ─── With Icons ──────────────────────────────────────────────────────────────

const PlusIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const WithIconBefore: Story = {
  args: { children: 'New item', iconBefore: <PlusIcon /> },
}

export const WithIconAfter: Story = {
  args: { children: 'Continue', iconAfter: <ArrowIcon /> },
}

// ─── All Variants grid ────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(['primary', 'secondary', 'ghost', 'danger'] as const).map(variant => (
        <div key={variant} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button variant={variant} size="sm">{variant} sm</Button>
          <Button variant={variant} size="md">{variant} md</Button>
          <Button variant={variant} size="lg">{variant} lg</Button>
          <Button variant={variant} disabled>disabled</Button>
          <Button variant={variant} loading>loading</Button>
        </div>
      ))}
    </div>
  ),
  parameters: { layout: 'padded' },
}
