import React from "react";
import { createEmbeddings } from "@/utils-server/openai/create-embedding";
import styles from "./page.module.css";

export default async function Home() {
  const [{ embedding: catEmbedding }] = await createEmbeddings(['cat'])
  const [{ embedding: catEmbeddingThree }] = await createEmbeddings(['cat'], { dimensions: 3 })

  return (
    <div>
      <div>
        cat (dimensions {catEmbedding.length})<span style={{ marginLeft: '54px' }}></span>: {JSON.stringify(catEmbedding).slice(0, 200)}...
      </div>
      <div>
        cat (reduced to 3 dimensions): {JSON.stringify(catEmbeddingThree)}
      </div>
    </div>
  );
}
