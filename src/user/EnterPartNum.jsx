import {
  Flex,
  Box,
  Container,
  Text,
  TextField,
  Button,
} from "@radix-ui/themes";

function EnterPartNum() {
  return (
    <Flex direction="column" gap="4">
      <Text size="5" color="gray">
        Your participation number:
      </Text>
      <TextField.Root
        className="!h-12 !bg-gray-200/30"
        size="3"
        placeholder="Enter your participation number"
      />
      <Button size="4" variant="solid">
        Continue
      </Button>
    </Flex>
  );
}

export default EnterPartNum;
