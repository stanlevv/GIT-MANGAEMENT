import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE } from "../../config/api";
import { authToken } from "../lib/authToken";

type AskAIRequest = {
  prompt: string;
};

type AskAIResponse = {
  response?: string;
  [key: string]: unknown;
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  prepareHeaders: (headers) => {
    const token = authToken.get();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery,
  endpoints: (builder) => ({
    askAI: builder.mutation<AskAIResponse, AskAIRequest>({
      query: (body) => ({
        url: "/ai/chat",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAskAIMutation } = aiApi;
