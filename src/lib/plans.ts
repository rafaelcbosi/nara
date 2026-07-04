export type PlanSlug = 'essencial' | 'profissional' | 'escala'

export interface PlanConfig {
  slug: PlanSlug
  nome: string
  bioChatLimitMonth: number
  bioPageEnabled: boolean
}

// Limites por plano. Preço NÃO entra aqui — é definido na Kiwify e
// mapeado por kiwifyProductId no PLAN_BY_KIWIFY_PRODUCT abaixo.
export const PLANS: Record<PlanSlug, PlanConfig> = {
  essencial: {
    slug: 'essencial',
    nome: 'Essencial',
    bioChatLimitMonth: 0,
    bioPageEnabled: true,
  },
  profissional: {
    slug: 'profissional',
    nome: 'Profissional',
    bioChatLimitMonth: 100,
    bioPageEnabled: true,
  },
  escala: {
    slug: 'escala',
    nome: 'Escala',
    bioChatLimitMonth: 500,
    bioPageEnabled: true,
  },
}

export const DEFAULT_PLAN: PlanSlug = 'essencial'

// Mapeia o ID/nome do produto Kiwify para o plano interno.
// Preencher com os IDs reais ao configurar os produtos na Kiwify.
export const PLAN_BY_KIWIFY_PRODUCT: Record<string, PlanSlug> = {
  // 'kiwify-product-id-essencial': 'essencial',
  // 'kiwify-product-id-profissional': 'profissional',
  // 'kiwify-product-id-escala': 'escala',
}

export function resolvePlan(kiwifyProductId?: string | null): PlanSlug {
  if (kiwifyProductId && PLAN_BY_KIWIFY_PRODUCT[kiwifyProductId]) {
    return PLAN_BY_KIWIFY_PRODUCT[kiwifyProductId]
  }
  return DEFAULT_PLAN
}

export function getPlanConfig(plan: string | null | undefined): PlanConfig {
  if (plan && plan in PLANS) return PLANS[plan as PlanSlug]
  return PLANS[DEFAULT_PLAN]
}
