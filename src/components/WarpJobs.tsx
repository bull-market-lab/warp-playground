import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { WarpClosedJobs } from "./WarpClosedJobs";
import { WarpExecutedJobs } from "./WarpExecutedJobs";
import { WarpPendingJobs } from "./WarpPendingJobs";

type WarpJobsProps = {
  warpControllerAddress: string;
};

export const WarpJobs = ({ warpControllerAddress }: WarpJobsProps) => {
  return (
    <Flex align="center" justify="center" direction="column">
      <Tabs>
        <TabList>
          <Tab>pending</Tab>
          <Tab>executed</Tab>
          <Tab>closed</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <WarpPendingJobs warpControllerAddress={warpControllerAddress} />
          </TabPanel>
          <TabPanel>
            <WarpExecutedJobs warpControllerAddress={warpControllerAddress} />
          </TabPanel>
          <TabPanel>
            <WarpClosedJobs warpControllerAddress={warpControllerAddress} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
