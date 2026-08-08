import "@testing-library/jest-dom/vitest"

import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

import { apiMock } from "@/test/apiMock"


afterEach(() => {
  cleanup()
  apiMock.reset()
  localStorage.clear()
  vi.restoreAllMocks()
})
