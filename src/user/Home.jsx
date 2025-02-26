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
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Flex,
  Box,
  Container,
  Button,
  Text,
  Separator,
  Callout,
} from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import Header from "../components/Header";
import EnterParticipationNumber from "../components/user/EnterParticipationNumber";
import ParticipantDetails from "../components/user/ParticipationDetails";
import PublishedQuiz from "../components/user/PublishedQuiz";
import SuccessSubmission from "../components/user/SuccessSubmission";

function Home() {
  const [participationNumber, setParticipationNumber] = useState("");
  const [participant, setParticipant] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmittedSuccess, setQuizSubmitted] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // Handle participant search using the participation number
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setParticipant(null);
    setQuiz(null);

    try {
      const response = await fetch(
        "https://us-central1-ekquiz30-69c41.cloudfunctions.net/lookupParticipant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ participationNumber }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Error fetching participant");
      } else {
        setParticipant(data.participant);
        setQuiz(data.quiz);
        setQuizId(data.quizId);
        setAlreadySubmitted(data.alreadySubmitted);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching participant.");
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection in the quiz remains the same
  const handleOptionSelect = (questionIndex, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  // Handle quiz submission - now sends only the selected answers without "isCorrect"
  const handleSubmitQuiz = async () => {
    if (!quizId) {
      console.error("Quiz ID not found.");
      return;
    }

    setSubmittingQuiz(true);

    // Prepare the answers array without computing isCorrect here
    const answers = quiz.questions.map((question, index) => {
      const selectedOption = selectedAnswers[index] || { text: "No answer" };
      return {
        question: question.question,
        selectedAnswer: selectedOption.text,
      };
    });

    try {
      const response = await fetch(
        "https://us-central1-ekquiz30-69c41.cloudfunctions.net/submitQuiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizId,
            participant,
            answers,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Error submitting quiz.");
      } else {
        setQuizSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting quiz. Please try again.");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Reset the form and state to start over
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
            {/* Show the participation number entry form if no participant is loaded */}
            {!participant && (
              <EnterParticipationNumber
                participationNumber={participationNumber}
                setParticipationNumber={setParticipationNumber}
                handleSearch={handleSearch}
                loading={loading}
              />
            )}

            {error && (
              <Callout.Root color="red" size="1">
                <Callout.Icon>
                  <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>{error}</Callout.Text>
              </Callout.Root>
            )}

            {/* Once a participant is found, display details and quiz */}
            {participant && (
              <Flex direction="column" gap="5">
                <ParticipantDetails
                  participant={participant}
                  handleReset={handleReset}
                />
                <Button variant="soft" onClick={handleReset}>
                  Play as another participant
                </Button>
                <Separator size="4" />

                {/* Show the quiz if not yet submitted */}
                {!quizSubmittedSuccess && (
                  <PublishedQuiz
                    quiz={quiz}
                    quizLoading={quizLoading}
                    selectedAnswers={selectedAnswers}
                    handleOptionSelect={handleOptionSelect}
                    handleSubmitQuiz={handleSubmitQuiz}
                    submittingQuiz={submittingQuiz}
                    alreadySubmitted={alreadySubmitted}
                  />
                )}

                {/* Show success message after quiz submission */}
                {quizSubmittedSuccess && (
                  <SuccessSubmission handleReset={handleReset} />
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
