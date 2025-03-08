import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Container,
  Button,
  Text,
  Separator,
  Tabs,
  Callout,
  SegmentedControl,
} from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { getFunctions, httpsCallable } from "firebase/functions";

import Header from "../components/Header";
import EnterParticipationNumber from "../components/user/EnterParticipationNumber";
import ParticipantDetails from "../components/user/ParticipationDetails";
import PublishedQuiz from "../components/user/PublishedQuiz";
import SuccessSubmission from "../components/user/SuccessSubmission";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Import Firestore instance

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
  // New state for segmented control and points data
  const [selectedSegment, setSelectedSegment] = useState("quiz");
  const [pointsData, setPointsData] = useState(null);
  const [pointsLoading, setPointsLoading] = useState(false);

  // Handle participant search using the participation number
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setParticipant(null);
    setQuiz(null);
    setPointsData(null); // reset points data

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

  // Fetch points and submission details when user selects "My Points"
  useEffect(() => {
    const fetchPointsData = async () => {
      if (participant && selectedSegment === "points") {
        setPointsLoading(true);
        try {
          const functions = getFunctions();
          const getPointsData = httpsCallable(
            functions,
            "getParticipantSubmissions"
          );
          const result = await getPointsData({ participationNumber });

          setPointsData(result.data);

          let totalPoints = 0;
          const submissions = [];

          result.data.quizzesData.forEach((quiz) => {
            // Skip if no responses
            if (!quiz.responses) return;
            // Find the response from the participant
            const response = quiz.responses.find(
              (r) => r.participationNumber === participationNumber
            );
            if (!response) return;

            const answerDetails = [];
            let correctCount = 0;

            // Process each answer from the response.
            // Assume response.answers is an array of objects:
            // { question: "Question text", selectedAnswer: "User's answer text" }
            response.answers.forEach((answer) => {
              // Match the answer to the quiz question by question text.
              const quizQuestion = quiz.questions.find(
                (q) => q.question === answer.question
              );
              if (!quizQuestion) return; // Skip if the question is not found.
              const correctOption = quizQuestion.options.find(
                (option) => option.isCorrect
              );
              const isAnswerCorrect =
                correctOption && answer.selectedAnswer === correctOption.text;
              if (isAnswerCorrect) {
                correctCount++;
                answerDetails.push({
                  question: quizQuestion.question,
                  submittedAnswer: answer.selectedAnswer,
                });
              } else {
                answerDetails.push({
                  question: quizQuestion.question,
                  submittedAnswer: answer.selectedAnswer,
                  correctAnswer: correctOption
                    ? correctOption.text
                    : "Not available",
                });
              }
            });

            totalPoints += correctCount;
            submissions.push({
              quizId: quiz.id,
              quizName: quiz.quizName,
              answers: answerDetails,
              correctCount,
            });
          });
        } catch (error) {
          console.error("Error fetching points data:", error);
        } finally {
          setPointsLoading(false);
        }
      }
    };

    fetchPointsData();
  }, [participant, selectedSegment, participationNumber]);

  // Reset the form and state to start over
  const handleReset = () => {
    setParticipationNumber("");
    setParticipant(null);
    setQuiz(null);
    setQuizId(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setError("");
    setPointsData(null);
  };

  return (
    <Box>
      <Container size="1" py="9" px="5">
        <Flex direction="column" gap="7">
          <Header handleReset={handleReset} />

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

            {/* Once a participant is found, display details and quiz/points */}
            {participant && (
              <Flex direction="column" gap="5">
                <Flex direction="column" gap="3">
                  <ParticipantDetails
                    participant={participant}
                    handleReset={handleReset}
                  />
                </Flex>

                <SegmentedControl.Root
                  size="3"
                  value={selectedSegment}
                  onValueChange={setSelectedSegment}
                  variant="surface"
                >
                  <SegmentedControl.Item value="quiz">
                    Today's Quiz
                  </SegmentedControl.Item>
                  <SegmentedControl.Item value="points">
                    My Answers
                  </SegmentedControl.Item>
                </SegmentedControl.Root>

                {selectedSegment === "quiz" && (
                  <Flex>
                    {/* Show the quiz */}
                    {!quizSubmittedSuccess ? (
                      <PublishedQuiz
                        quiz={quiz}
                        quizLoading={quizLoading}
                        selectedAnswers={selectedAnswers}
                        handleOptionSelect={handleOptionSelect}
                        handleSubmitQuiz={handleSubmitQuiz}
                        submittingQuiz={submittingQuiz}
                        alreadySubmitted={alreadySubmitted}
                      />
                    ) : (
                      <SuccessSubmission handleReset={handleReset} />
                    )}
                  </Flex>
                )}

                {selectedSegment === "points" && (
                  <Flex direction="column" gap="4">
                    {pointsLoading ? (
                      <Text>Loading points data...</Text>
                    ) : pointsData ? (
                      <>
                        <Callout.Root variant="surface" color="blue" size="2">
                          <Callout.Text>
                            Your Total Points:{" "}
                            <strong>{pointsData.totalPoints}</strong>
                          </Callout.Text>
                        </Callout.Root>

                        {pointsData.submissions
                          .sort((a, b) => b.quizName.localeCompare(a.quizName))
                          .map((submission) => (
                            <Flex
                              direction="column"
                              gap="3"
                              key={submission.quizId}
                            >
                              <Separator size="4" my="3" />
                              <Text size="4" weight="bold">
                                {submission.quizName}:
                              </Text>
                              {submission.publishAnswers
                                ? submission.answers.map((ans, idx) => (
                                    <Flex key={idx} direction="column" gap="1">
                                      <Text size="3" weight="bold">
                                        {ans.question}
                                      </Text>
                                      {ans.correctAnswer ? (
                                        <>
                                          <Flex>
                                            <Text
                                              size="2"
                                              style={{
                                                background: "var(--red-a3)",
                                                border:
                                                  "1px dashed var(--red-a7)",
                                                borderRadius: "3px 0px 0px 3px",
                                                padding: "7px",
                                                width: "30%",
                                              }}
                                            >
                                              Your Answer:
                                            </Text>
                                            <Text
                                              size="2"
                                              style={{
                                                background: "var(--red-a3)",
                                                border:
                                                  "1px dashed var(--red-a7)",
                                                borderRadius: "0px 3px 3px 0px",
                                                padding: "7px",
                                                width: "70%",
                                              }}
                                            >
                                              {ans.submittedAnswer}
                                            </Text>
                                          </Flex>
                                          <Flex>
                                            <Text
                                              size="2"
                                              style={{
                                                background: "var(--green-a3)",
                                                border:
                                                  "1px dashed var(--green-a7)",
                                                borderRadius: "3px 0px 0px 3px",
                                                padding: "7px",
                                                width: "30%",
                                              }}
                                            >
                                              Correct Answer:
                                            </Text>
                                            <Text
                                              size="2"
                                              style={{
                                                background: "var(--green-a3)",
                                                border:
                                                  "1px dashed var(--green-a7)",
                                                borderRadius: "0px 3px 3px 0px",
                                                padding: "7px",
                                                width: "70%",
                                              }}
                                            >
                                              {ans.correctAnswer}
                                            </Text>
                                          </Flex>
                                        </>
                                      ) : (
                                        <>
                                          <Flex>
                                            <Text
                                              size="2"
                                              style={{
                                                background: "var(--green-a3)",
                                                border:
                                                  "1px dashed var(--green-a7)",
                                                borderRadius: "3px 0px 0px 3px",
                                                padding: "7px",
                                                width: "30%",
                                              }}
                                            >
                                              Your Answer:
                                            </Text>
                                            <Text
                                              size="2"
                                              style={{
                                                background: "var(--green-a3)",
                                                border:
                                                  "1px dashed var(--green-a7)",
                                                borderRadius: "0px 3px 3px 0px",
                                                padding: "7px",
                                                width: "70%",
                                              }}
                                            >
                                              {ans.submittedAnswer}
                                            </Text>
                                          </Flex>
                                          <Text
                                            size="2"
                                            style={{
                                              background: "var(--gray-a3)",
                                              borderColor: "var(--gray-a7)",
                                              border:
                                                "1px solid var(--gray-a7)",
                                              borderBottom:
                                                "1px solid var(--gray-a7)",
                                              borderRadius: "3px",
                                              padding: "7px",
                                              width: "100%",
                                            }}
                                          >
                                            Your answer is correct!
                                          </Text>
                                        </>
                                      )}
                                    </Flex>
                                  ))
                                : // For quizzes that haven't published answers
                                  submission.answers.map((ans, idx) => (
                                    <Flex key={idx} direction="column" gap="1">
                                      <Text size="3" weight="bold">
                                        {ans.question}
                                      </Text>
                                      <Flex>
                                        <Text
                                          size="2"
                                          style={{
                                            background: "var(--blue-a3)",
                                            border: "1px dashed var(--blue-a7)",
                                            borderRadius: "3px 0px 0px 3px",
                                            padding: "7px",
                                            width: "30%",
                                          }}
                                        >
                                          Your Answer:
                                        </Text>
                                        <Text
                                          size="2"
                                          style={{
                                            background: "var(--blue-a3)",
                                            border: "1px dashed var(--blue-a7)",
                                            borderRadius: "0px 3px 3px 0px",
                                            padding: "7px",
                                            width: "70%",
                                          }}
                                        >
                                          {ans.submittedAnswer}
                                        </Text>
                                      </Flex>
                                      <Text
                                        size="2"
                                        style={{
                                          background: "var(--gray-a3)",
                                          borderColor: "var(--gray-a7)",
                                          border: "1px solid var(--gray-a7)",
                                          borderRadius: "3px",
                                          padding: "7px",
                                          width: "100%",
                                        }}
                                      >
                                        Result not yet published
                                      </Text>
                                    </Flex>
                                  ))}
                            </Flex>
                          ))}
                      </>
                    ) : (
                      <Text>No submission data found.</Text>
                    )}
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
