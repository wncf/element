import { ElementUIComponent, ElementUIComponentSize } from './component'

/** Context appended to every event handler declared in a field config */
export interface FormBuilderEventContext {
  /** The field config that fired the event */
  field: FormBuilderField
  /** The form model */
  model: Record<string, any>
  /** Path of the field in the model */
  prop: string
  /** Current value of the field */
  value: any
}

/** Layout-only entries */
export type FormBuilderFieldType = 'field' | 'title' | 'divider'

/** One entry of the `fields` config */
export interface FormBuilderField {
  /** Path of the value in the model, supports 'a.b' and 'list[0].id' */
  prop?: string

  /** Label text */
  label?: string

  /** Component name (globally registered) or component object */
  component?: string | object

  /** Props forwarded to the field component */
  props?: Record<string, any>

  /** event name -> handler, the handler receives (…args, ctx) */
  events?: Record<string, (...args: any[]) => void>

  /** Slots forwarded into the field component: ['prefix'] or { prefix: 'myPrefix' } */
  slots?: string[] | Record<string, string>

  /** Option data, rendered as el-option / el-radio / el-checkbox automatically */
  options?: any[]

  /** Field name mapping for option data, e.g. { label: 'name', value: 'id' } */
  optionProps?: { label?: string, value?: string, disabled?: string }

  /** Option child component name, inferred from `component` by default */
  optionComponent?: string

  /** Generate a required rule automatically */
  required?: boolean

  /** Custom message for the generated required rule */
  requiredMessage?: string

  /** Validation rules, merged with `required` and the form level `rules` */
  rules?: object[]

  /** 24-column grid span, only used when `columns` is not set */
  span?: number

  /** Hide the field without dropping its value */
  hidden?: boolean | ((model: Record<string, any>) => boolean)

  /** Disable the field, function form is re-evaluated on model change */
  disabled?: boolean | ((model: Record<string, any>) => boolean)

  /** Helper text rendered under the field */
  tip?: string

  /** Entry kind, defaults to 'field' */
  type?: FormBuilderFieldType

  /** Render this field with a named slot of the caller */
  slot?: string

  /** Render the label with a named slot of the caller */
  labelSlot?: string

  /** Position of the divider text, only for type 'divider' */
  contentPosition?: 'left' | 'center' | 'right'

  /** Unique key for v-for, defaults to prop */
  key?: string
}

/** FormBuilder Component */
export declare class ElFormBuilder extends ElementUIComponent {
  /** Form data, updated in place */
  value: Record<string, any>

  /** Field configs */
  fields: FormBuilderField[]

  /** Validation rules of the form */
  rules: Record<string, object[]>

  /** Width of label */
  labelWidth: string

  /** Position of label */
  labelPosition: 'right' | 'left' | 'top'

  /** Suffix of the label */
  labelSuffix: string

  /** Whether the form is inline */
  inline: boolean

  /** Whether to put the error message inline with the form item */
  inlineMessage: boolean

  /** Whether to show the validation status icon */
  statusIcon: boolean

  /** Whether to hide the required asterisk */
  hideRequiredAsterisk: boolean

  /** Whether to validate the form when rules change */
  validateOnRuleChange: boolean

  /** Size of the controls in this form */
  size: ElementUIComponentSize

  /** Whether the whole form is disabled */
  disabled: boolean

  /** Whether to show the error message */
  showMessage: boolean

  /** Number of columns in a row, takes precedence over field.span when set */
  columns: number

  /** Horizontal gap between columns, in pixels */
  gutter: number

  /** Whether to render the submit / reset buttons */
  showActions: boolean

  /** Text of the submit button */
  submitText: string

  /** Text of the reset button */
  resetText: string

  /** Loading state of the submit button */
  loading: boolean

  /** Validate the whole form */
  validate (callback?: (valid: boolean, invalidFields?: object) => void): Promise<boolean> | void

  /** Validate specific fields */
  validateField (props: string | string[], callback?: (message: string) => void): void

  /** Reset all fields to their initial values */
  resetFields (): void

  /** Clear validation state of specific fields */
  clearValidate (props?: string | string[]): void
}
