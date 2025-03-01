import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Import Firestore instance
import {
  Flex,
  Text,
  Button,
  Table,
  Badge,
  Spinner,
  IconButton,
  AlertDialog,
  Strong,
  Skeleton,
} from "@radix-ui/themes";
import { TrashIcon } from "@heroicons/react/24/outline";

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
        const participationRef = collection(db, "participants");
        // Order by the "name" field in ascending order (A-Z)
        const q = query(participationRef, orderBy("name", "asc"));
        const querySnapshot = await getDocs(q);

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
    <Flex direction="column" gap="5" flexGrow="1">
      <Flex gap="4" align="center" justify="between">
        <Text size="5" className="font-semibold">
          <span className="text-2xl">🧑‍🤝‍🧑</span> Participants
        </Text>
        <Button
          size="2"
          variant="soft"
          onClick={() => navigate("/add-participant")}
        >
          + Add Participants
        </Button>
      </Flex>

      {loading ? (
        <Skeleton width="100%" height="200px">
          <Table.Root variant="surface"></Table.Root>
        </Skeleton>
      ) : participants.length > 0 ? (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Relation Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Relative Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Phone Number</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Participation No.</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {participants.map((participant) => (
              <Table.Row key={participant.id}>
                <Table.RowHeaderCell>
                  <Strong>{participant.name}</Strong>
                </Table.RowHeaderCell>
                <Table.Cell>
                  {participant.relation_type === "son"
                    ? "S/o"
                    : participant.relation_type === "daughter"
                    ? "D/o"
                    : participant.relation_type === "wife"
                    ? "W/o"
                    : ""}
                </Table.Cell>
                {participant.relation_name != " " && (
                  <Table.Cell>{participant.relative_name}</Table.Cell>
                )}

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
  );
}

export default Participants;
