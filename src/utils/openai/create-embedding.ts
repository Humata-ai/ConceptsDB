import { Embedding } from "openai/resources/embeddings.mjs";

export async function createEmbeddings(input: string[]): Promise<Array<Embedding>> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY was not set');
  }

  // Add dimensions param only for text-embedding-3-large and new models
  // older models does not support that.
  const $promise = fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-large',
      input,
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data);

  return $promise
}
