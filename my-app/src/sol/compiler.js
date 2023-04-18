export const compile = async (contractCode, additionalSources) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./solc.worker.js", import.meta.url));

    worker.onmessage = function (e) {
      const output = e.data.output;

      if (output.errors && output.errors.length > 0) {
        console.error("Compilation errors:", output.errors);
      }
    
      if (output.warnings && output.warnings.length > 0) {
        console.warn("Compilation warnings:", output.warnings);
      }
      const result = {};
      if (!output.contracts) {
        reject("Invalid source code");
        return;
      }
      for (const fileName in output.contracts) {
        for (const contractName in output.contracts[fileName]) {
          const contract = output.contracts[fileName][contractName];

          result[contractName] = {
            contractName: contractName,
            byteCode: contract.evm.bytecode.object,
            abi: contract.abi,
          };
        }
      }
      resolve(result);
    };

    worker.onerror = reject;
    worker.postMessage({
      contractCode: contractCode,
      additionalSources: additionalSources
    });
    
    
  });
};
