import { useWarpGetJobs } from "@/hooks/useWarpGetJobs";
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Flex,
  Box,
} from "@chakra-ui/react";
import { Job } from "@/utils/job";

type WarpExecutedJobsProps = {
  warpControllerAddress: string;
};

export const WarpExecutedJobs = ({
  warpControllerAddress,
}: WarpExecutedJobsProps) => {
  const [warpExecutedJobs, setWarpExecutedJobs] = useState<Job[]>([]);
  const [warpExecutedJobCount, setWarpExecutedJobCount] = useState(0);

  const getWarpExecutedJobsResult = useWarpGetJobs({
    warpControllerAddress,
    status: "Executed",
  }).jobsResult.data;

  useEffect(() => {
    if (!getWarpExecutedJobsResult) {
      return;
    }
    setWarpExecutedJobCount(getWarpExecutedJobsResult.totalCount);
    setWarpExecutedJobs(getWarpExecutedJobsResult.jobs);
  }, [getWarpExecutedJobsResult]);

  const onClick = () => {};

  return (
    <Flex align="center" justify="center" direction="column">
      <Box>executed limit swap count {warpExecutedJobCount}</Box>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>job id</Th>
              <Th>detail</Th>
              <Th>action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {warpExecutedJobs.map((job) => (
              <Tr key={job.id}>
                <Td>{job.id}</Td>
                <Td>to be added</Td>
                <Td>
                  <Button onClick={onClick}>to be added</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
