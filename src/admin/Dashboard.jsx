import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Import Firestore instance
import { Flex, Box, Text, Card, Button, Table } from "@radix-ui/themes";
import {
  UsersIcon,
  CalendarDaysIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import PointTable from "../components/PointTable";

function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [participants, setParticipants] = useState([]);

  // Fetch quizzes from Firestore
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const quizData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include document ID
          ...doc.data(),
        }));
        setQuizzes(quizData);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "participants"));
        const participantsData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Get document ID (useful for updates/deletions)
          ...doc.data(), // Spread the document data
        }));
        setParticipants(participantsData);
      } catch (err) {
        console.error("Error fetching participants:", err);
      }
    };

    fetchParticipants();
  }, []);
  return (
    <Flex direction="column" gap="7" flexGrow="1">
      <Flex gap="3">
        <Card>
          <Flex
            gap="4"
            align="center"
            py="1"
            pl="3"
            pr="4"
            width="150px"
            justify="between"
          >
            <Box>
              <Text as="div" size="2" color="gray">
                Quizzes
              </Text>
              <Text as="div" size="2" weight="bold">
                {quizzes.length}
              </Text>
            </Box>
            <PuzzlePieceIcon className="size-7 text-gray-500/50" />
          </Flex>
        </Card>
        <Card>
          <Flex
            gap="4"
            align="center"
            py="1"
            pl="3"
            pr="4"
            width="150px"
            justify="between"
          >
            <Box>
              <Text as="div" size="2" color="gray">
                Participants
              </Text>
              <Text as="div" size="2" weight="bold">
                {participants.length}
              </Text>
            </Box>
            <UsersIcon className="size-7 text-gray-500/50" />
          </Flex>
        </Card>
      </Flex>
      <Flex direction="column" gap="4">
        <Text size="5" className="font-semibold">
          Leaderboard
        </Text>
        <PointTable />
      </Flex>
    </Flex>
  );
}

export default Dashboard;
