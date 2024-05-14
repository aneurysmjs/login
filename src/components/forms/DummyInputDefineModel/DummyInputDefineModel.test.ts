import { fireEvent, render } from '@testing-library/vue'

import DummyInputDefineModel from './DummyInputDefineModel.vue'

describe('dummyInputDefineModel', () => {
  it('should update model value and trigger "update:modelValue" event', async () => {
    const placeholder = 'Your name'
    const modelValue = ''

    const handler = vi.fn()

    const { emitted, getByPlaceholderText } = render(DummyInputDefineModel, {
      props: {
        placeholder,
        modelValue,
        // 'update:model-value': handler,
        'onUpdate:modelValue': handler,
      },
    })

    const input = getByPlaceholderText(placeholder)

    const newValue = 'some value'

    await fireEvent.update(input, newValue)

    expect(input).toHaveValue(newValue)

    expect(emitted()).toHaveProperty('update:modelValue')

    expect(handler).toHaveBeenCalledWith(newValue)
  })
})
