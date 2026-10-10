import Swal from 'sweetalert2'

const BRAND = '#db0505'
const CANCEL = '#6b7280'

/** Toast (notificacion no bloqueante, esquina superior derecha). */
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3200,
  timerProgressBar: true,
  didOpen: (el) => {
    el.addEventListener('mouseenter', Swal.stopTimer)
    el.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

export function toastSuccess(title, text = '') {
  return Toast.fire({ icon: 'success', title, text })
}
export function toastError(title, text = '') {
  return Toast.fire({ icon: 'error', title, text })
}
export function toastInfo(title, text = '') {
  return Toast.fire({ icon: 'info', title, text })
}
export function toastWarning(title, text = '') {
  return Toast.fire({ icon: 'warning', title, text })
}

/** Dialogo de confirmacion reutilizable. */
export function confirmDialog({
  title = 'Estas seguro?',
  text = '',
  confirmText = 'Si, continuar',
  cancelText = 'Cancelar',
  icon = 'question',
} = {}) {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: BRAND,
    cancelButtonColor: CANCEL,
    reverseButtons: true,
    focusCancel: true,
  })
}

/** Aviso simple de exito / error. */
export function alertSuccess(title, text = '') {
  return Swal.fire({ title, text, icon: 'success', confirmButtonColor: BRAND })
}
export function alertError(title, text = '') {
  return Swal.fire({ title, text, icon: 'error', confirmButtonColor: BRAND })
}

/** Aviso rapido de errores de validacion. */
export function notifyValidation(firstMessage) {
  return Swal.fire({
    icon: 'warning',
    title: 'Revisa el formulario',
    text: firstMessage || 'Hay campos obligatorios sin completar.',
    confirmButtonColor: BRAND,
  })
}

export { Swal }
