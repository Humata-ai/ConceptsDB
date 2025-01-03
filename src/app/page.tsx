import React from "react";
import { createEmbeddings } from "@/utils-server/openai/create-embedding";
import styles from "./page.module.css";
import { PlotExample } from "./plot.tsx";

export default async function Home() {
  const [{ embedding: catEmbedding }] = await createEmbeddings(['cat'])
  const [{ embedding: catEmbeddingThree }] = await createEmbeddings(['cat'], { dimensions: 3 })
  const [{ embedding: cat }, { embedding: dog }, { embedding: baseball }] = await createEmbeddings(['cat', 'dog', 'baseball'], { dimensions: 3 })

  return (
    <div>
      <div>
        cat (dimensions {catEmbedding.length})<span style={{ marginLeft: '54px' }}></span>: {JSON.stringify(catEmbedding).slice(0, 200)}...
      </div>
      <div>
        cat (reduced to 3 dimensions): {JSON.stringify(catEmbeddingThree)}
      </div>

      <br />
      <br />

      {/* TODO: Graph this in three dimesional space*/}
      <div>{JSON.stringify(cat)}</div>
      <div>{JSON.stringify(dog)}</div>
      <div>{JSON.stringify(baseball)}</div>
      <PlotExample />


    </div>
  );
}
