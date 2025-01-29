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
  DataList,
  Badge,
  Code,
  Link,
  Strong,
  Separator,
  AlertDialog,
  Dialog,
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
    <Flex direction="column" gap="7" flexGrow="1">
      <Flex direction="column" gap="5">
        <Flex justify="between">
          <Button size="2" variant="soft" onClick={() => navigate("/quizzes")}>
            <ArrowLeftIcon className="size-5" />
            Back
          </Button>
        </Flex>

        <Flex justify="between" align="center">
          <Text size="5" className="font-semibold">
            Ramdan 1
          </Text>
          <Flex gap="2">
            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <IconButton variant="soft" color="red">
                  <TrashIcon width="18" height="18" />
                </IconButton>
              </AlertDialog.Trigger>
              <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>Delete Quiz?</AlertDialog.Title>
                <AlertDialog.Description size="2">
                  Are you sure? This quiz will no longer be available.
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                    <Button variant="soft" color="gray">
                      Cancel
                    </Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                    <Button variant="solid" color="red">
                      Delete
                    </Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </Flex>
        </Flex>
      </Flex>
      <Tabs.Root defaultValue="info" size="2">
        <Tabs.List>
          <Tabs.Trigger value="info">Quiz Info</Tabs.Trigger>
          <Tabs.Trigger value="documents">Statistics</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="info">
            <Flex>
              <Flex
                py="4"
                gap="7"
                direction="column"
                justify="start"
                width="40%"
              >
                <DataList.Root>
                  <DataList.Item>
                    <DataList.Label minWidth="88px">Name</DataList.Label>
                    <DataList.Value>
                      <Strong>Ramadan 1</Strong>
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label minWidth="88px">Description</DataList.Label>
                    <DataList.Value>Vlad Moroz</DataList.Value>
                  </DataList.Item>
                  <DataList.Item align="center">
                    <DataList.Label minWidth="88px">Status</DataList.Label>
                    <DataList.Value>
                      <Badge color="grass" variant="outline">
                        Published
                      </Badge>
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item align="center">
                    <DataList.Label minWidth="88px">
                      No. of Questions
                    </DataList.Label>
                    <DataList.Value>
                      <Badge color="gray" variant="outline">
                        1
                      </Badge>
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item align="center">
                    <DataList.Label minWidth="88px">
                      Total Attempts
                    </DataList.Label>
                    <DataList.Value>
                      <Badge color="gray" variant="outline">
                        1
                      </Badge>
                    </DataList.Value>
                  </DataList.Item>
                </DataList.Root>

                <Flex gap="3">
                  <Dialog.Root>
                    <Dialog.Trigger>
                      <Button variant="soft">Edit Quiz Info</Button>
                    </Dialog.Trigger>

                    <Dialog.Content maxWidth="600px">
                      <Dialog.Title mb="0">Edit Quiz Info</Dialog.Title>
                      <Dialog.Description size="2" mb="4">
                        Make changes to your quiz.
                      </Dialog.Description>

                      <Flex direction="column" gap="3">
                        <label>
                          <Text as="div" size="2" mb="1" weight="bold">
                            Name
                          </Text>
                          <TextField.Root placeholder="Enter quiz name" />
                        </label>
                        <label>
                          <Text as="div" size="2" mb="1" weight="bold">
                            Description
                          </Text>
                          <TextArea
                            size="2"
                            placeholder="Enter description question"
                          />
                        </label>
                      </Flex>

                      <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                          <Button variant="soft" color="gray">
                            Cancel
                          </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                          <Button>Save</Button>
                        </Dialog.Close>
                      </Flex>
                    </Dialog.Content>
                  </Dialog.Root>

                  <Button variant="soft" color="grass">
                    Publish
                  </Button>
                </Flex>
              </Flex>
              <Flex py="4" direction="column" gap="3" width="60%">
                <Card variant="classic" className="bg-gray-500/10 w-full">
                  <Flex direction="column" gap="3">
                    <Flex direction="column" gap="4">
                      <Flex justify="between" align="center">
                        <Text size="4" weight="bold">
                          Question 1
                        </Text>
                        <Dialog.Root>
                          <Dialog.Trigger>
                            <Button variant="soft">Edit</Button>
                          </Dialog.Trigger>

                          <Dialog.Content maxWidth="450px">
                            <Dialog.Title>Question 1</Dialog.Title>
                            <Flex direction="column">
                              <Flex direction="column" gap="3" mb="3">
                                <label>
                                  <Text as="div" size="2" mb="1" weight="bold">
                                    Question
                                  </Text>
                                  <TextArea
                                    size="3"
                                    placeholder="Enter question"
                                  />
                                </label>
                              </Flex>
                              <Flex
                                gap="2"
                                align="center"
                                justify="between"
                                mb="3"
                              >
                                <Radio size="3" color="grass" />
                                <TextField.Root
                                  placeholder="Option 1"
                                  size="2"
                                  className="w-full"
                                />
                                <IconButton variant="soft" color="red">
                                  <XMarkIcon width="18" height="18" />
                                </IconButton>
                              </Flex>
                              <Flex
                                gap="2"
                                align="center"
                                justify="between"
                                mb="3"
                              >
                                <Radio size="3" color="grass" />
                                <TextField.Root
                                  placeholder="Option 2"
                                  size="2"
                                  className="w-full"
                                />
                                <IconButton variant="soft" color="red">
                                  <XMarkIcon width="18" height="18" />
                                </IconButton>
                              </Flex>

                              <Button size="2" variant="outline">
                                + Add Option
                              </Button>
                            </Flex>

                            <Flex gap="3" mt="6" justify="end">
                              <Dialog.Close>
                                <Button variant="soft" color="gray">
                                  Cancel
                                </Button>
                              </Dialog.Close>
                              <Dialog.Close>
                                <Button>Save</Button>
                              </Dialog.Close>
                            </Flex>
                          </Dialog.Content>
                        </Dialog.Root>
                      </Flex>
                      <Text size="3">Question comes here</Text>
                    </Flex>
                    <Flex gap="2" direction="column">
                      <Flex gap="0">
                        <Text
                          size="2"
                          style={{
                            background: "var(--gray-a2)",
                            border: "1px dashed var(--gray-a7)",
                            borderBottom: "1px dashed var(--gray-a7)",
                            borderRadius: "3px 0px 0px 3px",
                            padding: "7px",
                            width: "30px",
                            textAlign: "center",
                          }}
                        >
                          A
                        </Text>
                        <Text
                          size="2"
                          style={{
                            background: "var(--gray-a2)",
                            border: "1px dashed var(--gray-a7)",
                            borderBottom: "1px dashed var(--gray-a7)",
                            borderRadius: "0px 3px 3px 0px",
                            padding: "7px",
                            width: "100%",
                          }}
                        >
                          Without trim
                        </Text>
                      </Flex>
                      <Flex gap="0">
                        <Text
                          size="2"
                          style={{
                            background: "var(--green-a2)",
                            border: "1px dashed var(--green-a7)",
                            borderBottom: "1px dashed var(--green-a7)",
                            borderRadius: "3px 0px 0px 3px",
                            padding: "7px",
                            width: "30px",
                            textAlign: "center",
                          }}
                        >
                          B
                        </Text>
                        <Text
                          size="2"
                          style={{
                            background: "var(--green-a2)",
                            border: "1px dashed var(--green-a7)",
                            borderBottom: "1px dashed var(--green-a7)",
                            borderRadius: "0px 3px 3px 0px",
                            padding: "7px",
                            width: "100%",
                          }}
                        >
                          Without trim
                        </Text>
                      </Flex>
                      <Flex gap="0">
                        <Text
                          size="2"
                          style={{
                            background: "var(--gray-a2)",
                            border: "1px dashed var(--gray-a7)",
                            borderBottom: "1px dashed var(--gray-a7)",
                            borderRadius: "3px 0px 0px 3px",
                            padding: "7px",
                            width: "30px",
                            textAlign: "center",
                          }}
                        >
                          C
                        </Text>
                        <Text
                          size="2"
                          style={{
                            background: "var(--gray-a2)",
                            border: "1px dashed var(--gray-a7)",
                            borderBottom: "1px dashed var(--gray-a7)",
                            borderRadius: "0px 3px 3px 0px",
                            padding: "7px",
                            width: "100%",
                          }}
                        >
                          Without trim
                        </Text>
                      </Flex>
                      <Flex gap="0">
                        <Text
                          size="2"
                          style={{
                            background: "var(--gray-a2)",
                            border: "1px dashed var(--gray-a7)",
                            borderBottom: "1px dashed var(--gray-a7)",
                            borderRadius: "3px 0px 0px 3px",
                            padding: "7px",
                            width: "30px",
                            textAlign: "center",
                          }}
                        >
                          D
                        </Text>
                        <Text
                          size="2"
                          style={{
                            background: "var(--gray-a2)",
                            border: "1px dashed var(--gray-a7)",
                            borderBottom: "1px dashed var(--gray-a7)",
                            borderRadius: "0px 3px 3px 0px",
                            padding: "7px",
                            width: "100%",
                          }}
                        >
                          Without trim
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
                <Card variant="classic" className="bg-gray-500/10 w-full">
                  <Flex direction="column" gap="3">
                    <Flex direction="column" gap="4">
                      <Flex justify="between" align="center">
                        <Text size="4" weight="bold">
                          Question 1
                        </Text>
                        <Button variant="soft">Edit</Button>
                      </Flex>

                      <Text size="3">Question comes here</Text>
                    </Flex>
                    <Flex gap="2" direction="column">
                      <Flex gap="0">
                        <Text
                          size="2"
                          style={{
                            background: "var(--gray-a2)",
                            border: "1px dashed var(--gray-a7)",
                            borderBottom: "1px dashed var(--gray-a7)",
                            borderRadius: "3px 0px 0px 3px",
                            padding: "7px",
                            width: "30px",
                            textAlign: "center",
                          }}
                        >
                          A
                        </Text>
                        <Text
                          size="2"
                          style={{
                            background: "var(--gray-a2)",
                            border: "1px dashed var(--gray-a7)",
                            borderBottom: "1px dashed var(--gray-a7)",
                            borderRadius: "0px 3px 3px 0px",
                            padding: "7px",
                            width: "100%",
                          }}
                        >
                          Without trim
                        </Text>
                      </Flex>
                      <Flex gap="0">
                        <Text
                          size="2"
                          style={{
                            background: "var(--gray-a2)",
                            border: "1px dashed var(--gray-a7)",
                            borderBottom: "1px dashed var(--gray-a7)",
                            borderRadius: "3px 0px 0px 3px",
                            padding: "7px",
                            width: "30px",
                            textAlign: "center",
                          }}
                        >
                          B
                        </Text>
                        <Text
                          size="2"
                          style={{
                            background: "var(--gray-a2)",
                            border: "1px dashed var(--gray-a7)",
                            borderBottom: "1px dashed var(--gray-a7)",
                            borderRadius: "0px 3px 3px 0px",
                            padding: "7px",
                            width: "100%",
                          }}
                        >
                          Without trim
                        </Text>
                      </Flex>
                      <Flex gap="0">
                        <Text
                          size="2"
                          style={{
                            background: "var(--gray-a2)",
                            border: "1px dashed var(--gray-a7)",
                            borderBottom: "1px dashed var(--gray-a7)",
                            borderRadius: "3px 0px 0px 3px",
                            padding: "7px",
                            width: "30px",
                            textAlign: "center",
                          }}
                        >
                          C
                        </Text>
                        <Text
                          size="2"
                          style={{
                            background: "var(--gray-a2)",
                            border: "1px dashed var(--gray-a7)",
                            borderBottom: "1px dashed var(--gray-a7)",
                            borderRadius: "0px 3px 3px 0px",
                            padding: "7px",
                            width: "100%",
                          }}
                        >
                          Without trim
                        </Text>
                      </Flex>
                      <Flex gap="0">
                        <Text
                          size="2"
                          style={{
                            background: "var(--green-a2)",
                            border: "1px dashed var(--green-a7)",
                            borderBottom: "1px dashed var(--green-a7)",
                            borderRadius: "3px 0px 0px 3px",
                            padding: "7px",
                            width: "30px",
                            textAlign: "center",
                          }}
                        >
                          D
                        </Text>
                        <Text
                          size="2"
                          style={{
                            background: "var(--green-a2)",
                            border: "1px dashed var(--green-a7)",
                            borderBottom: "1px dashed var(--green-a7)",
                            borderRadius: "0px 3px 3px 0px",
                            padding: "7px",
                            width: "100%",
                          }}
                        >
                          Without trim
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              </Flex>
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="documents">
            <Text size="2">Statistics</Text>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Flex>
  );
}

export default QuizInfo;
