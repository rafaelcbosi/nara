// Entrada só para desenvolvimento local: serve apenas o painel.
import { handlePainel } from './painel/handler.js'

export default {
  fetch(request, env, ctx) {
    const url = new URL(request.url)
    if (url.pathname === '/' ) return Response.redirect(new URL('/painel', url), 302)
    if (url.pathname.startsWith('/painel')) return handlePainel(request, env, ctx)
    return new Response('Não encontrado', { status: 404 })
  },
}
