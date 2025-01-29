import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Import Firestore instance
import { Flex, Box, Section, Text, TextField, Button } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AdminHeader from "../components/AdminHeader";
import AdminSidemenu from "../components/AdminSidemenu";

function AddParticipant() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For button loading state
  const navigate = useNavigate();

  const generateParticipationNumber = async () => {
    while (true) {
      const participationNumber = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number

      // Check Firestore for duplicate participationNumber
      const participantsQuery = query(
        collection(db, "participants"),
        where("participationNumber", "==", participationNumber)
      );
      const querySnapshot = await getDocs(participantsQuery);

      if (querySnapshot.empty) {
        // If no duplicate found, return the generated number
        return participationNumber;
      }

      // Otherwise, retry generating a new number
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!name || !age || !phone) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const participationNumber = await generateParticipationNumber(); // Generate a unique number

      // Add participant to Firestore
      const docRef = await addDoc(collection(db, "participants"), {
        name,
        age: Number(age),
        phone,
        participationNumber,
      });

      console.log("Document written with ID:", docRef.id);

      // Redirect back to participants page
      navigate("/participants");
    } catch (err) {
      console.error("Error adding document:", err);
      setError("Failed to add participant. Please try again.");
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
              <Flex direction="column" gap="7">
                <Flex direction="column" gap="5" align="start">
                  <Button
                    size="3"
                    variant="soft"
                    onClick={() => navigate("/participants")}
                  >
                    <ArrowLeftIcon className="size-5" />
                    Back
                  </Button>
                  <Text size="5" className="font-semibold">
                    Add Participant
                  </Text>
                </Flex>
                <form onSubmit={handleSubmit}>
                  <Flex as="form" direction="column" gap="5" width="400px">
                    {error && (
                      <Text color="red" size="2">
                        {error}
                      </Text>
                    )}
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Name
                      </Text>
                      <TextField.Root
                        placeholder="Enter Name"
                        className="!h-12 !bg-gray-200/30"
                        size="3"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </label>
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Age
                      </Text>
                      <TextField.Root
                        placeholder="Enter Age"
                        className="!h-12 !bg-gray-200/30"
                        size="3"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </label>
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Phone Number
                      </Text>
                      <TextField.Root
                        placeholder="Enter Phone Number"
                        className="!h-12 !bg-gray-200/30"
                        size="3"
                        type="number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </label>
                    <Button
                      size="4"
                      variant="solid"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Adding Participant..." : "Add Participant"}
                    </Button>
                  </Flex>
                </form>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </Box>
  );
}

export default AddParticipant;
