import React from 'react';

const EventLog = ({ log }) => {
  return (
    <div>
      <h3>Dziennik Zdarzeń</h3>
      <ul>
        {log.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventLog;
