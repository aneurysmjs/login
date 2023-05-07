import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { byTestId } from './utils'
import useFormSubmission from '~/composables/useFormSubmission'

describe('useFormSubmission', () => {
  let wrapper: ReturnType<typeof mount>

  const fakeApi = vi.fn(async () => ({ name: 'John Doe' }))

  beforeEach(() => {
    const TestComponent = {
      template: `
        <div>
          <button @click="submitForm" :disabled="isSubmitting">Submit</button>
          <div v-if="isSubmitting" data-testid="loading">Loading...</div>
        </div>
      `,
      setup() {
        const { isSubmitting, submitForm } = useFormSubmission(fakeApi)

        return {
          isSubmitting,
          submitForm,
        }
      },
    }

    wrapper = mount(TestComponent)
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.restoreAllMocks()
  })

  it('displays loading state while submitting form', async () => {
    const submitButton = wrapper.find('button')
    expect(submitButton.attributes()).not.toHaveProperty('disabled')
    // Verify that loading state is NOT displayed
    expect(wrapper.find(byTestId('loading')).exists()).toBe(false)

    await submitButton.trigger('click')

    expect(fakeApi).toHaveBeenCalled()

    expect(wrapper.find(byTestId('loading')).exists()).toBe(true)
    expect(submitButton.attributes()).toHaveProperty('disabled')

    await flushPromises()

    // Verify that loading state is no longer displayed
    expect(wrapper.find(byTestId('loading')).exists()).toBe(false)
    expect(submitButton.attributes()).not.toHaveProperty('disabled')
  })
})
