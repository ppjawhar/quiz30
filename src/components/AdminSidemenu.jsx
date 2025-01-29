import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth"; // Firebase sign-out method
import { auth } from "../firebase"; // Import your Firebase auth instance
import {
  Flex,
  Box,
  Container,
  Section,
  Separator,
  Text,
  TextField,
  Card,
  Button,
} from "@radix-ui/themes";
import {
  HomeIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";

function AdminSidemenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Error during logout:", err.message);
    }
  };

  const isActive = (paths) => paths.includes(location.pathname);

  return (
    <Flex width="280px" direction="column" gap="9" px="7" py="7">
      <Flex gap="0" direction="column">
        <Text size="3" color="gray" className="!font-sans">
          EK Family
        </Text>
        <Text size="5" className="font-semibold">
          Ramadan Quiz 2025
        </Text>
      </Flex>
      <Flex direction="column" gap="5">
        <Button
          variant="ghost"
          size="3"
          color={`${isActive("/dashboard") ? "" : "gray"}`}
          className="!justify-start"
          onClick={() => navigate("/dashboard")}
        >
          <HomeIcon className="size-5" />
          Home
        </Button>

        <Button
          variant="ghost"
          size="3"
          color={`${
            isActive(["/quizzes", "/add-quiz", "/quiz/:id"]) ? "" : "gray"
          }`}
          className="!justify-start"
          onClick={() => navigate("/quizzes")}
        >
          <PuzzlePieceIcon className="size-5" />
          Quizzes
        </Button>
        <Button
          variant="ghost"
          size="3"
          color={`${
            isActive(["/participants", "/add-participant"]) ? "" : "gray"
          }`}
          className="!justify-start"
          onClick={() => navigate("/participants")}
        >
          <UsersIcon className="size-5" />
          Participants
        </Button>
        <Button
          variant="ghost"
          size="3"
          color={`${isActive("/leaderboard") ? "" : "gray"}`}
          className="!justify-start"
          onClick={() => navigate("/dashboard")}
        >
          <RocketLaunchIcon className="size-5" />
          Leaderboard
        </Button>
      </Flex>
      <Button size="3" variant="soft" onClick={handleLogout}>
        Logout
      </Button>
    </Flex>
  );
}

export default AdminSidemenu;
