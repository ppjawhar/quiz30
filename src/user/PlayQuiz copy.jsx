import {
  Flex,
  Box,
  Container,
  Link,
  RadioCards,
  Button,
  Text,
  Separator,
} from "@radix-ui/themes";
import Header from "../components/Header";

function PlayQuiz() {
  return (
    <Box>
      <Container size="1" py="9" px="5">
        <Flex direction="column" gap="7">
          <Header />
          <Flex direction="column" gap="5">
            <Flex direction="column" gap="1">
              <Flex gap="1" direction="row">
                <Text size="4" color="gray" className=" !font-sans">
                  Participant No:
                </Text>
                <Link size="4" color="solid" className=" !font-sans">
                  422
                </Link>
              </Flex>
              <Flex gap="1" direction="row">
                <Text size="4" color="gray" className=" !font-sans">
                  Participant Name:
                </Text>
                <Text size="4" weight="medium" className=" !font-sans">
                  Player Name
                </Text>
              </Flex>
              <Flex gap="1" direction="row">
                <Text size="4" color="gray" className=" !font-sans">
                  Age:
                </Text>
                <Text size="4" weight="medium" className=" !font-sans">
                  30
                </Text>
              </Flex>
            </Flex>
            <Separator size="4" />
            <Flex direction="column" gap="5">
              <Flex gap="1" direction="row">
                <Text size="4" color="gray" className=" !font-sans">
                  Question for Ramadan
                </Text>
                <Link size="4" color="solid" className=" !font-sans">
                  01
                </Link>
                <Text size="4" color="gray" className=" !font-sans">
                  -
                </Text>
                <Text size="4" color="gray" className=" !font-sans">
                  28 Feb 2025
                </Text>
              </Flex>
              <Flex gap="5" direction="column">
                <Text size="6" className=" !font-sans">
                  What is the capital of Indian state Kerala?
                </Text>
                <RadioCards.Root columns="1">
                  <RadioCards.Item value="1">
                    <Flex direction="column" width="100%">
                      <Text>Kannur</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="2">
                    <Flex direction="column" width="100%">
                      <Text>Kannur</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="3">
                    <Flex direction="column" width="100%">
                      <Text>Kannur</Text>
                    </Flex>
                  </RadioCards.Item>
                </RadioCards.Root>
                <Button size="4" variant="solid">
                  Submit
                </Button>
              </Flex>
            </Flex>
            {/* <Completed /> */}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default PlayQuiz;
