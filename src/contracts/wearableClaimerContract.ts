
import { ContractFactory, RequestManager } from 'eth-connect';
import * as EthereumController from "@decentraland/EthereumController";
import { getProvider } from "@decentraland/web3-provider";
// import {
//     connection,
//     ConnectionResponse
//   } from 'decentraland-connect';

// import { connect } from "./connector";

import abi from "../abis/wearableClaimer"
import { DclUser } from "../../shared-dcl/src/playfab/dcluser";

export class WearableClaimerContract 
{
    public address:string;
    public requestMgr:RequestManager;
    public callback:(funcName:string, returnVal:any) => void;

    public contract:any;
    public isLoaded:boolean = false;

    constructor(contractAddress:string, callback:(funcName:string, returnVal:any) => void = null)
    {
        this.address = contractAddress;
        this.callback = callback;
    }

    // testConnection()
    // {
    //     executeTask(async () => {

    //         // create an instance of the web3 provider to interface with Metamask
    //         const conn = await connect()
    //         log("CONNECTED");
    //     });
    // }

    loadContract()
    {
        executeTask(async () => {
            // create an instance of the web3 provider to interface with Metamask
            const provider = await getProvider()
            // Create the object that will handle the sending and receiving of RPC messages
            this.requestMgr = new RequestManager(provider)
            // Create a factory object based on the abi
            const factory = new ContractFactory(this.requestMgr, abi)
            // Use the factory object to instance a `contract` object, referencing a specific contract
            this.contract = (await factory.at(this.address)) as any;

            this.isLoaded = true;
            if (this.callback != null)
            {
                this.callback("loadContract", this.contract.address);
            }

            log("WearableClaimerContract provider=", provider);
            log("WearableClaimerContract contract=", this.contract);
        })
    } 

    getItemSupply(collIndex:number, wearableName:string):number
    {
        if (this.contract == null && !this.isLoaded) return;

        executeTask(async () => {
            const res = await this.contract.remainingSupply(collIndex, wearableName);
            if (this.callback != null)
            {
                this.callback("getItemSupply", parseInt(res));
            }
        })
    }

    canMint(collIndex:number, wearableName:string)
    {
        if (this.contract == null && !this.isLoaded) return -1;

        executeTask(async () => 
        {
            const res = await this.contract.canMint(collIndex, wearableName, 1);
            if (this.callback != null)
            {
                this.callback("canMint", res);
            }
        })
    }

    checkSender(collIndex:number, wearIndex:number, claimNum:number, sig:string)
    {
        log("checkSender()");
        if (this.contract == null && !this.isLoaded) return -1;

        executeTask(async () => {

            const res = await this.contract.checkSender(
                collIndex, 
                wearIndex,
                claimNum, 
                sig, 
                true,  
                {
                    from: DclUser.activeUser.userId
                }
            );
            log("res=" + res);
            if (this.callback != null)
            {
                this.callback("checkSender", res);
            }
        })
    }

    claim(collIndex:number, wearIndex:number, claimNum:number, signature:string)
    {
        //log("test=" + this.address);

        executeTask(async () => {
            log("calling claim()");

            try
            {
                log("sig=" + signature);
                const res = await this.contract.claim(
                    collIndex,
                    wearIndex,
                    claimNum,
                    signature,
                    {
                        from: DclUser.activeUser.userId,
                    }
                );
                if (this.callback != null)
                {
                    this.callback("minted", res);
                }
            }
            catch (error) 
            {
                log(error.toString());
                this.callback("claimError", error);
            }
        })
    }
}