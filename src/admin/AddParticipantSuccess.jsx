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
  ArrowLeftIcon,
  CheckCircleIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import AdminHeader from "../components/AdminHeader";
import AdminSidemenu from "../components/AdminSidemenu";

function AddParticipantSuccess() {
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
                </Flex>
                <Flex direction="column" gap="5" width="100" align="center">
                  <CheckCircleIcon className="size-20 text-emerald-500" />
                  <Text size="5" align="center" className="font-medium">
                    New participant added successfully with <br /> participation
                    number: 422
                  </Text>
                  <Flex direction="column" gap="2" pt="7">
                    <Flex gap="1" direction="row">
                      <Text size="4" color="gray" className=" !font-sans">
                        Participant No:
                      </Text>
                      <Text size="4" weight="medium" className=" !font-sans">
                        422
                      </Text>
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
                    <Flex gap="1" direction="row">
                      <Text size="4" color="gray" className=" !font-sans">
                        Phone number:
                      </Text>
                      <Text size="4" weight="medium" className=" !font-sans">
                        9633503495
                      </Text>
                    </Flex>
                  </Flex>

                  <Button size="4" variant="solid">
                    Add another participant
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

export default AddParticipantSuccess;
