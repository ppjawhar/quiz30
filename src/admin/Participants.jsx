import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Import Firestore instance
import {
  Flex,
  Box,
  Section,
  Text,
  Button,
  Table,
  Badge,
  Spinner,
  IconButton,
  AlertDialog,
} from "@radix-ui/themes";
import { TrashIcon } from "@heroicons/react/24/outline";

import AdminHeader from "../components/AdminHeader";
import AdminSidemenu from "../components/AdminSidemenu";

function DeleteParticipant({ participantId, onDelete }) {
  const handleDelete = async () => {
    try {
      // Delete participant from Firestore
      await deleteDoc(doc(db, "participants", participantId));
      // Call onDelete callback to update UI
      onDelete(participantId);
    } catch (err) {
      console.error("Error deleting participant:", err);
    }
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <IconButton variant="soft" size="1" color="red">
          <TrashIcon width="12" height="12" />
        </IconButton>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete Participant?</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This participant will no longer be available.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

function Participants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "participants"));
        const participantsData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Get document ID (useful for updates/deletions)
          ...doc.data(), // Spread the document data
        }));
        setParticipants(participantsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching participants:", err);
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const handleDeleteFromState = (participantId) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.id !== participantId)
    );
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
                <Flex gap="4" align="center">
                  <Text size="5" className="font-semibold">
                    Participants
                  </Text>
                  <Button
                    size="2"
                    variant="soft"
                    onClick={() => navigate("/add-participant")}
                  >
                    + Add
                  </Button>
                </Flex>

                {loading ? (
                  <Text>
                    <Spinner />
                  </Text>
                ) : participants.length > 0 ? (
                  <Table.Root variant="surface">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Age</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>
                          Phone Number
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>
                          Participation No.
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {participants.map((participant) => (
                        <Table.Row key={participant.id}>
                          <Table.RowHeaderCell>
                            {participant.name}
                          </Table.RowHeaderCell>
                          <Table.Cell>{participant.age}</Table.Cell>
                          <Table.Cell>{participant.phone}</Table.Cell>
                          <Table.Cell>
                            <Badge variant="outline">
                              {participant.participationNumber}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell align="right">
                            <DeleteParticipant
                              participantId={participant.id}
                              onDelete={handleDeleteFromState}
                            />
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                ) : (
                  <Text>No participants found.</Text>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </Box>
  );
}

export default Participants;
