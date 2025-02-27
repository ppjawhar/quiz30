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
          quizData = { quizName: "", description: "", questions: [] };
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
