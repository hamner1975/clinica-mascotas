import { computed, reactive } from 'vue'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+]?[\d\s().-]{6,20}$/

/**
 * Composable de validacion reutilizable, 100% Vue (sin librerias externas).
 *
 * Reglas disponibles por campo:
 *   required, email, phone, min, max, number, minValue, maxValue, pattern, custom(fn)
 *   label -> nombre amigable mostrado en los mensajes.
 *
 * Uso:
 *   const { form, errors, touched, validate, validateField } = useForm(
 *     { email: '', password: '' },
 *     {
 *       email: { label: 'Correo electronico', required: true, email: true },
 *       password: { label: 'Contrasena', required: true, min: 6 },
 *     },
 *   )
 */
export function useForm(initialValues, rules = {}) {
  const form = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})

  function runRule(field, value) {
    const rule = rules[field] || {}
    const label = rule.label || field
    const val = typeof value === 'string' ? value.trim() : value
    const isEmpty = val === '' || val === null || val === undefined || (Array.isArray(val) && val.length === 0)

    if (rule.required && isEmpty) return `El campo "${label}" es obligatorio.`
    if (isEmpty) return ''

    if (rule.email && !EMAIL_RE.test(val)) return `Ingresa un "${label}" valido.`
    if (rule.phone && !PHONE_RE.test(val)) return `"${label}" no tiene un formato valido.`
    if (rule.min && String(val).length < rule.min) return `"${label}" debe tener al menos ${rule.min} caracteres.`
    if (rule.max && String(val).length > rule.max) return `"${label}" no debe superar ${rule.max} caracteres.`
    if (rule.number && Number.isNaN(Number(val))) return `"${label}" debe ser numerico.`
    if (rule.minValue != null && Number(val) < rule.minValue) return `"${label}" debe ser mayor o igual a ${rule.minValue}.`
    if (rule.maxValue != null && Number(val) > rule.maxValue) return `"${label}" debe ser menor o igual a ${rule.maxValue}.`
    if (rule.pattern && !rule.pattern.test(val)) return rule.patternMessage || `"${label}" no tiene un formato valido.`
    if (typeof rule.custom === 'function') {
      const message = rule.custom(val, form)
      if (message) return message
    }
    return ''
  }

  function validateField(field) {
    touched[field] = true
    errors[field] = runRule(field, form[field])
    return !errors[field]
  }

  function validate() {
    let ok = true
    Object.keys(rules).forEach((field) => {
      touched[field] = true
      errors[field] = runRule(field, form[field])
      if (errors[field]) ok = false
    })
    return ok
  }

  function firstError() {
    const field = Object.keys(errors).find((key) => errors[key])
    return field ? errors[field] : ''
  }

  function reset(values = initialValues) {
    Object.assign(form, values)
    Object.keys(errors).forEach((key) => delete errors[key])
    Object.keys(touched).forEach((key) => delete touched[key])
  }

  const isValid = computed(() => Object.values(errors).every((error) => !error))

  return { form, errors, touched, validate, validateField, firstError, reset, isValid }
}
