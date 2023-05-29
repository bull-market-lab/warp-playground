import BigNumber from "bignumber.js";
import { convertTokenDecimals, isNativeAsset } from "@/config/tokens";
import {
  MsgExecuteContract,
  MsgSend,
  WalletConnection,
} from "@delphi-labs/shuttle";
import { DEFAULT_JOB_REWARD_AMOUNT, EVICTION_FEE } from "./constants";

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

type ConstructFundJobForFeeMsgProps = {
  wallet: WalletConnection;
  warpAccountAddress: string;
  warpJobCreationFeePercentage: string;
  // how many days we want to keep the job alive, e.g. 1 means job expire after 24 hours
  daysLived: number;
};

// send job reward, job creation fee, potential eviction fee to warp account
export const constructFundJobForFeeMsg = ({
  wallet,
  warpAccountAddress,
  warpJobCreationFeePercentage,
  daysLived,
}: ConstructFundJobForFeeMsgProps) => {
  const jobFee = BigNumber(DEFAULT_JOB_REWARD_AMOUNT)
    .times(BigNumber(warpJobCreationFeePercentage).plus(100).div(100))
    .plus(BigNumber(EVICTION_FEE).times(daysLived - 1))
    .toString();

  return new MsgSend({
    fromAddress: wallet.account.address,
    toAddress: warpAccountAddress,
    amount: [
      {
        denom: wallet.network.defaultCurrency!.coinMinimalDenom,
        amount: convertTokenDecimals(
          jobFee,
          wallet.network.defaultCurrency!.coinMinimalDenom
        ),
      },
    ],
  });
};

type ConstructFundJobForOfferedAssetMsgProps = {
  wallet: WalletConnection;
  warpAccountAddress: string;
  offerAssetAddress: string;
  offerAmount: string;
};

export const constructFundJobForOfferedAssetMsg = ({
  wallet,
  warpAccountAddress,
  offerAssetAddress,
  offerAmount,
}: ConstructFundJobForOfferedAssetMsgProps) => {
  return isNativeAsset(offerAssetAddress)
    ? new MsgSend({
        fromAddress: wallet.account.address,
        toAddress: warpAccountAddress,
        amount: [
          {
            denom: wallet.network.defaultCurrency!.coinMinimalDenom,
            amount: convertTokenDecimals(offerAmount, offerAssetAddress),
          },
        ],
      })
    : new MsgExecuteContract({
        sender: wallet.account.address,
        contract: offerAssetAddress,
        msg: {
          transfer: {
            recipient: warpAccountAddress,
            amount: convertTokenDecimals(offerAmount, offerAssetAddress),
          },
        },
      });
};
