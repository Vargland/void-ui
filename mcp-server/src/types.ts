export interface ComponentMeta {
  name: string
  description: string
  props: PropMeta[]
  variants?: string[]
  examples: CodeExample[]
}

export interface PropMeta {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
}

export interface CodeExample {
  title: string
  code: string
}

export interface TokenMeta {
  name: string
  value: string
  category: string
  description?: string
}

export interface LibrarySnapshot {
  version: string
  generatedAt: string
  components: ComponentMeta[]
  tokens: TokenMeta[]
}
