import { request } from '@umijs/max';

export const openAIService = {
  async callOpenAI(input: string) {
    const res = (await request<string>('/api/v0/openai/proxyToOpenAI', {
      method: 'POST',
      data: {
        max_tokens: 3000,
        model: 'gpt-3.5-turbo',
        temperature: 1,
        top_p: 1,
        presence_penalty: 1,
        messages: [
          {
            role: 'user',
            content: input,
          },
        ],
        stream: false,
      },
    })) as any;

    return res.data as string;
  },
};
