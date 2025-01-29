import { Outlet } from "react-router-dom";
import { Flex, Box, Section, Separator } from "@radix-ui/themes";

import AdminHeader from "../components/AdminHeader";
import AdminSidemenu from "../components/AdminSidemenu";

function Layout() {
  return (
    <Box>
      <Section size="4" py="0">
        <Flex gap="0" direction="column">
          {/* <AdminHeader /> */}
          <Flex gap="0">
            <AdminSidemenu />

            <Flex px="7" className="py-32" flexGrow="1">
              <Outlet />
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </Box>
  );
}

export default Layout;
