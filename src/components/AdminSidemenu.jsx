import { useNavigate, useLocation } from "react-router-dom";
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

  const isActive = (paths) => paths.includes(location.pathname);

  return (
    <Flex width="280px" direction="column" gap="4">
      <Flex direction="column" gap="5" width="200px">
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
          color={`${isActive(["/quizzes", "/add-quiz"]) ? "" : "gray"}`}
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
    </Flex>
  );
}

export default AdminSidemenu;
