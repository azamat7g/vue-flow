<script lang="ts" setup>
import type { EdgeProps, Position } from '@vue-flow/core'
import { getBezierPath, useVueFlow } from '@vue-flow/core'

interface CustomEdgeProps<T = any> extends EdgeProps<T> {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
  data?: T
  markerEnd: string
}

const props = defineProps<CustomEdgeProps>()
const { applyEdgeChanges, getEdges } = useVueFlow()

const onClick = (evt: Event, id: string) => {
  applyEdgeChanges([{ type: 'remove', id }])
  evt.stopPropagation()
}

const foreignObjectSize = 40

const edgePath = computed(() =>
  getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  }),
)
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <path :id="props.id" :style="props.style" class="vue-flow__edge-path" :d="edgePath[0]" :marker-end="props.markerEnd" />
  <foreignObject
    :width="foreignObjectSize"
    :height="foreignObjectSize"
    :x="edgePath[1] - foreignObjectSize / 2"
    :y="edgePath[2] - foreignObjectSize / 2"
    class="edgebutton-foreignobject"
    requiredExtensions="http://www.w3.org/1999/xhtml"
  >
    <body>
      <button class="edgebutton" @click="(event) => onClick(event, props.id)">×</button>
    </body>
  </foreignObject>
</template>

<style>
.edgebutton {
  border-radius: 999px;
  cursor: pointer;
}
.edgebutton:hover {
  box-shadow: 0 0 0 2px pink, 0 0 0 4px #f05f75;
}
</style>
