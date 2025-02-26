import { Flex, TextField, Button, Text, Spinner } from "@radix-ui/themes";

//  Enter Participation Number Component
function EnterParticipationNumber({
  participationNumber,
  setParticipationNumber,
  handleSearch,
  loading,
}) {
  return (
    <form onSubmit={handleSearch}>
      <Flex direction="column" gap="4">
        <Text size="5" color="gray">
          Your participation number:
        </Text>
        <TextField.Root
          className=" text-lg"
          size="3"
          type="number"
          placeholder="Enter your participation number"
          value={participationNumber}
          onChange={(e) => setParticipationNumber(e.target.value)}
        />
        <Button size="3" variant="solid" type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Submit"}
        </Button>
      </Flex>
    </form>
  );
}

export default EnterParticipationNumber;
