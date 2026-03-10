import type { PlanetName } from '../../typings/contexts/planet'

// ─── Planets ──────────────────────────────────────────────────────────────────

export const PLANETS = [
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
] as const satisfies PlanetName[]

// ─── Satellites ───────────────────────────────────────────────────────────────

export const SATELLITES = [
  'moon',
  'europa',
  'io',
] as const satisfies PlanetName[]

// ─── Lore ─────────────────────────────────────────────────────────────────────
// Fictional references — e.g. the USCSS Nostromo from Alien (1979)

export const LORE = [
  'nostromo',
] as const satisfies PlanetName[]

// ─── Combined ─────────────────────────────────────────────────────────────────

export const ALL_CELESTIAL_BODIES = [
  ...PLANETS,
  ...SATELLITES,
  ...LORE,
] as const satisfies PlanetName[]

// ─── Types ────────────────────────────────────────────────────────────────────

export type Planet    = typeof PLANETS[number]
export type Satellite = typeof SATELLITES[number]
export type Lore      = typeof LORE[number]
