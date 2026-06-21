const EVENT_TITLE = 'Avinash & Ananya - Engagement Ceremony';
const EVENT_LOCATION = 'Grandion Event Venue, 1810 Parkwood Blvd, Frisco, TX 75034';
const EVENT_DETAILS = [
  'Join us to celebrate the engagement of Avinash and Ananya!',
  '',
  'Breakfast & Lunch will be served.',
  'Attire: Indian Traditional',
].join('\n');

export function getGoogleCalendarUrl() {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: EVENT_TITLE,
    dates: '20260705T080000/20260705T140000',
    details: EVENT_DETAILS,
    location: EVENT_LOCATION,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadCalendarInvite() {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Avinash & Ananya Engagement//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'DTSTART:20260705T080000',
    'DTEND:20260705T140000',
    `SUMMARY:${EVENT_TITLE}`,
    `DESCRIPTION:${EVENT_DETAILS.replace(/\n/g, '\\n')}`,
    `LOCATION:${EVENT_LOCATION.replace(/,/g, '\\,')}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Avinash & Ananya Engagement - Tomorrow!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'avinash-ananya-engagement.ics';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
