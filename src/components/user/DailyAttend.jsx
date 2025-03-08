import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  Flex,
  Box,
  Container,
  Text,
  Dialog,
  Button,
  Badge,
  Strong,
  IconButton,
  Table,
  Separator,
} from "@radix-ui/themes";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Header from "../../components/Header";

// Helper function to format date strings.
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString();
}

// Helper function to count correct answers.
// Adjust this function if your answer object structure differs.
function countCorrectAnswers(response) {
  let correctAnswers = 0;
  response.answers.forEach((answer) => {
    if (answer.isCorrect) {
      correctAnswers++;
    }
  });
  return { correctAnswers };
}

function DailyAttend() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const functions = getFunctions();
        const getQuizById = httpsCallable(functions, "getQuizById");
        const result = await getQuizById({ quizId: id });
        setQuiz(result.data.quiz);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  if (loading) {
    return (
      <Box>
        <Container size="1" py="9" px="5">
          <Text>Loading...</Text>
        </Container>
      </Box>
    );
  }

  if (!quiz) {
    return (
      <Box>
        <Container size="1" py="9" px="5">
          <Flex direction="column" gap="7">
            <Header />
            <Flex justify="between">
              <Button
                size="2"
                variant="soft"
                onClick={() => navigate("/userdashboard")}
              >
                <ArrowLeftIcon className="size-5" />
                Back
              </Button>
            </Flex>
            <Text>Quiz not found.</Text>
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Container size="1" py="9" px="5">
        <Flex direction="column" gap="7">
          <Header />

          <Flex justify="between">
            <Button
              size="2"
              variant="soft"
              onClick={() => navigate("/userdashboard")}
            >
              <ArrowLeftIcon className="size-5" />
              Back
            </Button>
          </Flex>
          <Flex direction="column">
            <Text size="5" className="font-semibold">
              {quiz.quizName}
            </Text>
            <Text size="3" color="gray">
              {quiz.description || "No description available."}
            </Text>
          </Flex>
          <Flex py="0" direction="column" gap="3" width="100%">
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Score</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {quiz.responses &&
                  quiz.responses.map((q, qIndex) => (
                    <Table.Row key={qIndex} align="center">
                      <Table.Cell>{q.participantName}</Table.Cell>
                      <Table.Cell>{formatDate(q.date)}</Table.Cell>
                      <Table.Cell>
                        {countCorrectAnswers(q).correctAnswers}
                      </Table.Cell>
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
                                Submitted On:{" "}
                                <Strong>{formatDate(q.date)}</Strong>
                              </Text>
                              <Separator size="4" />
                              <Text weight="bold">Submitted Answer:</Text>
                              <Flex direction="column" gap="5">
                                {q.answers.map((a, index) => (
                                  <Flex key={index} direction="column" gap="3">
                                    <Text>
                                      <Strong>{index + 1}. </Strong>
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
        </Flex>
      </Container>
    </Box>
  );
}

export default DailyAttend;
