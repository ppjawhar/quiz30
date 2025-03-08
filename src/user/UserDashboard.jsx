import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Container,
  Button,
  Text,
  Separator,
  Tabs,
  Callout,
  SegmentedControl,
} from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import Header from "../components/Header";
import UserPointTable from "../components/user/UserPointTable";
import QuizDetails from "../components/user/QuizDetails";
import DailyAttend from "../components/user/DailyAttend";

function UserDashboard() {
  const [selectedSegment, setSelectedSegment] = useState("stat");
  return (
    <Box>
      <Container size="1" py="9" px="5">
        <Flex direction="column" gap="7">
          <Header />
          <SegmentedControl.Root
            size="3"
            variant="surface"
            value={selectedSegment}
            onValueChange={setSelectedSegment}
          >
            <SegmentedControl.Item value="stat">
              ക്വിസ് വിവരങ്ങൾ
            </SegmentedControl.Item>

            <SegmentedControl.Item value="leaderboard">
              പോയിന്റ് നില
            </SegmentedControl.Item>
          </SegmentedControl.Root>

          {selectedSegment === "stat" && (
            <Flex>
              <QuizDetails />
            </Flex>
          )}
          {selectedSegment === "leaderboard" && (
            <Flex>
              <UserPointTable />
            </Flex>
          )}
        </Flex>
      </Container>
    </Box>
  );
}

export default UserDashboard;
