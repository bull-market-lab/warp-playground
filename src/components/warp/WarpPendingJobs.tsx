import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react";

import { useWarpGetJobs } from "@/hooks/useWarpGetJobs";
import { Job } from "@/utils/warpHelpers";
import { WarpJobLink } from "@/components/warp/WarpJobLink";
import { WarpJobDetail } from "@/components/warp/WarpJobDetail";
import { WarpCancelJob } from "@/components/warp/WarpCancelJob";
import { LABEL_WARP_PLAYGROUND } from "@/utils/constants";

type WarpPendingJobsProps = {
  ownerAddress?: string;
  warpControllerAddress?: string;
  warpJobLabel: string;
};

export const WarpPendingJobs = ({
  ownerAddress,
  warpControllerAddress,
  warpJobLabel,
}: WarpPendingJobsProps) => {
  const [warpPendingJobs, setWarpPendingJobs] = useState<Job[]>([]);
  const [warpPendingJobCount, setWarpPendingJobCount] = useState(0);

  const getWarpPendingJobsResult = useWarpGetJobs({
    ownerAddress,
    warpControllerAddress,
    status: "Pending",
  }).jobsResult.data;

  useEffect(() => {
    if (!getWarpPendingJobsResult) {
      return;
    }
    const jobs = getWarpPendingJobsResult.jobs.filter(
      (job) =>
        job.labels.includes(LABEL_WARP_PLAYGROUND) &&
        job.labels.includes(warpJobLabel)
    );
    setWarpPendingJobCount(jobs.length);
    setWarpPendingJobs(jobs);
  }, [getWarpPendingJobsResult]);

  const warpPendingJobItems =
    warpPendingJobs.length > 0 ? (
      warpPendingJobs.map((job) => (
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
          <Td borderBottom="none" py="6" minW="200px">
            <WarpJobDetail job={job} />
          </Td>
          <Td borderBottom="none" py="6" minW="200px" borderRightRadius="2xl">
            <WarpCancelJob
              senderAddress={ownerAddress}
              jobId={job.id}
              warpControllerAddress={warpControllerAddress}
            />
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
          No pending orders
        </Td>
      </Tr>
    );

  return (
    <>
      <Box>pending order count {warpPendingJobCount}</Box>
      {warpPendingJobCount > 50 ? (
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
              <Th borderBottom="none" bg="brand.darkBrown" color="white">
                detail
              </Th>
              <Th
                borderBottom="none"
                bg="brand.darkBrown"
                color="white"
                borderRightRadius="2xl"
              >
                action
              </Th>
            </Tr>
          </Thead>
          <Tbody>{warpPendingJobItems}</Tbody>
        </Table>
      </Box>
    </>
  );
};
