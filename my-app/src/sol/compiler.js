// src/sol/compiler.js
export const compile = (contractCode) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL("./solc.worker.js", import.meta.url));
  
      worker.onmessage = function (e) {
        const output = e.data.output;
        const result = [];
        if (!output.contracts) {
          reject("Invalid source code");
          return;
        }
        const contractFileName = "contract.sol";
        for (const contractName in output.contracts[contractFileName]) {
            const contract = output.contracts[contractFileName][contractName];

          result.push({
            contractName: contractName,
            byteCode: contract.evm.bytecode.object,
            abi: contract.abi,
          });
        }
        resolve(result);
      };
  
      worker.onerror = reject;
      worker.postMessage({
        contractCode: contractCode,
      });
    });
  };
  