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

            {/* <Completed /> */}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default PlayQuiz;
