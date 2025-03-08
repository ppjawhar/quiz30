import React, { useMemo } from "react";
import {
  Flex,
  Button,
  Text,
  RadioCards,
  Strong,
  Spinner,
  Callout,
} from "@radix-ui/themes";

// Client-side utility to shuffle an array using the Fisher-Yates algorithm
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function PublishedQuiz({
  quiz,
  quizLoading,
  selectedAnswers,
  handleOptionSelect,
  handleSubmitQuiz,
  submittingQuiz,
  alreadySubmitted,
}) {
  if (quizLoading) return <Spinner />;
  if (!quiz) return null;

  // Compute shuffled options for each question only once when the quiz loads.
  const shuffledOptionsByQuestion = useMemo(() => {
    return quiz.questions.map((question) =>
      quiz.shuffleOptions ? shuffleArray(question.options) : question.options
    );
  }, [quiz]);

  // Check if each question has a selected answer
  const allQuestionsAnswered = quiz.questions.every(
    (question, index) => selectedAnswers && selectedAnswers[index]
  );

  return (
    <Flex direction="column" gap="6">
      <Flex direction="column" gap="1">
        <Text size="6" weight="bold">
          {quiz.quizName}
        </Text>
        <Text size="4" color="gray">
          {quiz.description}
        </Text>
      </Flex>
      <Flex gap="5" direction="column">
        {quiz.questions.map((question, index) => {
          // Use the pre-computed shuffled options for this question
          const shuffledOptions = shuffledOptionsByQuestion[index];

          return (
            <Flex key={index} direction="column" gap="3">
              <Text size="6" mb="5">
                {index + 1}. {question.question}
              </Text>

              <RadioCards.Root columns="1">
                {shuffledOptions.map((option, optionIndex) => (
                  <RadioCards.Item
                    key={optionIndex}
                    value={option}
                    onClick={() => handleOptionSelect(index, option)}
                    disabled={alreadySubmitted}
                  >
                    <Flex direction="row" width="100%" gap="2" align="center">
                      <Text size="4" weight="bold">
                        {String.fromCharCode(65 + optionIndex)}.
                      </Text>
                      <Text size="4">{option.text}</Text>
                    </Flex>
                  </RadioCards.Item>
                ))}
              </RadioCards.Root>
            </Flex>
          );
        })}
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
            disabled={submittingQuiz || !allQuestionsAnswered}
          >
            {submittingQuiz ? "Submitting..." : "Submit"}
          </Button>
        )}
      </Flex>
    </Flex>
  );
}

export default PublishedQuiz;
