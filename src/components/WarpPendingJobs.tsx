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

type WarpPendingJobsProps = {
  warpControllerAddress: string;
};

export const WarpPendingJobs = ({
  warpControllerAddress,
}: WarpPendingJobsProps) => {
  const [warpPendingJobs, setWarpPendingJobs] = useState<Job[]>([]);
  const [warpPendingJobCount, setWarpPendingJobCount] = useState(0);

  const getWarpPendingJobsResult = useWarpGetJobs({
    warpControllerAddress,
    status: "Pending",
  }).jobsResult.data;

  useEffect(() => {
    if (!getWarpPendingJobsResult) {
      return;
    }
    setWarpPendingJobCount(getWarpPendingJobsResult.totalCount);
    setWarpPendingJobs(getWarpPendingJobsResult.jobs);
  }, [getWarpPendingJobsResult]);

  const cancelJob = () => {
    // TODO: cancel warp job
  };

  return (
    <Flex align="center" justify="center" direction="column">
      <Box>pending limit swap count {warpPendingJobCount}</Box>
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
            {warpPendingJobs.map((job) => (
              <Tr key={job.id}>
                <Td>{job.id}</Td>
                <Td>to be added</Td>
                <Td>
                  <Button onClick={cancelJob}>cancel</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
