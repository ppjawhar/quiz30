import {
  Flex,
  Box,
  Container,
  Text,
  TextField,
  Button,
  Link,
  RadioCards,
} from "@radix-ui/themes";

function DailyQuestion() {
  return (
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
  );
}

export default DailyQuestion;
