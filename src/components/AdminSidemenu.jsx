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
} from "@heroicons/react/24/outline";

function AdminSidemenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
          color={`${isActive("/participants") ? "" : "gray"}`}
          className="!justify-start"
          onClick={() => navigate("/participants")}
        >
          <UsersIcon className="size-5" />
          Participants
        </Button>
        <Button
          variant="ghost"
          size="3"
          color={`${isActive("/questions") ? "" : "gray"}`}
          className="!justify-start"
          onClick={() => navigate("/questions")}
        >
          <QuestionMarkCircleIcon className="size-5" />
          Questions
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
