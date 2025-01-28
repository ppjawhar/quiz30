import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Import your auth instance
import {
  Flex,
  Box,
  Container,
  Text,
  TextField,
  Button,
} from "@radix-ui/themes";
import Header from "../components/Header";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect to dashboard on successful login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <Box>
      <Container size="1" py="9" px="5">
        <Flex direction="column" gap="7">
          <Header />
          <form onSubmit={handleLogin}>
            <Flex direction="column" gap="5">
              <Text size="6" weight="medium">
                Admin Login
              </Text>
              {error && (
                <Text color="red" size="2">
                  {error}
                </Text>
              )}
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Email Address
                </Text>
                <TextField.Root
                  placeholder="Enter Email Address"
                  className="!h-12 !bg-gray-200/30"
                  size="3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Password
                </Text>
                <TextField.Root
                  placeholder="Enter Password"
                  type="password"
                  className="!h-12 !bg-gray-200/30"
                  size="3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <Button size="4" variant="solid" type="submit">
                Login
              </Button>
            </Flex>
          </form>
        </Flex>
      </Container>
    </Box>
  );
}

export default Login;
