Hey @Cyrus and @Zach,

I believe if we are able to build the below two demos we will prove that it is now possible for us to quickly and accurately represent human knowledge in mathematically digital space and for us to use this representation of knowledge to solve real world problems.

The demos below require us to build the knowledge primitatives for `encode`, `diffing`, `searching`, `subtracting` and `filtering`. Each demo demonstrates an outcome that is economically valueable.

## Demo #1: Discovering new knowledge

Accelerating the discovering of new knowledge...
1. `know encode` 50 research papers and then `know merge` them together into a file named `all-my-market-research.know`
2. `know encode new_paper_A.pdf | save new_paper_A.know` 
3. View the new knowledge 
`know subtract new_paper_A.know all-my-research.know | know view`
  - Know view will show the sections of new_paper_A.pdf that is not already in all-my-market-research.know


## Demo #2: Knowledge retrival for complex question answer

This demo shows the fundamental approaches in the `know cli` are able to approach complex research questions in a way that is superior to know retrival methods (keyword search, semantic search, and graph RAG)

Question
> Is there a polyurethane or urethane coating available in the UK for internal pipe sealing that meets GIS/LC8-3:2006 standards?

[Draft: Work in Progress]
Needed Operations
- `know search "Internal Pipe Sealing Coating's"` 
  - `know filter "material is polyurethane || urethane"`
  - output: `pipe_coating.know`
- `know seach "GIS/LC8-3:2006 standards"`
  - `know filter "Pipe Sealing Standards"`
  - output: `gis_lc832006_pipe_coating_requirements.know`
- Question: Does `pipe_coating.know` meet `gis_lc832006_pipe_coating_requirements.know`?
  -TODO: Meet

Here is where I'm working and developing: https://github.com/Humata-ai/the-know-file-format

Feedback welcome
