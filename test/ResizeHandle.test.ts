import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { type Header } from '@tanstack/vue-table'

import ResizeHandle from '../src/components/LoginForm.vue'

// Helper function to update column size by delta
function updateColumnSizeBy<T>(header: Header<T, unknown>, delta: number) {
  header.getContext().table.setColumnSizing((prev) => {
    // Replace with actual maxSize and minSize values or mock them
    const { maxSize = 200, minSize = 50 } = header.column.columnDef

    return {
      ...prev,
      [header.id]: Math.min(Math.max(header.column.getSize() + delta, minSize), maxSize),
    }
  })
}

describe('ResizeHandle', () => {
  it('should update column size when arrow keys are pressed', async () => {
    const header = {
      id: 'column_id',
      column: {
        getSize: vi.fn(() => 100),
      },
      getResizeHandler: vi.fn(() => vi.fn()),
      getContext: vi.fn(() => ({
        table: {
          setColumnSizing: vi.fn(),
        },
      })),
    }

    const { getByRole } = render(ResizeHandle, {
      props: {
        header,
      },
    })

    const resizeHandle = getByRole('separator')

    // Press left arrow key
    fireEvent.keyDown(resizeHandle, { key: 'ArrowLeft' })
    expect(header.getContext().table.setColumnSizing).toHaveBeenCalledTimes(1)
    expect(header.getContext().table.setColumnSizing).toHaveBeenCalledWith(
      expect.any(Function),
    )
    expect(header.getContext().table.setColumnSizing.mock.calls[0][0]).toBeInstanceOf(Function)
    const sizingFnLeft = header.getContext().table.setColumnSizing.mock.calls[0][0]

    // Invoke the sizing function and check if the delta is correct
    sizingFnLeft({
      [header.id]: 100, // Initial size before the update
    })
    expect(header.getContext().table.setColumnSizing).toHaveBeenCalledTimes(2) // Once during keyDown and once during sizingFnLeft invocation
    expect(header.getContext().table.setColumnSizing).toHaveBeenLastCalledWith({
      [header.id]: 90, // Expected size after applying the clamp function
    })

    // Press right arrow key
    fireEvent.keyDown(resizeHandle, { key: 'ArrowRight' })
    expect(header.getContext().table.setColumnSizing).toHaveBeenCalledTimes(3)
    expect(header.getContext().table.setColumnSizing).toHaveBeenCalledWith(
      expect.any(Function),
    )
    expect(header.getContext().table.setColumnSizing.mock.calls[2][0]).toBeInstanceOf(Function)
    const sizingFnRight = header.getContext().table.setColumnSizing.mock.calls[2][0]

    // Invoke the sizing function and check if the delta is correct
    sizingFnRight({
      [header.id]: 100, // Initial size before the update
    })
    expect(header.getContext().table.setColumnSizing).toHaveBeenCalledTimes(4) // Once during keyDown and once during sizingFnRight invocation
    expect(header.getContext().table.setColumnSizing).toHaveBeenLastCalledWith({
      [header.id]: 110, // Expected size after applying the clamp function
    })
  })
})
