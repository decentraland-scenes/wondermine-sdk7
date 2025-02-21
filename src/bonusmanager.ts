// import { DclUser } from '../shared-dcl/src/playfab/dcluser';
import { wearablesData } from './wearablesData';

function findWearable(item:string):any
{
    let found:any;
    for (let j = 0; j < wearablesData.length; j++)
    {
        
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (item.indexOf(wearablesData[j].id) > 0)
        {
            found = wearablesData[j];
            return found;
        }
    }
    return null;
}

export default function calcWearablesBonus(wearables:string[]):number
{
    // log("calcWearBonus()", wearables);

    let wearCount = 0;
    let wearBonus = 0;

    try 
    {
        let item;
        if (wearables != null && Array.isArray(wearables) && wearables.length > 0)
        {
            for (var i = 0; i < wearables.length; i++)
            {
                item = wearables[i].toLowerCase(); 

                // can't use array.find
                const found:any= findWearable(item);
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                if (found?.bonus)
                {
                    wearCount++;
                    wearBonus += found.bonus;
                }
                else
                {
                    console.log("no bonus for wearable " + item);
                }
            }
        }
        console.log("NEW: Player wears " + wearCount + " WonderZone wearables for +" + wearBonus + "% bonus");

        // the caller should update these:
        // DclUser.activeUser.wearables = wearables;
        // DclUser.activeUser.wearablesBonus = wearBonus;
    }
    catch 
    {
        console.log("an error occurred getting avatar data")
    }
    return wearBonus;
}