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
  TrophyIcon,
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
          <span className="text-2xl">🏠</span> Home
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
          <span className="text-2xl">🧩</span>
          Quizzes
        </Button>
        <Button
          variant="ghost"
          size="3"
          color={`${isActive("/leaderboard") ? "" : "gray"}`}
          className="!justify-start"
          onClick={() => navigate("/leaderboard")}
        >
          <span className="text-2xl">🏆</span>
          Leaderboard
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
          <span className="text-2xl">🧑‍🤝‍🧑</span>
          Participants
        </Button>
      </Flex>
      <Flex direction="column" gap="3">
        <Button size="3" variant="soft" onClick={handleLogout}>
          Logout
        </Button>
        <Text align="center" size="2" color="gray">
          V 1.0.0
        </Text>
      </Flex>
    </Flex>
  );
}

export default AdminSidemenu;
