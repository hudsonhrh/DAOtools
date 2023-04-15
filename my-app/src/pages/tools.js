import React, { useState } from 'react';
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


const Tools = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [daoName, setDaoName] = useState('');
  const [deployedAddress, setDeployedAddress] = useState('');
  const [deploying, setDeploying] = useState(false);

  const handleDeploy = async () => {
    if (selectedOptions.length && daoName) {
      setDeploying(true);
  
      // Compile and deploy the contract
      try {
        // Call the API route to compile the contract
        console.log("check3")
        const response = await fetch('/api/compile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ selectedOptions }),
        });
        console.log("check4")
        if (!response.ok) {
          const errorDetails = await response.json();
          console.error('Error compiling contract:', errorDetails);
          throw new Error('Error compiling contract');
        }
  
        const { abi, bytecode } = await response.json();
  
        // Deploy the contract
        try {
          const web3 = new Web3("https://rpc-mumbai.maticvigil.com/");
          const account = web3.eth.accounts.privateKeyToAccount(
            "0x" + process.env.NEXT_PUBLIC_PRIVATE_KEY
          );
          const contract = new web3.eth.Contract(abi);
          const deployOptions = {
            data: bytecode,
            arguments: [daoName],
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
      } catch (error) {
        console.error('Error deploying the contract:', error);
      }
  
      setDeploying(false);
    }
  };
  

  return (
    <Box
      p={10}
      minH="100vh"
      bgGradient="linear(to-b, #f5f5f5, #ffffff)"
      borderRadius="xl"
    >
      <Image
        src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f18"
        alt="Background image"
        position="fixed"
        zIndex="-1"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        objectFit="cover"
        opacity="0.3"
      />
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
                <VStack alignItems="start">
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
                <FormLabel size="lg">Input your DAO name</FormLabel>
                <Input
                  value={daoName}
                  onChange={(e) => setDaoName(e.target.value)}
                  placeholder="Your DAO Name"
                />
              </FormControl>
              <Button
                colorScheme="blue"
                onClick={handleDeploy}
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
