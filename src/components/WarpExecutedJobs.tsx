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
  Button,
  Flex,
  Box,
} from "@chakra-ui/react";
import { Job } from "@/utils/warpHelpers";
import { WarpJobLink } from "./WarpJobLink";
import { WarpJobDetail } from "./WarpJobDetail";

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
            </Tr>
          </Thead>
          <Tbody>
            {warpExecutedJobs.map((job) => (
              <Tr key={job.id}>
                <Td>
                  <WarpJobLink jobId={job.id} />
                </Td>
                <Td>
                  <WarpJobDetail jobName={job.name} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
