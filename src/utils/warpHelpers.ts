import BigNumber from "bignumber.js";
import { MsgExecuteContract } from "@terra-money/feather.js";
import { convertTokenDecimals, isNativeAsset } from "@/utils/token";
import {
  CHAIN_ID_LOCALTERRA,
  CHAIN_ID_PHOENIX_1,
  CHAIN_ID_PISCO_1,
} from "@/utils/network";

/*
  job example
  {
  "data": {
    "job": {
      "id": "64",
      "owner": "terra12t7aleqrmrgq2wtzrlxu4hf8lldrg5vk5zrgmn",
      "last_update_time": "1684727046",
      "name": "warp-world-astroport-limit-swap",
      "description": "warp-world-astroport-limit-swap",
      "labels": [],
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
  description: string;
  labels: string[];
  status: string;
};

export const WARP_CONSTANTS = {
  [CHAIN_ID_PHOENIX_1]: {
    controller:
      "terra1mg93d4g69tsf3x6sa9nkmkzc9wl38gdrygu0sewwcwj6l2a4089sdd7fgj",
    feeTokenAddress: "uluna",
  },
  [CHAIN_ID_PISCO_1]: {
    controller:
      "terra1fqcfh8vpqsl7l5yjjtq5wwu6sv989txncq5fa756tv7lywqexraq5vnjvt",
    feeTokenAddress: "uluna",
  },
  [CHAIN_ID_LOCALTERRA]: {
    controller:
      "terra156fwsk56dgldh4l6dpvm2p3mheugm408lac9au4pc8gn4gqn0kfsy44rqr",
    feeTokenAddress: "uluna",
  },
};

export const constructJobUrl = (jobId: string) =>
  `https://app.warp.money/#/jobs/${jobId}`;

type ConstructHelperMsgsProps = {
  senderAddress: string;
  warpControllerAddress: string;
  warpFeeTokenAddress: string;
  jobFee: string;
  offerAssetAddress: string;
  offerAmount: string;
};

// msg 1. increase allowance if it's sending cw20 token
// msg 2. create warp account if not exist, send job reward, job creation fee and eviction fee to warp account
export const constructHelperMsgs = ({
  senderAddress,
  warpControllerAddress,
  warpFeeTokenAddress,
  jobFee,
  offerAssetAddress,
  offerAmount,
}: ConstructHelperMsgsProps) => {
  let cwFunds: { cw20: { contract_addr: string; amount: string } }[] = [];
  let nativeFunds = {};

  if (isNativeAsset(offerAssetAddress)) {
    if (warpFeeTokenAddress === offerAssetAddress) {
      nativeFunds = {
        [offerAssetAddress]: convertTokenDecimals(
          BigNumber(jobFee).plus(offerAmount).toString(),
          offerAssetAddress
        ),
      };
    } else {
      nativeFunds = {
        [warpFeeTokenAddress]: convertTokenDecimals(
          jobFee,
          warpFeeTokenAddress
        ),
        [offerAssetAddress]: convertTokenDecimals(
          offerAmount,
          offerAssetAddress
        ),
      };
    }
  } else {
    cwFunds = [
      {
        cw20: {
          contract_addr: offerAssetAddress,
          amount: convertTokenDecimals(offerAmount, offerAssetAddress),
        },
      },
    ];
    nativeFunds = {
      [warpFeeTokenAddress]: convertTokenDecimals(jobFee, warpFeeTokenAddress),
    };
  }

  if (isNativeAsset(offerAssetAddress)) {
    return [
      new MsgExecuteContract(
        senderAddress,
        warpControllerAddress,
        {
          create_account: {
            funds: cwFunds,
          },
        },
        nativeFunds
      ),
    ];
  } else {
    return [
      new MsgExecuteContract(senderAddress, offerAssetAddress, {
        increase_allowance: {
          spender: warpControllerAddress,
          amount: convertTokenDecimals(offerAmount, offerAssetAddress),
          expires: {
            never: {},
          },
        },
      }),
      new MsgExecuteContract(
        senderAddress,
        warpControllerAddress,
        {
          create_account: {
            funds: cwFunds,
          },
        },
        nativeFunds
      ),
    ];
  }
};
