import PointTable from "../components/PointTable";
import { Flex, Text } from "@radix-ui/themes";

function Leaderboard() {
  return (
    <Flex direction="column" gap="5" flexGrow="1">
      <Text size="5" className="font-semibold">
        Leaderboard
      </Text>
      <PointTable />
    </Flex>
  );
}

export default Leaderboard;
