import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
import { Stack } from '../stack/stack'
import { Typography } from '../typography/typography'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title:     'Components/Tabs',
  component:  Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['line', 'solid'],
      description: 'Visual style of the tab strip',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the tab triggers',
    },
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled initial active tab',
    },
    planet: {
      control: 'select',
      options: ALL_CELESTIAL_BODIES,
      description: 'Override planet theme scope',
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Tabs defaultValue="overview" {...args}>
      <TabsList aria-label="Project tabs">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Typography>Project overview content goes here.</Typography>
      </TabsContent>
      <TabsContent value="activity">
        <Typography>Recent activity feed will appear here.</Typography>
      </TabsContent>
      <TabsContent value="settings">
        <Typography>Configure your project settings.</Typography>
      </TabsContent>
    </Tabs>
  ),
}

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <Stack direction="column" gap={8}>
      <Stack direction="column" gap={2}>
        <Typography size="xs" color="muted" uppercase tracking="wide">
          Line (default)
        </Typography>
        <Tabs defaultValue="tab1" variant="line">
          <TabsList aria-label="Line variant tabs">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1"><Typography>Content for Tab 1</Typography></TabsContent>
          <TabsContent value="tab2"><Typography>Content for Tab 2</Typography></TabsContent>
          <TabsContent value="tab3"><Typography>Content for Tab 3</Typography></TabsContent>
        </Tabs>
      </Stack>

      <Stack direction="column" gap={2}>
        <Typography size="xs" color="muted" uppercase tracking="wide">
          Solid
        </Typography>
        <Tabs defaultValue="tab1" variant="solid">
          <TabsList aria-label="Solid variant tabs">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1"><Typography>Content for Tab 1</Typography></TabsContent>
          <TabsContent value="tab2"><Typography>Content for Tab 2</Typography></TabsContent>
          <TabsContent value="tab3"><Typography>Content for Tab 3</Typography></TabsContent>
        </Tabs>
      </Stack>
    </Stack>
  ),
}

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <Stack direction="column" gap={8}>
      {(['sm', 'md', 'lg'] as const).map(size => (
        <Stack key={size} direction="column" gap={2}>
          <Typography size="xs" color="muted" uppercase tracking="wide">
            {size}
          </Typography>
          <Tabs defaultValue="a" size={size}>
            <TabsList aria-label={`${size} tabs`}>
              <TabsTrigger value="a">Alpha</TabsTrigger>
              <TabsTrigger value="b">Beta</TabsTrigger>
              <TabsTrigger value="c">Gamma</TabsTrigger>
            </TabsList>
            <TabsContent value="a"><Typography>Alpha content</Typography></TabsContent>
            <TabsContent value="b"><Typography>Beta content</Typography></TabsContent>
            <TabsContent value="c"><Typography>Gamma content</Typography></TabsContent>
          </Tabs>
        </Stack>
      ))}
    </Stack>
  ),
}

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [active, setActive] = React.useState('details')

    return (
      <Stack direction="column" gap={4}>
        <Tabs value={active} onChange={setActive}>
          <TabsList aria-label="Controlled tabs">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Typography>Product details content.</Typography>
          </TabsContent>
          <TabsContent value="specs">
            <Typography>Technical specifications.</Typography>
          </TabsContent>
          <TabsContent value="reviews">
            <Typography>Customer reviews.</Typography>
          </TabsContent>
        </Tabs>

        <Stack direction="row" gap={3}>
          {['details', 'specs', 'reviews'].map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              style={{
                padding:      '4px 12px',
                borderRadius: 'var(--void-radius-sm)',
                border:       '1px solid var(--void-color-border-default)',
                cursor:       'pointer',
                fontFamily:   'var(--void-font-family-sans)',
                fontSize:     'var(--void-font-size-sm)',
                background:   active === tab ? 'var(--void-color-action-primary-subtle)' : 'transparent',
                color:        active === tab ? 'var(--void-color-action-primary)' : 'var(--void-color-text-primary)',
              }}
            >
              {tab}
            </button>
          ))}
        </Stack>

        <Typography size="sm" color="muted">
          Active tab: <strong>{active}</strong>
        </Typography>
      </Stack>
    )
  },
}

// ─── With disabled tab ────────────────────────────────────────────────────────

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="active">
      <TabsList aria-label="Tabs with disabled state">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
        <TabsTrigger value="another">Another</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <Typography>This tab is enabled and active.</Typography>
      </TabsContent>
      <TabsContent value="disabled">
        <Typography>This content is unreachable via the disabled trigger.</Typography>
      </TabsContent>
      <TabsContent value="another">
        <Typography>Another enabled tab's content.</Typography>
      </TabsContent>
    </Tabs>
  ),
}

// ─── With icons ───────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 6.5L8 2l6 4.5V14a1 1 0 01-1 1H3a1 1 0 01-1-1V6.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2l1.8 3.6L14 6.3l-3 2.9.7 4.1L8 11.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2a4 4 0 00-4 4v3l-1.5 2h11L12 9V6a4 4 0 00-4-4zM6.5 13.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="home">
      <TabsList aria-label="Navigation tabs">
        <TabsTrigger value="home">
          <HomeIcon />
          Home
        </TabsTrigger>
        <TabsTrigger value="starred">
          <StarIcon />
          Starred
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <BellIcon />
          Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        <Typography>Home dashboard content.</Typography>
      </TabsContent>
      <TabsContent value="starred">
        <Typography>Your starred items.</Typography>
      </TabsContent>
      <TabsContent value="notifications">
        <Typography>Your notifications feed.</Typography>
      </TabsContent>
    </Tabs>
  ),
}

// ─── ManyTabs (overflow) ──────────────────────────────────────────────────────

export const ManyTabs: Story = {
  render: () => {
    const tabs = [
      'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon',
      'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
    ]

    return (
      <div style={{ maxWidth: 480 }}>
        <Tabs defaultValue="Alpha">
          <TabsList aria-label="Many tabs overflow example">
            {tabs.map(tab => (
              <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(tab => (
            <TabsContent key={tab} value={tab}>
              <Typography>Content for the {tab} tab.</Typography>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    )
  },
}

// ─── Planet themes ────────────────────────────────────────────────────────────

export const PlanetThemes: Story = {
  render: () => (
    <Stack direction="column" gap={6} style={{ padding: '24px' }}>
      {(['earth', 'mars', 'neptune', 'saturn', 'nostromo'] as const).map(planet => (
        <Stack
          key={planet}
          direction="column"
          gap={2}
          data-void-planet={planet}
          style={{
            padding:      '20px',
            background:   'var(--void-color-background-surface)',
            borderRadius: 'var(--void-radius-md)',
            border:       '1px solid var(--void-color-border-default)',
          }}
        >
          <Typography size="xs" color="secondary" uppercase tracking="wide">
            {planet}
          </Typography>
          <Tabs defaultValue="a">
            <TabsList aria-label={`${planet} themed tabs`}>
              <TabsTrigger value="a">Overview</TabsTrigger>
              <TabsTrigger value="b">Details</TabsTrigger>
              <TabsTrigger value="c">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="a"><Typography>Overview content</Typography></TabsContent>
            <TabsContent value="b"><Typography>Details content</Typography></TabsContent>
            <TabsContent value="c"><Typography>Settings content</Typography></TabsContent>
          </Tabs>
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}
