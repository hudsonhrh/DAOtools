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

const Tools = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [daoName, setDaoName] = useState('');
  const [deployedAddress, setDeployedAddress] = useState('');
  const [deploying, setDeploying] = useState(false);

  const handleDeploy = () => {
    if (selectedOptions.length && daoName) {
      setDeploying(true);
      // Here, you can call the function to deploy the contract and get the deployed address
      const deployedContractAddress = '0x12345...'; // Replace this with the actual deployed contract address
      setDeployedAddress(deployedContractAddress);
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
