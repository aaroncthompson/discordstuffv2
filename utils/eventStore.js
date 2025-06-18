const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'eventMap.json');

function loadEvents() {
  try {
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, '{}');
      return {};
    }
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load events:', error);
    return {};
  }
}

function saveEvents(events) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Failed to save events:', error);
  }
}

function getEvent(eventId) {
  const events = loadEvents();
  return events[eventId];
}

function saveEvent(eventId, eventData) {
  const events = loadEvents();

  if (eventData === null) { // we tell the bot to stop minding an Event by writing null to its dataset
    delete events[eventId];
  } else {
    events[eventId] = eventData;
  }

  saveEvents(events);
}

function deleteEvent(eventId) { // this is probably redundant and could be folded into the above
  const events = loadEvents();
  if (events[eventId]) {
    delete events[eventId];
    saveEvents(events);
  }
}

module.exports = {
  getEvent,
  saveEvent,
  deleteEvent,
};
