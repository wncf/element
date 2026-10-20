import { ElementUIComponent, ElementUIComponentSize } from './component'

/** AmountInput Component */
export declare class ElAmountInput extends ElementUIComponent {
  /** Binding value, always a string: empty string means "not filled in" */
  value: string | number

  /** Decimal places to keep, 0 means integers only */
  precision: number

  /** The minimum allowed value. Defaults to 0 when negative values are forbidden */
  min: number

  /** The maximum allowed value */
  max: number

  /** Whether negative values can be entered */
  allowNegative: boolean

  /** Placeholder of Input */
  placeholder: string

  /** Whether Input is disabled */
  disabled: boolean

  /** Whether the input is clearable */
  clearable: boolean

  /** Size of Input */
  size: ElementUIComponentSize

  /** Prefix icon class */
  prefixIcon: string

  /** Suffix icon class */
  suffixIcon: string

  /** Same as name in native input */
  name: string

  /** Same as readonly in native input */
  readonly: boolean

  /**
   * Focus the Input component
   */
  focus (): void

  /**
   * Blur the Input component
   */
  blur (): void

  /**
   * Select the text in input element
   */
  select (): void
}
