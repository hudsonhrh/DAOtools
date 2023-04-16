import React from 'react';
import {
  Box,
  Heading,
  VStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  useColorMode,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import TokenArtifiact from "../abi/testToken.json";


const checkTokenBalance = async ( userAddress) => {
  try {
    const web3 = new Web3("https://rpc-mumbai.maticvigil.com/");
    const token = new web3.eth.Contract(TokenArtifiact.abi, "0xB54060e426f4cFB038a09f0f2A561E014A23FaeF");
    const balance = await token.methods.balanceOf(userAddress).call();
    console.log(`Balance of ${userAddress}:`, balance);
    return balance;
  } catch (error) {
    console.error("Error checking token balance:", error);
  }
};

const Demo = () => {
  const { colorMode, toggleColorMode } = useColorMode(); // Moved inside the functional component
  const [userAddress, setUserAddress] = React.useState("");
  const [taskRequirements, setTaskRequirements] = React.useState("");
  const [taskSubmission, setTaskSubmission] = React.useState("");
  const [mintFunctionInput, setMintFunctionInput] = React.useState("");


  return (
    <Box
      p={10}
      minH="100vh"
      bgGradient="linear(to-b, #f5f5f5, #ffffff)"
      borderRadius="xl"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Button
        position="absolute"
        top={5}
        right={5}
        onClick={toggleColorMode}
        variant="ghost"
        fontSize="xl"
      >
        {colorMode === "light" ? <FaMoon /> : <FaSun />}
      </Button>
      <Heading as="h1" size="2xl" color="black" mb={5}>
        Demo Page
      </Heading>
      <VStack
        spacing={6}
        w="100%"
        maxW="600px"
        p={8}
        boxShadow="lg"
        borderRadius="md"
        bg="white"
      >
        <Input
          placeholder="Enter user address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
        <Button
          onClick={() =>
            checkTokenBalance(userAddress).then((balance) =>
              alert(`Balance of ${userAddress}: ${balance}`)
            )
          }
          colorScheme="teal"
        >
          Check Token Balance
        </Button>
        <FormControl>
          <FormLabel>Task Requirements</FormLabel>
          <Textarea
            placeholder="Enter task requirements"
            value={taskRequirements}
            onChange={(e) => setTaskRequirements(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Task Submission</FormLabel>
          <Textarea
            placeholder="Enter task submission"
            value={taskSubmission}
            onChange={(e) => setTaskSubmission(e.target.value)}
          />
        </FormControl>
        <Button
          onClick={() => console.log(taskRequirements, taskSubmission)}
          colorScheme="teal"
        >
          Submit Task
        </Button>
      </VStack>
    </Box>
  );
  };
  
  export default Demo;