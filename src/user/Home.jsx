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
} from "@radix-ui/themes";

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

  useEffect(() => {
    if (participant && quizId) {
      checkIfAlreadySubmitted(quizId);
    }
  }, [participant, quizId]);

  // Fetch the published quiz from Firestore
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
        setQuizId(quizDoc.id);
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

  // Handle participant search using the participation number
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setParticipant(null);
    setQuiz(null);

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
        fetchPublishedQuiz();
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

  // Handle answer selection in the quiz
  const handleOptionSelect = (questionIndex, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  // Handle quiz submission
  const handleSubmitQuiz = async () => {
    if (!quizId) {
      console.error("Quiz ID not found.");
      return;
    }

    setSubmittingQuiz(true);

    const answers = quiz.questions.map((question, index) => {
      const selectedOption = selectedAnswers[index] || { text: "No answer" };
      const correctOption = question.options.find((opt) => opt.isCorrect)?.text;
      return {
        question: question.question,
        selectedAnswer: selectedOption.text,
        isCorrect: selectedOption.text === correctOption,
      };
    });

    const participantResponse = {
      participantName: participant.name,
      participationNumber: participant.participationNumber,
      date: new Date().toISOString(),
      answers,
    };

    try {
      const quizRef = doc(db, "quizzes", quizId);
      const quizDoc = await getDoc(quizRef);
      if (!quizDoc.exists()) {
        console.error("Quiz document not found!");
        return;
      }
      const quizData = quizDoc.data();
      if (!quizData.responses) {
        await setDoc(quizRef, { responses: [] }, { merge: true });
      }
      await updateDoc(quizRef, {
        responses: arrayUnion(participantResponse),
      });
      setQuizSubmitted(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
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

            {error && <Text color="red">{error}</Text>}

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
