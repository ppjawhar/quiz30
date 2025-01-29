import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
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
  Tabs,
  DataList,
  Badge,
  Strong,
  Dialog,
  AlertDialog,
} from "@radix-ui/themes";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";

function QuizInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newQuizName, setNewQuizName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Fetch Quiz Details
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, "quizzes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuiz({ id: docSnap.id, ...docSnap.data() });
          setNewQuizName(docSnap.data().quizName);
          setNewDescription(docSnap.data().description);
        } else {
          console.error("No such quiz!");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Update Quiz Info
  const handleEditQuiz = async () => {
    try {
      await updateDoc(doc(db, "quizzes", id), {
        quizName: newQuizName,
        description: newDescription,
      });
      setQuiz({ ...quiz, quizName: newQuizName, description: newDescription });
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  // Change Quiz Status (Publish/Unpublish)
  const handleStatusChange = async () => {
    const newStatus =
      quiz.status === "Unpublished" ? "Published" : "Unpublished";
    try {
      await updateDoc(doc(db, "quizzes", id), { status: newStatus });
      setQuiz({ ...quiz, status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete Quiz
  const handleDeleteQuiz = async () => {
    try {
      await deleteDoc(doc(db, "quizzes", id));
      navigate("/quizzes");
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  if (loading) return <Text>Loading...</Text>;

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
            {quiz.quizName}
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
                    <Button
                      variant="solid"
                      color="red"
                      onClick={handleDeleteQuiz}
                    >
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
          <Tabs.Trigger value="questions">Questions</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="info">
            <Flex py="4" gap="7" direction="column" justify="start" width="40%">
              <DataList.Root>
                <DataList.Item>
                  <DataList.Label>Name</DataList.Label>
                  <DataList.Value>
                    <Strong>{quiz.quizName}</Strong>
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Description</DataList.Label>
                  <DataList.Value>{quiz.description}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Status</DataList.Label>
                  <DataList.Value>
                    <Badge
                      color={quiz.status === "Published" ? "grass" : "red"}
                      variant="outline"
                    >
                      {quiz.status}
                    </Badge>
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Total Questions</DataList.Label>
                  <DataList.Value>
                    <Badge color="gray" variant="outline">
                      {quiz.questions.length}
                    </Badge>
                  </DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="questions">
            <Flex direction="column" gap="4">
              {quiz.questions.map((q, qIndex) => (
                <Card
                  key={qIndex}
                  variant="classic"
                  className="bg-gray-500/10 w-full"
                >
                  <Flex direction="column" gap="3">
                    <Flex justify="between" align="center">
                      <Text size="4" weight="bold">
                        Question {qIndex + 1}
                      </Text>
                    </Flex>
                    <Text size="3">{q.question}</Text>

                    <Flex gap="2" direction="column">
                      {q.options.map((option, oIndex) => {
                        const optionLabels = ["A", "B", "C", "D"];
                        return (
                          <Flex key={oIndex} gap="0">
                            <Text
                              size="2"
                              style={{
                                background: option.isCorrect
                                  ? "var(--green-a2)"
                                  : "var(--gray-a2)",
                                border: `1px dashed ${
                                  option.isCorrect
                                    ? "var(--green-a7)"
                                    : "var(--gray-a7)"
                                }`,
                                borderBottom: `1px dashed ${
                                  option.isCorrect
                                    ? "var(--green-a7)"
                                    : "var(--gray-a7)"
                                }`,
                                borderRadius: "3px 0px 0px 3px",
                                padding: "7px",
                                width: "30px",
                                textAlign: "center",
                              }}
                            >
                              {optionLabels[oIndex]}
                            </Text>
                            <Text
                              size="2"
                              style={{
                                background: option.isCorrect
                                  ? "var(--green-a2)"
                                  : "var(--gray-a2)",
                                border: `1px dashed ${
                                  option.isCorrect
                                    ? "var(--green-a7)"
                                    : "var(--gray-a7)"
                                }`,
                                borderBottom: `1px dashed ${
                                  option.isCorrect
                                    ? "var(--green-a7)"
                                    : "var(--gray-a7)"
                                }`,
                                borderRadius: "0px 3px 3px 0px",
                                padding: "7px",
                                width: "100%",
                              }}
                            >
                              {option.text}
                            </Text>
                          </Flex>
                        );
                      })}
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Flex>
  );
}

export default QuizInfo;
