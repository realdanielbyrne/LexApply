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
function isValidFirstName(firstName){
    return true;
}
function isValidPhone(phone){
    var p = String(phone);
    return p.match(/\d/g).length===10;
}
function isValidJobPosting(posting){
    const validPostings =["software development director","senior .net programmer","vice president of it"];
    return (validPostings.indexOf(posting.toLowerCase()) > -1);
}
function isValidDate(date) {
    return !(isNaN(Date.parse(date)));
}
function isValidYesNo(resp){
    const responses = ['yes','no'];
    return (responses.indexOf(resp.toLowerCase()) > -1);
}

function isValidSkill() {
    // in real app verify against a database of keywords
    return true;
}

function isValidIsEligible(elgibility){
    const responses=["eligible", "yes", "no", "not eligible", "i am eligible", "i am eligible to work"] 
    return (responses.indexOf(elgibility.toLowerCase()) > -1);
}

function validateApplication(slots){
    console.log("validateApplication");
    const firstName = slots.FirstName;
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

    if (firstName && !isValidFirstName(firstName)){
        return buildValidationResult(false, 'FirstName', 'Sorry I did not understand that name. Could you please reenter your first name?');
    }
    if (phone && !isValidPhone(phone)){
        return buildValidationResult(false, 'Phone', 'I did not understand the phone number you entered.  Would you please enter a valid 10 digit phone number?');
    }
    if (jobPosting && !isValidJobPosting(jobPosting)){
        return buildValidationResult(false, 'JobPosting', 'Sorry, I did not see that job posting. Which of the open positions would you like to apply for?');
    }
    if (availableForWork){
        if (!isValidDate(availableForWork)) {
            return buildValidationResult(false, 'AvailableForWork', 'Sorry, I did not understand your availability date.  When would you be available to begin working in a new position?');
        }
        if (new Date(availableForWork) < new Date()) {
            return buildValidationResult(false, 'AvailableForWork', 'Your availability date is in the past!  Can you try a different date?');
        }
    }
    if (provideProgrammingSkills && !isValidYesNo(provideProgrammingSkills)){
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
    if (isEligible && !isValidIsEligible(isEligible)){
        return buildValidationResult(false, 'IsEligible', "Sorry I didn't recognize that response.  Are you eligible to ork in the US, yes or no?");        
    }  
    return { isValid: true };
}

function validateStatus(slots){
    const jobPosting = slots.JobPosting;

    if (jobPosting && !isValidJobPosting(jobPosting)){
        return buildValidationResult(false, 'JobPosting', 'Sorry, I did not see that job posting. Which of the open positions would you like to apply for?');
    }
    return { isValid: true };
}

function checkSkills(jobPosting, lastConfirmedApplication){
    const netSkills = ["programming",".net","c#","mvc","webapi","bs","bachelor's degree","ms","javascript","js","python"];
    const vpSkills = ["management","budgeting","resource management","agile","scrum","mba","presentation skills","negotiations","strategic planning"];
    const programmingSkill = lastConfirmedApplication.ProgrammingSkill;
    const programmingSkillTwo = lastConfirmedApplication.ProgrammingSkillTwo;
    const managementSkill = lastConfirmedApplication.managementSkill;
    const managementSkillTwo = lastConfirmedApplication.managementSkillTwo;
    var pskill1= (netSkills.indexOf(programmingSkill.toLowerCase()) > -1);
    var pskill2= (netSkills.indexOf(programmingSkillTwo.toLowerCase()) > -1);
    var mskill1= (managementSkill.indexOf(vpSkills.toLowerCase()) > -1);
    var mskill2= (managementSkillTwo.indexOf(vpSkills.toLowerCase()) > -1);

    if (jobPosting == "Software Development Director"){
        return pskill1 && pskill2 && mskill1 && mskill2;
    }
    if (jobPosting == "Senior .Net Programmer"){
        return pskill1 && pskill2;  
    }
    if (jobPosting == "Vice President of IT"){
        return mskill1 && mskill2;
    }
    return false;
}

function checkStatus(intentRequest, callback){
    const slots = intentRequest.currentIntent.slots;
    const firstName = slots.FirstName;
    const jobPosting = slots.JobPosting;
    const lastConfirmedApplication = sessionAttributes.lastConfirmedApplication ? JSON.parse(sessionAttributes.lastConfirmedApplication) : null;
    
    if (intentRequest.invocationSource === 'DialogCodeHook') {
        const validationResult = validateStatus(slots);
        if (!validationResult.isValid) {
            slots[`${validationResult.violatedSlot}`] = null;
            callback(elicitSlot(sessionAttributes, intentRequest.currentIntent.name,
            slots, validationResult.violatedSlot, validationResult.message));
            return;
        }

        if ((!firstName && !jobPosting) || confirmationContext === 'AutoPopulate') {
            if (lastConfirmedApplication) {
                sessionAttributes.confirmationContext = 'AutoPopulate';
                callback(confirmIntent(sessionAttributes, intentRequest.currentIntent.name,
                    {
                        FirstName: lastConfirmedApplication.FirstName, 
                        JobPosting: lastConfirmedApplication.JobPosting, 
                    },
                    { contentType: 'PlainText', content: `Hello again" ${lastConfirmedApplication.FirstName}! Are you checking on the status of your ${lastConfirmedApplication.JobPosting} application?` }));
                return;
            }
        }

        // If confirmation has occurred, continue filling any unfilled slot values or pass to fulfillment.
        if (confirmationStatus === 'Confirmed') {
            // Remove confirmationContext from sessionAttributes so it does not confuse future requests
            delete sessionAttributes.confirmationContext;
            if (confirmationContext === 'AutoPopulate') {
                if (!firstName) {
                    callback(elicitSlot(sessionAttributes, intentRequest.currentIntent.name, intentRequest.currentIntent.slots, 'FirstName',
                    { contentType: 'PlainText', content: 'Please provide me with your first name so I can locate your application.' }));
                    return;
                } else if (!jobPosting) {
                    callback(elicitSlot(sessionAttributes, intentRequest.currentIntent.name, intentRequest.currentIntent.slots, 'JobPosting',
                    { contentType: 'PlainText', content: 'For what job are you checking the status of your application on?' }));
                    return;
                }
            }

            sessionAttributes.lastConfirmedApplication = lastConfirmedApplication;
            callback(delegate(sessionAttributes, intentRequest.currentIntent.slots));
            return;
        }

        sessionAttributes.lastConfirmedApplication = lastConfirmedApplication;
        callback(delegate(sessionAttributes, intentRequest.currentIntent.slots));
    }


    var status = checkSkills(jobPosting, lastConfirmedApplication);
    var response = "";
    if (status) {
        response = "Congratulations! Your skills meet the basic requirement of this job posting, and you application has been submitted to the hiring manager for further review.";
    }
    else {
        response = "Unfortunately your skills do not meet the basic requirements of this position, and you application has been rejected.";
    }

    sessionAttributes.lastConfirmedApplication = application;
    callback(close(sessionAttributes, 'Fulfilled',
    { contentType: 'PlainText', content: response }));
}

/**
 * Performs dialog management and fulfillment for job applicants.
 */
function applyForJob(intentRequest, callback) {
    console.log("applyForJob Start");
    const slots = intentRequest.currentIntent.slots;

    const firstName = slots.FirstName;
    const phone = slots.Phone;
    const jobPosting = slots.JobPosting;
    const availableForWork = slots.AvailableForWork;
    const provideProgrammingSkills = slots.ProvideProgrammingSkills;
    console.log(provideProgrammingSkills);

    const programmingSkill = slots.ProgrammingSkill;
    const programmingSkillTwo = slots.ProgrammingSkillTwo;
    const provideManagementSkills = slots.ProvideManagementSkills;

    const managementSkill = slots.ManagementSkill;
    const managementSkillTwo = slots.ManagementSkillTwo;
    const isEligible = slots.IsEligible;

    const confirmationStatus = intentRequest.currentIntent.confirmationStatus;
    const sessionAttributes = intentRequest.sessionAttributes;

    const lastConfirmedApplication = sessionAttributes.lastConfirmedApplication ? JSON.parse(sessionAttributes.lastConfirmedApplication) : null;
    const confirmationContext = sessionAttributes.confirmationContext;

    // Load confirmation history and track the current application.
    const application = String(JSON.stringify({ 
        FirstName: firstName, 
        Phone: phone, 
        JobPosting: jobPosting, 
        AvailableForWork: availableForWork,
        ProvideProgrammingSkills:provideProgrammingSkills,
        ProgrammingSkill:programmingSkill,
        ProgrammingSkillTwo:programmingSkillTwo,
        ProvideManagementSkills:provideManagementSkills,
        ManagementSkill:managementSkill,
        ManagementSkillTwo:managementSkillTwo,
        IsEligible:isEligible
     }));
    sessionAttributes.currentApplication = application;

    if (intentRequest.invocationSource === 'DialogCodeHook') {
     

        // Validate any slots which have been specified.  If any are invalid, re-elicit for their value
        const validationResult = validateApplication(intentRequest.currentIntent.slots);
        if (!validationResult.isValid) {
            console.log(`validation error=${validationResult.violatedSlot}`);
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
                FirstName: null, 
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
                    'FirstName',
                { contentType: 'PlainText', content: 'Can I have your name please?' }));
                return;
            }
            callback(delegate(sessionAttributes, intentRequest.currentIntent.slots));
            return;
        }

        if (confirmationStatus === 'None') {
            
            // If we are currently auto-populating but have not gotten confirmation, keep requesting for confirmation.
            if ((!firstName && !phone) || confirmationContext === 'AutoPopulate') {
                if (lastConfirmedApplication) {
                    sessionAttributes.confirmationContext = 'AutoPopulate';
                    callback(confirmIntent(sessionAttributes, intentRequest.currentIntent.name,
                        {
                            FirstName: lastConfirmedApplication.FirstName, 
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
                        { contentType: 'PlainText', content: `Is this information still correct, First Name ${lastConfirmedApplication.FirstName} and Phone: ${lastConfirmedApplication.Phone}` }));
                    return;
                }
                if (jobPosting && !firstName){
                    sessionAttributes.confirmationContext = 'AutoPopulate';
                    confirmIntent(sessionAttributes, intentRequest.currentIntent.name,
                        {
                            FirstName: null, 
                            Phone: null, 
                            JobPosting: jobPosting, 
                            AvailableForWork: null,
                            ProvideProgrammingSkills:null,
                            ProgrammingSkills:null,
                            ProgrammingSkillsTwo:null,
                            ProvideManagementSkills:null,
                            ManagementSkills:null,
                            ManagementSkillsTwo:null,
                            IsEligible:null
                        },
                        { contentType: 'PlainText', content: `You would like to apply for the ${jobPosting} position, correct?` });
                    return;
                }
            }
            var populatedSlots = { 
                FirstName: firstName, 
                Phone: phone, 
                JobPosting: jobPosting, 
                AvailableForWork: availableForWork,
                ProvideProgrammingSkills:provideProgrammingSkills,
                ProgrammingSkill:programmingSkill,
                ProgrammingSkillTwo:programmingSkillTwo,
                ProvideManagementSkills:provideManagementSkills,
                ManagementSkill:managementSkill,
                ManagementSkillTwo:managementSkillTwo,
                IsEligible:isEligible
            };

            if (!firstName && !phone) {
                var input = intentRequest.inputTranscript.toLowerCase();
                if (input === "hello" || input === "hi") {
                    
                    callback(elicitSlot(sessionAttributes, intentRequest.currentIntent.name, populatedSlots, 
                        'FirstName',
                    { contentType: 'PlainText', content: 'Hello!  My name is Daniel.  I am here to help you with you job search, but please first tell me your first name.' }));
                    return;
                }
            }   

            if (provideProgrammingSkills && provideProgrammingSkills =="yes"){
                if(!programmingSkill){
                    callback(elicitSlot(sessionAttributes, intentRequest.currentIntent.name, populatedSlots, 
                        'ProgrammingSkill',
                    { contentType: 'PlainText', content: 'Please enter a programming skill relevant to this position.' }));
                    return;
                }
                if(!programmingSkillTwo && programmingSkill){
                    callback(elicitSlot(sessionAttributes, intentRequest.currentIntent.name, populatedSlots, 
                        'ProgrammingSkillTwo',
                    { contentType: 'PlainText', content: 'Please enter another programming skill you feel is relevant to this position.' }));
                    return;
                }
            }

            if (provideManagementSkills && provideManagementSkills == "yes"){
                if(!managementSkill){
                    callback(elicitSlot(sessionAttributes, intentRequest.currentIntent.name, populatedSlots, 
                        'ManagementSkill',
                    { contentType: 'PlainText', content: 'Please enter a management skill relevant to this position.' }));
                    return;
                }
                if(!managementSkillTwo && managementSkill){
                    callback(elicitSlot(sessionAttributes, intentRequest.currentIntent.name, populatedSlots, 
                        'ManagementSkillTwo',
                    { contentType: 'PlainText', content: 'Please enter another salient management skill.' }));
                    return;
                }
            }

            sessionAttributes.currentApplication = application;
            // Otherwise, let native DM rules determine how to elicit for slots and/or drive confirmation.
            callback(delegate(sessionAttributes, intentRequest.currentIntent.slots));
            return;
        }

        // If confirmation has occurred, continue filling any unfilled slot values or pass to fulfillment.
        if (confirmationStatus === 'Confirmed') {
            // Remove confirmationContext from sessionAttributes so it does not confuse future requests
            delete sessionAttributes.confirmationContext;

            if (firstName && jobPosting && !phone) {
                callback(elicitSlot(sessionAttributes, intentRequest.currentIntent.name, intentRequest.currentIntent.slots, 'Phone',
                { contentType: 'PlainText', content: 'Sure I can help with that.  Can you please give me you contact phone number?' }));
                return;
            }

            callback(delegate(sessionAttributes, intentRequest.currentIntent.slots));
            return;
        }

        sessionAttributes.currentApplication = application;
        callback(delegate(sessionAttributes, intentRequest.currentIntent.slots));
        return;
    }

    // In a real application, this would likely involve a call to a backend service.
    console.log(`submit application.`);
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
