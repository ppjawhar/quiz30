import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth"; // Firebase sign-out method
import { auth } from "../firebase"; // Import your Firebase auth instance
import { Flex, Text, Button } from "@radix-ui/themes";

function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Error during logout:", err.message);
    }
  };

  return (
    <Flex justify="between" align="center" py="7" px="7">
      <Flex gap="0" direction="column">
        <Text size="3" color="gray" className="!font-sans">
          EK Family
        </Text>
        <Text size="5" className="font-semibold">
          Ramadan Quiz 2025
        </Text>
      </Flex>
      
    </Flex>
  );
}

export default AdminHeader;
