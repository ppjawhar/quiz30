import { Outlet } from "react-router-dom";
import { Flex, Box, Section } from "@radix-ui/themes";
import AdminSidemenu from "../components/AdminSidemenu";
import AdminHeader from "../components/AdminHeader";
function Layout() {
  return (
    <Box>
      <Section size="4" py="0">
        <Flex gap="0" direction="column">
          <AdminHeader />
          <Flex gap="0">
            <AdminSidemenu />

            <Flex px="7" pt="6" pb="9" flexGrow="1">
              <Outlet />
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </Box>
  );
}

export default Layout;
