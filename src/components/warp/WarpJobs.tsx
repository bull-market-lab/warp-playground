import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { WarpClosedJobs } from "@/components/warp/WarpClosedJobs";
import { WarpExecutedJobs } from "@/components/warp/WarpExecutedJobs";
import { WarpPendingJobs } from "@/components/warp/WarpPendingJobs";
import { WalletConnection } from "@delphi-labs/shuttle";

type WarpJobsProps = {
  wallet: WalletConnection;
  warpControllerAddress: string;
};

export const WarpJobs = ({ wallet, warpControllerAddress }: WarpJobsProps) => {
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
            <WarpPendingJobs
              wallet={wallet}
              warpControllerAddress={warpControllerAddress}
            />
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
