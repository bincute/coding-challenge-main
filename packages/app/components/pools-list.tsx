import React, { useState, useEffect, Fragment } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  useColorModeValue,
  SimpleGrid,
  Image,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  ModalFooter,
  Select,
  useDisclosure,
  useToast,
  List,
  ListItem,
  Divider,
} from "@chakra-ui/react";

import { assetStoreContext, poolStoreContext } from "../pages/_app";

import { chain, assets, asset_list } from "@chain-registry/osmosis";

interface PoolsData {
  id: string;
  token1: { name: string; imgSrc: string };
  token2: { name: string; imgSrc: string };
  poolLiquidity: number;
  apr: number;
  myLiquidity: number;
  myBoundedAmount: number;
  longestDaysUnbonding: boolean;
}

const PoolProfile = ({ id, token1, token2 }) => (
  <Flex align="center" mb={4}>
    <Flex
      position="relative"
      align="center"
      h={{ base: 12, md: 14, lg: 16 }}
      pr={{ base: 10, sm: 14 }}
      mr={!token1 ? { base: 10, sm: 14 } : null}
    >
      {token1 ? (
        <Box
          w={{ base: 12, md: 14, lg: 16 }}
          h={{ base: 12, md: 14, lg: 16 }}
          bg="whiteAlpha.900"
          borderRadius="full"
          border="1px solid"
          borderColor={useColorModeValue("primary.100", "primary.900")}
          overflow="hidden"
          p={0.5}
        >
          <Image src={token1?.imgSrc} />
        </Box>
      ) : null}

      {token2 ? (
        <Box
          position="absolute"
          left={token1 && token2 ? { base: 8, sm: 10 } : { base: 0, sm: 0 }}
          w={{ base: 12, md: 14, lg: 16 }}
          h={{ base: 12, md: 14, lg: 16 }}
          bg="whiteAlpha.900"
          borderRadius="full"
          border="1px solid"
          borderColor={useColorModeValue("primary.100", "primary.900")}
          overflow="hidden"
          p={0.5}
        >
          <Image src={token2.imgSrc} />
        </Box>
      ) : null}
    </Flex>
    <Flex flexDirection="column" justify="center">
      <Text fontSize="xl" fontWeight="extrabold" mr={token1 && token2 ? 0 : 10}>
        Pools #{id}
      </Text>
      <Text
        fontWeight="bold"
        color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}
        wordBreak="break-word"
      >
        {/* {token1 && token2
          ? `${token1.name}/${token2.name}`
          : token1
          ? token1.name
          : token2
          ? token2.name
          : null} */}
        {token1?.name} {token1 && token2 ? "/" : ""} {token2?.name}
      </Text>
    </Flex>
  </Flex>
);

const PoolsCard = ({ poolsData }: { poolsData: PoolsData[] }) => {
  return (
    <SimpleGrid columns={{ sm: 2, lg: 4 }} gap={4} mb={8}>
      {poolsData.map(
        ({
          id,
          token1,
          token2,
          poolLiquidity,
          apr,
          myLiquidity,
          myBoundedAmount,
          longestDaysUnbonding,
        }) => {
          return (
            <Box
              key={id}
              borderRadius="lg"
              border="1px solid"
              borderColor={
                longestDaysUnbonding
                  ? useColorModeValue("primary.500", "primary.300")
                  : "transparent"
              }
              boxShadow="md"
              _hover={{
                cursor: "pointer",
                borderColor: longestDaysUnbonding
                  ? useColorModeValue("primary.500", "primary.300")
                  : "orange.300",
              }}
              bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")}
              p={4}
            >
              <PoolProfile id={id} token1={token1} token2={token2} />
              <Grid
                templateColumns={{ lg: "1fr 1fr" }}
                gap={{ base: 2, md: 4 }}
              >
                <GridItem>
                  <Text
                    fontWeight="semibold"
                    color={useColorModeValue(
                      "blackAlpha.600",
                      "whiteAlpha.600"
                    )}
                  >
                    Pool Liquidity
                  </Text>
                  <Text
                    fontSize={{ base: "lg", sm: "xl" }}
                    fontWeight="extrabold"
                    wordBreak="break-word"
                  >
                    ${poolLiquidity.toLocaleString()}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text
                    fontWeight="semibold"
                    color={useColorModeValue(
                      "blackAlpha.600",
                      "whiteAlpha.600"
                    )}
                  >
                    Apr
                  </Text>
                  <Text
                    fontSize={{ base: "lg", sm: "xl" }}
                    fontWeight="extrabold"
                  >
                    {apr}%
                  </Text>
                </GridItem>
                <GridItem colSpan={{ lg: 2 }}>
                  <Divider
                    borderColor={useColorModeValue(
                      "primary.300",
                      "primary.100"
                    )}
                  />
                </GridItem>
                <GridItem>
                  <Text
                    fontWeight="semibold"
                    color={useColorModeValue(
                      "blackAlpha.600",
                      "whiteAlpha.600"
                    )}
                  >
                    My Liquidity
                  </Text>
                  <Text
                    fontSize={{ base: "lg", sm: "xl" }}
                    fontWeight="extrabold"
                  >
                    ${myLiquidity}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text
                    fontWeight="semibold"
                    color={useColorModeValue(
                      "blackAlpha.600",
                      "whiteAlpha.600"
                    )}
                  >
                    My Bounded Amount
                  </Text>
                  <Text
                    fontSize={{ base: "lg", sm: "xl" }}
                    fontWeight="extrabold"
                  >
                    ${myBoundedAmount}
                  </Text>
                </GridItem>
              </Grid>
            </Box>
          );
        }
      )}
    </SimpleGrid>
  );
};

export default function ListPools() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedId2, setSelectedId2] = useState<string>();
  const [removingOrUpdatingAssetName, setRemovingOrUpdatingAssetName] =
    useState<string>();
  const [addingAssetName, setAddingAssetName] = useState<string>();

  const assetStore = React.useContext(assetStoreContext);
  const poolStore = React.useContext(poolStoreContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpen2nd,
    onOpen: onPen2nd,
    onClose: onClose2nd,
  } = useDisclosure();

  const {
    isOpen: isOpen3rd,
    onOpen: onPen3rd,
    onClose: onClose3rd,
  } = useDisclosure();

  const onCloseModal = () => {
    onClose();
    setSelectedId(undefined);
    setSelectedId2(undefined);
  };

  const onClickCreateNewPool = () => {
    onOpen();
  };

  const onClickRemoveOrUpdateAssets = () => {
    onPen2nd();
  };

  const onClickAddAssets = () => {
    onPen3rd();
  };

  const onChangePool1 = (e) => {
    const name = e.target.value;
    setSelectedId(name);
  };

  const onChangePool2 = (e) => {
    const name = e.target.value;
    setSelectedId2(name);
  };
  const toast = useToast();
  const onClickConfirm = () => {
    if (!(selectedId && selectedId2)) {
      toast({
        title: `You must choose 2 assets`,
        status: "error",
        isClosable: true,
      });
      return;
    }
    onClose();
    const asset1 = assetStore.assets.find((item) => selectedId === item.name);
    const asset2 = assetStore.assets.find((item) => selectedId2 === item.name);
    poolStore.addPool(asset1, asset2);
    setSelectedId(undefined);
    setSelectedId2(undefined);
  };

  const assets = assetStore.assets;
  const waitAddingAssets = assetStore.waitAddingAssets;
  const listPools = poolStore.listPools;

  const onClickAddAsset = () => {
    if (!addingAssetName) {
      toast({
        title: `You should choose an asset`,
        status: "error",
        isClosable: true,
      });
      return;
    }
    const asset = assetStore.waitAddingAssets.find(
      (item) => addingAssetName === item.name
    );
    assetStore.addAsset(asset);
    onClose3rd();
    setAddingAssetName(undefined);
  };
  const onClickUpdateAsset = () => {
    const asset = assetStore.assets.find(
      (item) => removingOrUpdatingAssetName === item.name
    );

    assetStore.updateAsset(asset);
    const name = removingOrUpdatingAssetName;
    setRemovingOrUpdatingAssetName("");
    setTimeout(() => {
      setRemovingOrUpdatingAssetName(name);
    });
  };

  const onClickRemoveAsset = () => {
    const asset = assetStore.assets.find(
      (item) => removingOrUpdatingAssetName === item.name
    );
    assetStore.removeAsset(asset);
    poolStore.updatePool(asset);
    onClose2nd();
  };

  const onChangeRemovingAsset = (e) => {
    const name = e.target.value;
    setRemovingOrUpdatingAssetName(name);
  };

  const onChangeAddingAsset = (e) => {
    const name = e.target.value;
    setAddingAssetName(name);
  };

  const onClickConfirmAssetModal = () => {
    onClose();
  };

  const updatingAsset = assets.find(
    (it) => it.name === removingOrUpdatingAssetName
  );

  return (
    <>
      <Box p={4}>
        <Flex align="center" mb={6}>
          <Heading as="h2" fontSize="2xl" mr={4}>
            Active Pools
          </Heading>
          <Button
            display={{ base: "none", sm: "block" }}
            onClick={onClickCreateNewPool}
            mr={4}
          >
            Create New Pool
          </Button>
          <Button
            display={{ base: "none", sm: "block" }}
            onClick={onClickRemoveOrUpdateAssets}
            mr={4}
          >
            Remove or Update Assets
          </Button>

          <Button
            display={{ base: "none", sm: "block" }}
            onClick={onClickAddAssets}
          >
            Add Assets
          </Button>
        </Flex>
        <SimpleGrid columns={{ sm: 2 }} gap={4} maxW={{ sm: "md" }} mb={8}>
          <Box>
            <Text
              fontWeight="semibold"
              color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}
              mb={1}
            >
              OSMO Price
            </Text>
            <Text fontSize="3xl" fontWeight="bold" py={2}>
              $4.41
            </Text>
          </Box>
          <Box>
            <Text
              fontWeight="semibold"
              color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}
              mb={2}
            >
              Reward distribution on
            </Text>
            <Flex align="center">
              <Text fontSize="3xl" fontWeight="bold">
                12
              </Text>
              <Box
                borderRadius="lg"
                bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")}
                px={3}
                mx={1}
              >
                <Text fontSize="2xl" fontWeight="bold">
                  H
                </Text>
              </Box>
              <Text fontSize="3xl" fontWeight="bold">
                19
              </Text>
              <Box
                borderRadius="lg"
                bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")}
                px={3}
                mx={1}
              >
                <Text fontSize="2xl" fontWeight="bold">
                  M
                </Text>
              </Box>
            </Flex>
          </Box>
        </SimpleGrid>
        <Box
          bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")}
          m={-4}
          px={4}
          py={6}
        >
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            My Pools
          </Text>
          <PoolsCard poolsData={listPools} />
        </Box>
      </Box>
      <Modal
        isCentered
        onClose={onCloseModal}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Pool</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Select Asset 1 "
              onChange={onChangePool1}
              mb={4}
            >
              {assets.map((item) => (
                <option value={item?.name}>
                  <span>{item?.name} </span>
                  <img src={item?.logo_URIs?.png} />
                </option>
              ))}
            </Select>
            <Select placeholder="Select Asset 2 " onChange={onChangePool2}>
              {assets.map((item) => (
                <option value={item.name}>
                  <span>{item.name} </span>
                  <img src={item.logo_URIs.png} />
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={onClickConfirm}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isCentered onClose={onClose2nd} isOpen={isOpen2nd}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove or Update Assets</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Select An Asset"
              onChange={onChangeRemovingAsset}
            >
              {assets.map((item) => (
                <option value={item.name}>
                  <span>{item.name} </span>
                  <img src={item.logo_URIs.png} />
                </option>
              ))}
            </Select>

            {updatingAsset ? (
              <List spacing={3} mt={4}>
                <ListItem>Name: {updatingAsset.name}</ListItem>
                <Divider orientation="horizontal" />
                <ListItem>Base: {updatingAsset.base}</ListItem>
                <Divider orientation="horizontal" />
                <ListItem>
                  Denom_units:
                  {updatingAsset.denom_units.map((it) => (
                    <>
                      <ListItem>
                        <Text ml={4}>
                          denom: {it.denom}
                          <Divider orientation="horizontal" />
                          exponent: {it.exponent}
                        </Text>
                      </ListItem>
                      <Divider orientation="horizontal" />
                    </>
                  ))}
                </ListItem>

                <ListItem>symbol: {updatingAsset?.symbol}</ListItem>
                <Divider orientation="horizontal" />
              </List>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose2nd}>
              Close
            </Button>

            <Button colorScheme="blue" onClick={onClickUpdateAsset} mr={3}>
              Update the Asset
            </Button>

            <Button colorScheme="blue" onClick={onClickRemoveAsset}>
              Remove the Asset
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isCentered onClose={onClose3rd} isOpen={isOpen3rd}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Asset</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Select An Asset"
              onChange={onChangeAddingAsset}
            >
              {waitAddingAssets.map((item) => (
                <option value={item.name}>
                  <span>{item.name} </span>
                  <img src={item.logo_URIs.png} />
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose3rd}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={onClickAddAsset}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
