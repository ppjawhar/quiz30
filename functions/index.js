const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true }); // Allow all origins; adjust as needed

admin.initializeApp();

exports.lookupParticipant = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(403).send("Forbidden!");
    }

    const { participationNumber } = req.body;
    if (!participationNumber) {
      return res.status(400).json({ error: "Missing participationNumber" });
    }

    try {
      const partNumber = Number(participationNumber);
      // Query the participants collection
      const participantsRef = admin.firestore().collection("participants");
      const querySnapshot = await participantsRef
        .where("participationNumber", "==", partNumber)
        .get();

      if (querySnapshot.empty) {
        return res.status(404).json({ error: "Participant not found" });
      }

      const participantData = querySnapshot.docs[0].data();

      // Query for a published quiz
      const quizzesRef = admin.firestore().collection("quizzes");
      const quizSnapshot = await quizzesRef
        .where("status", "==", "Published")
        .limit(1)
        .get();
      let quizData = null;
      let quizId = null;
      let alreadySubmitted = false;
      if (!quizSnapshot.empty) {
        const quizDoc = quizSnapshot.docs[0];
        const originalQuizData = quizDoc.data();
        quizId = quizDoc.id;

        // Check if the participant has already submitted responses
        if (originalQuizData && originalQuizData.responses) {
          alreadySubmitted = originalQuizData.responses.some(
            (response) =>
              response.participationNumber ===
              participantData.participationNumber
          );
        }

        // Transform the quiz data to include only questions and options (only text)
        if (originalQuizData && originalQuizData.questions) {
          quizData = {
            quizName: originalQuizData.quizName,
            description: originalQuizData.description,
            shuffleOptions: originalQuizData.shuffleOptions,
            questions: originalQuizData.questions.map((question) => ({
              question: question.question,
              options: Array.isArray(question.options)
                ? question.options.map((option) => ({
                    text: option.text,
                  }))
                : [],
            })),
          };
        } else {
          quizData = {
            quizName: "",
            description: "",
            shuffleOptions: false,
            questions: [],
          };
        }
      }

      return res.status(200).json({
        participant: participantData,
        quiz: quizData,
        quizId,
        alreadySubmitted,
      });
    } catch (error) {
      console.error("Error in lookupParticipant:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

exports.submitQuiz = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(403).send("Forbidden!");
    }

    const { quizId, participant, answers } = req.body;
    if (!quizId || !participant || !answers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const quizRef = admin.firestore().collection("quizzes").doc(quizId);
      const quizDoc = await quizRef.get();
      if (!quizDoc.exists) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      const quizData = quizDoc.data();
      const responses = quizData.responses || [];
      const alreadySubmitted = responses.some(
        (response) =>
          response.participationNumber === participant.participationNumber
      );
      if (alreadySubmitted) {
        return res.status(400).json({ error: "Quiz already submitted" });
      }

      // Check if all questions have an answer submitted.
      if (
        answers.length !== quizData.questions.length ||
        quizData.questions.some((question, index) => {
          return !answers[index] || !answers[index].selectedAnswer;
        })
      ) {
        return res
          .status(400)
          .json({ error: "All questions must be answered" });
      }

      // Compute the answers with correctness on the server side
      const computedAnswers = quizData.questions.map((question, index) => {
        const correctOption = question.options.find(
          (opt) => opt.isCorrect
        )?.text;
        const submittedAnswer = answers[index]?.selectedAnswer;
        return {
          question: question.question,
          selectedAnswer: submittedAnswer,
          isCorrect: submittedAnswer === correctOption,
        };
      });

      const participantResponse = {
        participantName: participant.name,
        participationNumber: participant.participationNumber,
        date: new Date().toISOString(),
        answers: computedAnswers, // using the computed answers here
      };

      await quizRef.update({
        responses: admin.firestore.FieldValue.arrayUnion(participantResponse),
      });
      return res.status(200).json({ message: "Quiz submitted successfully" });
    } catch (error) {
      console.error("Error in submitQuiz:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

exports.changeQuizStatus = functions.https.onCall(async (data, context) => {
  // Expecting quizId and newStatus to be passed from the client.

  console.log("Received data:", data); // This will log the data payload
  const { quizId, newStatus } = data.data;

  if (!quizId || !newStatus) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "quizId and newStatus must be provided."
    );
  }

  const quizzesRef = admin.firestore().collection("quizzes");

  if (newStatus === "Published") {
    // Query for any quiz that is published (excluding the one being updated).
    const publishedQuerySnapshot = await quizzesRef
      .where("status", "==", "Published")
      .get();

    let conflictQuiz = null;
    publishedQuerySnapshot.forEach((doc) => {
      if (doc.id !== quizId) {
        conflictQuiz = doc.data();
      }
    });

    if (conflictQuiz) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        `Only one quiz can be published at a time. Unpublish the quiz "${conflictQuiz.quizName}" first.`
      );
    }
  }

  // Update the quiz document with the new status.
  try {
    await quizzesRef.doc(quizId).update({ status: newStatus });
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError("unknown", error.message, error);
  }
});

exports.getLeaderboardData = functions.https.onCall(async (data, context) => {
  try {
    const db = admin.firestore();
    // Fetch participants and quizzes concurrently.
    const [participantsSnapshot, quizzesSnapshot] = await Promise.all([
      db.collection("participants").get(),
      db.collection("quizzes").get(),
    ]);

    const participantsData = participantsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const quizzesData = quizzesSnapshot.docs.map((doc) => doc.data());

    // Compute stats for each participant based on quiz responses,
    // only considering quizzes with includeLeaderboard === true.
    const participantStats = new Map();

    quizzesData.forEach((quiz) => {
      if (!quiz.includeLeaderboard) return; // Only include quizzes for leaderboard
      if (!quiz.responses) return;

      quiz.responses.forEach((response) => {
        const { participationNumber, answers } = response;
        if (!participantStats.has(participationNumber)) {
          participantStats.set(participationNumber, {
            quizAttended: 0,
            correctAnswers: 0,
          });
        }
        const stats = participantStats.get(participationNumber);
        stats.quizAttended += 1;
        stats.correctAnswers += answers.filter(
          (answer) => answer.isCorrect
        ).length;
      });
    });

    // Merge statistics with participant details.
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

    // Sort leaderboard by total correct answers in descending order.
    const sortedLeaderboard = leaderboardData.sort(
      (a, b) => b.correctAnswers - a.correctAnswers
    );

    return sortedLeaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Unable to fetch leaderboard data"
    );
  }
});

exports.getParticipantLeaderboardAndSubmissions = functions.https.onCall(
  async (data, context) => {
    try {
      const db = admin.firestore();
      const { participationNumber } = data.data;
      if (!participationNumber) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Participation number is required."
        );
      }

      // Query quizzes that should publish answers
      const quizzesSnapshot = await db
        .collection("quizzes")
        .where("publishAnswers", "==", true)
        .get();
      // Include quiz id along with data
      const quizzesData = quizzesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let totalPoints = 0;
      const submissions = [];

      quizzesData.forEach((quiz) => {
        // Skip if no responses
        if (!quiz.responses) return;
        // Find the response from the participant
        const response = quiz.responses.find(
          (r) => String(r.participationNumber) === String(participationNumber)
        );
        if (!response) return;

        const answerDetails = [];
        let correctCount = 0;

        // Process each answer from the response.
        // Assume response.answers is an array of objects:
        // { question: "Question text", selectedAnswer: "User's answer text" }
        response.answers.forEach((answer) => {
          // Match the answer to the quiz question by question text.
          const quizQuestion = quiz.questions.find(
            (q) => q.question === answer.question
          );
          if (!quizQuestion) return; // Skip if the question is not found.
          const correctOption = quizQuestion.options.find(
            (option) => option.isCorrect
          );
          const isAnswerCorrect =
            correctOption && answer.selectedAnswer === correctOption.text;
          if (isAnswerCorrect) {
            correctCount++;
            answerDetails.push({
              question: quizQuestion.question,
              submittedAnswer: answer.selectedAnswer,
            });
          } else {
            answerDetails.push({
              question: quizQuestion.question,
              submittedAnswer: answer.selectedAnswer,
              correctAnswer: correctOption
                ? correctOption.text
                : "Not available",
            });
          }
        });

        totalPoints += correctCount;
        submissions.push({
          quizId: quiz.id,
          quizName: quiz.quizName,
          answers: answerDetails,
          correctCount,
        });
      });

      return { quizzesData, totalPoints, submissions };
    } catch (error) {
      console.error(
        "Error fetching participant leaderboard and submissions:",
        error
      );
      throw new functions.https.HttpsError("internal", "Unable to fetch data");
    }
  }
);

exports.getParticipantSubmissions = functions.https.onCall(
  async (data, context) => {
    try {
      const db = admin.firestore();
      const { participationNumber } = data.data;
      if (!participationNumber) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Participation number is required."
        );
      }

      // Get ALL quizzes (regardless of publishAnswers)
      const quizzesSnapshot = await db.collection("quizzes").get();
      const quizzesData = quizzesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let totalPoints = 0;
      const submissions = [];

      quizzesData.forEach((quiz) => {
        // Skip if no responses
        if (!quiz.responses) return;
        // Find the response from the participant
        const response = quiz.responses.find(
          (r) => String(r.participationNumber) === String(participationNumber)
        );
        if (!response) return;

        const answerDetails = [];
        let correctCount = 0;

        // Process each answer differently based on quiz.publishAnswers
        if (quiz.publishAnswers) {
          response.answers.forEach((answer) => {
            // Find the corresponding quiz question by question text.
            const quizQuestion = quiz.questions.find(
              (q) => q.question === answer.question
            );
            if (!quizQuestion) return; // Skip if the question is not found.
            const correctOption = quizQuestion.options.find(
              (option) => option.isCorrect
            );
            const isAnswerCorrect =
              correctOption && answer.selectedAnswer === correctOption.text;
            if (isAnswerCorrect) {
              correctCount++;
              answerDetails.push({
                question: quizQuestion.question,
                submittedAnswer: answer.selectedAnswer,
              });
            } else {
              answerDetails.push({
                question: quizQuestion.question,
                submittedAnswer: answer.selectedAnswer,
                correctAnswer: correctOption
                  ? correctOption.text
                  : "Not available",
              });
            }
          });
          totalPoints += correctCount;
        } else {
          // For quizzes that have not published answers, only include the submitted answer.
          response.answers.forEach((answer) => {
            const quizQuestion = quiz.questions.find(
              (q) => q.question === answer.question
            );
            if (!quizQuestion) return;
            answerDetails.push({
              question: quizQuestion.question,
              submittedAnswer: answer.selectedAnswer,
              result: "result not yet published",
            });
          });
        }

        submissions.push({
          quizId: quiz.id,
          quizName: quiz.quizName,
          publishAnswers: quiz.publishAnswers,
          answers: answerDetails,
          correctCount: quiz.publishAnswers ? correctCount : undefined,
        });
      });

      return { quizzesData, totalPoints, submissions };
    } catch (error) {
      console.error(
        "Error fetching participant leaderboard and submissions:",
        error
      );
      throw new functions.https.HttpsError("internal", "Unable to fetch data");
    }
  }
);

// fetching quiz details for user side view
exports.getQuizDetails = functions.https.onCall(async (data, context) => {
  try {
    const quizzesSnapshot = await admin
      .firestore()
      .collection("quizzes")
      .orderBy("quizName", "asc")
      .get();

    const quizzes = [];
    quizzesSnapshot.forEach((doc) => {
      const quizData = doc.data();

      // Calculate the total number of responses for the quiz
      let totalResponses = quizData.responses ? quizData.responses.length : 0;
      let totalCorrect = 0;

      // For each response, count the number of correct answers
      if (quizData.responses) {
        quizData.responses.forEach((response) => {
          if (response.answers && Array.isArray(response.answers)) {
            totalCorrect += response.answers.filter(
              (answer) => answer.isCorrect
            ).length;
          }
        });
      }

      quizzes.push({
        id: doc.id,
        ...quizData,
        totalResponses,
        totalCorrect,
      });
    });

    return quizzes;
  } catch (error) {
    console.error("Error fetching quiz details:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error fetching quiz details",
      error
    );
  }
});

exports.getQuizById = functions.https.onCall(async (data, context) => {
  try {
    const db = admin.firestore();
    const { quizId } = data.data;
    if (!quizId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Quiz ID is required."
      );
    }
    const quizDoc = await db.collection("quizzes").doc(quizId).get();
    if (!quizDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Quiz not found");
    }
    return { quiz: { id: quizDoc.id, ...quizDoc.data() } };
  } catch (error) {
    console.error("Error retrieving quiz:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Unable to retrieve quiz data"
    );
  }
});
