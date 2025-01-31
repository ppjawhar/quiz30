import { useState, useEffect } from "react";
import { Flex, Text, Table, Badge, Strong } from "@radix-ui/themes";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Ensure Firebase is configured in this file

function PointTable() {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Fetch participants and quizzes concurrently
        const [participantsSnapshot, quizzesSnapshot] = await Promise.all([
          getDocs(collection(db, "participants")),
          getDocs(collection(db, "quizzes")),
        ]);

        const participantsData = participantsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const quizzesData = quizzesSnapshot.docs.map((doc) => doc.data());

        // Create a map for quiz responses grouped by participationNumber
        const participantStats = new Map();

        quizzesData.forEach((quiz) => {
          if (!quiz.responses) return;

          quiz.responses.forEach((response) => {
            const { participationNumber, answers } = response;

            if (!participantStats.has(participationNumber)) {
              participantStats.set(participationNumber, {
                quizAttended: 0,
                correctAnswers: 0,
              });
            }

            const participantData = participantStats.get(participationNumber);
            participantData.quizAttended += 1;
            participantData.correctAnswers += answers.filter(
              (answer) => answer.isCorrect
            ).length;
          });
        });

        // Merge statistics with participant details
        const leaderboardData = participantsData.map((participant) => {
          const { participationNumber, name } = participant;
          const stats = participantStats.get(participationNumber) || {
            quizAttended: 0,
            correctAnswers: 0,
          };

          return {
            participationNumber,
            name,
            quizAttended: stats.quizAttended,
            correctAnswers: stats.correctAnswers,
          };
        });

        // 🔹 Sort participants by correctAnswers in descending order
        const sortedLeaderboard = leaderboardData.sort(
          (a, b) => b.correctAnswers - a.correctAnswers
        );

        setParticipants(sortedLeaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Participation No.</Table.ColumnHeaderCell>
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
            <Table.RowHeaderCell>
              <Badge variant="outline">{participant.participationNumber}</Badge>
            </Table.RowHeaderCell>
            <Table.Cell>{participant.name}</Table.Cell>
            <Table.Cell>{participant.quizAttended}</Table.Cell>
            <Table.Cell align="right">
              <Strong>{participant.correctAnswers}</Strong>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export default PointTable;
