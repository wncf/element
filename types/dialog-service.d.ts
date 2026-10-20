import { VNode } from 'vue'

export interface DialogInstance {
  visible: boolean
  loading: boolean
  close: () => void
}

export interface DialogOptions {
  title?: string
  type?: 'alert' | 'confirm'
  width?: string | number
  maskClose?: boolean
  escClose?: boolean
  showClose?: boolean
  content?: string | VNode
  confirmButtonText?: string
  cancelButtonText?: string
  confirm?: (instance: DialogInstance) => void | Promise<void>
  cancel?: (instance: DialogInstance) => void
  /** Open stacked on existing dialog instead of queueing */
  stack?: boolean
  /** Show divider between header / body / footer */
  border?: boolean
}

export interface DialogService {
  (options: DialogOptions, renderFn?: (h: any) => VNode): void
}

declare module 'vue/types/vue' {
  interface Vue {
    $dialog: DialogService
  }
}
