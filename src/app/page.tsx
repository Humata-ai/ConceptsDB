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
    "cat",
    "cats",
    "apple",
    "pineapple",
    "banana",
    "Jesus",
  ];

  const wordsWithEmbeddings = await addCoordinatesToWords(words)
  const points = wordsWithEmbeddings.map(addColor)

  return (
    <div style={styles}>
      <h3>- [ ] Question: Cat and Apple appear very closely while apple and banana appear very far apart. Why?</h3>
      <br />
      <br />
      <PlotExample points={points} />

      <EmbeddingDistance wordOne="cat" wordTwo="cat" />
      <EmbeddingDistance wordOne="cat" wordTwo="cats" />
      <EmbeddingDistance wordOne="cat" wordTwo="apple" />
      <EmbeddingDistance wordOne="cat" wordTwo="pineapple" />
      <EmbeddingDistance wordOne="cat" wordTwo="banana" />
      <EmbeddingDistance wordOne="cat" wordTwo="Jesus" />

      <br />
      <EmbeddingDistance wordOne="apple" wordTwo="banana" />
      <EmbeddingDistance wordOne="apple" wordTwo="pineapple" />

    </div>
  );
}
