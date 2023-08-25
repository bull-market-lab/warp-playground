import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import WarpClosedJobs from "@/components/warp/WarpClosedJobs";
import WarpExecutedJobs from "@/components/warp/WarpExecutedJobs";
import WarpPendingJobs from "@/components/warp/WarpPendingJobs";

type WarpJobsProps = {
  myAddress?: string;
  warpControllerAddress?: string;
  warpJobLabel: string;
};

const WarpJobs = ({
  myAddress,
  warpControllerAddress,
  warpJobLabel,
}: WarpJobsProps) => {
  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      style={{ marginTop: "10px" }}
    >
      <Tabs>
        <TabList display="flex" justifyContent="space-between" width="85vw">
          <Tab flex="1" minWidth="0">
            pending
          </Tab>
          <Tab flex="1" minWidth="0">
            executed
          </Tab>
          <Tab flex="1" minWidth="0">
            closed
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <WarpPendingJobs
              ownerAddress={myAddress}
              warpControllerAddress={warpControllerAddress}
              warpJobLabel={warpJobLabel}
            />
          </TabPanel>
          <TabPanel>
            <WarpExecutedJobs
              ownerAddress={myAddress}
              warpControllerAddress={warpControllerAddress}
              warpJobLabel={warpJobLabel}
            />
          </TabPanel>
          <TabPanel>
            <WarpClosedJobs
              ownerAddress={myAddress}
              warpControllerAddress={warpControllerAddress}
              warpJobLabel={warpJobLabel}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default WarpJobs;
