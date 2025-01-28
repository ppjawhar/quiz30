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
import { CheckCircleIcon } from "@heroicons/react/24/outline";

function Completed() {
  return (
    <Flex gap="5" direction="column" align="center">
      <CheckCircleIcon className="size-20 text-emerald-500" />
      <Text size="6" align="center" className="!font-sans">
        Your answer submitted successfully!
      </Text>

      <Button size="4" variant="solid">
        OK
      </Button>
    </Flex>
  );
}

export default Completed;
