import { MsgExecuteContract } from "@terra-money/feather.js";
import { useMemo } from "react";
import useMyWallet from "../useMyWallet";
import {
  Job,
  extractOfferTokenAddress,
  isMarsYieldBearingOrder,
} from "@/utils/warpHelpers";
import { toBase64 } from "@/utils/encoding";

type UseWarpCancelJobProps = {
  job: Job;
};

const useWarpCancelJob = ({ job }: UseWarpCancelJobProps) => {
  const { myAddress, currentChainConfig } = useMyWallet();
  const warpControllerAddress = currentChainConfig.warp.controllerAddress;

  const msgs = useMemo(() => {
    if (!warpControllerAddress || !job || !myAddress) {
      return [];
    }
    const result = [];
    if (isMarsYieldBearingOrder(job.labels)) {
      result.push(
        new MsgExecuteContract(myAddress, job.account, {
          generic: {
            msgs: [
              {
                wasm: {
                  execute: {
                    contract_addr: currentChainConfig.mars.redBankAddress,
                    msg: toBase64({
                      withdraw: {
                        denom: extractOfferTokenAddress(job.labels),
                      },
                    }),
                    funds: [],
                  },
                },
              },
            ],
          },
        })
      );
    }
    result.push(
      new MsgExecuteContract(myAddress, warpControllerAddress, {
        delete_job: { id: job.id },
      })
    );
    return result;
  }, [myAddress, warpControllerAddress, job]);

  return useMemo(() => {
    return { msgs };
  }, [msgs]);
};

export default useWarpCancelJob;
