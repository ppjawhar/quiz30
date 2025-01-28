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
  TextArea,
  Checkbox,
  IconButton,
  Radio,
} from "@radix-ui/themes";
import {
  HomeIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
  CalendarDaysIcon,
  ArrowLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import AdminHeader from "../components/AdminHeader";
import AdminSidemenu from "../components/AdminSidemenu";

function Question() {
  const [count, setCount] = useState(0);
  return (
    <Box>
      <Section size="4" py="7" px="7">
        <Flex gap="6" direction="column">
          <AdminHeader />
          <Flex gap="1">
            <AdminSidemenu />
            <Flex direction="column" gap="7" flexGrow="1">
              <Flex direction="column" gap="7">
                <Flex direction="column" gap="5" align="start">
                  <Button size="3" variant="soft">
                    <ArrowLeftIcon className="size-5" />
                    Back
                  </Button>
                  <Text size="5" className="font-semibold">
                    Question for day 1
                  </Text>
                </Flex>
                <Flex direction="column" gap="5" width="600px">
                  <Flex justify="between" gap="8">
                    <Text size="5">
                      What is the capital of Indian state Kerala?
                    </Text>
                    <Button size="2" variant="soft">
                      Edit
                    </Button>
                  </Flex>

                  <Flex direction="column" gap="2">
                    <Card>
                      <Flex gap="3" align="center" justify="between">
                        <Text size="2" weight="regular">
                          Teodros Girmay
                        </Text>
                        <Text size="2" weight="regular" color="grass">
                          Correct
                        </Text>
                      </Flex>
                    </Card>
                    <Card>
                      <Flex gap="3" align="center" justify="between">
                        <Text size="2" weight="regular">
                          Teodros Girmay
                        </Text>
                      </Flex>
                    </Card>
                    <Card>
                      <Flex gap="3" align="center" justify="between">
                        <Text size="2" weight="regular">
                          Teodros Girmay
                        </Text>
                      </Flex>
                    </Card>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </Box>
  );
}

export default Question;
