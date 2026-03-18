import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Table, TableHead, TableBody, TableFooter, TableRow, TableHeader, TableCell } from './table'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'

// ─── Sample data ──────────────────────────────────────────────────────────────

interface Astronaut {
  id:        number
  name:      string
  planet:    string
  missions:  number
  status:    string
  distance:  number
}

const ASTRONAUTS: Astronaut[] = [
  { id: 1, name: 'Alice Vance',    planet: 'Earth',   missions: 12, status: 'Active',   distance: 384400 },
  { id: 2, name: 'Bob Meridian',   planet: 'Mars',    missions: 4,  status: 'Active',   distance: 78340000 },
  { id: 3, name: 'Carol Stardust', planet: 'Europa',  missions: 7,  status: 'Inactive', distance: 628300000 },
  { id: 4, name: 'Dave Nostromo',  planet: 'Saturn',  missions: 3,  status: 'Active',   distance: 1200000000 },
  { id: 5, name: 'Eve Horizons',   planet: 'Neptune', missions: 1,  status: 'Training', distance: 4500000000 },
]

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title:     'Components/Table',
  component:  Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'striped', 'bordered'],
      description: 'Visual variant of the table',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls cell padding and font size',
    },
    planet: {
      control: 'select',
      options: ALL_CELESTIAL_BODIES,
      description: 'Override the planet theme for this component',
    },
    stickyHeader: { control: 'boolean' },
    hoverable:    { control: 'boolean' },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Planet</TableHeader>
          <TableHeader>Missions</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {ASTRONAUTS.map(row => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.planet}</TableCell>
            <TableCell numeric>{row.missions}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  args: {
    variant:  'default',
    size:     'md',
  },
}

// ─── Striped ──────────────────────────────────────────────────────────────────

export const Striped: Story = {
  render: () => (
    <Table variant="striped">
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Planet</TableHeader>
          <TableHeader>Missions</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {ASTRONAUTS.map(row => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.planet}</TableCell>
            <TableCell numeric>{row.missions}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

// ─── Bordered ─────────────────────────────────────────────────────────────────

export const Bordered: Story = {
  render: () => (
    <Table variant="bordered">
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Planet</TableHeader>
          <TableHeader>Missions</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {ASTRONAUTS.map(row => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.planet}</TableCell>
            <TableCell numeric>{row.missions}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

// ─── With sorting ─────────────────────────────────────────────────────────────

export const WithSorting: Story = {
  render: () => {
    const [sortField, setSortField]  = useState<'name' | 'missions' | 'distance' | null>(null)
    const [sortDir,   setSortDir]    = useState<'asc' | 'desc'>('asc')

    function handleSort(field: 'name' | 'missions' | 'distance') {
      if (sortField === field) {
        setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortField(field)
        setSortDir('asc')
      }
    }

    const sorted = [...ASTRONAUTS].sort((a, b) => {
      if (!sortField) {return 0}

      const av = a[sortField]
      const bv = b[sortField]
      const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av) - (bv as number)

      return sortDir === 'asc' ? cmp : -cmp
    })

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader
              sortable
              sortDirection={sortField === 'name' ? sortDir : null}
              onSort={() => handleSort('name')}
            >
              Name
            </TableHeader>
            <TableHeader>Planet</TableHeader>
            <TableHeader
              sortable
              sortDirection={sortField === 'missions' ? sortDir : null}
              onSort={() => handleSort('missions')}
              align="right"
            >
              Missions
            </TableHeader>
            <TableHeader
              sortable
              sortDirection={sortField === 'distance' ? sortDir : null}
              onSort={() => handleSort('distance')}
              align="right"
            >
              Distance (km)
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.planet}</TableCell>
              <TableCell numeric>{row.missions}</TableCell>
              <TableCell numeric>{row.distance.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  },
}

// ─── Hoverable ────────────────────────────────────────────────────────────────

export const Hoverable: Story = {
  render: () => (
    <Table hoverable>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Planet</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {ASTRONAUTS.map(row => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.planet}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

// ─── Sticky header ────────────────────────────────────────────────────────────

export const StickyHeader: Story = {
  render: () => (
    <div style={{ height: 200, overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Planet</TableHeader>
            <TableHeader>Missions</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...ASTRONAUTS, ...ASTRONAUTS, ...ASTRONAUTS].map((row, i) => (
            <TableRow key={`${row.id}-${i}`}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.planet}</TableCell>
              <TableCell numeric>{row.missions}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  parameters: { layout: 'padded' },
}

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {(['sm', 'md', 'lg'] as const).map(size => (
        <div key={size}>
          <p style={{ marginBottom: 8, fontFamily: 'sans-serif', fontSize: 12, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>
            Size: {size}
          </p>
          <Table size={size}>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Planet</TableHeader>
                <TableHeader>Missions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {ASTRONAUTS.slice(0, 3).map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.planet}</TableCell>
                  <TableCell numeric>{row.missions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  ),
}

// ─── With selection ───────────────────────────────────────────────────────────

export const WithSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<number | null>(null)

    return (
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Planet</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {ASTRONAUTS.map(row => (
            <TableRow
              key={row.id}
              selected={selected === row.id}
              onClick={() => setSelected(prev => prev === row.id ? null : row.id)}
            >
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.planet}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {selected !== null && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>
                Selected: {ASTRONAUTS.find(a => a.id === selected)?.name}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    )
  },
}

// ─── Planet themes ────────────────────────────────────────────────────────────

export const PlanetThemes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {(['mercury', 'earth', 'mars', 'neptune'] as const).map(planet => (
        <div key={planet}>
          <p style={{ marginBottom: 8, fontFamily: 'sans-serif', fontSize: 12, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>
            Planet: {planet}
          </p>
          <Table planet={planet} variant="striped" hoverable>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Missions</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {ASTRONAUTS.slice(0, 3).map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell numeric>{row.missions}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  ),
  parameters: { layout: 'padded', backgrounds: { default: 'void' } },
}
