// @ts-check

//https://shopify.dev/docs/apps/build/checkout/delivery-shipping/delivery-options/build-function#step-2-preview-the-function-on-a-development-store

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  let renameOperations = []

  for(const group of input.cart.deliveryGroups){

    for(const option of group.deliveryOptions){

      if(option.title === "B2B Shipping"){     // IF IS FREE SHIP
        if(input.cart.buyerIdentity?.purchasingCompany === null || input.cart.buyerIdentity?.purchasingCompany === undefined){          // AND User is NOT KNOWN
          renameOperations.push({                       // HIDE FREE SHIP
            hide: {
              deliveryOptionHandle: option.handle
            }          
          }) 
        }
      } else if (option.title === "1-2 Day Shipping"){  // IF IS PAID SHIP
        if(input.cart.buyerIdentity !== null && input.cart.buyerIdentity?.purchasingCompany !== null){          // AND User is KNOWN
          if(input.cart.buyerIdentity?.purchasingCompany !== undefined){ // and HAS COMPANY
            renameOperations.push({                       // HIDE PAID SHIP
              hide: {
                deliveryOptionHandle: option.handle
              }          
            })             
          }          
        }
      }
    }
  }

  //console.log(input.cart.buyerIdentity === null)
  //console.log(JSON.stringify(input.cart.buyerIdentity))
  //console.log(JSON.stringify(input.cart.buyerIdentity?.purchasingCompany))

  if(renameOperations.length === 0) return NO_CHANGES;

  return {
    operations: [
      ...renameOperations
    ]
  }

};