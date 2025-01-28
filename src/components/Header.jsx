import {
  Flex,
  Box,
  Container,
  Text,
  TextField,
  Button,
} from "@radix-ui/themes";

function Header() {
  return (
    <Flex gap="0" direction="column">
      <Text size="5" color="gray" className=" !font-sans">
        EK Family
      </Text>
      <Text size="7" className="font-semibold">
        Ramadan Quiz 2025
      </Text>
    </Flex>
  );
}

export default Header;
