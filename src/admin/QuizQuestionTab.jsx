import { useState } from "react";
import {
  Dialog,
  Card,
  Flex,
  Text,
  TextArea,
  Radio,
  TextField,
  IconButton,
  Button,
  AlertDialog,
} from "@radix-ui/themes";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function QuizQuestionTab({
  quiz,
  setEditQuestion,
  editQuestion,
  handleUpdateQuestion,
  handleDeleteQuestion,
  handleAddQuestion = { handleAddQuestion },
}) {
  if (!quiz) return <Text>Loading questions...</Text>;

  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  const handleOptionChange = (index, value) => {
    setNewOptions((prevOptions) =>
      prevOptions.map((opt, i) => (i === index ? { ...opt, text: value } : opt))
    );
  };

  const handleAddOption = () => {
    setNewOptions([...newOptions, { text: "", isCorrect: false }]);
  };

  const handleMarkCorrect = (index) => {
    setNewOptions((prevOptions) =>
      prevOptions.map((opt, i) => ({
        ...opt,
        isCorrect: i === index, // Set only this option as correct, unmark others
      }))
    );
  };

  const handleSaveNewQuestion = async () => {
    if (!newQuestion.trim()) return;

    const questionData = {
      question: newQuestion,
      options: [...newOptions], // Ensure we pass a fresh copy
    };

    await handleAddQuestion(questionData);

    setNewQuestion(""); // Reset input
    setNewOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
  };

  return (
    <Flex py="4" direction="column" gap="3" width="100%">
      {quiz.questions.map((q, qIndex) => (
        <Card key={qIndex} variant="classic" className="bg-gray-500/10 w-full">
          <Flex direction="column" gap="3">
            <Flex justify="between" align="center">
              <Text size="4" weight="bold">
                Question {qIndex + 1}
              </Text>
              <Flex gap="2">
                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <IconButton variant="soft" color="red">
                      <TrashIcon width="16" height="16" />
                    </IconButton>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>Delete Question?</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                      Are you sure? This question will no longer be available
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                      <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action>
                        <Button
                          variant="solid"
                          color="red"
                          onClick={() => handleDeleteQuestion(qIndex)}
                        >
                          Delete
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>

                <Dialog.Root>
                  <Dialog.Trigger>
                    <IconButton
                      variant="soft"
                      onClick={() => setEditQuestion(q)}
                    >
                      <PencilSquareIcon width="16" height="16" />
                    </IconButton>
                  </Dialog.Trigger>

                  <Dialog.Content maxWidth="600px">
                    <Dialog.Title>Edit Question</Dialog.Title>
                    <Flex direction="column" gap="3">
                      <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                          Question
                        </Text>
                        <TextArea
                          size="3"
                          value={editQuestion?.question || ""}
                          onChange={(e) =>
                            setEditQuestion({
                              ...editQuestion,
                              question: e.target.value,
                            })
                          }
                        />
                      </label>
                      {editQuestion?.options?.map((option, oIndex) => (
                        <Flex
                          key={oIndex}
                          gap="2"
                          align="center"
                          justify="between"
                        >
                          <Radio
                            size="3"
                            color="grass"
                            checked={option.isCorrect}
                            onChange={() => {
                              setEditQuestion({
                                ...editQuestion,
                                options: editQuestion.options.map((opt, i) => ({
                                  ...opt,
                                  isCorrect: i === oIndex,
                                })),
                              });
                            }}
                          />
                          <TextField.Root
                            className="w-full"
                            value={option.text}
                            onChange={(e) => {
                              setEditQuestion({
                                ...editQuestion,
                                options: editQuestion.options.map((opt, i) =>
                                  i === oIndex
                                    ? { ...opt, text: e.target.value }
                                    : opt
                                ),
                              });
                            }}
                          />
                          <IconButton
                            variant="soft"
                            color="red"
                            onClick={() => {
                              setEditQuestion({
                                ...editQuestion,
                                options: editQuestion.options.filter(
                                  (_, i) => i !== oIndex
                                ),
                              });
                            }}
                          >
                            <XMarkIcon width="18" height="18" />
                          </IconButton>
                        </Flex>
                      ))}
                      <Button
                        size="2"
                        variant="outline"
                        onClick={() => {
                          setEditQuestion({
                            ...editQuestion,
                            options: [
                              ...editQuestion.options,
                              { text: "", isCorrect: false },
                            ],
                          });
                        }}
                      >
                        + Add Option
                      </Button>
                    </Flex>

                    <Flex gap="3" mt="6" justify="end">
                      <Dialog.Close>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </Dialog.Close>
                      <Dialog.Close>
                        <Button onClick={() => handleUpdateQuestion(qIndex)}>
                          Save
                        </Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
              </Flex>
            </Flex>
            <Text size="3">{q.question}</Text>

            <Flex gap="2" direction="column">
              {q.options.map((option, oIndex) => (
                <Flex key={oIndex} gap="0">
                  <Text
                    size="2"
                    style={{
                      background: option.isCorrect
                        ? "var(--green-a4)"
                        : "var(--gray-a3)",

                      border: "1px dashed var(--gray-a7)",
                      borderBottom: "1px dashed var(--gray-a7)",
                      borderRadius: "3px 0px 0px 3px",
                      borderColor: option.isCorrect
                        ? "var(--green-a7)"
                        : "var(--gray-a7)",
                      padding: "7px",
                      width: "30px",
                      textAlign: "center",
                    }}
                  >
                    {String.fromCharCode(65 + oIndex)}
                  </Text>
                  <Text
                    size="2"
                    style={{
                      background: option.isCorrect
                        ? "var(--green-a4)"
                        : "var(--gray-a3)",
                      borderColor: option.isCorrect
                        ? "var(--green-a7)"
                        : "var(--gray-a7)",
                      border: "1px dashed var(--gray-a7)",
                      borderBottom: "1px dashed var(--gray-a7)",
                      borderRadius: "0px 3px 3px 0px",
                      padding: "7px",
                      width: "100%",
                    }}
                  >
                    {option.text}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Card>
      ))}
      <Dialog.Root>
        <Dialog.Trigger>
          <Button variant="soft">+ Add More Question</Button>
        </Dialog.Trigger>
        <Dialog.Content maxWidth="600px">
          <Dialog.Title>Add Question</Dialog.Title>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Question
              </Text>
              <TextArea
                size="2"
                placeholder="Enter question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </label>
            {newOptions.map((option, index) => (
              <Flex key={index} gap="2" align="center" justify="between">
                <Radio
                  size="3"
                  color="grass"
                  onChange={() => handleMarkCorrect(index)}
                />
                <TextField.Root
                  className="w-full"
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                <IconButton
                  variant="soft"
                  color="red"
                  onClick={() =>
                    setNewOptions(newOptions.filter((_, i) => i !== index))
                  }
                >
                  <XMarkIcon width="18" height="18" />
                </IconButton>
              </Flex>
            ))}
            <Button size="2" variant="outline" onClick={handleAddOption}>
              + Add Option
            </Button>
          </Flex>
          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button
                onClick={() => {
                  handleSaveNewQuestion();
                }}
              >
                Save
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}

export default QuizQuestionTab;
