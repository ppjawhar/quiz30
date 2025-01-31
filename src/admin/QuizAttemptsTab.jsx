import { useState } from "react";
import {
  Dialog,
  Card,
  Flex,
  Text,
  TextArea,
  Radio,
  TextField,
  IconButton,
  Button,
  AlertDialog,
  Table,
  Badge,
  Strong,
  Separator,
} from "@radix-ui/themes";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function QuizAttemptsTab({ quiz }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long", // "Thursday"
      year: "numeric", // "2025"
      month: "long", // "January"
      day: "numeric", // "30"
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Use 12-hour format with AM/PM
    });
  };

  const countCorrectAnswers = (response) => {
    const correctCount = response.answers.filter(
      (answer) => answer.isCorrect
    ).length;
    return {
      correctAnswers: correctCount,
    };
  };

  // console.log(countCorrectAnswers(quiz));

  return (
    <Flex py="4" direction="column" gap="3" width="100%">
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Participation No.</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Score</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {quiz.responses &&
            quiz.responses.map((q, qIndex) => (
              <Table.Row align="center">
                <Table.RowHeaderCell>
                  <Badge size="2" variant="outline">
                    {q.participationNumber}
                  </Badge>
                </Table.RowHeaderCell>
                <Table.Cell>{q.participantName}</Table.Cell>
                <Table.Cell>{formatDate(q.date)}</Table.Cell>
                <Table.Cell>{countCorrectAnswers(q).correctAnswers}</Table.Cell>
                <Table.Cell align="right">
                  <Dialog.Root>
                    <Dialog.Trigger>
                      <Button variant="soft" size="2">
                        View
                      </Button>
                    </Dialog.Trigger>

                    <Dialog.Content maxWidth="500px">
                      <Flex justify="between">
                        <Flex direction="column">
                          <Dialog.Description size="4" mb="4">
                            <Badge size="3" variant="outline">
                              {q.participationNumber}
                            </Badge>
                          </Dialog.Description>
                          <Dialog.Title size="5">
                            {q.participantName}
                          </Dialog.Title>
                        </Flex>
                        <Dialog.Close>
                          <IconButton variant="soft" color="gray">
                            <XMarkIcon width="18" height="18" />
                          </IconButton>
                        </Dialog.Close>
                      </Flex>
                      <Flex direction="column" gap="4">
                        <Text>
                          Submitted On: <Strong>{formatDate(q.date)}</Strong>
                        </Text>
                        <Separator size="4" />
                        <Text weight="bold">Submitted Answer:</Text>
                        <Flex direction="column" gap="5">
                          {q.answers.map((a, qIndex) => (
                            <Flex direction="column" gap="3">
                              <Text>
                                <Strong>{qIndex + 1}. </Strong>
                                {a.question}
                              </Text>
                              <Badge
                                size="3"
                                variant="soft"
                                color={a.isCorrect ? "green" : "red"}
                              >
                                {a.selectedAnswer}
                              </Badge>
                            </Flex>
                          ))}
                        </Flex>
                      </Flex>
                    </Dialog.Content>
                  </Dialog.Root>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
}

export default QuizAttemptsTab;
