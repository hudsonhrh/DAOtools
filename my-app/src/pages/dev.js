import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Container,
} from '@chakra-ui/react';
import { ethers } from "ethers";
import TokenArtifiact from "../abi/testToken.json";
import Web3 from 'web3';
import Functions from "../abi/FunctionsConsumer.json";

const deployTestContract = async () => {
  try {
    console.log(process.env.NEXT_PUBLIC_PRIVATE_KEY)
    const web3 = new Web3("https://rpc-mumbai.maticvigil.com/");
    const account = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.NEXT_PUBLIC_PRIVATE_KEY
    );
    const contract = new web3.eth.Contract(TokenArtifiact.abi);
    const deployOptions = {
      data: TokenArtifiact.bytecode,
      arguments: [],
    };

    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await contract.deploy(deployOptions).estimateGas({ from: account.address });

    const signedTx = await account.signTransaction({
      data: contract.deploy(deployOptions).encodeABI(),
      gas: gasEstimate,
      gasPrice: gasPrice,
      from: account.address,
      to: '',
    });

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Contract deployed at address:", receipt.contractAddress);
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
};

const deployRealContract = async () => {
  try {
    console.log(process.env.NEXT_PUBLIC_PRIVATE_KEY)
    const web3 = new Web3("https://rpc-mumbai.maticvigil.com/");
    const account = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.NEXT_PUBLIC_PRIVATE_KEY
    );

    const oracleAddress = "0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4";

    const contract = new web3.eth.Contract(Functions.abi);
    const deployOptions = {
      from: account.address,
      data: Functions.bytecode,
      arguments: [oracleAddress],
    };

    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await contract.deploy(deployOptions).estimateGas({ from: account.address });

    const signedTx = await account.signTransaction({
      data: contract.deploy(deployOptions).encodeABI(),
      gas: gasEstimate,
      gasPrice: gasPrice,
      from: account.address,
      to: '',
    });

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Contract deployed at address:", receipt.contractAddress);
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
};

const requestContract = async () => {
  try {
    console.log(process.env.NEXT_PUBLIC_PRIVATE_KEY)
    const web3 = new Web3("https://rpc-mumbai.maticvigil.com/");
    const account = web3.eth.accounts.privateKeyToAccount(
      "0x" + process.env.NEXT_PUBLIC_PRIVATE_KEY
    );
    const contract = new web3.eth.Contract(TokenArtifiact.abi);
    const deployOptions = {
      data: TokenArtifiact.bytecode,
      arguments: [],
    };

    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await contract.deploy(deployOptions).estimateGas({ from: account.address });

    const signedTx = await account.signTransaction({
      data: contract.deploy(deployOptions).encodeABI(),
      gas: gasEstimate,
      gasPrice: gasPrice,
      from: account.address,
      to: '',
    });

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Contract deployed at address:", receipt.contractAddress);
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
};




const Dev = () => {
    return (
        <Box>
        <Heading as="h1" size="2xl" color="black">
            Dev Page
        </Heading>
          <Button onClick={deployTestContract}>Deploy Test Contract</Button>
          <Button onClick={deployRealContract }>Deploy Real Contract</Button>
          <Button onClick={requestContract }>Request to Contract</Button>

        </Box>

    );
  };
  
  export default Dev;