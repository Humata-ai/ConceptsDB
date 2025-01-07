import React from "react";
import { createEmbeddings } from "@/utils-server/openai/create-embedding";
import styles from "./page.module.css";
import { PlotExample } from "./plot.tsx";
import { EmbeddingDistance } from "./embedding-distance.component.tsx";

async function addCoordinatesToWords(words: string[]): Promise<{ text: string, x: number, y: number, z: number }[]> {
  const embeddings = await createEmbeddings(words, { dimensions: 3 })
  return embeddings.map(({ embedding }, index) => {
    const [x, y, z] = embedding;
    return {
      text: words[index],
      x,
      y,
      z
    }
  })
}

function addColor<T>(word: T) {
  return {
    ...word,
    color: 'red'
  }
}

export default async function Home() {
  const words = [
    "apple",
    "pineapple",
    "banana",
  ];

  const wordsWithEmbeddings = await addCoordinatesToWords(words)
  const points = wordsWithEmbeddings.map(addColor)

  return (
    <div style={styles}>
      <h3>Why are apple and pineapple close, while apple and banana far?</h3>
      <br />
      <br />
      <PlotExample points={points} />


      <br />
      <div>Dot Product Distance on 3072 dimension embedding vectors</div>
      <EmbeddingDistance wordOne="apple" wordTwo="apple" />
      <EmbeddingDistance wordOne="apple" wordTwo="banana" />
      <EmbeddingDistance wordOne="apple" wordTwo="pineapple" />

      <br />
      <br />
      <div>Dot Product Distance After Low Dimensional Projections 3 dimension embedding vectors</div>
      <EmbeddingDistance wordOne="apple" wordTwo="apple" dimensions={3} />
      <EmbeddingDistance wordOne="apple" wordTwo="banana" dimensions={3} />
      <EmbeddingDistance wordOne="apple" wordTwo="pineapple" dimensions={3} />

      <br />
      <br />
      <div>The reason they are so close is because we lose a lot of rich information when we drop that many dimensions</div>

    </div>
  );
}
