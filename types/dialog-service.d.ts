import { VNode } from 'vue'

export type DialogType = 'alert' | 'confirm' | 'error' | 'warning' | 'info' | 'add' | 'edit'

export interface DialogInstance {
  visible: boolean
  loading: boolean
  /** 真实组件实例的 refs，可用于校验弹窗内的表单等 */
  readonly $refs: Record<string, any>
  /** 真实组件实例的根元素 */
  readonly $el: HTMLElement | null
  close: () => void
}

export interface DialogOptions {
  title?: string
  /**
   * alert: 无底部按钮
   * confirm / error / warning / info / add / edit: 取消 + 确定
   * error 的确定按钮为危险色，其余类型在标题区额外渲染图标
   */
  type?: DialogType
  width?: string | number
  fullscreen?: boolean
  /** 是否渲染遮罩，默认 true；设为 false 可只保留弹窗本身 */
  modal?: boolean
  maskClose?: boolean
  escClose?: boolean
  showClose?: boolean
  content?: string | VNode
  confirmButtonText?: string
  cancelButtonText?: string
  /** 自定义标题图标类名，不传时按 type 自动取 */
  icon?: string
  /** 为 true 时不渲染底部按钮（type 为 alert 时本就没有按钮） */
  hideFooter?: boolean
  confirm?: (instance: DialogInstance) => void | Promise<void>
  cancel?: (instance: DialogInstance) => void
  /** 弹窗打开后的回调，可用于聚焦输入框等 */
  open?: (instance: DialogInstance) => void
  /**
   * 叠在上一个弹窗之上，默认 true。
   * 传 false 改为排队：等前一个关闭、延迟 500ms 后再显示。
   */
  stack?: boolean
  /** 层级，用于和业务方既有弹窗并轨；不传走 PopupManager 自增 */
  zIndex?: number
  /** 父实例，决定 $store / $route / provide 的继承来源；在组件内调用时自动取 this */
  parent?: any
  /** Show divider between header / body / footer */
  border?: boolean
}

export interface DialogService {
  (options: DialogOptions | string, renderFn?: (h: any) => VNode): DialogInstance | undefined
}

declare module 'vue/types/vue' {
  interface Vue {
    $dialog: DialogService
  }
}
