import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Import Firestore instance
import {
  Flex,
  Box,
  Section,
  Text,
  TextField,
  Card,
  Button,
  TextArea,
  IconButton,
  Radio,
  Tabs,
} from "@radix-ui/themes";
import {
  ArrowLeftIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import AdminHeader from "../components/AdminHeader";
import AdminSidemenu from "../components/AdminSidemenu";

function QuizInfo() {
  const navigate = useNavigate();
  return (
    <Box>
      <Section size="4" py="7" px="7">
        <Flex gap="6" direction="column">
          <AdminHeader />
          <Flex gap="1">
            <AdminSidemenu />
            <Flex direction="column" gap="7" flexGrow="1">
              <Flex direction="column" gap="4">
                <Flex direction="column" gap="5" align="start">
                  <Button
                    size="2"
                    variant="soft"
                    onClick={() => navigate("/quizzes")}
                  >
                    <ArrowLeftIcon className="size-5" />
                    Back
                  </Button>
                </Flex>
                <Tabs.Root defaultValue="account" size="2">
                  <Tabs.List>
                    <Tabs.Trigger value="account">Quiz Info</Tabs.Trigger>
                    <Tabs.Trigger value="documents">Statistics</Tabs.Trigger>
                    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                  </Tabs.List>

                  <Box pt="3">
                    <Tabs.Content value="account">
                      <Text size="2">Quiz Info</Text>
                    </Tabs.Content>

                    <Tabs.Content value="documents">
                      <Text size="2">Statistics</Text>
                    </Tabs.Content>

                    <Tabs.Content value="settings">
                      <Text size="2">Settings</Text>
                    </Tabs.Content>
                  </Box>
                </Tabs.Root>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </Box>
  );
}

export default QuizInfo;
