import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Import Firestore instance
import {
  Flex,
  Box,
  Section,
  Text,
  TextField,
  Button,
  Table,
  IconButton,
} from "@radix-ui/themes";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import AdminHeader from "../components/AdminHeader";
import AdminSidemenu from "../components/AdminSidemenu";

function AddParticipant() {
  const [participants, setParticipants] = useState([
    { name: "", age: "", phone: "" },
  ]);
  const [loading, setLoading] = useState(false); // For submit loading state
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Generate a unique 4-digit participation number
  const generateParticipationNumber = async () => {
    while (true) {
      const participationNumber = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit number

      const participantsQuery = query(
        collection(db, "participants"),
        where("participationNumber", "==", participationNumber)
      );
      const querySnapshot = await getDocs(participantsQuery);

      if (querySnapshot.empty) {
        return participationNumber;
      }
    }
  };

  // Add a new blank participant row
  const handleAddRow = () => {
    setParticipants([...participants, { name: "", age: "", phone: "" }]);
  };

  // Update participant details in the table
  const handleInputChange = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  // Remove a participant row
  const handleRemoveRow = (index) => {
    const updatedParticipants = participants.filter((_, i) => i !== index);
    setParticipants(updatedParticipants);
  };

  // Submit participants to Firestore
  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      // Validate inputs
      for (const participant of participants) {
        if (!participant.name || !participant.age || !participant.phone) {
          setError("All fields are required for each participant.");
          setLoading(false);
          return;
        }
      }

      // Add each participant to Firestore
      for (const participant of participants) {
        const participationNumber = await generateParticipationNumber();
        await addDoc(collection(db, "participants"), {
          ...participant,
          age: Number(participant.age),
          participationNumber,
        });
      }

      navigate("/participants"); // Redirect to participants list
    } catch (err) {
      console.error("Error adding participants:", err);
      setError("Failed to add participants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Section size="4" py="7" px="7">
        <Flex gap="6" direction="column">
          <AdminHeader />
          <Flex gap="1">
            <AdminSidemenu />
            <Flex direction="column" gap="7" flexGrow="1">
              <Flex direction="column" gap="5">
                <Flex direction="column" align="start" gap="5">
                  <Button
                    size="2"
                    variant="soft"
                    onClick={() => navigate("/participants")}
                  >
                    <ArrowLeftIcon className="size-5" />
                    Back
                  </Button>
                  <Text size="5" className="font-semibold">
                    Add Participants
                  </Text>
                </Flex>

                {error && (
                  <Text color="red" size="2">
                    {error}
                  </Text>
                )}

                <Table.Root variant="surface">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>
                        Participant Name
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Age</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>
                        Phone Number
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {participants.map((participant, index) => (
                      <Table.Row key={index} align="center">
                        <Table.Cell>{index + 1}.</Table.Cell>
                        <Table.RowHeaderCell>
                          <TextField.Root
                            placeholder="Enter Name"
                            className="!bg-gray-200/30"
                            size="2"
                            value={participant.name}
                            onChange={(e) =>
                              handleInputChange(index, "name", e.target.value)
                            }
                          />
                        </Table.RowHeaderCell>
                        <Table.Cell>
                          <TextField.Root
                            placeholder="Enter Age"
                            className="!bg-gray-200/30"
                            size="2"
                            type="number"
                            value={participant.age}
                            onChange={(e) =>
                              handleInputChange(index, "age", e.target.value)
                            }
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <TextField.Root
                            placeholder="Enter Phone Number"
                            className="!bg-gray-200/30"
                            size="2"
                            type="number"
                            value={participant.phone}
                            onChange={(e) =>
                              handleInputChange(index, "phone", e.target.value)
                            }
                          />
                        </Table.Cell>
                        <Table.Cell align="right">
                          <IconButton
                            variant="soft"
                            size="2"
                            color="red"
                            onClick={() => handleRemoveRow(index)}
                          >
                            <XMarkIcon width="16" height="16" />
                          </IconButton>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>

                <Flex justify="between" mt="4">
                  <Button variant="soft" size="2" onClick={handleAddRow}>
                    + Add More
                  </Button>
                  <Button
                    variant="solid"
                    size="2"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </Box>
  );
}

export default AddParticipant;
