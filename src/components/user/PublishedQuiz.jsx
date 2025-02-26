import {
  Flex,
  Button,
  Text,
  RadioCards,
  Strong,
  Spinner,
  Callout,
} from "@radix-ui/themes";
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
        {quiz.questions.map((question, index) => (
          <Flex key={index} direction="column" gap="3">
            <Text size="6" mb="5">
              {index + 1}. {question.question}
            </Text>
            {alreadySubmitted ? (
              <RadioCards.Root columns="1">
                {question.options.map((option, optionIndex) => (
                  <RadioCards.Item key={optionIndex} value={option} disabled>
                    <Flex direction="row" width="100%" gap="2" align="center">
                      <Text size="4" weight="bold">
                        {String.fromCharCode(65 + optionIndex)}.
                      </Text>
                      <Text size="4">{option.text}</Text>
                    </Flex>
                  </RadioCards.Item>
                ))}
              </RadioCards.Root>
            ) : (
              <RadioCards.Root columns="1">
                {question.options.map((option, optionIndex) => (
                  <RadioCards.Item
                    key={optionIndex}
                    value={option}
                    onClick={() => handleOptionSelect(index, option)}
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
            )}
          </Flex>
        ))}
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
    </Flex>
  );
}

export default PublishedQuiz;
