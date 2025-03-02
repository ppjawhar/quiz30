import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore instance
import { getFunctions, httpsCallable } from "firebase/functions"; // Firebase Functions
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
  Skeleton,
  Callout,
  Switch,
} from "@radix-ui/themes";
import {
  ArrowLeftIcon,
  TrashIcon,
  XMarkIcon,
  EllipsisHorizontalIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import QuizQustionTab from "./QuizQuestionTab";
import QuizAttemptsTab from "./QuizAttemptsTab";
import QuizSettingsTab from "./QuizSettingsTab";

function QuizInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newQuizName, setNewQuizName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editQuestion, setEditQuestion] = useState(null);
  const [publishAlertOpen, setPublishAlertOpen] = useState(false);
  const [publishErrorMessage, setPublishErrorMessage] = useState("");

  // Fetch Quiz Details
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, "quizzes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Load new fields with defaults if they don't exist
          const quizData = {
            id: docSnap.id,
            ...data,
            shuffleOptions: data.shuffleOptions ?? false,
            includeLeaderboard: data.includeLeaderboard ?? false,
            publishAnswers: data.publishAnswers ?? false,
          };
          setQuiz(quizData);
          setNewQuizName(data.quizName);
          setNewDescription(data.description);
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

  // Update quiz status using the cloud function
  const handleStatusChange = async (quizId, newStatus) => {
    const functions = getFunctions();
    const changeQuizStatus = httpsCallable(functions, "changeQuizStatus");

    try {
      const result = await changeQuizStatus({ quizId, newStatus });

      if (result.data.success) {
        // Update local state after a successful status update.
        setQuiz((prevQuiz) => ({
          ...prevQuiz,
          status: newStatus,
        }));
      }
    } catch (error) {
      console.error("Error updating quiz status:", error);
      setPublishErrorMessage(error.message);
      setPublishAlertOpen(true);
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

  // Handlers for new quiz settings fields
  const handleShuffleOptionsChange = async (checked) => {
    try {
      await updateDoc(doc(db, "quizzes", id), { shuffleOptions: checked });
      setQuiz((prevQuiz) => ({ ...prevQuiz, shuffleOptions: checked }));
    } catch (error) {
      console.error("Error updating shuffle options:", error);
    }
  };

  const handleLeaderboardChange = async (checked) => {
    try {
      await updateDoc(doc(db, "quizzes", id), { includeLeaderboard: checked });
      setQuiz((prevQuiz) => ({ ...prevQuiz, includeLeaderboard: checked }));
    } catch (error) {
      console.error("Error updating leaderboard calculation:", error);
    }
  };

  const handlePublishAnswersChange = async (checked) => {
    try {
      await updateDoc(doc(db, "quizzes", id), { publishAnswers: checked });
      setQuiz((prevQuiz) => ({ ...prevQuiz, publishAnswers: checked }));
    } catch (error) {
      console.error("Error updating publish answers and points:", error);
    }
  };

  // Skeleton loading..
  if (loading)
    return (
      <Flex direction="column" gap="7" flexGrow="1">
        <Flex direction="column" gap="5">
          <Flex justify="between">
            <Skeleton>
              <Button size="2" variant="soft">
                <ArrowLeftIcon className="size-5" />
                Back
              </Button>
            </Skeleton>
          </Flex>
          <Flex direction="column" gap="5">
            <Flex justify="between">
              <Flex direction="column" gap="1">
                <Skeleton>
                  <Text size="5" className="font-semibold">
                    Quiz Name
                  </Text>
                </Skeleton>
                <Skeleton>
                  <Text size="3" color="gray">
                    Quiz Description Quiz Description Quiz Description Quiz
                    Description
                  </Text>
                </Skeleton>
              </Flex>
              <Flex gap="2">
                <Skeleton>
                  <IconButton variant="soft" color="red">
                    <TrashIcon width="18" height="18" />
                  </IconButton>
                </Skeleton>
                <Skeleton>
                  <Button size="2" variant="soft">
                    Edit Quiz Info
                  </Button>
                </Skeleton>
              </Flex>
            </Flex>
            <Flex gap="2">
              <Skeleton width="220px" height="80px">
                <Card></Card>
              </Skeleton>
              <Skeleton width="220px" height="80px">
                <Card></Card>
              </Skeleton>
              <Skeleton width="220px" height="80px">
                <Card></Card>
              </Skeleton>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );

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

              <Button
                variant="soft"
                color={quiz.status === "Published" ? "red" : "grass"}
                onClick={() =>
                  handleStatusChange(
                    quiz.id,
                    quiz.status === "Published" ? "Unpublished" : "Published"
                  )
                }
              >
                {quiz.status === "Published" ? "Unpublish" : "Publish"}
              </Button>
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
                  {quiz.responses ? quiz.responses.length : "0"}
                </Badge>
              </Flex>
            </Card>
            <Card className="w-56">
              <Flex direction="column" gap="3" align="start">
                <Text size="3" weight="bold">
                  Total Questions:
                </Text>
                <Badge color="gray" variant="outline" size="3">
                  {quiz.questions ? quiz.questions.length : "0"}
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
          <Tabs.Trigger value="settings">Quiz Settings</Tabs.Trigger>
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
          <Tabs.Content value="settings">
            <Flex py="4" direction="column" gap="3" width="100%">
              <DataList.Root size="3">
                <DataList.Item align="center" className="align-top">
                  <DataList.Label minWidth="88px">
                    <Flex direction="column">
                      <Text>Shuffle Options</Text>
                      <Text size="2" className="opacity-70">
                        Different options order for each user.
                      </Text>
                    </Flex>
                  </DataList.Label>
                  <DataList.Value>
                    <Switch
                      checked={quiz.shuffleOptions}
                      onCheckedChange={handleShuffleOptionsChange}
                    />
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item align="center">
                  <DataList.Label minWidth="88px">
                    <Flex direction="column">
                      <Text>Include to leaderboard calculation</Text>
                      <Text size="2" className="opacity-70">
                        Add this quiz's points to leaderboard calculation.
                      </Text>
                    </Flex>
                  </DataList.Label>
                  <DataList.Value>
                    <Switch
                      checked={quiz.includeLeaderboard}
                      onCheckedChange={handleLeaderboardChange}
                    />
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item align="center">
                  <DataList.Label minWidth="88px">
                    <Flex direction="column">
                      <Text>Publish Answer and Point</Text>
                      <Text size="2" className="opacity-70">
                        Publish correct answer to participant and the points
                        they earned.
                      </Text>
                    </Flex>
                  </DataList.Label>
                  <DataList.Value>
                    <Switch
                      checked={quiz.publishAnswers}
                      onCheckedChange={handlePublishAnswersChange}
                    />
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item align="center">
                  <DataList.Label minWidth="88px">
                    <Flex direction="column">
                      <Text>Auto Schedule</Text>
                      <Text size="2" className="opacity-70">
                        Publish and unpublish with auto schedule.
                      </Text>
                    </Flex>
                  </DataList.Label>
                  <DataList.Value>
                    <Switch disabled />
                  </DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>

      {/* AlertDialog for publish error */}
      <AlertDialog.Root
        open={publishAlertOpen}
        onOpenChange={(open) => {
          if (!open) setPublishAlertOpen(false);
        }}
      >
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Publish Error</AlertDialog.Title>
          <AlertDialog.Description size="2">
            <Callout.Root color="red">
              <Callout.Icon>
                <ExclamationCircleIcon className="size-5" />
              </Callout.Icon>
              <Callout.Text>{publishErrorMessage}</Callout.Text>
            </Callout.Root>
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Action>
              <Button
                variant="soft"
                color="gray"
                onClick={() => setPublishAlertOpen(false)}
              >
                OK
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Flex>
  );
}

export default QuizInfo;
