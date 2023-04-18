importScripts('https://binaries.soliditylang.org/bin/soljson-latest.js');
const wrapper = require('solc/wrapper');

self.onmessage = (event) => {
    const contractCode = event.data.contractCode;
    const additionalSources = event.data.additionalSources || {};

    const sourceCode = {
        language: 'Solidity',
        sources: {
            "contract.sol": {content: contractCode} ,
            ...additionalSources
        },
        
        settings: {
            outputSelection: { '*': { '*': ['*'] } }
        }
    };
    console.log(sourceCode);
    const compiler = wrapper((self).Module);
    self.postMessage({
        output: JSON.parse(compiler.compile(JSON.stringify(sourceCode)))
    });
};
