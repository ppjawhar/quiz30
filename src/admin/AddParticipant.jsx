import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  Flex,
  Text,
  TextField,
  Button,
  Table,
  IconButton,
  Select,
} from "@radix-ui/themes";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";

function AddParticipant() {
  // Set default relation_type to "son" for each participant
  const [participants, setParticipants] = useState([
    { name: "", relation_type: "son", relative_name: "", phone: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Generate a unique 4-digit participation number
  const generateParticipationNumber = async () => {
    while (true) {
      const participationNumber = Math.floor(1000 + Math.random() * 9000);
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

  // Add a new blank participant row with default relation_type
  const handleAddRow = () => {
    setParticipants([
      ...participants,
      { name: "", relation_type: "son", relative_name: "", phone: "" },
    ]);
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
      // Validate that each participant has a name and phone
      for (const participant of participants) {
        if (!participant.name || !participant.phone) {
          setError("Name and phone number are required for each participant.");
          setLoading(false);
          return;
        }
      }

      // Add each participant to Firestore with a unique participation number
      for (const participant of participants) {
        const participationNumber = await generateParticipationNumber();
        await addDoc(collection(db, "participants"), {
          ...participant,
          participationNumber,
        });
      }

      navigate("/participants");
    } catch (err) {
      console.error("Error adding participants:", err);
      setError("Failed to add participants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction="column" gap="7" flexGrow="1">
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
            <Table.ColumnHeaderCell>Participant Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Relationship</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Phone Number</Table.ColumnHeaderCell>
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
                  size="2"
                  value={participant.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
              </Table.RowHeaderCell>
              <Table.Cell>
                <Flex gap="1" flexGrow="1">
                  <Select.Root
                    value={participant.relation_type}
                    onValueChange={(value) =>
                      handleInputChange(index, "relation_type", value)
                    }
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Group>
                        <Select.Label>Relation Type</Select.Label>
                        <Select.Item value="son">S/o</Select.Item>
                        <Select.Item value="daughter">D/o</Select.Item>
                        <Select.Item value="wife">W/o</Select.Item>
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>

                  <TextField.Root
                    placeholder="Enter relative name"
                    size="2"
                    type="text"
                    value={participant.relative_name}
                    className="w-full"
                    onChange={(e) =>
                      handleInputChange(index, "relative_name", e.target.value)
                    }
                  />
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <TextField.Root
                  placeholder="Enter Phone Number"
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
  );
}

export default AddParticipant;
