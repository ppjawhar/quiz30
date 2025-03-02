import { useContext, useState } from "react";
import { Flex, Text, IconButton } from "@radix-ui/themes";
import { SunIcon, MoonIcon, HomeIcon } from "@radix-ui/react-icons";
import ThemeContext from "../ThemeContext";

function Header({ handleReset }) {
  const { appearance, toggleAppearance } = useContext(ThemeContext);

  return (
    <>
      <Flex justify="between" align="center">
        <Flex gap="0" direction="column">
          <Text size="5" color="gray" className=" !font-sans">
            EK Family
          </Text>
          <Text size="7" className="font-semibold">
            Ramadan Quiz 2025
          </Text>
        </Flex>

        <Flex gap="3">
          <IconButton
            variant="soft"
            color="gray"
            size="3"
            onClick={toggleAppearance}
          >
            {appearance === "dark" ? <SunIcon /> : <MoonIcon />}
          </IconButton>
          <IconButton
            variant="soft"
            color="gray"
            size="3"
            onClick={handleReset}
          >
            <HomeIcon />
          </IconButton>
        </Flex>
      </Flex>
    </>
  );
}

export default Header;
