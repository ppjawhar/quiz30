import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth"; // Firebase sign-out method
import { auth } from "../firebase"; // Import your Firebase auth instance
import { Flex, Text, IconButton, Popover, Radio } from "@radix-ui/themes";
import { SunIcon, MoonIcon, ShadowIcon } from "@radix-ui/react-icons";
import ThemeContext from "../ThemeContext";

function AdminHeader() {
  const navigate = useNavigate();
  const { appearance, toggleAppearance } = useContext(ThemeContext);

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
      <Flex gap="2">
        <IconButton
          variant="soft"
          color="gray"
          size="3"
          onClick={toggleAppearance}
        >
          {appearance === "dark" ? <SunIcon /> : <MoonIcon />}
        </IconButton>
        {/* <Popover.Root>
          <Popover.Trigger asChild>
            <IconButton variant="soft" color="gray" size="3">
              <ShadowIcon />
            </IconButton>
          </Popover.Trigger>
          <Popover.Content side="bottom" align="center">
            <Flex direction="column" gap="2" align="end">
              <Flex gap="2">
                <Radio size="2" color="grass" name="color" value="grass" />
                <Radio size="2" color="blue" name="color" value="blue" />
              </Flex>
            </Flex>
          </Popover.Content>
        </Popover.Root> */}
      </Flex>
    </Flex>
  );
}

export default AdminHeader;
