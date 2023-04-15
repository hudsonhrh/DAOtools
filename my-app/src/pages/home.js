import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Container,
} from '@chakra-ui/react';



const Home = () => {
  return (
    <VStack spacing={10}>
      <Box bg="blue.500" w="100%" py={20}>
        <Container centerContent>
          <Heading as="h1" size="2xl" color="white">
            Welcome to DAO Tools
          </Heading>
          <Text fontSize="xl" color="white" mt={5}>
            DAO tools helps DAOs be more decnetralized
          </Text>
          <Button colorScheme="whiteAlpha" mt={8}>
            Get Started
          </Button>
        </Container>
      </Box>
    </VStack>
  );
};

export default Home;