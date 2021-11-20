import { ConnectionMode, Edge, EdgeTypes, Elements, FlowState, Node, NodeExtent, NodeTypes, PanOnScrollMode } from '~/types'
import { isEdge, isNode, parseEdge, parseNode } from '~/utils'
import { DefaultNode, InputNode, OutputNode } from '~/components/Nodes'
import { BezierEdge, SmoothStepEdge, StepEdge, StraightEdge } from '~/components/Edges'
import { createHooks } from '~/composables'

type NextElements = {
  nextNodes: Node[]
  nextEdges: Edge[]
}

export const defaultNodeTypes: NodeTypes = {
  input: markRaw(InputNode),
  default: markRaw(DefaultNode),
  output: markRaw(OutputNode),
}

export const defaultEdgeTypes: EdgeTypes = {
  default: markRaw(BezierEdge),
  straight: markRaw(StraightEdge),
  step: markRaw(StepEdge),
  smoothstep: markRaw(SmoothStepEdge),
}

export const initialState = (): FlowState => ({
  dimensions: {
    width: 0,
    height: 0,
  },
  transform: [0, 0, 1],
  elements: [],
  nodes: [],
  edges: [],
  selectedElements: undefined,
  selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },

  d3Zoom: undefined,
  d3Selection: undefined,
  d3ZoomHandler: undefined,
  minZoom: 0.5,
  maxZoom: 2,
  translateExtent: [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
  ],

  nodeExtent: [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
  ],
  zoomOnScroll: true,
  zoomOnPinch: true,
  zoomOnDoubleClick: true,
  panOnScroll: false,
  panOnScrollSpeed: 0.5,
  panOnScrollMode: PanOnScrollMode.Free,
  paneMoveable: true,
  edgeUpdaterRadius: 10,

  nodesSelectionActive: false,
  selectionActive: false,

  userSelectionRect: {
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    draw: false,
  },

  arrowHeadColor: '#b1b1b7',
  connectionNodeId: undefined,
  connectionHandleId: undefined,
  connectionHandleType: 'source',
  connectionPosition: { x: NaN, y: NaN },
  connectionMode: ConnectionMode.Loose,

  snapGrid: [15, 15],
  snapToGrid: false,

  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,

  multiSelectionActive: false,

  isReady: false,
  hooks: createHooks(),
  storageKey: undefined,
  instance: undefined,

  vueFlowVersion: typeof __VUE_FLOW_VERSION__ !== 'undefined' ? __VUE_FLOW_VERSION__ : '-',
})

export const parseElements = (elements: Elements, nodes: Node[], edges: Edge[], nodeExtent: NodeExtent) => {
  const nextElements: NextElements = {
    nextNodes: [],
    nextEdges: [],
  }
  for (const element of elements) {
    if (isNode(element)) {
      const storeNode = nodes[nodes.map((x) => x.id).indexOf(element.id)]

      if (storeNode) {
        const updatedNode: Node = {
          ...storeNode,
          ...element,
        }
        if (!updatedNode.__rf) updatedNode.__rf = {}

        if (storeNode.position.x !== element.position.x || storeNode.position.y !== element.position.y) {
          updatedNode.__rf.position = element.position
        }

        if (typeof element.type !== 'undefined' && element.type !== storeNode.type) {
          // we reset the elements dimensions here in order to force a re-calculation of the bounds.
          // When the type of a node changes it is possible that the number or positions of handles changes too.
          updatedNode.__rf.width = undefined
        }

        nextElements.nextNodes.push(updatedNode)
      } else {
        nextElements.nextNodes.push(parseNode(element, nodeExtent))
      }
    } else if (isEdge(element)) {
      const storeEdge = edges[edges.map((x) => x.id).indexOf(element.id)]

      if (storeEdge) {
        nextElements.nextEdges.push({
          ...storeEdge,
          ...element,
        })
      } else {
        nextElements.nextEdges.push(parseEdge(element))
      }
    }
  }

  return nextElements
}
