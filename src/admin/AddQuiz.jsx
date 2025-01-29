import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Import Firestore instance
import {
  Flex,
  Text,
  TextField,
  Card,
  Button,
  TextArea,
  IconButton,
  Radio,
} from "@radix-ui/themes";
import {
  ArrowLeftIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function AddQuiz() {
  const [quizName, setQuizName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input for quiz name
  const handleQuizNameChange = (value) => {
    setQuizName(value);
  };

  // Handle input for quiz description
  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  // Handle input for question text
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  // Handle input for option text
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].text = value;
    setQuestions(updatedQuestions);
  };

  // Handle correct answer selection
  const handleCorrectAnswer = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.map((option, idx) => ({
      ...option,
      isCorrect: idx === optionIndex,
    }));
    setQuestions(updatedQuestions);
  };

  // Add a new option to a question
  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({
      text: "",
      isCorrect: false,
    });
    setQuestions(updatedQuestions);
  };

  // Remove an option from a question
  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.filter((_, idx) => idx !== optionIndex);
    setQuestions(updatedQuestions);
  };

  // Add a new question
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  // Remove a question
  const handleRemoveQuestion = (questionIndex) => {
    const updatedQuestions = questions.filter(
      (_, idx) => idx !== questionIndex
    );
    setQuestions(updatedQuestions);
  };

  // Handle quiz submission
  const handleSubmit = async () => {
    if (!quizName.trim()) {
      setError("Quiz name is required.");
      return;
    }

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    if (questions.some((q) => !q.question.trim() || q.options.length < 2)) {
      setError(
        "All questions must have text, and at least 2 options are required."
      );
      return;
    }

    if (
      questions.some(
        (q) => q.options.length > 0 && !q.options.some((o) => o.isCorrect)
      )
    ) {
      setError("Each question must have one correct answer.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "quizzes"), {
        quizName,
        description,
        questions,
        numberOfQuestions: questions.length,
        status: "Unpublished", // Default status
        numberOfAttempts: 0, // Default value
      });
      navigate("/quizzes");
    } catch (err) {
      console.error("Error creating quiz:", err);
      setError("Failed to create quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction="column" gap="7" flexGrow="1">
      <Flex direction="column" gap="5" align="start">
        <Button size="2" variant="soft" onClick={() => navigate("/quizzes")}>
          <ArrowLeftIcon className="size-5" />
          Back
        </Button>
        <Text size="5" className="font-semibold">
          Create Quiz
        </Text>
      </Flex>

      {error && (
        <Text color="red" size="2">
          {error}
        </Text>
      )}

      <Flex direction="column" gap="5" width="600px">
        <label>
          <Text as="div" size="3" mb="1" weight="bold">
            Quiz Name
          </Text>
          <TextField.Root
            placeholder="Enter Quiz Name"
            size="3"
            value={quizName}
            onChange={(e) => handleQuizNameChange(e.target.value)}
          />
        </label>

        <label>
          <Text as="div" size="3" mb="1" weight="bold">
            Description
          </Text>
          <TextArea
            placeholder="Enter quiz description"
            size="3"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
          />
        </label>

        {questions.map((question, qIndex) => (
          <Card key={qIndex} variant="classic" className="bg-gray-500/10">
            <Flex direction="column" gap="3">
              <Flex justify="between" align="center">
                <Text size="3" weight="bold">
                  Question {qIndex + 1}
                </Text>
                <IconButton
                  variant="soft"
                  color="red"
                  onClick={() => handleRemoveQuestion(qIndex)}
                >
                  <TrashIcon width="18" height="18" />
                </IconButton>
              </Flex>

              <TextArea
                size="3"
                placeholder="Enter question"
                value={question.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              />

              {question.options.map((option, oIndex) => (
                <Flex key={oIndex} gap="2" align="center" justify="between">
                  <Radio
                    size="3"
                    color="grass"
                    checked={option.isCorrect}
                    onChange={() => handleCorrectAnswer(qIndex, oIndex)}
                  />
                  <TextField.Root
                    placeholder={`Option ${oIndex + 1}`}
                    size="2"
                    className="w-full"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                  />
                  <IconButton
                    variant="soft"
                    color="red"
                    onClick={() => handleRemoveOption(qIndex, oIndex)}
                  >
                    <XMarkIcon width="18" height="18" />
                  </IconButton>
                </Flex>
              ))}

              <Button
                size="2"
                variant="outline"
                onClick={() => handleAddOption(qIndex)}
              >
                + Add Option
              </Button>
            </Flex>
          </Card>
        ))}

        <Button size="3" variant="soft" onClick={handleAddQuestion}>
          + Add More Question
        </Button>
        <Button
          size="4"
          variant="solid"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating Quiz..." : "Create Quiz"}
        </Button>
      </Flex>
    </Flex>
  );
}

export default AddQuiz;
