import React, { useState , useEffect} from 'react';
import dynamic from 'next/dynamic';
//import FunctionsClientSource from '../abi/FunctionsClientSource';
//import ConfirmedOwnerSource from '../abi/ConfirmedOwnerSource';



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
import {submitRequest} from "../components/submitRequest";
import Buffer from "../Solidity_to_javascript/Buffer";
import CBOR from "../Solidity_to_javascript/CBOR";
import DependencyConfirmedOwner from "../Solidity_to_javascript/ConfirmedOwner";
import ConfirmedOwnerWithProposal from "../Solidity_to_javascript/ConfirmedOwnerWithProposal";
import Functions from "../Solidity_to_javascript/Functions";
import FunctionsBillingRegistryInterface from '../Solidity_to_javascript/FunctionsBillingRegistryInterface';
import FunctionsClient from '../Solidity_to_javascript/FunctionsClient';
import FunctionsClientInterface from '../Solidity_to_javascript/FunctionsClientInterface';
import FunctionsOracleInterface from '@/Solidity_to_javascript/FunctionsOracleInterface';
import OwnableInterface from '@/Solidity_to_javascript/OwnableInterface';



const Tools = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [daoName, setDaoName] = useState('');
  const [mint, setMint] = useState('');
  const [deployedAddress, setDeployedAddress] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [additionalSources, setAdditionalSources] = useState({
    "Buffer.sol": { content: Buffer },
    "CBOR.sol": { content: CBOR },
    "ConfirmedOwner.sol": { content: DependencyConfirmedOwner },
    "ConfirmedOwnerWithProposal.sol": { content: ConfirmedOwnerWithProposal },
    "Functions.sol": { content: Functions },
    "FunctionsBillingRegistryInterface.sol": { content: FunctionsBillingRegistryInterface },
    "FunctionsClient.sol": { content: FunctionsClient },
    "FunctionsClientInterface.sol": { content: FunctionsClientInterface },
    "FunctionsOracleInterface.sol": { content: FunctionsOracleInterface },
    "OwnableInterface.sol": { content: OwnableInterface },
  });
  
  



  
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
  
        const contractTemplate = `
        // SPDX-License-Identifier: MIT
        pragma solidity ^0.8.7;
        

        import {Functions, FunctionsClient} from "FunctionsClient.sol";
        import {ConfirmedOwner} from "ConfirmedOwner.sol";

      
        
        //interface
      
      contract FunctionsConsumer is FunctionsClient, ConfirmedOwner {
        using Functions for Functions.Request;
      
        bytes32 public latestRequestId;
        bytes public latestResponse;
        bytes public latestError;
    
      
        
      
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
          
        
          
    
          
      
        }
          
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
  
      let byteCode=""
      let abi=""
      console.log("Source:", source);
      try {
        try {
          const contractData = await compile(source, additionalSources );
          
    
          const data = contractData['FunctionsConsumer'];
          byteCode = data.byteCode;
          abi = data.abi;
          console.log("byteCode",byteCode)
          // Rest of the deployment code
        } catch (error) {
          console.error("Error deploying contract:", error);
        }
        
  
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


    const handleSubmit = async () => {
      const prompt = 'I am testing a project using you, only send the response 11 without a period or new line';
      try {
        const result = await submitRequest(prompt);
        console.log('Request submitted successfully:', result);
      } catch (error) {
        console.error('Request submission failed:', error);
      }
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
          <Button onClick={handleSubmit}>
      Submit Request
    </Button>
        </Container>
      </Center>
    </Box>
  );
};

export default Tools;
