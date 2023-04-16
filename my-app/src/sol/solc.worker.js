importScripts("https://binaries.soliditylang.org/bin/soljson-latest.js");
import wrapper from "solc/wrapper";

self.onmessage = (event) => {
  const sources = event.data.sources;
  const sourceCode = {
    language: "Solidity",
    sources: {},
    settings: {
      outputSelection: { "*": { "*": ["*"] } },
    },
  };

  for (const [filename, content] of Object.entries(sources)) {
    sourceCode.sources[filename] = { content };
  }

  console.log("Input:", sourceCode);

  const compiler = wrapper(self.Module);
  const compiledOutput = JSON.parse(
    compiler.compile(JSON.stringify(sourceCode))
  );

  console.log("Output:", compiledOutput);

  self.postMessage({
    output: compiledOutput,
  });
};

