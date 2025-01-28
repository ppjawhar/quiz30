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

function AddQuestion() {
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
                    Add Question
                  </Text>
                </Flex>
                <Flex direction="column" gap="5" width="600px">
                  <label>
                    <Text as="div" size="3" mb="1" weight="bold">
                      Question
                    </Text>
                    <TextArea size="3" placeholder="Reply to comment…" />
                  </label>
                  <Flex gap="2" align="center" justify="between">
                    <TextField.Root
                      placeholder="Option 1"
                      className="!bg-gray-200/30 w-full"
                      size="3"
                    />
                    <Flex align="center" gap="3">
                      <Text as="label" size="2">
                        <Flex gap="2">
                          <Checkbox color="grass" />
                          Correct
                        </Flex>
                      </Text>
                      <IconButton variant="soft">
                        <TrashIcon width="18" height="18" />
                      </IconButton>
                    </Flex>
                  </Flex>
                  <Flex gap="2" align="center" justify="between">
                    <TextField.Root
                      placeholder="Option 2"
                      className="!bg-gray-200/30 w-full"
                      size="3"
                    />
                    <Flex align="center" gap="3">
                      <Text as="label" size="2">
                        <Flex gap="2">
                          <Checkbox color="grass" />
                          Correct
                        </Flex>
                      </Text>
                      <IconButton variant="soft">
                        <TrashIcon width="18" height="18" />
                      </IconButton>
                    </Flex>
                  </Flex>
                  <Flex gap="2" align="center" justify="between">
                    <TextField.Root
                      placeholder="Option 3"
                      className="!bg-gray-200/30 w-full"
                      size="3"
                    />
                    <Flex align="center" gap="3">
                      <Text as="label" size="2">
                        <Flex gap="2">
                          <Checkbox color="grass" />
                          Correct
                        </Flex>
                      </Text>
                      <IconButton variant="soft">
                        <TrashIcon width="18" height="18" />
                      </IconButton>
                    </Flex>
                  </Flex>

                  <Button size="2" variant="soft" align="start">
                    + More Option
                  </Button>

                  <Button size="4" variant="solid">
                    Submit Question
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </Box>
  );
}

export default AddQuestion;
