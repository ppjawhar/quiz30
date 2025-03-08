import { useState, useEffect } from "react";
import { Flex, Text, Table, Badge, Strong, Skeleton } from "@radix-ui/themes";
import { getFunctions, httpsCallable } from "firebase/functions";

function UserPointTable() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const functions = getFunctions();
        const getLeaderboardData = httpsCallable(
          functions,
          "getLeaderboardData"
        );
        const result = await getLeaderboardData();
        // The Cloud Function returns the sorted leaderboard data.
        setParticipants(result.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <>
      {loading ? (
        <Skeleton width="100%" height="200px">
          <Table.Root variant="surface"></Table.Root>
        </Skeleton>
      ) : participants.length > 0 ? (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>No.</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quiz Attended</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">
                Total Points
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {participants.map((participant, index) => (
              <Table.Row key={participant.participationNumber}>
                <Table.RowHeaderCell>{index + 1}</Table.RowHeaderCell>

                <Table.Cell>{participant.name}</Table.Cell>
                <Table.Cell>{participant.quizAttended}</Table.Cell>
                <Table.Cell align="right">
                  <Strong>{participant.correctAnswers}</Strong>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : (
        <Text>No participants found.</Text>
      )}
    </>
  );
}

export default UserPointTable;
