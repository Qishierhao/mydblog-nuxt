<template>
  <div class="mac-desktop-container">
    <keep-alive>
      <WindowFrameWork v-for="item in appInstances" :app-instances="item">
        <template v-slot:header>{{item.name}}</template>
      </WindowFrameWork>
    </keep-alive>
  </div>
</template>

<script setup lang="ts">

import {defineAsyncComponent, isReactive, markRaw, reactive, ref, toRaw} from "vue";
import {appDescriber, appInstance} from "@/declare/WindowServer";
import {storeToRefs} from "pinia";
import {useAppStore} from "@/store";
import WindowFrameWork from "@/components/darwin/mac/WindowFrameWork.vue";

//监听pinia中的appDescribers以实现对app实例的操作。app实例均会挂载在此组件(WindowServer)下
const appStore = useAppStore();
const {appDescribers} = storeToRefs(appStore);
let appInstances = reactive({} as any);  //app实例组
/**
 * 在WindowServer中创建app实例
 * @param appDescriber
 */
const createInstance = (appDescriber: appDescriber) => {
  appInstances[appDescriber.appName] = {
    name: appDescriber.name,
    appName: appDescriber.appName,
    componentInstance: markRaw(defineAsyncComponent(() =>
      import(/* @vite-ignore */`/src/apps/${appDescriber.appName}/index.vue`)
    ))
  } as appInstance;
}
/**
 * 在WindowServer中移除app实例
 * @param appName
 */
const removeInstance = (appName: string) => {
  delete appInstances[appName]
}
const setInstance = (appName: string, props: string, value: any) => {
  console.log(appName)
  console.log(appInstances[appName])
  if (typeof appInstances[appName][props] !== "undefined") {
    if (appInstances[appName][props] == value) {
      return false;
    } else {
      appInstances[appName][props] = value;
    }
  } else appInstances[appName][props] = value;
}
/**
 * pinia中app实例组修改的状态监听
 */
const appSubscribe = appStore.$subscribe((mutation, state) => {
  const events = mutation.events as any;
  const {newValue, target, type, key} = events;
  console.log(events)
  if (target) {
    if (type == 'add') {
      createInstance(appStore.appDescribers[key])
    } else if (type == 'delete') {
      removeInstance(key)
    } else if (type == 'set') {
      setInstance(target.appName, key, newValue)
    }
  }
}, {detached: false})
</script>

<style scoped lang="scss">
button {
  background: white;
  margin-right: 20px;
}

.mac-desktop-container {
  background: transparent;
  height: 100%;
}
</style>
