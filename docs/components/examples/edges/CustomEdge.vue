<script setup>
import { getBezierPath, useVueFlow } from '@vue-flow/core'
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  sourceX: {
    type: Number,
    required: true,
  },
  sourceY: {
    type: Number,
    required: true,
  },
  targetX: {
    type: Number,
    required: true,
  },
  targetY: {
    type: Number,
    required: true,
  },
  sourcePosition: {
    type: String,
    required: true,
  },
  targetPosition: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: false,
  },
  markerEnd: {
    type: String,
    required: false,
  },
  style: {
    type: Object,
    required: false,
  },
})

const { removeEdges } = useVueFlow()

const foreignObjectSize = 40

const onClick = (evt, id) => {
  removeEdges([id])
  evt.stopPropagation()
}

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

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <path :id="id" :style="style" class="vue-flow__edge-path" :d="edgePath[0]" :marker-end="markerEnd" />
  <foreignObject
    :width="foreignObjectSize"
    :height="foreignObjectSize"
    :x="edgePath[1] - foreignObjectSize / 2"
    :y="edgePath[2] - foreignObjectSize / 2"
    class="edgebutton-foreignobject"
    requiredExtensions="http://www.w3.org/1999/xhtml"
  >
    <body style="display: flex; align-items: center; justify-content: center">
      <div>
        <button ref="btn" class="edgebutton" @click="(event) => onClick(event, id)">×</button>
      </div>
    </body>
  </foreignObject>
</template>
