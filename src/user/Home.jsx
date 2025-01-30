import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  setDoc,
  getDoc,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore"; // Firestore methods
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
  Strong,
  Card,
  Spinner,
  Callout,
  Popover,
  IconButton,
} from "@radix-ui/themes";
import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Header from "../components/Header";

function Home() {
  const [participationNumber, setParticipationNumber] = useState("");
  const [participant, setParticipant] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [quizId, setQuizId] = useState(null); // Store quiz document ID
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Store selected answers
  const [date, setDate] = useState(new Date());
  const [quizSubmittedSuccess, setQuizSubmitted] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (participant && quizId) {
      checkIfAlreadySubmitted(quizId);
    }
  }, [participant, quizId]);

  // Function to fetch the published quiz
  const fetchPublishedQuiz = async () => {
    setQuizLoading(true);
    try {
      const quizzesRef = collection(db, "quizzes");
      const q = query(quizzesRef, where("status", "==", "Published"));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const quizDoc = querySnapshot.docs[0];
        const quizData = quizDoc.data();
        setQuiz(quizData);
        setQuizId(quizDoc.id); // Store quiz document ID
        checkIfAlreadySubmitted(quizDoc.id);
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

  const checkIfAlreadySubmitted = async (quizId) => {
    if (!participant) return;

    // alert(participant);
    try {
      const quizRef = doc(db, "quizzes", quizId);
      const quizDoc = await getDoc(quizRef);
      if (quizDoc.exists()) {
        const responses = quizDoc.data().responses || [];
        const hasSubmitted = responses.some(
          (response) =>
            response.participationNumber === participant.participationNumber
        );
        setAlreadySubmitted(hasSubmitted);
      }
    } catch (err) {
      console.error("Error checking submission status:", err);
    }
  };

  // Handle selection of an answer
  const handleOptionSelect = (questionIndex, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  // Handle form submission to save responses
  const handleSubmitQuiz = async () => {
    if (!quizId) {
      console.error("Quiz ID not found.");
      return;
    }

    setSubmittingQuiz(true); // Show "Submitting..." on button

    // Prepare participant's answers
    const answers = quiz.questions.map((question, index) => {
      const selectedOption = selectedAnswers[index] || { text: "No answer" };
      const correctOption = question.options.find((opt) => opt.isCorrect)?.text;

      return {
        question: question.question,
        selectedAnswer: selectedOption.text,
        isCorrect: selectedOption.text === correctOption,
      };
    });

    // Create participant response object
    const participantResponse = {
      participantName: participant.name,
      participationNumber: participant.participationNumber,
      date: new Date().toISOString(),
      answers,
    };

    try {
      const quizRef = doc(db, "quizzes", quizId);

      // Check if "responses" field exists
      const quizDoc = await getDoc(quizRef);
      if (!quizDoc.exists()) {
        console.error("Quiz document not found!");
        return;
      }

      const quizData = quizDoc.data();

      if (!quizData.responses) {
        // If "responses" field does not exist, create it as an empty array first
        await setDoc(quizRef, { responses: [] }, { merge: true });
      }

      // Now, safely add the participant response
      await updateDoc(quizRef, {
        responses: arrayUnion(participantResponse), // Append to responses array
      });
      setQuizSubmitted(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Error submitting quiz. Please try again.");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Reset the form and start from the beginning
  const handleReset = () => {
    setParticipationNumber("");
    setParticipant(null);
    setQuiz(null);
    setQuizId(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setError("");
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
                    {loading ? <Spinner /> : "Submit"}
                  </Button>
                </Flex>
              </form>
            )}

            {error && <Text color="red">{error}</Text>}

            {/* Show participant details if found */}
            {participant && (
              <Flex direction="column" gap="5">
                <Card variant="classic">
                  <Flex direction="column" gap="1" p="2">
                    <Flex align="center" justify="between" gap="4">
                      <Text size="5" weight="bold" color="solid">
                        Participant Details:
                      </Text>
                      <Popover.Root>
                        <Popover.Trigger>
                          <IconButton variant="ghost">
                            <QuestionMarkCircleIcon width="24" height="24" />
                          </IconButton>
                        </Popover.Trigger>
                        <Popover.Content width="360px">
                          <Flex gap="2" direction="column">
                            <Text>This is not you?</Text>
                            <Button onClick={handleReset}>
                              Enter participation number again.
                            </Button>
                          </Flex>
                        </Popover.Content>
                      </Popover.Root>
                    </Flex>

                    <Flex gap="1" direction="row">
                      <Text size="4" color="gray">
                        Participant Name:
                      </Text>
                      <Text size="4" weight="medium">
                        <Strong>{participant.name}</Strong>
                      </Text>
                    </Flex>
                    <Flex gap="1" direction="row">
                      <Text size="4" color="gray">
                        Participant No:
                      </Text>
                      <Link size="4" color="solid">
                        <Strong>{participant.participationNumber}</Strong>
                      </Link>
                    </Flex>
                    <Flex gap="1" direction="row">
                      <Text size="4" color="gray">
                        Age:
                      </Text>
                      <Text size="4">{participant.age}</Text>
                    </Flex>
                    <Flex gap="1" direction="row">
                      <Text size="4" color="gray">
                        Phone:
                      </Text>
                      <Text size="4">{participant.phone}</Text>
                    </Flex>
                    <Link onClick={handleReset} mt="4">
                      Play as another participant?
                    </Link>
                  </Flex>
                </Card>

                {/* Show quiz details */}
                {quizLoading && <Spinner />}

                {quiz && !quizSubmittedSuccess && (
                  <Flex direction="column" gap="6">
                    <Flex direction="column" gap="1">
                      <Text size="6" weight="bold">
                        {quiz.quizName}
                      </Text>
                      <Text size="4" color="gray">
                        {quiz.description} -{" "}
                        <Strong>{date.toDateString()}</Strong>
                      </Text>
                    </Flex>

                    <Separator size="4" />

                    <Flex gap="9" direction="column">
                      {quiz.questions.map((question, index) => (
                        <Flex key={index} direction="column" gap="3">
                          <Text size="6" mb="5">
                            {index + 1}. {question.question}
                          </Text>

                          <RadioCards.Root
                            columns="1"
                            disabled={alreadySubmitted}
                          >
                            {question.options.map((option, optionIndex) => (
                              <RadioCards.Item
                                key={optionIndex}
                                value={option}
                                onClick={() =>
                                  handleOptionSelect(index, option)
                                }
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
                    </Flex>
                    {quiz && alreadySubmitted && (
                      <Callout.Root color="red">
                        <Callout.Text size="5">
                          You already submitted your answers for{" "}
                          <Strong>{quiz.quizName}</Strong>
                        </Callout.Text>
                      </Callout.Root>
                    )}
                    {!alreadySubmitted && (
                      <Button
                        size="4"
                        variant="solid"
                        onClick={handleSubmitQuiz}
                        disabled={submittingQuiz}
                      >
                        {submittingQuiz ? "Submitting..." : "Submit"}
                      </Button>
                    )}
                  </Flex>
                )}

                {quizSubmittedSuccess && (
                  <Flex gap="5" direction="column" align="center">
                    <CheckCircleIcon className="size-20 text-emerald-500" />
                    <Text size="6" align="center" className="!font-sans">
                      Your answer submitted successfully!
                    </Text>

                    <Button size="4" variant="solid" onClick={handleReset}>
                      OK
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
