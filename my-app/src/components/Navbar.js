import React from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const Navbar = () => {
  return (
    <Box bg="blue.500" p={4}>
      <Flex justifyContent="space-around" alignItems="center" h="100%" maxH="64px">
        <Link as={NextLink} href="/" color="white" fontWeight="extrabold">
          Home
        </Link>
        <Link as={NextLink} href="/tools" color="white" fontWeight="extrabold">
          Tools
        </Link>
        <Link as={NextLink} href="/demo" color="white" fontWeight="extrabold">
          Demo
        </Link>
        <Link as={NextLink} href="/dev" color="white" fontWeight="extrabold">
          Developer
        </Link>
      </Flex>
    </Box>
  );
};

export default Navbar;
