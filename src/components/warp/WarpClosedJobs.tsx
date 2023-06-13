import { useWarpGetJobs } from "@/hooks/useWarpGetJobs";
import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react";
import { LCDClient } from "@terra-money/feather.js";

import { Job } from "@/utils/warpHelpers";
import { WarpJobDetail } from "@/components/warp/WarpJobDetail";
import { WarpJobLink } from "@/components/warp/WarpJobLink";

type WarpClosedJobsProps = {
  lcd?: LCDClient;
  chainID: string;
  ownerAddress?: string;
  warpControllerAddress: string;
};

export const WarpClosedJobs = ({
  lcd,
  chainID,
  ownerAddress,
  warpControllerAddress,
}: WarpClosedJobsProps) => {
  const [warpCancelledJobs, setWarpCancelledJobs] = useState<Job[]>([]);
  const [warpCancelledJobCount, setWarpCancelledJobCount] = useState(0);

  // TODO: cover all 3 status: Failed, Evicted, Cancelled
  const getWarpCancelledJobsResult = useWarpGetJobs({
    lcd,
    chainID,
    ownerAddress,
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

  const warpCancelledJobItems =
    warpCancelledJobs.length > 0 ? (
      warpCancelledJobs.map((job) => (
        <Tr
          key={job.id}
          transition="0.25s all"
          bg="white"
          mb="2"
          _hover={{ bg: "gray.100" }}
        >
          <Td borderBottom="none" py="6" borderLeftRadius="2xl">
            <WarpJobLink jobId={job.id} />
          </Td>
          <Td borderBottom="none" py="6" minW="230px" borderRightRadius="2xl">
            <WarpJobDetail jobName={job.name} />
          </Td>
        </Tr>
      ))
    ) : (
      <Tr bg="white" mb="2">
        <Td
          colSpan={4}
          py="6"
          textAlign="center"
          borderBottom="none"
          borderRadius="2xl"
        >
          No Cancelled orders
        </Td>
      </Tr>
    );

  return (
    <>
      <Box>cancelled order count {warpCancelledJobCount}</Box>
      {warpCancelledJobCount > 50 ? (
        <Box>
          WARNING! currently UI only shows up to recent 50 jobs, you need to go
          to official Warp UI to see all jobs
        </Box>
      ) : (
        <></>
      )}
      <Box overflowX="auto">
        <Table
          style={{ borderCollapse: "separate", borderSpacing: "0 0.6rem" }}
        >
          <Thead>
            <Tr>
              <Th
                borderBottom="none"
                bg="brand.darkBrown"
                color="white"
                borderLeftRadius="2xl"
              >
                job id
              </Th>
              <Th
                borderBottom="none"
                bg="brand.darkBrown"
                color="white"
                borderRightRadius="2xl"
              >
                detail
              </Th>
            </Tr>
          </Thead>
          <Tbody>{warpCancelledJobItems}</Tbody>
        </Table>
      </Box>
    </>
  );
};
