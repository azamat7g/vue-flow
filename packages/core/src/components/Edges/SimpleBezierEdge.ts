import type { FunctionalComponent } from 'vue'
import { getSimpleBezierPath } from './utils'
import BaseEdge from './BaseEdge'
import { Position } from '~/types'
import type { EdgeProps } from '~/types'

const SimpleBezierEdge: FunctionalComponent<EdgeProps> = function ({
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
  label,
  labelStyle = {},
  labelShowBg = true,
  labelBgStyle = {},
  labelBgPadding,
  labelBgBorderRadius,
  sourceY,
  sourceX,
  targetX,
  targetY,
  markerEnd,
  markerStart,
  style,
}) {
  const [path, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  return h(BaseEdge, {
    path,
    labelX,
    labelY,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    style,
    markerEnd,
    markerStart,
  })
}

SimpleBezierEdge.props = [
  'sourcePosition',
  'targetPosition',
  'label',
  'labelStyle',
  'labelShowBg',
  'labelBgStyle',
  'labelBgPadding',
  'labelBgBorderRadius',
  'sourceY',
  'sourceX',
  'targetX',
  'targetY',
  'markerEnd',
  'markerStart',
  'style',
]
SimpleBezierEdge.inheritAttrs = false

export default SimpleBezierEdge
