import { useWarpGetJobs } from "@/hooks/useWarpGetJobs";
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Box,
} from "@chakra-ui/react";
import { Job } from "@/utils/warpHelpers";
import { WarpJobDetail } from "@/components/warp/WarpJobDetail";
import { WarpJobLink } from "@/components/warp/WarpJobLink";

type WarpClosedJobsProps = {
  warpControllerAddress: string;
};

export const WarpClosedJobs = ({
  warpControllerAddress,
}: WarpClosedJobsProps) => {
  const [warpCancelledJobs, setWarpCancelledJobs] = useState<Job[]>([]);
  const [warpCancelledJobCount, setWarpCancelledJobCount] = useState(0);

  // TODO: cover all 3 status: Failed, Evicted, Cancelled
  const getWarpCancelledJobsResult = useWarpGetJobs({
    warpControllerAddress,
    status: "Cancelled",
  }).jobsResult.data;

  useEffect(() => {
    if (!getWarpCancelledJobsResult) {
      return;
    }
    setWarpCancelledJobCount(getWarpCancelledJobsResult.totalCount);
    setWarpCancelledJobs(getWarpCancelledJobsResult.jobs);
  }, [getWarpCancelledJobsResult]);

  return (
    <Flex align="center" justify="center" direction="column">
      <Box>closed order count {warpCancelledJobCount}</Box>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>job id</Th>
              <Th>detail</Th>
              <Th>closed reason</Th>
            </Tr>
          </Thead>
          <Tbody>
            {warpCancelledJobs.map((job) => (
              <Tr key={job.id}>
                <Td>
                  <WarpJobLink jobId={job.id} />
                </Td>
                <Td>
                  <WarpJobDetail jobName={job.name} />
                </Td>
                <Td>{job.status === "Evicted" ? "Expired" : job.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
