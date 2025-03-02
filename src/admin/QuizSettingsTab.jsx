import { useState } from "react";
import {
  Dialog,
  Card,
  Flex,
  Text,
  TextArea,
  Radio,
  TextField,
  IconButton,
  Button,
  AlertDialog,
  Table,
  Badge,
  Strong,
  Separator,
  DataList,
  Link,
  Switch,
} from "@radix-ui/themes";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function QuizSettingsTab({ quiz }) {
  return (
    <Flex py="4" direction="column" gap="3" width="100%">
      <DataList.Root size="3">
        <DataList.Item align="center" className="align-top">
          <DataList.Label minWidth="88px">
            <Flex direction="column">
              <Text>Shuffle Options</Text>
              <Text size="2" className="opacity-70">
                Different options order for each users
              </Text>
            </Flex>
          </DataList.Label>
          <DataList.Value>
            <Switch defaultChecked />
          </DataList.Value>
        </DataList.Item>
        <DataList.Item align="center">
          <DataList.Label minWidth="88px">
            <Flex direction="column">
              <Text>Include to leaderbaord calculation</Text>
              <Text size="2" className="opacity-70">
                Add this quiz's points to leaderbaord calculation
              </Text>
            </Flex>
          </DataList.Label>
          <DataList.Value>
            <Switch defaultChecked />
          </DataList.Value>
        </DataList.Item>
        <DataList.Item align="center">
          <DataList.Label minWidth="88px">
            <Flex direction="column">
              <Text>Publish Answer and Point</Text>
              <Text size="2" className="opacity-70">
                Publish correct answer to participant and the point they earned
              </Text>
            </Flex>
          </DataList.Label>
          <DataList.Value>
            <Switch />
          </DataList.Value>
        </DataList.Item>
        <DataList.Item align="center">
          <DataList.Label minWidth="88px">
            <Flex direction="column">
              <Text>Auto Schedule</Text>
              <Text size="2" className="opacity-70">
                Publish and unpublish with auto schedule
              </Text>
            </Flex>
          </DataList.Label>
          <DataList.Value>
            <Switch disabled />
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Flex>
  );
}

export default QuizSettingsTab;
