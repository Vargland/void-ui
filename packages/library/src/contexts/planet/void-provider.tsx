import { useState, useRef, type ReactNode } from 'react'
import type { PlanetName } from '../../typings/contexts/planet'
import { PlanetContext, DEFAULT_PLANET } from './planet-context'

interface VoidProviderProps {
  /** Default planet theme for all child components */
  planet?: PlanetName
  children: ReactNode
}

export function VoidProvider({ planet: initialPlanet = DEFAULT_PLANET, children }: VoidProviderProps) {
  const [planet, setPlanet] = useState<PlanetName>(initialPlanet)
  const wrapperRef = useRef<HTMLDivElement>(null)

  return (
    <PlanetContext.Provider value={{ planet, setPlanet }}>
      <div
        ref={wrapperRef}
        data-void-planet={planet}
        data-void-provider=""
      >
        {children}
      </div>
    </PlanetContext.Provider>
  )
}
