import { useState } from "react";
import {
  Flex,
  Box,
  Container,
  Section,
  Separator,
  Text,
  TextField,
  Card,
  Button,
  Table,
} from "@radix-ui/themes";
import {
  HomeIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import AdminHeader from "../components/AdminHeader";
import AdminSidemenu from "../components/AdminSidemenu";

function Dashboard() {
  const [count, setCount] = useState(0);
  return (
    <Box>
      <Section size="4" py="7" px="7">
        <Flex gap="6" direction="column">
          <AdminHeader />
          <Flex gap="1">
            <AdminSidemenu />
            <Flex direction="column" gap="7" flexGrow="1">
              <Flex direction="column" gap="4">
                <Flex gap="3">
                  <Card>
                    <Flex
                      gap="4"
                      align="center"
                      py="1"
                      pl="3"
                      pr="4"
                      width="150px"
                    >
                      <CalendarDaysIcon className="size-7 text-gray-500/50" />
                      <Box>
                        <Text as="div" size="2" color="gray">
                          Day
                        </Text>
                        <Text as="div" size="2" weight="bold">
                          01 / 30
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                  <Card>
                    <Flex
                      gap="4"
                      align="center"
                      py="1"
                      pl="3"
                      pr="4"
                      width="150px"
                    >
                      <UsersIcon className="size-7 text-gray-500/50" />
                      <Box>
                        <Text as="div" size="2" color="gray">
                          Participants
                        </Text>
                        <Text as="div" size="2" weight="bold">
                          30
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                </Flex>
              </Flex>
              <Flex direction="column" gap="4">
                <Text size="5" className="font-semibold">
                  Leaderboard
                </Text>
                <Table.Root variant="surface">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Table.Row>
                      <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
                      <Table.Cell>danilo@example.com</Table.Cell>
                      <Table.Cell>Developer</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>
                      <Table.Cell>zahra@example.com</Table.Cell>
                      <Table.Cell>Admin</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.RowHeaderCell>Jasper Eriksson</Table.RowHeaderCell>
                      <Table.Cell>jasper@example.com</Table.Cell>
                      <Table.Cell>Developer</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </Box>
  );
}

export default Dashboard;
