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
  Radio,
  Spinner,
} from "@radix-ui/themes";
import {
  ArrowLeftIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import QuizQustionTab from "./QuizQuestionTab";
import QuizAttemptsTab from "./QuizAttemptsTab";

function QuizInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newQuizName, setNewQuizName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editQuestion, setEditQuestion] = useState(null);

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

  const handleUpdateQuestion = async (index) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = editQuestion;
    try {
      await updateDoc(doc(db, "quizzes", id), { questions: updatedQuestions });
      setQuiz({ ...quiz, questions: updatedQuestions });
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleAddQuestion = async (newQ) => {
    if (!newQ.question.trim()) return;

    const updatedQuestions = [...quiz.questions, newQ];

    try {
      await updateDoc(doc(db, "quizzes", id), { questions: updatedQuestions });
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        questions: updatedQuestions,
      }));
    } catch (error) {
      console.error("Error adding new question:", error);
    }
  };

  const handleDeleteQuestion = async (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);

    try {
      await updateDoc(doc(db, "quizzes", id), { questions: updatedQuestions });
      setQuiz({ ...quiz, questions: updatedQuestions });
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Flex direction="column" gap="7" flexGrow="1">
      <Flex direction="column" gap="5">
        <Flex justify="between">
          <Button size="2" variant="soft" onClick={() => navigate("/quizzes")}>
            <ArrowLeftIcon className="size-5" />
            Back
          </Button>
        </Flex>

        <Flex direction="column" gap="5">
          <Flex justify="between">
            <Flex direction="column">
              <Text size="5" className="font-semibold">
                {quiz.quizName}
              </Text>
              <Text size="3" color="gray">
                {quiz.description}
              </Text>
            </Flex>
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
              {/* Edit Quiz Dialog */}
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
                      <TextField.Root
                        placeholder="Enter quiz name"
                        value={newQuizName}
                        onChange={(e) => setNewQuizName(e.target.value)}
                      />
                    </label>
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Description
                      </Text>
                      <TextArea
                        size="2"
                        placeholder="Enter description question"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
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
                      <Button onClick={handleEditQuiz}>Save</Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>

              {/* <Button
                variant="soft"
                color={quiz.status === "Published" ? "red" : "grass"}
                onClick={handleStatusChange}
              >
                {quiz.status === "Published" ? "Unpublish" : "Publish"}
              </Button> */}
            </Flex>
          </Flex>
          <Flex gap="2">
            <Card className="w-56">
              <Flex direction="column" gap="3" align="start">
                <Text size="3" weight="bold">
                  Status:
                </Text>
                <Badge
                  size="3"
                  color={quiz.status === "Published" ? "grass" : "red"}
                  variant="outline"
                >
                  {quiz.status}
                </Badge>
              </Flex>
            </Card>
            <Card className="w-56">
              <Flex direction="column" gap="3" align="start">
                <Text size="3" weight="bold">
                  Total Attempts:
                </Text>
                <Badge color="gray" variant="outline" size="3">
                  {quiz.responses.length}
                </Badge>
              </Flex>
            </Card>
            <Card className="w-56">
              <Flex direction="column" gap="3" align="start">
                <Text size="3" weight="bold">
                  Total Questions:
                </Text>
                <Badge color="gray" variant="outline" size="3">
                  {quiz.questions.length}
                </Badge>
              </Flex>
            </Card>
          </Flex>
        </Flex>
      </Flex>

      <Tabs.Root defaultValue="attempts" size="2">
        <Tabs.List>
          <Tabs.Trigger value="attempts">Attempts</Tabs.Trigger>
          <Tabs.Trigger value="questions">Questions</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="attempts">
            <QuizAttemptsTab quiz={quiz} />
          </Tabs.Content>
          <Tabs.Content value="questions">
            <QuizQustionTab
              quiz={quiz}
              setEditQuestion={setEditQuestion}
              editQuestion={editQuestion}
              handleUpdateQuestion={handleUpdateQuestion}
              handleDeleteQuestion={handleDeleteQuestion}
              handleAddQuestion={handleAddQuestion}
            />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Flex>
  );
}

export default QuizInfo;
