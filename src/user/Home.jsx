import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Import Firestore instance
import {
  Flex,
  Box,
  Container,
  TextField,
  Button,
  Text,
  Link,
  Separator,
  RadioCards,
} from "@radix-ui/themes";
import Header from "../components/Header";

function Home() {
  const [participationNumber, setParticipationNumber] = useState("");
  const [participant, setParticipant] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch the published quiz
  const fetchPublishedQuiz = async () => {
    setQuizLoading(true);
    try {
      const quizzesRef = collection(db, "quizzes");
      const q = query(quizzesRef, where("status", "==", "Published"));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const quizData = querySnapshot.docs[0].data();
        setQuiz(quizData);
      } else {
        setQuiz(null);
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setParticipant(null);
    setQuiz(null); // Reset quiz on new search

    try {
      const participantsRef = collection(db, "participants");
      const q = query(
        participantsRef,
        where("participationNumber", "==", Number(participationNumber))
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const participantData = querySnapshot.docs[0].data();
        setParticipant(participantData);
        fetchPublishedQuiz(); // Fetch quiz once participant is found
      } else {
        setError("Participant not found.");
      }
    } catch (err) {
      setError("Error fetching participant.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Container size="1" py="9" px="5">
        <Flex direction="column" gap="7">
          <Header />
          <Flex direction="column" gap="5">
            {/* Hide form if participant exists */}
            {!participant && (
              <form onSubmit={handleSearch}>
                <Flex direction="column" gap="4">
                  <Text size="5" color="gray">
                    Your participation number:
                  </Text>
                  <TextField.Root
                    className="!h-10 !bg-gray-200/30"
                    size="3"
                    placeholder="Enter your participation number"
                    value={participationNumber}
                    onChange={(e) => setParticipationNumber(e.target.value)}
                  />

                  <Button
                    size="4"
                    variant="solid"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Submit"}
                  </Button>
                </Flex>
              </form>
            )}

            {error && <Text color="red">{error}</Text>}

            {/* Show participant details if found */}
            {participant && (
              <Flex direction="column" gap="5">
                <Flex direction="column" gap="2">
                  <Text size="5" weight="bold" color="solid">
                    Participant Details
                  </Text>
                  <Flex gap="1" direction="row">
                    <Text size="4" color="gray">
                      Participant No:
                    </Text>
                    <Link size="4" color="solid">
                      {participant.participationNumber}
                    </Link>
                  </Flex>
                  <Flex gap="1" direction="row">
                    <Text size="4" color="gray">
                      Participant Name:
                    </Text>
                    <Text size="4" weight="medium">
                      {participant.name}
                    </Text>
                  </Flex>
                  <Flex gap="1" direction="row">
                    <Text size="4" color="gray">
                      Age:
                    </Text>
                    <Text size="4" weight="medium">
                      {participant.age}
                    </Text>
                  </Flex>
                  <Flex gap="1" direction="row">
                    <Text size="4" color="gray">
                      Phone:
                    </Text>
                    <Text size="4" weight="medium">
                      {participant.phone}
                    </Text>
                  </Flex>
                </Flex>
                <Separator size="4" />

                {/* Show quiz details */}
                {quizLoading && <Text>Loading quiz...</Text>}

                {quiz && (
                  <Flex direction="column" gap="6">
                    <Flex direction="column" gap="1">
                      <Text size="6" weight="bold">
                        {quiz.quizName}
                      </Text>
                      <Text size="4" color="gray">
                        {quiz.description}
                      </Text>
                    </Flex>

                    {quiz.questions &&
                      quiz.questions.map((question, index) => (
                        <Flex key={index} direction="column" gap="3">
                          <Text size="6">
                            {index + 1}. {question.question}
                          </Text>
                          <RadioCards.Root columns="1" mt="3">
                            {question.options.map((option, optionIndex) => (
                              <RadioCards.Item
                                key={optionIndex}
                                value={option}
                                style={{
                                  // background: option.isCorrect
                                  //   ? "var(--green-a4)"
                                  //   : "var(--gray-a3)",
                                  // borderColor: option.isCorrect
                                  //   ? "var(--green-a7)"
                                  //   : "var(--gray-a7)",

                                  background: "var(--gray-a3)",
                                }}
                              >
                                <Flex
                                  direction="row"
                                  width="100%"
                                  gap="2"
                                  align="center"
                                >
                                  <Text size="4" weight="bold">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </Text>

                                  <Text size="4">{option.text}</Text>
                                </Flex>
                              </RadioCards.Item>
                            ))}
                          </RadioCards.Root>
                        </Flex>
                      ))}

                    <Button size="4" variant="solid">
                      Submit
                    </Button>
                  </Flex>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default Home;
