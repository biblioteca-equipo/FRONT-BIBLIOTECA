import { describe, expect, it } from "vitest"

import { resolveApiBaseUrl } from "./runtimeConfig"

describe("resolveApiBaseUrl", () => {
  it("prioriza la configuración inyectada al iniciar el contenedor", () => {
    expect(resolveApiBaseUrl(" https://api.example.test/ ", "http://build.test")).toBe(
      "https://api.example.test",
    )
  })

  it("usa la variable de compilación durante el desarrollo local", () => {
    expect(resolveApiBaseUrl("", " http://localhost:9000/ ")).toBe("http://localhost:9000")
  })

  it("mantiene la URL local documentada cuando no hay configuración", () => {
    expect(resolveApiBaseUrl("", "")).toBe("http://127.0.0.1:8003")
  })
})
