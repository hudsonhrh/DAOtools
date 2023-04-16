import React, { useState , useEffect} from 'react';
import dynamic from 'next/dynamic';
import background from '../../public/background.jpg';

import {
  Box,
  Heading,
  VStack,
  CheckboxGroup,
  Checkbox,
  Input,
  Button,
  Text,
  Center,
  Container,
  FormControl,
  FormLabel,
  Progress,
  Image,
} from '@chakra-ui/react';
import { ethers } from "ethers";
import Web3  from "web3";
import { compile } from "../sol/compiler";




const Tools = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [daoName, setDaoName] = useState('');
  const [mint, setMint] = useState('');
  const [deployedAddress, setDeployedAddress] = useState('');
  const [deploying, setDeploying] = useState(false);


  
  const getFunctionality = (option) => {
    // Return the Solidity code for each functionality
    switch (option) {
      case 'AI Code Review':
        return `
  function aiCodeReview() public view returns (string memory) {
      return "AI Code Review functionality";
  }
  `;
      case 'AI Research Review':
        return `
  function aiResearchReview() public view returns (string memory) {
      return "AI Research Review functionality";
  }
  `;
      case 'Attendance Tracker':
        return `
  function attendanceTracker() public view returns (string memory) {
      return "Attendance Tracker functionality";
  }
  `;
      case 'Combined Functionality':
        return `
  function combinedFunctionality() public view returns (string memory) {
      return "Combined AI Code Review and AI Research Review functionality";
  }
  `;
      default:
        return '';
    }
  };
  

  const compileContract = async () => {
    if (selectedOptions.length && daoName) {
      setDeploying(true);
  
      const bothSelected = selectedOptions.includes('AI Code Review') && selectedOptions.includes('AI Research Review');
      const updatedOptions = bothSelected
        ? selectedOptions.filter((option) => option !== 'AI Code Review' && option !== 'AI Research Review').concat('Combined Functionality')
        : selectedOptions;
  
      const contractTemplate= `
      // SPDX-License-Identifier: MIT
      pragma solidity ^0.8.7;
      
      import {Functions, FunctionsClient} from "./dev/functions/FunctionsClient.sol";
      
      import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
      
      import {IDAO} from  "./Interface.sol";
      
      
      contract FunctionsConsumer is FunctionsClient, ConfirmedOwner {
        using Functions for Functions.Request;
      
        bytes32 public latestRequestId;
        bytes public latestResponse;
        bytes public latestError;
      
        IDAO DAO;
      
        
      
        event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
      
        
        constructor(address oracle) FunctionsClient(oracle) ConfirmedOwner(msg.sender) {}
      

        function executeRequest(
          string calldata source,
          bytes calldata secrets,
          string[] calldata args,
          uint64 subscriptionId,
          uint32 gasLimit
        ) public onlyOwner returns (bytes32) {
          Functions.Request memory req;
          req.initializeRequest(Functions.Location.Inline, Functions.CodeLanguage.JavaScript, source);
          if (secrets.length > 0) {
            req.addRemoteSecrets(secrets);
          }
          if (args.length > 0) req.addArgs(args);
      
          bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit);
          latestRequestId = assignedReqID;
          
      
          return assignedReqID;
        }
      
        
      
        function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
          latestResponse = response;
          latestError = err;
          
          bytes32 answer = bytes32(response);
          
        
          
    
          // Functionality Placeholders
          
      

          
        function updateOracleAddress(address oracle) public onlyOwner {
          setOracle(oracle);
        }
      
        function addSimulatedRequestId(address oracleAddress, bytes32 requestId) public onlyOwner {
          addExternalRequest(oracleAddress, requestId);
        }
      }
      `;
      const source = contractTemplate.replace(
        '// Functionality Placeholders',
        updatedOptions.map(getFunctionality).join('\n')
      );
  
      // Compile the contract
      try {
        const contractData = await compile(source);
        const data = contractData[0];
        const byteCode = data.byteCode
        const abi = data.abi
  
        // Deploy the contract
        const web3 = new Web3("https://rpc-mumbai.maticvigil.com/");
        const account = web3.eth.accounts.privateKeyToAccount(
          "0x" + process.env.NEXT_PUBLIC_PRIVATE_KEY
        );
        const oracleAddress = "0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4";

        const contract = new web3.eth.Contract(abi);
        const deployOptions = {
          from: account.address,
          data: byteCode,
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
  };
  
  
  
  

  return (
    <Box
      p={10}
      minH="100vh"
      bgGradient="linear(to-b, #f5f5f5, #ffffff)"
      borderRadius="xl"
    >
      <Center>
        <Container maxW="container.md">
          <Box
            bg="white"
            boxShadow="xl"
            p={8}
            borderRadius="xl"
            position="relative"
          >
            {deploying && (
              <Progress
                position="absolute"
                top={0}
                left={0}
                w="100%"
                borderRadius="xl"
                colorScheme="blue"
                size="sm"
                isIndeterminate
              />
            )}
            <VStack spacing={6} alignItems="start">
              <Heading size="lg">Choose the functionality your DAO needs</Heading>
              <Box
                bg="gray.50"
                boxShadow="md"
                p={8}
                borderRadius="xl"
                position="center">
              <CheckboxGroup
                colorScheme="green"
                onChange={setSelectedOptions}
                value={selectedOptions}
              >
                <VStack  alignItems="start">
                  <Checkbox size="lg" value="AI Code Review">
                    AI Code Review
                  </Checkbox>
                  <Checkbox size="lg" value="AI Research Review">
                    AI Research Review
                  </Checkbox>
                  <Checkbox size="lg" value="Attendance Tracker">
                    Attendance Tracker
                  </Checkbox>
                </VStack>
              </CheckboxGroup>
              </Box>
              <FormControl id="daoName">
                <FormLabel size="lg">Input your DAO Token contract adress</FormLabel>
                <Input
                  value={daoName}
                  onChange={(e) => setDaoName(e.target.value)}
                  placeholder="DAO Contract Adress"
                />
              </FormControl>
              <FormControl id="mintFunction">
                <FormLabel size="lg">Input your DAO Tokens mint function</FormLabel>
                <Input
                  value={mint}
                  onChange={(e) => setMint(e.target.value)}
                  placeholder="Token Mint Function"
                />
              </FormControl>
              <Button
                colorScheme="blue"
                onClick={compileContract}
                disabled={deploying}
              >
                Deploy Your Contract
              </Button>
              {deployedAddress && (
                <Text mt={4}>
                  Deployed Contract Address:{' '}
                  <strong>{deployedAddress}</strong>
                </Text>
              )}
            </VStack>
          </Box>
        </Container>
      </Center>
    </Box>
  );
};

export default Tools;
