<template>
  <div class="auth">
    <!-- Panel de marca (solo escritorio) -->
    <section class="auth__brand d-none d-lg-flex">
      <div class="auth__brand-inner">
        <span class="auth__logo"><i class="bi bi-heart-pulse-fill"></i></span>
        <h1>Clinica Mascotas</h1>
        <p class="lead mb-1">Sistema integral de gestion veterinaria</p>
        <ul class="auth__features">
          <li><i class="bi bi-check2-circle"></i> Historia clinica y consultas</li>
          <li><i class="bi bi-check2-circle"></i> Citas y agenda medica</li>
          <li><i class="bi bi-check2-circle"></i> Farmacia y tienda online</li>
          <li><i class="bi bi-check2-circle"></i> Dashboard y reportes</li>
        </ul>
        <p class="auth__hint">
          <i class="bi bi-lightbulb"></i> Demo: <code>admin@clinica.test</code> con cualquier
          contrasena de 6+ caracteres.
        </p>
      </div>
    </section>

    <!-- Formulario -->
    <section class="auth__form-wrap">
      <div class="auth__form">
        <div class="text-center d-lg-none mb-4">
          <span class="auth__logo auth__logo--sm"><i class="bi bi-heart-pulse-fill"></i></span>
        </div>

        <h2 class="h4 fw-bold mb-1">Iniciar sesion</h2>
        <p class="text-muted mb-4">Ingresa tus credenciales para continuar.</p>

        <form novalidate @submit.prevent="onSubmit">
          <div class="mb-3">
            <label for="email" class="form-label">Correo electronico</label>
            <div class="input-group input-group-lg">
              <span class="input-group-text"><i class="bi bi-envelope"></i></span>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': touched.email && errors.email }"
                placeholder="tucorreo@clinica.com"
                autocomplete="username"
                @blur="validateField('email')"
              />
              <div v-if="touched.email && errors.email" class="invalid-feedback">
                {{ errors.email }}
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Contrasena</label>
            <div class="input-group input-group-lg">
              <span class="input-group-text"><i class="bi bi-lock"></i></span>
              <input
                id="password"
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': touched.password && errors.password }"
                placeholder="********"
                autocomplete="current-password"
                @blur="validateField('password')"
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                :aria-label="showPass ? 'Ocultar contrasena' : 'Mostrar contrasena'"
                @click="showPass = !showPass"
              >
                <i :class="['bi', showPass ? 'bi-eye-slash' : 'bi-eye']"></i>
              </button>
              <div v-if="touched.password && errors.password" class="invalid-feedback">
                {{ errors.password }}
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="form-check">
              <input id="remember" v-model="form.remember" class="form-check-input" type="checkbox" />
              <label class="form-check-label" for="remember">Recordarme</label>
            </div>
            <a href="#" class="small text-decoration-none" @click.prevent="onForgot">Olvidaste tu contrasena?</a>
          </div>

          <button class="btn btn-primary btn-lg w-100" type="submit" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-box-arrow-in-right me-2"></i>
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

        <p class="text-center text-muted small mt-4 mb-0">
          &copy; {{ year }} Clinica Mascotas. Todos los derechos reservados.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useForm } from '@/composables/useForm'
import { notifyValidation, toastError, toastInfo, toastSuccess } from '@/utils/alerts'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const year = new Date().getFullYear()
const showPass = ref(false)
const loading = ref(false)

const { form, errors, touched, validate, validateField, firstError } = useForm(
  { email: '', password: '', remember: true },
  {
    email: { label: 'Correo electronico', required: true, email: true },
    password: { label: 'Contrasena', required: true, min: 6 },
  },
)

const canSubmit = computed(() => !loading.value)

async function onSubmit() {
  if (!validate()) {
    notifyValidation(firstError())
    return
  }
  if (!canSubmit.value) return

  loading.value = true
  try {
    // FASE 1: simulamos la peticion al servidor. En FASE 2 se llama a la API PHP.
    await new Promise((resolve) => setTimeout(resolve, 700))
    auth.login({ email: form.email })
    toastSuccess('Bienvenido', `Has iniciado sesion como ${auth.fullName}.`)
    const redirect = route.query.redirect
    router.push(typeof redirect === 'string' ? redirect : { name: 'dashboard' })
  } catch (error) {
    toastError('Error al ingresar', 'Verifica tus credenciales e intenta de nuevo.')
  } finally {
    loading.value = false
  }
}

function onForgot() {
  toastInfo('Recuperar contrasena', 'Esta funcion se habilitara en una siguiente fase.')
}
</script>
