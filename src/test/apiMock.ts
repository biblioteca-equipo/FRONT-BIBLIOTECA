import AxiosMockAdapter from "axios-mock-adapter"

import { api } from "@/lib/api"


export const apiMock = new AxiosMockAdapter(api)
