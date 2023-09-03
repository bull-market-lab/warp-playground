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
  warpJobLabels: string[];
};

const WarpJobs = ({ warpJobLabels }: WarpJobsProps) => {
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
            <WarpPendingJobs warpJobLabels={warpJobLabels} />
          </TabPanel>
          <TabPanel>
            <WarpExecutedJobs warpJobLabels={warpJobLabels} />
          </TabPanel>
          <TabPanel>
            <WarpClosedJobs warpJobLabels={warpJobLabels} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default WarpJobs;
