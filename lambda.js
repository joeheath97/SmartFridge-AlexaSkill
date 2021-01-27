/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome, i can find recipes, add or remove items in your fridge and tell you when items are expiring, How can i help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// REMOTE DATA 
const ListOfOpenFoodIntentHandler = {
  canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListOfOpenFoodIntent';
  },
  async handle(handlerInput) {
    let outputSpeech = 'This is the default message.';

    //https://github.com/joeheath97/foodjson/blob/main/db.json
    await getRemoteData('http://my-json-server.typicode.com/joeheath97/foodjson/ListOfOpenFood')
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `Ok, here is a list of all the food which are open in the fridge: ${data.Food}`;
      })
      .catch((err) => {
        console.log(`ERROR: ${err.message}`);
        // set an optional error message here
        // outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();
  },
};

// GET RECIPE 
const GetRecipeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetRecipeIntent';
    },
    handle(handlerInput) {
        const FoodType = Alexa.getSlotValue(handlerInput.requestEnvelope, 'FoodType')
        const speakOutput = `Ok, a recipe for ${FoodType} has been sent to your mobile.`;
        
        const attributesManager = handlerInput.attributesManager;
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.FoodType = FoodType;
        attributesManager.setSessionAttributes(attributes);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("Can i help you with anything else?")
            .getResponse();
    }
};

// GET LAST RECIPE : SESSOION ATTRIBUTE
const GetLastRecipeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetLastRecipeIntent';
    },
    handle(handlerInput) {
        const FoodType = Alexa.getSlotValue(handlerInput.requestEnvelope, 'FoodType')
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
        const lastRecipe = sessionAttributes.FoodType;
        var speakOutput = "";
        if(typeof lastRecipe !== 'undefined')
        {
            speakOutput = `The last recipe was for ${lastRecipe}`;
        }
        else
        {
            speakOutput = `There is no previous recipes`;
        }
        

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("Can i help you with anything else?")
            .getResponse();
    }
};

// OPEN FOOD 
const OpenFoodIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OpenFoodIntent';
    },
    handle(handlerInput) {
        const FoodType = Alexa.getSlotValue(handlerInput.requestEnvelope, 'FoodType')
        const speakOutput = `I will mark ${FoodType} as opened`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("Can i help you with anything else?")
            .getResponse();
    }
};

// REMOVE FOOD 
const RemoveFoodIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RemoveFoodIntent';
    },
    handle(handlerInput) {
        const FoodType = Alexa.getSlotValue(handlerInput.requestEnvelope, 'FoodType')
        const quantity = Alexa.getSlotValue(handlerInput.requestEnvelope, 'Number')
        
        const speakOutput = `I will remove ${quantity} ${FoodType} from fridge storage`;

        const attributesManager = handlerInput.attributesManager;
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.FoodType = FoodType;
        attributesManager.setSessionAttributes(attributes);
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("Can i help you with anything else?")
            .getResponse();
    }
};

// PUT FOOD BACK : SESSION ATTRIBUTE
const PutFoodBackIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PutFoodBackIntent';
    },
    handle(handlerInput) {
        const FoodType = Alexa.getSlotValue(handlerInput.requestEnvelope, 'FoodType')
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
        const lastRemovedFood = sessionAttributes.FoodType;
        var speakOutput = "";
        
        if(typeof lastRemovedFood !== 'undefined')
        {
            speakOutput = `Adding ${lastRemovedFood} back to fridge`;
        }
        else
        {
            speakOutput = `No previous food has been removed`;
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("Can i help you with anything else?")
            .getResponse();
    }
};

// FOOD EXPIRY DATE
const ExpireFoodIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ExpireFoodIntent';
    },
    handle(handlerInput) {
        const FoodType = Alexa.getSlotValue(handlerInput.requestEnvelope, 'FoodType');
        const date = Alexa.getSlotValue(handlerInput.requestEnvelope, 'Date')
        const speakOutput = `I will mark ${FoodType} with expiry date of ${date}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("Can i help you with anything else?")
            .getResponse();
    }
};

// ADD FOOD 
const AddFoodIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AddFoodIntent';
    },
    handle(handlerInput) {
        const FoodType = Alexa.getSlotValue(handlerInput.requestEnvelope, 'FoodType')
        const speakOutput = `I will add ${FoodType} to fridge storage`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("Can i help you with anything else?")
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// GET REMOTE DATE FUNCTION
const getRemoteData = (url) => new Promise((resolve, reject) => {
  const client = url.startsWith('https') ? require('https') : require('http');
  const request = client.get(url, (response) => {
    if (response.statusCode < 200 || response.statusCode > 299) {
      reject(new Error(`Failed with status code: ${response.statusCode}`));
    }
    const body = [];
    response.on('data', (chunk) => body.push(chunk));
    response.on('end', () => resolve(body.join('')));
  });
  request.on('error', (err) => reject(err));
});


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ListOfOpenFoodIntentHandler,
        GetRecipeIntentHandler,
        GetLastRecipeIntentHandler,
        OpenFoodIntentHandler,
        RemoveFoodIntentHandler,
        PutFoodBackIntent,
        ExpireFoodIntentHandler,
        AddFoodIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();