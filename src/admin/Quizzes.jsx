import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Import Firestore instance
import {
  Flex,
  Box,
  Section,
  Text,
  Card,
  Button,
  Badge,
  Strong,
  IconButton,
  Spinner,
  DropdownMenu,
} from "@radix-ui/themes";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import AdminHeader from "../components/AdminHeader";
import AdminSidemenu from "../components/AdminSidemenu";

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch quizzes from Firestore
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
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

  // Update quiz status
  const handleStatusChange = async (quizId, newStatus) => {
    try {
      await updateDoc(doc(db, "quizzes", quizId), { status: newStatus });
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) =>
          quiz.id === quizId ? { ...quiz, status: newStatus } : quiz
        )
      );
    } catch (error) {
      console.error("Error updating quiz status:", error);
    }
  };

  // Delete quiz from Firestore
  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteDoc(doc(db, "quizzes", quizId));
        setQuizzes((prevQuizzes) =>
          prevQuizzes.filter((quiz) => quiz.id !== quizId)
        );
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };

  return (
    <Box>
      <Section size="4" py="7" px="7">
        <Flex gap="6" direction="column">
          <AdminHeader />
          <Flex gap="1">
            <AdminSidemenu />
            <Flex direction="column" gap="7" flexGrow="1">
              <Flex direction="column" gap="5">
                <Flex gap="4" align="center">
                  <Text size="5" className="font-semibold">
                    Quizzes
                  </Text>
                  <Button
                    size="2"
                    variant="soft"
                    onClick={() => navigate("/add-quiz")}
                  >
                    + Create New Quiz
                  </Button>
                </Flex>

                {loading ? (
                  <Spinner />
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
                            <Flex direction="row" gap="4" justify="">
                              <Flex align="center" gap="1">
                                <Text>Total attempts:</Text>
                                <Badge variant="outline" color="gray">
                                  <Strong>{quiz.numberOfAttempts}</Strong>
                                </Badge>
                              </Flex>
                              <Flex align="center" gap="1">
                                <Text>Total questions:</Text>
                                <Badge variant="outline" color="gray">
                                  <Strong>{quiz.numberOfQuestions}</Strong>
                                </Badge>
                              </Flex>
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
                            </Flex>
                          </Flex>
                          <Flex direction="row" gap="3" p="1" align="center">
                            <Button
                              variant="soft"
                              onClick={() => navigate("/quiz-info")}
                            >
                              View
                            </Button>

                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger>
                                <IconButton variant="soft" size="2">
                                  <EllipsisHorizontalIcon
                                    width="18"
                                    height="18"
                                  />
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

                                <DropdownMenu.Item>Edit</DropdownMenu.Item>

                                <DropdownMenu.Item
                                  color="red"
                                  onClick={() => handleDeleteQuiz(quiz.id)}
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
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </Box>
  );
}

export default Quizzes;
