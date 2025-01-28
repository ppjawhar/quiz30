import { useState } from "react";
import {
  Flex,
  Box,
  Container,
  Separator,
  Text,
  TextField,
  Button,
} from "@radix-ui/themes";
import Header from "../components/Header";
import EnterPartNum from "./EnterPartNum";
import PartipantDetails from "./ParticipantDetails";
import DailyQuestion from "./DailyQuestion";
import Completed from "./Completed";

function Home() {
  const [count, setCount] = useState(0);
  return (
    <Box>
      <Container size="1" py="9" px="5">
        <Flex direction="column" gap="7">
          <Header />
          <Flex direction="column" gap="5">
            {/* <EnterPartNum /> */}
            <PartipantDetails />
            <Separator my="1" size="4" />
            <DailyQuestion />
            {/* <Completed /> */}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default Home;
