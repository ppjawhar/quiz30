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
  // Update quiz status
  const handleStatusChange = async (quizId, newStatus) => {
    try {
      if (newStatus === "Published") {
        // Check if there's already a published quiz
        const alreadyPublished = quizzes.find(
          (quiz) => quiz.status === "Published"
        );

        if (alreadyPublished) {
          alert(
            `Only one quiz can be published at a time. Unpublish "${alreadyPublished.quizName}" first.`
          );
          return;
        }
      }

      // Update Firestore document
      await updateDoc(doc(db, "quizzes", quizId), { status: newStatus });

      // Update state
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
  );
}

export default Quizzes;
