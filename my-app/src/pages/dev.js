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

const deployTestContract = async () => {
  try {
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

        </Box>

    );
  };
  
  export default Dev;