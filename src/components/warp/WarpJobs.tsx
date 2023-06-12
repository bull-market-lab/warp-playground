import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { LCDClient } from "@terra-money/feather.js";

import { WarpClosedJobs } from "@/components/warp/WarpClosedJobs";
import { WarpExecutedJobs } from "@/components/warp/WarpExecutedJobs";
import { WarpPendingJobs } from "@/components/warp/WarpPendingJobs";

type WarpJobsProps = {
  lcd: LCDClient;
  chainID: string;
  myAddress?: string;
  warpControllerAddress: string;
};

export const WarpJobs = ({
  lcd,
  chainID,
  myAddress,
  warpControllerAddress,
}: WarpJobsProps) => {
  return (
    <Flex align="center" justify="center" direction="column">
      <Tabs>
        <TabList display="flex" justifyContent="space-between" width="100%">
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
              lcd={lcd}
              chainID={chainID}
              ownerAddress={myAddress}
              warpControllerAddress={warpControllerAddress}
            />
          </TabPanel>
          <TabPanel>
            <WarpExecutedJobs
              lcd={lcd}
              chainID={chainID}
              ownerAddress={myAddress}
              warpControllerAddress={warpControllerAddress}
            />
          </TabPanel>
          <TabPanel>
            <WarpClosedJobs
              lcd={lcd}
              chainID={chainID}
              ownerAddress={myAddress}
              warpControllerAddress={warpControllerAddress}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
