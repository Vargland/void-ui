// ─── Planet names ─────────────────────────────────────────────────────────────

export type PlanetName =
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'moon'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'europa'
  | 'uranus'
  | 'neptune'
  | 'io'
  | 'nostromo'

// ─── Context shape ────────────────────────────────────────────────────────────

export interface PlanetContextValue {
  /** Currently active planet theme */
  planet: PlanetName
  /** Change the active planet theme */
  setPlanet: (planet: PlanetName) => void
}
