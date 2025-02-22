import type { Connection, CoordinateExtent, Edge, Getters, GraphEdge, GraphNode, Node } from '~/types'
import { connectionExists, getEdgeId, isEdge, isGraphEdge, parseEdge, parseNode } from '~/utils/graph'

export const isDef = <T>(val: T): val is NonNullable<T> => typeof val !== 'undefined'

export const addEdgeToStore = (edgeParams: Edge | Connection, edges: Edge[]) => {
  if (!edgeParams.source || !edgeParams.target) {
    console.warn("[vueflow]: Can't create edge. An edge needs a source and a target.")
    return false
  }

  let edge
  if (isEdge(edgeParams)) {
    edge = { ...edgeParams }
  } else {
    edge = {
      ...edgeParams,
      id: getEdgeId(edgeParams),
    } as Edge
  }
  edge = parseEdge(edge)
  if (connectionExists(edge, edges)) return false
  return edge
}

export const updateEdgeAction = (edge: GraphEdge, newConnection: Connection, edges: GraphEdge[]) => {
  if (!newConnection.source || !newConnection.target) {
    console.warn("[vueflow]: Can't create new edge. An edge needs a source and a target.")
    return false
  }

  const foundEdge = edges.find((e) => isGraphEdge(e) && e.id === edge.id)

  if (!foundEdge) {
    console.warn(`[vueflow]: The old edge with id=${edge.id} does not exist.`)
    return false
  }

  const newEdge = {
    ...edge,
    id: getEdgeId(newConnection),
    source: newConnection.source,
    target: newConnection.target,
    sourceHandle: newConnection.sourceHandle,
    targetHandle: newConnection.targetHandle,
  }

  edges.splice(edges.indexOf(foundEdge), 1, newEdge)

  return newEdge
}

export const createGraphNodes = (
  nodes: Node[],
  getNode: Getters['getNode'],
  currGraphNodes: GraphNode[],
  extent: CoordinateExtent,
) => {
  const parentNodes: Record<string, true> = {}

  const graphNodes = nodes.map((node) => {
    const parsed = shallowReactive(
      parseNode(node, extent, {
        ...getNode(node.id),
        parentNode: node.parentNode,
      }),
    )
    if (node.parentNode) {
      parentNodes[node.parentNode] = true
    }

    return parsed
  })

  graphNodes.forEach((node) => {
    const nextNodes = [...graphNodes, ...currGraphNodes]
    if (node.parentNode && !nextNodes.find((n) => n.id === node.parentNode)) {
      console.warn(`[vueflow]: Parent node ${node.parentNode} not found`)
    }

    if (node.parentNode || parentNodes[node.id]) {
      if (parentNodes[node.id]) {
        node.isParent = true
      }
      const parent = node.parentNode ? getNode(node.parentNode) : undefined
      if (parent) parent.isParent = true
    }
  })

  return graphNodes
}
