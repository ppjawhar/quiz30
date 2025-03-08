// QuizDetails.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFunctions, httpsCallable } from "firebase/functions"; // Firebase Functions methods
// import { db } from "../../firebase"; // No longer needed if using the function
// import { functions } from "../../firebase"; // Assumes you export your functions instance here
// import { app } from "../../firebase"; // Ensure you have your Firebase app instance

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

function QuizDetails() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch quizzes from Cloud Function
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const functions = getFunctions();
        // Create a callable function reference
        const getQuizDetails = httpsCallable(functions, "getQuizDetails");
        const { data } = await getQuizDetails();
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <Flex direction="column" gap="5" flexGrow="1">
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
            <Card
              key={quiz.id}
              variant="classic"
              className="cursor-pointer"
              onClick={() => navigate(`/dailyattend/${quiz.id}`)}
            >
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
                      <Text>ആകെ പങ്കെടുത്തവർ:</Text>
                      <Badge variant="outline">
                        <Strong>{quiz.totalResponses || 0}</Strong>
                      </Badge>
                    </Flex>
                    <Flex align="center" gap="1">
                      <Text>ശരി ഉത്തരം നൽകിയവർ:</Text>
                      <Badge variant="outline" color="green">
                        <Strong>{quiz.totalCorrect || 0}</Strong>
                      </Badge>
                    </Flex>
                  </Flex>
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

export default QuizDetails;
