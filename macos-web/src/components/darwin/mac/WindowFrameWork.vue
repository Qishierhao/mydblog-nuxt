<template>
  <Vue3DraggableResizable
    :initW="110" :initH="110"
    v-model:x="xCoor" v-model:y="yCoor"
    v-model:w="dragWidth" v-model:h="dragHeight"
    v-model:active="active"
    :draggable="true" :resizable="true"
    @activated="print('activated')"
    @deactivated="print('deactivated')"
    @resizing="onResizing"
  >
    <div class="mac-window-frame" :ref="appInstances.appName+'Ref'">
      <div class="mac-window-frame-bar">
        <div class="mac-window-frame-btn-group">
          <button class="mac-window-frame-btn-close" @mousedown.stop="clickBar(0)">
            <span>x</span>
          </button>
          <button class="mac-window-frame-btn-min" @mousedown.stop="clickBar(1)">
            <span>-</span>
          </button>
          <button class="mac-window-frame-btn-max" @mousedown.stop="clickBar(2)">
            <span>+</span>
          </button>
        </div>
        <slot name="header"></slot>
      </div>
      <!--TODO 此处事件也应处理vuex中的active-->
      <div class="mac-window-frame-container" @mousedown.stop="">
        <component :is="appInstances.componentInstance"
                   :style="windowSizeHandle"
        ></component>
      </div>
    </div>
  </Vue3DraggableResizable>
</template>

<script setup lang="ts" name="WindowFrameWork">
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
import {computed, getCurrentInstance, nextTick, ref, watchEffect} from "vue";

const vm = getCurrentInstance();
const props = defineProps({
  appInstances: {
    required: true,
    type: Object
  }
})
const xCoor = ref(100);
const yCoor = ref(100);
const dragWidth = ref(100);
const dragHeight = ref(100);
const windowWidth = ref(0);
const windowHeight = ref(0);
const active = ref(true) //TODO 进入vuex
watchEffect(() => {
  nextTick(() => {
    setTimeout(() => {
      if (props.appInstances.appName) {
        const ref = props.appInstances.appName + 'Ref';
        const vDom = vm!.refs[ref] as HTMLDivElement;
        const {height, width} = vDom.getBoundingClientRect();
        windowWidth.value = width;
        windowHeight.value = height;
        dragWidth.value = width;
        dragHeight.value = height;
      }
    }, 500)
  })
})
const windowSizeHandle = computed(() => {
  if (windowWidth.value === 0 || windowHeight.value === 0) {
    return {}
  } else {
    return {width: windowWidth.value - 4 + 'px', height: windowHeight.value - 49 + 'px'}
  }
})
const onResizing = () => {
  windowWidth.value = dragWidth.value;
  windowHeight.value = dragHeight.value;
}
const print = (val: any) => {
  console.log(val)
}
const clickBar = (action: number) => {
  console.log(action)
}

</script>

<style scoped lang="scss">
.vdr-container.active {
  border: none !important;
}

::v-deep(.vdr-handle) {
  background: transparent;
  border: none;
}

//上半部分缩放点
::v-deep(.handle-tl) {
  width: 4%;
  top: 0;
}

::v-deep(.handle-tm) {
  width: 94%;
  left: 4%;
}

::v-deep(.handle-tr) {
  width: 4%;
  top: 0;
}

//下半部分缩放点
::v-deep(.handle-bl) {
  width: 4%;
  bottom: 0;
}

::v-deep(.handle-bm) {
  width: 94%;
  left: 4%;
}

::v-deep(.handle-br) {
  width: 4%;
  bottom: 0;
}

//左右缩放点
::v-deep(.handle-ml) {
  height: 96%;
  top: 3%;
}

::v-deep(.handle-mr) {
  height: 96%;
  top: 3%;
}

.mac-window-frame {
  @apply flex flex-col;
  border: solid 2px rgba(70, 72, 75, 0.7);
  border-radius: 5px;
  background-color: #1e1e1e;
  width: fit-content;

  .mac-window-frame-bar {
    @apply flex flex-row items-center;
    height: 45px;
    background-color: #37343b;

    .mac-window-frame-btn-group {
      @apply flex flex-row items-center;
      margin-left: 20px;

      button {
        cursor: default;
        user-select: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #4f4953;
        margin-right: 6px;

        span {
          font-size: 16px;
          font-weight: 400;
          margin-top: -3px;
        }
      }

      .mac-window-frame-btn-close {
        @apply flex flex-row justify-center items-center;
        background-color: #ec6a5e;

        &:hover {

        }
      }

      .mac-window-frame-btn-min {
        @apply flex flex-row justify-center items-center;
        background-color: #f4bf4e;

        &:hover {

        }
      }

      .mac-window-frame-btn-max {
        @apply flex flex-row justify-center items-center;
        background-color: #5fc151;

        &:hover {

        }
      }
    }
  }

  .mac-window-frame-container {
    width: 100%;
    height: fit-content;
  }
}
</style>
