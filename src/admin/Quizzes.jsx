import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Import Firestore instance
import { getFunctions, httpsCallable } from "firebase/functions"; // Firebase Functions
import {
  Flex,
  Text,
  Card,
  Button,
  Badge,
  Strong,
  IconButton,
  Skeleton,
  DropdownMenu,
  AlertDialog,
  Callout,
} from "@radix-ui/themes";
import {
  EllipsisHorizontalIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Instead of a boolean, store the quiz ID to delete
  const [quizToDelete, setQuizToDelete] = useState(null);
  // State for publish error alert
  const [publishAlertOpen, setPublishAlertOpen] = useState(false);
  const [publishErrorMessage, setPublishErrorMessage] = useState("");

  // Fetch quizzes from Firestore
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizzesRef = collection(db, "quizzes");
        // Order by the "quizName" field in ascending order (A-Z)
        const q = query(quizzesRef, orderBy("quizName", "asc"));
        const querySnapshot = await getDocs(q);
        const quizData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include document ID
          ...doc.data(),
        }));
        setQuizzes(quizData);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Update quiz status using the cloud function
  const handleStatusChange = async (quizId, newStatus) => {
    const functions = getFunctions();
    const changeQuizStatus = httpsCallable(functions, "changeQuizStatus");

    try {
      const result = await changeQuizStatus({ quizId, newStatus });

      if (result.data.success) {
        // Update local state after a successful status update.
        setQuizzes((prevQuizzes) =>
          prevQuizzes.map((quiz) =>
            quiz.id === quizId ? { ...quiz, status: newStatus } : quiz
          )
        );
      }
    } catch (error) {
      console.error("Error updating quiz status:", error);
      // Display the error message returned by the cloud function.
      setPublishErrorMessage(error.message);
      setPublishAlertOpen(true);
    }
  };

  // Delete quiz from Firestore
  const handleDeleteQuiz = async (quizId) => {
    try {
      await deleteDoc(doc(db, "quizzes", quizId));
      setQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz.id !== quizId)
      );
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <Flex direction="column" gap="5" flexGrow="1">
      <Flex gap="4" align="center" justify="between">
        <Text size="5" className="font-semibold">
          <span className="text-2xl">🧩</span> Quizzes
        </Text>
        <Button size="2" variant="soft" onClick={() => navigate("/add-quiz")}>
          + Create New Quiz
        </Button>
      </Flex>

      {loading ? (
        <Flex direction="column" gap="2">
          <Skeleton width="100%" height="80px">
            <Card></Card>
          </Skeleton>
          <Skeleton width="100%" height="80px">
            <Card></Card>
          </Skeleton>
          <Skeleton width="100%" height="80px">
            <Card></Card>
          </Skeleton>
        </Flex>
      ) : quizzes.length > 0 ? (
        <Flex direction="column" gap="3">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} variant="classic">
              <Flex justify="between">
                <Flex direction="column" gap="3" p="1" align="start">
                  <Flex gap="0" direction="column">
                    <Text size="4" weight="medium">
                      {quiz.quizName}
                    </Text>
                    <Text size="2" color="gray">
                      {quiz.description}
                    </Text>
                  </Flex>
                  <Flex direction="row" gap="4">
                    <Flex align="center" gap="1">
                      <Text>Status:</Text>
                      {quiz.status === "Unpublished" ? (
                        <Badge variant="outline" color="red">
                          <Strong>{quiz.status}</Strong>
                        </Badge>
                      ) : (
                        <Badge variant="outline" color="grass">
                          <Strong>{quiz.status}</Strong>
                        </Badge>
                      )}
                    </Flex>
                    <Flex align="center" gap="1">
                      <Text>Total attempts:</Text>
                      <Badge variant="outline" color="gray">
                        <Strong>
                          {quiz.responses ? quiz.responses.length : "0"}
                        </Strong>
                      </Badge>
                    </Flex>
                    <Flex align="center" gap="1">
                      <Text>Total questions:</Text>
                      <Badge variant="outline" color="gray">
                        <Strong>
                          {quiz.questions ? quiz.questions.length : "0"}
                        </Strong>
                      </Badge>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex direction="row" gap="3" p="1" align="center">
                  <Button
                    variant="soft"
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                  >
                    View
                  </Button>

                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <IconButton variant="soft" size="2">
                        <EllipsisHorizontalIcon width="18" height="18" />
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end">
                      {quiz.status === "Unpublished" ? (
                        <DropdownMenu.Item
                          onClick={() =>
                            handleStatusChange(quiz.id, "Published")
                          }
                        >
                          Publish
                        </DropdownMenu.Item>
                      ) : (
                        <DropdownMenu.Item
                          onClick={() =>
                            handleStatusChange(quiz.id, "Unpublished")
                          }
                        >
                          Unpublish
                        </DropdownMenu.Item>
                      )}
                      <DropdownMenu.Item
                        color="red"
                        onClick={() => setQuizToDelete(quiz.id)}
                      >
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      ) : (
        <Text>No quizzes found.</Text>
      )}

      {/* AlertDialog for confirming quiz deletion */}
      <AlertDialog.Root
        open={!!quizToDelete}
        onOpenChange={(open) => {
          // When closed, reset the quizToDelete state
          if (!open) {
            setQuizToDelete(null);
          }
        }}
      >
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Delete Quiz</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure? This quiz will no longer be accessible.
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
                onClick={() => {
                  handleDeleteQuiz(quizToDelete);
                  setQuizToDelete(null);
                }}
              >
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

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

export default Quizzes;
