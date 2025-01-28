import {
  Flex,
  Box,
  Container,
  Text,
  TextField,
  Button,
  Link,
} from "@radix-ui/themes";

function PartipantDetails() {
  return (
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
  );
}

export default PartipantDetails;
