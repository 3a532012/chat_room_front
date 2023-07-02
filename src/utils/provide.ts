import type { InjectionKey,Ref } from 'vue'

export const roomSocketKey = Symbol() as InjectionKey<Ref<WebSocket>>

export const listSocketKey = Symbol() as InjectionKey<Ref<WebSocket>>