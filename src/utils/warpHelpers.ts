import BigNumber from "bignumber.js";
import {
  DAY_IN_SECONDS,
  DEFAULT_JOB_REWARD_AMOUNT,
  EVICTION_FEE,
} from "./constants";
import { constructSendTokenMsg } from "./token";

/*
  job example
  {
  "data": {
    "job": {
      "id": "64",
      "owner": "terra12t7aleqrmrgq2wtzrlxu4hf8lldrg5vk5zrgmn",
      "last_update_time": "1684727046",
      "name": "warp-world-astroport-limit-swap",
      "status": "Executed",
      "condition": {
        "expr": {
          "decimal": {
            "left": {
              "ref": "$warp.variable.swap-100-terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv-to-uluna"
            },
            "op": "gte",
            "right": {
              "simple": "500000"
            }
          }
        }
      },
      "msgs": [
        "{\"wasm\":{\"execute\":{\"contract_addr\":\"terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv\",\"msg\":\"eyJzZW5kIjp7ImNvbnRyYWN0IjoidGVycmExdWRzdWE5dzZqbGp3eHdnd3NlZ3Z0NnY2NTdyZzNheWZ2ZW11cG5lczdscmdnZDI4czB3cTdnOGF6bSIsImFtb3VudCI6IjEwMDAwMDAwMCIsIm1zZyI6ImV5SnpkMkZ3SWpwN0ltRnphMTloYzNObGRGOXBibVp2SWpwN0ltNWhkR2wyWlY5MGIydGxiaUk2ZXlKa1pXNXZiU0k2SW5Wc2RXNWhJbjE5TENKdFlYaGZjM0J5WldGa0lqb2lNQzR4SWl3aWRHOGlPaUowWlhKeVlURXlkRGRoYkdWeGNtMXlaM0V5ZDNSNmNteDRkVFJvWmpoc2JHUnlaelYyYXpWNmNtZHRiaUo5ZlE9PSJ9fQ==\",\"funds\":[]}}}"
      ],
      "vars": [
        {
          "query": {
            "kind": "amount",
            "name": "swap-100-terra167dsqkh2alurx997wmycw9ydkyu54gyswe3ygmrs4lwume3vmwks8ruqnv-to-uluna",
            "init_fn": {
              "selector": "$.return_amount",
              "query": {
                "wasm": {
                  "smart": {
                    "contract_addr": "terra1udsua9w6jljwxwgwsegvt6v657rg3ayfvemupnes7lrggd28s0wq7g8azm",
                    "msg": "eyJzaW11bGF0aW9uIjp7Im9mZmVyX2Fzc2V0Ijp7ImluZm8iOnsidG9rZW4iOnsiY29udHJhY3RfYWRkciI6InRlcnJhMTY3ZHNxa2gyYWx1cng5OTd3bXljdzl5ZGt5dTU0Z3lzd2UzeWdtcnM0bHd1bWUzdm13a3M4cnVxbnYifX0sImFtb3VudCI6IjEwMDAwMDAwMCJ9fX0="
                  }
                }
              }
            },
            "reinitialize": false,
            "value": null,
            "update_fn": null
          }
        }
      ],
      "recurring": false,
      "requeue_on_evict": false,
      "reward": "1000000"
    }
  }
}
*/
export type Job = {
  id: string;
  name: string;
  status: string;
};

// TODO: url may change after warp comes out of beta
export const constructJobUrl = (jobId: string) =>
  `https://beta.warp.money/#/jobs/${jobId}`;

type ConstructFundLimitOrderJobForFeeMsgProps = {
  senderAddress: string;
  warpFeeTokenAddress: string;
  warpAccountAddress: string;
  warpJobCreationFeePercentage: string;
  expiredAfterDays: number;
};

// send job reward, job creation fee and eviction fee to warp account
export const constructFundLimitOrderJobForFeeMsg = ({
  senderAddress,
  warpFeeTokenAddress,
  warpAccountAddress,
  warpJobCreationFeePercentage,
  expiredAfterDays,
}: ConstructFundLimitOrderJobForFeeMsgProps) => {
  let jobFee = BigNumber(DEFAULT_JOB_REWARD_AMOUNT)
    .times(BigNumber(warpJobCreationFeePercentage).plus(100).div(100))
    // if expire after 1 day, we don't need to pay eviction fee at all
    .plus(BigNumber(EVICTION_FEE).multipliedBy(expiredAfterDays - 1))
    .toString();

  return constructSendTokenMsg({
    tokenAddress: warpFeeTokenAddress,
    senderAddress: senderAddress,
    receiverAddress: warpAccountAddress,
    humanAmount: jobFee,
  });
};

type ConstructFundDcaOrderJobForFeeMsgProps = {
  senderAddress: string;
  warpFeeTokenAddress: string;
  warpAccountAddress: string;
  warpJobCreationFeePercentage: string;
  // how many times to repeat the job, e.g. 10 means the job will run 10 times
  dcaCount: number;
  // how often to repeat the job, unit is day, e.g. 1 means the job will run everyday
  dcaInterval: number;
  // when to start the job, in unix timestamp
  dcaStartTimestamp: number;
};

// send job reward, job creation fee and eviction fee to warp account
export const constructFundDcaOrderJobForFeeMsg = ({
  senderAddress,
  warpFeeTokenAddress,
  warpAccountAddress,
  warpJobCreationFeePercentage,
  dcaCount,
  dcaInterval,
  dcaStartTimestamp,
}: ConstructFundDcaOrderJobForFeeMsgProps) => {
  const howManyDaysUntilStartTime = Math.ceil(
    (dcaStartTimestamp - Date.now() / 1000) / DAY_IN_SECONDS
  );

  // we might be overpaying eviction fee, but it's fine, as long as it's not underpaid
  const jobFee = BigNumber(DEFAULT_JOB_REWARD_AMOUNT)
    // creation fee + reward for a single job
    .times(BigNumber(warpJobCreationFeePercentage).plus(100).div(100))
    // pay eviction fee between each interval
    .plus(BigNumber(EVICTION_FEE).times(dcaInterval))
    // times how many times the job will run
    .times(dcaCount)
    // pay eviction fee between now and start time
    .plus(BigNumber(EVICTION_FEE).times(howManyDaysUntilStartTime))
    .toString();

  return constructSendTokenMsg({
    tokenAddress: warpFeeTokenAddress,
    senderAddress: senderAddress,
    receiverAddress: warpAccountAddress,
    humanAmount: jobFee,
  });
};
