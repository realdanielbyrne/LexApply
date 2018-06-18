'use strict';

 /**
  * This sample demonstrates an implementation of the Lex Code Hook Interface

  */

 // --------------- Helpers that build all of the responses -----------------------

function elicitSlot(sessionAttributes, intentName, slots, slotToElicit, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message,
        },
    };
}

function confirmIntent(sessionAttributes, intentName, slots, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ConfirmIntent',
            intentName,
            slots,
            message,
        },
    };
}

function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

function delegate(sessionAttributes, slots) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Delegate',
            slots,
        },
    };
}

// ---------------- Helper Functions --------------------------------------------------



function buildValidationResult(isValid, violatedSlot, messageContent) {
    return {
        isValid,
        violatedSlot,
        message: { contentType: 'PlainText', content: messageContent },
    };
}
function isValidFullName(fullName){
    return true;
}
function isValidPhone(fullName){
    return fullName.Test("^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$");
}
function isValidJobPosting(posting){
    return true;
}
function isValidDate(date) {
    return !(isNaN(Date.parse(date)));
}
function isValidYesNo(resp){
    const responses = ['yes','no'];
    return (responses.indexOf(resp.toLowerCase()> 1));
}

function isValidSkill() {
    // in real app verify against a database of keywords
    return true;
}

function isValidIsEligible(elgibility){
    const responses=["eligible", "yes", "no", "not eligible", "I am eligible", "I am eligible to work"] 
    return (responses.indexOf(elgibility.toLowerCase()> 1));
}

function validateApplication(slots){

    const fullName = slots.FullName;
    const phone = slots.Phone;
    const jobPosting = slots.JobPosting;
    const availableForWork = slots.AvailableForWork;
    const provideProgrammingSkills = slots.ProvideProgrammingSkills;
    const programmingSkill = slots.ProgrammingSkill;
    const programmingSkillTwo = slots.ProgrammingSkillTwo;
    const provideManagementSkills = slots.ProvideManagementSkills;
    const managementSkill = slots.ManagementSkill;
    const managementSkillTwo = slots.ManagementSkillTwo;
    const isEligible = slots.IsEligible;

    if (fullName && !isValidFullName()){
        return buildValidationResult(false, 'FullName', 'Sorry I did not understand that name');
    }
    if (phone && !isValidPhone()){
        return buildValidationResult(false, 'Phone', 'I did not understand the phone nmber you entered.  Would you please enter a valid 10 digit phone number?');
    }
    if (jobPosting && !isValidJobPosting()){
        return buildValidationResult(false, 'JobPosting', 'Sorry, I did not see that job posting. Which of teh open positions would you like to apply for?');
    }
    if (availableForWork){
        if (!isValidDate(availableForWork)) {
            return buildValidationResult(false, 'AvailableForWork', 'Sorry, I did not understand your availability date.  When would you be available to begin working in a new position?');
        }
        if (new Date(availableForWork) < new Date()) {
            return buildValidationResult(false, 'AvailableForWork', 'Your availability date is in the past!  Can you try a different date?');
        }
    }
    if (provideProgrammingSkills && ! isValidYesNo(provideProgrammingSkills)){
        return buildValidationResult(false, 'ProvideProgrammingSkills', 'Sorry I did not understand that. Can you provide me a relevant skill you posses?');        
    }

    if (provideProgrammingSkills == "yes" ){
        if (programmingSkill && !isValidSkill(programmingSkill)){
            return buildValidationResult(false, 'ProgrammingSkill', 'Sorry I did not understand that. Can you provide me a relevant skill you posses?');        
        }
        if (programmingSkillTwo && !isValidSkill(programmingSkillTwo)){
            return buildValidationResult(false, 'ProgrammingSkillTwo', 'Sorry I did not understand that. Can you provide me a relevant skill you posses?');        
        }
    }

    if (provideManagementSkills && ! isValidYesNo(provideManagementSkills)){
        return buildValidationResult(false, 'provideManagementSkills', 'Sorry I did not understand that. Can you provide me a relevant skill you posses?');        
    }

    if (provideManagementSkills == "yes" ){
        if (managementSkill && !isValidSkill(managementSkill)){
            return buildValidationResult(false, 'ManagementSkill', 'Sorry I did not understand that. Can you provide me a relevant skill you posses?');        
        }
        if (managementSkillTwo && !isValidSkill(managementSkillTwo)){
            return buildValidationResult(false, 'ManagementSkillTwo', 'Sorry I did not understand that. Can you provide me a relevant skill you posses?');        
        }
    }
    if (isEligible && !isValidIsEligible()){
        return buildValidationResult(false, 'IsEligible', "Sorry I didn't recognize that response.  Are you eligible to ork in the US, yes or no?");        
    }  
}
/**
 * Performs dialog management and fulfillment for job applicants.
 */
function applyForJob(intentRequest, callback) {
    const slots = intentRequest.currentIntent.slots;

    const fullName = slots.FullName;
    const phone = slots.Phone;
    const jobPosting = slots.JobPosting;
    const availableForWork = slots.AvailableForWork;
    const provideProgrammingSkills = slots.ProvideProgrammingSkills;

    const programmingSkills = slots.ProgrammingSkills;
    const programmingSkillsTwo = slots.ProgrammingSkillsTwo;
    const provideManagementSkills = slots.ProvideManagementSkills;

    const managementSkills = slots.ManagementSkills;
    const managementSkillsTwo = slots.ManagementSkillsTwo;
    const isEligible = slots.IsEligible;

    const confirmationStatus = intentRequest.currentIntent.confirmationStatus;
    const sessionAttributes = intentRequest.sessionAttributes;

    const lastConfirmedApplication = sessionAttributes.lastConfirmedApplication ? JSON.parse(sessionAttributes.lastConfirmedApplication) : null;
    const confirmationContext = sessionAttributes.confirmationContext;

    // Load confirmation history and track the current reservation.
    const application = String(JSON.stringify({ 
        FullName: fullName, 
        Phone: phone, 
        JobPosting: jobPosting, 
        AvailableForWork: availableForWork,
        ProvideProgrammingSkills:provideProgrammingSkills,
        ProgrammingSkills:programmingSkills,
        ProgrammingSkillsTwo:programmingSkillsTwo,
        ProvideManagementSkills:provideManagementSkills,
        ManagementSkills:managementSkills,
        ManagementSkillsTwo:managementSkillsTwo,
        IsEligible:isEligible
     }));
    sessionAttributes.currentApplication = application;

    if (intentRequest.invocationSource === 'DialogCodeHook') {
        // Validate any slots which have been specified.  If any are invalid, re-elicit for their value
        const validationResult = validateApplication(slots);
        if (!validationResult.isValid) {
            slots[`${validationResult.violatedSlot}`] = null;
            callback(elicitSlot(sessionAttributes, intentRequest.currentIntent.name,
            slots, validationResult.violatedSlot, validationResult.message));
            return;
        }

        // Determine if the intent (and current slot settings) has been denied.  The messaging will be different if the user is denying a reservation he initiated or an auto-populated suggestion.
        if (confirmationStatus === 'Denied') {
            // Clear out auto-population flag for subsequent turns.
            delete sessionAttributes.confirmationContext;
            delete sessionAttributes.currentApplication; 
            const clearedSlots = String(JSON.stringify({ 
                FullName: null, 
                Phone: null, 
                JobPosting: null, 
                AvailableForWork: null,
                ProvideProgrammingSkills:null,
                ProgrammingSkills:null,
                ProgrammingSkillsTwo:null,
                ProvideManagementSkills:null,
                ManagementSkills:null,
                ManagementSkillsTwo:null,
                IsEligible:null
             }));
             if (confirmationContext === 'AutoPopulate') {
                callback(elicitSlot(sessionAttributes, intentRequest.currentIntent.name, 
                    clearedSlots, 
                    'FullName',
                { contentType: 'PlainText', content: 'Can I have your name please?' }));
                return;
            }
            callback(delegate(sessionAttributes, intentRequest.currentIntent.slots));
            return;
        }

        if (confirmationStatus === 'None') {
            // If we are currently auto-populating but have not gotten confirmation, keep requesting for confirmation.
            if ((!fullName && !phone) || confirmationContext === 'AutoPopulate') {
                if (lastConfirmedApplication) {
                    sessionAttributes.confirmationContext = 'AutoPopulate';
                    callback(confirmIntent(sessionAttributes, intentRequest.currentIntent.name,
                        {
                            FullName: lastConfirmedApplication.FullName, 
                            Phone: lastConfirmedApplication.Phone, 
                            JobPosting: null, 
                            AvailableForWork: null,
                            ProvideProgrammingSkills:null,
                            ProgrammingSkills:null,
                            ProgrammingSkillsTwo:null,
                            ProvideManagementSkills:null,
                            ManagementSkills:null,
                            ManagementSkillsTwo:null,
                            IsEligible:null
                        },
                        { contentType: 'PlainText', content: `Is this information still correct, FullName:" ${lastConfirmedApplication.FullName} and Phone: ${lastConfirmedApplication.Phone}` }));
                    return;
                }
            }
            // Otherwise, let native DM rules determine how to elicit for slots and/or drive confirmation.
            callback(delegate(sessionAttributes, intentRequest.currentIntent.slots));
            return;
        }

        // If confirmation has occurred, continue filling any unfilled slot values or pass to fulfillment.
        if (confirmationStatus === 'Confirmed') {
            // Remove confirmationContext from sessionAttributes so it does not confuse future requests
            delete sessionAttributes.confirmationContext;
            if (confirmationContext === 'AutoPopulate') {
                if (!phone) {
                    callback(elicitSlot(sessionAttributes, intentRequest.currentIntent.name, intentRequest.currentIntent.slots, 'Phone',
                    { contentType: 'PlainText', content: 'What is your phone number?' }));
                    return;
                }
            }
            callback(delegate(sessionAttributes, intentRequest.currentIntent.slots));
            return;
        }
    }

    // In a real application, this would likely involve a call to a backend service.
    delete sessionAttributes.currentApplication;
    sessionAttributes.lastConfirmedApplication = application;
    callback(close(sessionAttributes, 'Fulfilled',
    { contentType: 'PlainText', content: 'Thanks, I have submitted your application. If you would like to check on the status of your application ask, "Check status."' }));
}

 // --------------- Intents -----------------------

/**
 * Called when the user specifies an intent for this skill.
 */
function dispatch(intentRequest, callback) {
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);

    const intentName = intentRequest.currentIntent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'ApplyForJob') {
        return applyForJob(intentRequest, callback);
    }
    else if (intentName ==='CheckStatus') {
        return checkStatus(intentRequest, callback);
    }
    throw new Error(`Intent with name ${intentName} not supported`);
}

// --------------- Main handler -----------------------
// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.bot.name=${event.bot.name}`);

        /**
         * Your Lex bot name, alias and / or version as a sanity check 
         * to prevent invoking this Lambda function from an undesired source.
         */
        
        if (event.bot.name != 'CandidateQualifier') {
             callback('Invalid Bot Name');
        }
        
        dispatch(event, (response) => callback(null, response));
    } catch (err) {
        callback(err);
    }
};