"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const aiBotService_1 = require("./aiBotService");
(0, node_test_1.default)('welcome message asks for patient name', () => {
    const reply = (0, aiBotService_1.generateBotReply)({
        patientName: null,
        message: 'hello',
        isReturning: false,
        lastInteractionHours: 0,
    });
    strict_1.default.match(reply, /welcome/i);
    strict_1.default.match(reply, /what is your name/i);
});
(0, node_test_1.default)('known hospital query answers with SHA and location', () => {
    const reply = (0, aiBotService_1.generateBotReply)({
        patientName: 'Mary',
        message: 'do you accept SHA?',
        isReturning: false,
        lastInteractionHours: 0,
    });
    strict_1.default.match(reply, /Yes, Mary/i);
    strict_1.default.match(reply, /SHA/i);
    strict_1.default.match(reply, /located/i);
});
(0, node_test_1.default)('unknown content asks to speak to a doctor', () => {
    const reply = (0, aiBotService_1.generateBotReply)({
        patientName: 'Mary',
        message: 'what is the weather in Nairobi?',
        isReturning: false,
        lastInteractionHours: 0,
    });
    strict_1.default.match(reply, /doctor/i);
});
(0, node_test_1.default)('stale conversation triggers follow-up welcome', () => {
    const stale = (0, aiBotService_1.isConversationStale)(7);
    strict_1.default.equal(stale, true);
    const reply = (0, aiBotService_1.generateBotReply)({
        patientName: 'Mary',
        message: 'hi again',
        isReturning: true,
        lastInteractionHours: 7,
    });
    strict_1.default.match(reply, /welcome back|continue/i);
});
(0, node_test_1.default)('extracts patient name from message', () => {
    const name = (0, aiBotService_1.extractPatientName)('my name is John Kamau');
    strict_1.default.equal(name, 'John Kamau');
});
(0, node_test_1.default)('does not treat a command as a patient name', () => {
    strict_1.default.equal((0, aiBotService_1.extractPatientName)('Assign me'), null);
    strict_1.default.equal((0, aiBotService_1.isUsablePatientName)('Assign'), false);
    strict_1.default.equal((0, aiBotService_1.isUsablePatientName)('Patient'), false);
});
(0, node_test_1.default)('guides patients who request a human', () => {
    strict_1.default.equal((0, aiBotService_1.isHumanSupportRequest)('Can I talk to a human?'), true);
    strict_1.default.equal((0, aiBotService_1.isHumanSupportRequest)('I need an agent'), true);
    strict_1.default.equal((0, aiBotService_1.isHumanSupportRequest)('Please connect me to a doctor'), true);
    strict_1.default.equal((0, aiBotService_1.isHumanSupportRequest)('I need staff help'), true);
    strict_1.default.match((0, aiBotService_1.generateBotReply)({
        patientName: 'Mary',
        message: 'Can I talk to a human?',
        isReturning: false,
        lastInteractionHours: 0,
    }), /staff|introduce/i);
});
(0, node_test_1.default)('named greetings provide Kenya time and next actions', () => {
    const reply = (0, aiBotService_1.generateBotReply)({
        patientName: 'Mary',
        message: 'Hi',
        isReturning: false,
        lastInteractionHours: 0,
    });
    strict_1.default.match(reply, /Mary/i);
    strict_1.default.match(reply, /appointment|service|staff/i);
});
(0, node_test_1.default)('starts every conversation by asking for the patient name', () => {
    const reply = (0, aiBotService_1.generateBotReply)({
        patientName: null,
        message: 'book appointment tomorrow at 9am in maternity',
        isReturning: false,
        lastInteractionHours: 0,
    });
    strict_1.default.match(reply, /what is your name/i);
    strict_1.default.doesNotMatch(reply, /tomorrow at 9am/i);
});
(0, node_test_1.default)('understands affirmative replies like okay and thanks in appointment flow', () => {
    const step1 = (0, aiBotService_1.generateBotReply)({
        patientId: 'affirm-1',
        patientName: null,
        message: 'my name is Mary',
    });
    strict_1.default.match(step1, /How can I help you today|welcome/i);
    const step2 = (0, aiBotService_1.generateBotReply)({
        patientId: 'affirm-1',
        patientName: null,
        message: 'book appointment today at 9am in maternity',
    });
    strict_1.default.match(step2, /appointment request|correct|confirm/i);
    const step3 = (0, aiBotService_1.generateBotReply)({
        patientId: 'affirm-1',
        patientName: null,
        message: 'thanks',
    });
    strict_1.default.match(step3, /Appointment Confirmed|booking reference/i);
});
(0, node_test_1.default)('answers common price and rebooking questions naturally', () => {
    const priceReply = (0, aiBotService_1.generateBotReply)({
        patientName: 'Mary',
        message: 'what is the consultation fee for obstetrics and gynecology?',
        isReturning: false,
        lastInteractionHours: 0,
    });
    strict_1.default.match(priceReply, /KSh 1,000/i);
    const rescheduleReply = (0, aiBotService_1.generateBotReply)({
        patientName: 'Mary',
        message: 'can i do it tomorrow at 9am in maternity?',
        isReturning: false,
        lastInteractionHours: 0,
    });
    strict_1.default.match(rescheduleReply, /appointment request|correct|confirm|what time/i);
    const cancelReply = (0, aiBotService_1.generateBotReply)({
        patientName: 'Mary',
        message: 'I want to cancel my appointment',
        isReturning: false,
        lastInteractionHours: 0,
    });
    strict_1.default.match(cancelReply, /cancel|cleared|No problem/i);
});
(0, node_test_1.default)('handles appointment history and reschedule keywords with patient-friendly wording', () => {
    const historyReply = (0, aiBotService_1.generateBotReply)({
        patientName: 'Mary',
        message: 'show my appointment history',
        isReturning: false,
        lastInteractionHours: 0,
    });
    strict_1.default.match(historyReply, /history|appointment/i);
    const rescheduleReply = (0, aiBotService_1.generateBotReply)({
        patientName: 'Mary',
        message: 'reschedule my appointment to tomorrow at 3pm',
        isReturning: false,
        lastInteractionHours: 0,
    });
    strict_1.default.match(rescheduleReply, /reschedule|appointment|tomorrow|3pm|available/i);
});
(0, node_test_1.default)('handles real-world patient phrases like confirmation, doctor availability, and late arrival', () => {
    const confirmReply = (0, aiBotService_1.generateBotReply)({
        patientName: 'Mary',
        message: 'can you confirm my appointment?',
        isReturning: false,
        lastInteractionHours: 0,
    });
    strict_1.default.match(confirmReply, /appointment|confirm|reference|date|time/i);
    const availabilityReply = (0, aiBotService_1.generateBotReply)({
        patientName: 'Mary',
        message: 'is there a doctor available now?',
        isReturning: false,
        lastInteractionHours: 0,
    });
    strict_1.default.match(availabilityReply, /doctor|available|appointment|book|call/i);
    const lateReply = (0, aiBotService_1.generateBotReply)({
        patientName: 'Mary',
        message: 'i am running late',
        isReturning: false,
        lastInteractionHours: 0,
    });
    strict_1.default.match(lateReply, /late|appointment|contact|staff|call/i);
});
(0, node_test_1.default)('formats Kenya greeting periods', () => {
    strict_1.default.equal((0, aiBotService_1.getKenyaGreeting)(new Date('2026-09-15T08:00:00.000Z')), 'Good morning');
    strict_1.default.equal((0, aiBotService_1.getKenyaGreeting)(new Date('2026-09-15T12:00:00.000Z')), 'Good afternoon');
    strict_1.default.equal((0, aiBotService_1.getKenyaGreeting)(new Date('2026-09-15T15:00:00.000Z')), 'Good evening');
});
(0, node_test_1.default)('conversation memory expires after three minutes', () => {
    strict_1.default.equal((0, aiBotService_1.isConversationStale)((aiBotService_1.CONVERSATION_MEMORY_MINUTES - 1) / 60), false);
    strict_1.default.equal((0, aiBotService_1.isConversationStale)(aiBotService_1.CONVERSATION_MEMORY_MINUTES / 60), true);
});
(0, node_test_1.default)('parses booking details from patient request', () => {
    const booking = (0, aiBotService_1.parseAppointmentRequest)('I want to book a visit tomorrow at 9am in maternity');
    strict_1.default.equal(booking.ready, true);
    strict_1.default.equal(booking.department, 'Maternity');
    strict_1.default.equal(booking.time, '09:00 AM');
});
(0, node_test_1.default)('parses interactive menu time values like 09 00 am', () => {
    const booking = (0, aiBotService_1.parseAppointmentRequest)('tomorrow 09 00 am in maternity');
    strict_1.default.equal(booking.department, 'Maternity');
    strict_1.default.equal(booking.time, '09:00 AM');
    strict_1.default.equal(booking.ready, true);
});
(0, node_test_1.default)('does not confuse appointments with ENT', () => {
    const booking = (0, aiBotService_1.parseAppointmentRequest)('I need appointments');
    strict_1.default.equal(booking.department, undefined);
    strict_1.default.equal(booking.ready, false);
});
(0, node_test_1.default)('recognizes common gynecology typos and returns the exact consultation fee', () => {
    const booking = (0, aiBotService_1.parseAppointmentRequest)('Obstetrics and Gynecolog appointment today at 11:00 AM');
    strict_1.default.equal(booking.department, 'Obstetrics and Gynecology');
    strict_1.default.equal(booking.time, '11:00 AM');
    strict_1.default.equal((0, aiBotService_1.getServicePrice)(booking.department), 'KSh 1,000');
});
(0, node_test_1.default)('asks for missing booking details', () => {
    const prompt = (0, aiBotService_1.generateAppointmentCollectionPrompt)('Mary', {
        date: 'tomorrow',
        time: '09:00 AM'
    });
    strict_1.default.match(prompt, /department/i);
    strict_1.default.match(prompt, /date|time/i);
});
(0, node_test_1.default)('keeps consultation pricing wording exact and human-friendly', () => {
    const prompt = (0, aiBotService_1.generateAppointmentCollectionPrompt)('Mary', {
        department: 'Obstetrics and Gynecology',
        date: 'today',
    });
    strict_1.default.match(prompt, /KSh 1,000/i);
    strict_1.default.doesNotMatch(prompt, /KSh 1,000 \+ KSh 1,000 consultation/i);
    strict_1.default.match(prompt, /what time/i);
});
