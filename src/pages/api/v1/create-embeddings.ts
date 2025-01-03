import { createEmbeddings } from '@/utils/openai/create-embedding';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const embeddings = await createEmbeddings(['cat'])
  res.status(200).json({ embeddings });
}
