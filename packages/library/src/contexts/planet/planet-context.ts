import * as React from 'react'
import type { PlanetContextValue, PlanetName } from '../../typings/contexts/planet'

export const DEFAULT_PLANET: PlanetName = 'moon'

export const PlanetContext = React.createContext<PlanetContextValue>({
  planet: DEFAULT_PLANET,
  setPlanet: () => {},
})

export function usePlanet(): PlanetContextValue {
  return React.useContext(PlanetContext)
}
