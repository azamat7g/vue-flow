import useVueFlow from './useVueFlow'
import { EdgeId, EdgeRef } from '~/context'
import type { CustomEvent, ElementData } from '~/types'

/**
 * Access an edge
 *
 * If no edge id is provided, the edge id is injected from context
 *
 * Meaning if you do not provide an id, this composable has to be called in a child of your custom edge component, or it will throw
 */
export default function useEdge<Data = ElementData, CustomEvents extends Record<string, CustomEvent> = any>(id?: string) {
  const edgeId = id ?? inject(EdgeId, '')
  const edgeEl = inject(EdgeRef, null)

  const { findEdge } = useVueFlow()

  const edge = findEdge<Data, CustomEvents>(edgeId)

  if (!edge) {
    throw new Error(`[vue-flow]: useEdge - Edge with id ${edgeId} not found!`)
  }

  return {
    id: edgeId,
    edge,
    edgeEl,
  }
}
