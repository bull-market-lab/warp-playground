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
import { WarpJobLink } from "./WarpJobLink";
import { WarpJobDetail } from "./WarpJobDetail";
import { WarpCancelJob } from "./WarpCancelJob";
import { WalletConnection } from "@delphi-labs/shuttle";

type WarpPendingJobsProps = {
  wallet: WalletConnection;
  warpControllerAddress: string;
};

export const WarpPendingJobs = ({
  wallet,
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

  return (
    <Flex align="center" justify="center" direction="column">
      <Box>pending order count {warpPendingJobCount}</Box>
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
                <Td>
                  <WarpJobLink jobId={job.id} />
                </Td>
                <Td>
                  <WarpJobDetail jobName={job.name} />
                </Td>
                <Td>
                  <WarpCancelJob
                    wallet={wallet}
                    jobId={job.id}
                    warpControllerAddress={warpControllerAddress}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
