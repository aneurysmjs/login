import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LoginForm from '../src/components/LoginForm.vue'

import { byTestId } from './utils'

describe('LoginForm', () => {
  it('submits form when all fields are valid', async () => {
    const wrapper = mount(LoginForm)

    const emailInput = wrapper.find(byTestId('email'))
    const passwordInput = wrapper.find(byTestId('password'))
    const submitButton = wrapper.find(byTestId('submit'))

    await emailInput.setValue('test@example.co')
    await passwordInput.setValue('longpasswordwithlongtextthatmakeswritealot')
    await submitButton.trigger('submit')

    expect(wrapper.emitted()).toHaveProperty('submit')
  })

  it('disables submit button when form is invalid', async () => {
    const wrapper = mount(LoginForm)

    const emailInput = wrapper.find(byTestId('email'))
    const passwordInput = wrapper.find(byTestId('password'))
    const submitButton = wrapper.find(byTestId('submit'))

    await emailInput.setValue('invalid-email')
    await passwordInput.setValue('shortpw')
    await submitButton.trigger('click')

    expect(submitButton.attributes()).toHaveProperty('disabled')
    expect(submitButton.classes()).toContain('login-form__submit--disabled')
  })

  it('shows error message when email is invalid', async () => {
    const wrapper = mount(LoginForm)

    const emailInput = wrapper.find(byTestId('email'))
    const submitButton = wrapper.find(byTestId('submit'))

    await emailInput.setValue('invalid-email')
    await submitButton.trigger('click')

    const errorMessage = wrapper.find(byTestId('password-email-msg'))

    expect(errorMessage.text()).toBe('Value is not a valid email address')
  })

  it('shows error message when password is too short', async () => {
    const wrapper = mount(LoginForm)

    const passwordInput = wrapper.find(byTestId('password'))
    const submitButton = wrapper.find(byTestId('submit'))

    await passwordInput.setValue('shortpw')
    await submitButton.trigger('click')

    await wrapper.vm.$nextTick()

    const errorMessage = wrapper.find(byTestId('password-error-msg'))

    expect(errorMessage.text()).toBe('This field should be at least 32 characters long')
  })

  it('toggles between types "text" and "password"', async () => {
    const wrapper = mount(LoginForm)
    const passwordInput = wrapper.find(byTestId('password'))
    const revealPasswordButton = wrapper.find(byTestId('reveal-password'))
    const eyeIcon = wrapper.find(byTestId('eye-icon'))

    expect(passwordInput.attributes('type')).toBe('password')
    expect(eyeIcon.classes('login-form__icon-eye-on')).toBe(true)

    await revealPasswordButton.trigger('click')

    expect(passwordInput.attributes('type')).toBe('text')
    expect(eyeIcon.classes('login-form__icon-eye-off')).toBe(true)
  })
})
