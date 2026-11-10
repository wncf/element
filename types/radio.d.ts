import { ElementUIComponent, ElementUIComponentSize } from './component'

/** Radio Component */
export declare class ElRadio extends ElementUIComponent {
  /** The form input value */
  value: string

  /** The value of radio */
  label: string | number | boolean

  /** Whether radio is disabled */
  disabled: boolean

  /** Whether to add a border around Radio */
  border: boolean

  /** Size of the Radio, only works when border is true */
  size: ElementUIComponentSize

  /** Native 'name' attribute */
  name: string
}
