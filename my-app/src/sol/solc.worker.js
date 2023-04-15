importScripts("https://binaries.soliditylang.org/bin/soljson-latest.js");
import wrapper from "solc/wrapper";

self.onmessage = (event) => {
  const contractCode = event.data.contractCode;
  const sourceCode = {
    language: "Solidity",
    sources: {
      "contract.sol": { content: contractCode },
    },
    settings: {
      outputSelection: { "*": { "*": ["*"] } },
    },
  };

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
