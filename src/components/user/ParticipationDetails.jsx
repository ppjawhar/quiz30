import {
  Flex,
  Button,
  Text,
  Link,
  Strong,
  Card,
  Popover,
  IconButton,
} from "@radix-ui/themes";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

function ParticipantDetails({ participant, handleReset }) {
  return (
    <Card variant="classic">
      <Flex direction="column" gap="1" p="2" justify="start">
        <Flex align="center" justify="between" gap="4">
          <Text size="5" weight="bold" color="solid">
            Participant Details:
          </Text>
          <Popover.Root>
            <Popover.Trigger>
              <IconButton variant="ghost">
                <QuestionMarkCircleIcon width="24" height="24" />
              </IconButton>
            </Popover.Trigger>
            <Popover.Content width="360px">
              <Flex gap="2" direction="column">
                <Text>This is not you?</Text>
                <Button onClick={handleReset}>
                  Enter participation number again.
                </Button>
              </Flex>
            </Popover.Content>
          </Popover.Root>
        </Flex>

        <Flex gap="1" direction="row">
          <Text size="4" color="gray">
            Participant Name:
          </Text>
          <Text size="4" weight="medium">
            <Strong>{participant.name}</Strong>
          </Text>
        </Flex>
        {participant.relative_name !== "" && (
          <Flex gap="1" direction="row">
            <Text size="4" color="gray">
              {participant.relation_type === "son"
                ? "S/o:"
                : participant.relation_type === "daughter"
                ? "D/o:"
                : participant.relation_type === "wife"
                ? "W/o:"
                : ""}
            </Text>
            <Text size="4">{participant.relative_name}</Text>
          </Flex>
        )}
        <Flex gap="1" direction="row">
          <Text size="4" color="gray">
            Participation No:
          </Text>
          <Link size="4" color="solid">
            <Strong>{participant.participationNumber}</Strong>
          </Link>
        </Flex>
        <Flex gap="1" direction="row">
          <Text size="4" color="gray">
            Phone:
          </Text>
          <Text size="4">{participant.phone}</Text>
        </Flex>
      </Flex>
    </Card>
  );
}

export default ParticipantDetails;
