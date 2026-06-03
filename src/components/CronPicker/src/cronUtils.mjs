function normalizeDayAndWeek(day, week) {
  if (day === '*' && week === '*') {
    return [day, '?'];
  }

  if (day === '*' && week !== '?' && week !== '*') {
    return ['?', week];
  }

  if (week === '*' && day !== '?' && day !== '*') {
    return [day, '?'];
  }

  return [day, week];
}

function joinValues(values) {
  return Array.isArray(values) && values.length > 0 ? values.join(',') : '';
}

function fallback(value, defaultValue) {
  return value === undefined || value === null || value === '' ? defaultValue : value;
}

function setSpecificValue(result, field, value) {
  result[field].cronEvery = field === 'day' ? '5' : '3';
  result[field].specificSpecific = [value];
}

function isFixedValue(value, expected) {
  return String(value) === String(expected);
}

export function normalizeCronExpression(expression) {
  const fields = String(expression || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (fields.length === 5) {
    const [minute, hour, day, month, week] = fields;
    const [normalizedDay, normalizedWeek] = normalizeDayAndWeek(day, week);
    return ['0', minute, hour, normalizedDay, month, normalizedWeek, '*'].join(' ');
  }

  if (fields.length === 6) {
    const [second, minute, hour, day, month, week] = fields;
    const [normalizedDay, normalizedWeek] = normalizeDayAndWeek(day, week);
    return [second, minute, hour, normalizedDay, month, normalizedWeek, '*'].join(' ');
  }

  if (fields.length === 7) {
    const [second, minute, hour, day, month, week, year] = fields;
    const [normalizedDay, normalizedWeek] = normalizeDayAndWeek(day, week);
    return [second, minute, hour, normalizedDay, month, normalizedWeek, year].join(' ');
  }

  return '';
}

export function createDefaultCronResult() {
  return {
    second: {
      cronEvery: '3',
      incrementStart: 3,
      incrementIncrement: 5,
      rangeStart: 0,
      rangeEnd: 0,
      specificSpecific: [0],
    },
    minute: {
      cronEvery: '1',
      incrementStart: 3,
      incrementIncrement: 5,
      rangeStart: 0,
      rangeEnd: '0',
      specificSpecific: [0],
    },
    hour: {
      cronEvery: '1',
      incrementStart: 3,
      incrementIncrement: 5,
      rangeStart: '0',
      rangeEnd: '0',
      specificSpecific: [0],
    },
    day: {
      cronEvery: '1',
      incrementStart: 1,
      incrementIncrement: '1',
      rangeStart: 1,
      rangeEnd: 1,
      specificSpecific: [1],
      cronDaysBeforeEomMinus: 1,
      cronDaysNearestWeekday: 1,
    },
    week: {
      cronEvery: '',
      specificSpecific: [1],
      cronNthDayDay: 1,
      cronNthDayNth: 1,
      cronLastSpecificDomDay: 1,
      rangeStart: 1,
      rangeEnd: 1,
    },
    month: {
      cronEvery: '1',
      incrementStart: 3,
      incrementIncrement: 5,
      rangeStart: 1,
      rangeEnd: 1,
      specificSpecific: [1],
    },
    year: {
      cronEvery: '1',
      incrementStart: 2021,
      incrementIncrement: 1,
      rangeStart: 2021,
      rangeEnd: 2021,
      specificSpecific: [2021],
    },
    label: '',
  };
}

export function applyCronSelection(result, unit, cronEvery) {
  if (!result) {
    return;
  }

  switch (unit) {
    case 'second':
      result.second.cronEvery = cronEvery;
      break;
    case 'minute':
      setSpecificValue(result, 'second', 0);
      result.minute.cronEvery = cronEvery;
      break;
    case 'hour':
      setSpecificValue(result, 'second', 0);
      setSpecificValue(result, 'minute', 0);
      result.hour.cronEvery = cronEvery;
      break;
    case 'day':
      setSpecificValue(result, 'second', 0);
      setSpecificValue(result, 'minute', 0);
      setSpecificValue(result, 'hour', 0);
      result.day.cronEvery = cronEvery;
      break;
    case 'month':
      setSpecificValue(result, 'second', 0);
      setSpecificValue(result, 'minute', 0);
      setSpecificValue(result, 'hour', 0);
      setSpecificValue(result, 'day', 1);
      result.month.cronEvery = cronEvery;
      break;
    case 'year':
      setSpecificValue(result, 'second', 0);
      setSpecificValue(result, 'minute', 0);
      setSpecificValue(result, 'hour', 0);
      setSpecificValue(result, 'day', 1);
      setSpecificValue(result, 'month', 1);
      result.year.cronEvery = cronEvery;
      break;
  }
}

export function normalizeEverySelections(result, expression) {
  const cron = normalizeCronExpression(expression);
  const [second, minute, hour, day, month, week, year] = cron.split(' ');
  let activeUnit = '';

  if (second === '*') {
    activeUnit = 'second';
  } else if (isFixedValue(second, 0) && minute === '*') {
    activeUnit = 'minute';
  } else if (isFixedValue(second, 0) && isFixedValue(minute, 0) && hour === '*') {
    activeUnit = 'hour';
  } else if (
    isFixedValue(second, 0) &&
    isFixedValue(minute, 0) &&
    isFixedValue(hour, 0) &&
    day === '*' &&
    week === '?'
  ) {
    activeUnit = 'day';
  } else if (
    isFixedValue(second, 0) &&
    isFixedValue(minute, 0) &&
    isFixedValue(hour, 0) &&
    day !== '*' &&
    month === '*' &&
    week === '?'
  ) {
    activeUnit = 'month';
  } else if (
    isFixedValue(second, 0) &&
    isFixedValue(minute, 0) &&
    isFixedValue(hour, 0) &&
    day !== '*' &&
    month !== '*' &&
    week === '?' &&
    year === '*'
  ) {
    activeUnit = 'year';
  }

  ['second', 'minute', 'hour', 'day', 'month', 'year'].forEach((unit) => {
    if (unit !== activeUnit && result[unit]?.cronEvery === '1') {
      result[unit].cronEvery = '';
    }
  });
}

export function buildCronFields(result) {
  const second = result.second || {};
  const minute = result.minute || {};
  const hour = result.hour || {};
  const day = result.day || {};
  const week = result.week || {};
  const month = result.month || {};
  const year = result.year || {};

  let seconds = '';
  switch ((second.cronEvery || '').toString()) {
    case '1':
      seconds = '*';
      break;
    case '2':
      seconds = `${fallback(second.incrementStart, 0)}/${fallback(second.incrementIncrement, 1)}`;
      break;
    case '3':
      seconds = joinValues(second.specificSpecific);
      break;
    case '4':
      seconds = `${fallback(second.rangeStart, 0)}-${fallback(second.rangeEnd, 0)}`;
      break;
  }

  let minutes = '';
  switch ((minute.cronEvery || '').toString()) {
    case '1':
      minutes = '*';
      break;
    case '2':
      minutes = `${fallback(minute.incrementStart, 0)}/${fallback(minute.incrementIncrement, 1)}`;
      break;
    case '3':
      minutes = joinValues(minute.specificSpecific);
      break;
    case '4':
      minutes = `${fallback(minute.rangeStart, 0)}-${fallback(minute.rangeEnd, 0)}`;
      break;
  }

  let hours = '';
  switch ((hour.cronEvery || '').toString()) {
    case '1':
      hours = '*';
      break;
    case '2':
      hours = `${fallback(hour.incrementStart, 0)}/${fallback(hour.incrementIncrement, 1)}`;
      break;
    case '3':
      hours = joinValues(hour.specificSpecific);
      break;
    case '4':
      hours = `${fallback(hour.rangeStart, 0)}-${fallback(hour.rangeEnd, 0)}`;
      break;
  }

  let days = '';
  switch ((day.cronEvery || '').toString()) {
    case '1':
      days = '*';
      break;
    case '2':
    case '4':
    case '8':
    case '11':
    case '12':
      days = '?';
      break;
    case '3':
      days = `${fallback(day.incrementStart, 1)}/${fallback(day.incrementIncrement, 1)}`;
      break;
    case '5':
      days = joinValues(day.specificSpecific);
      break;
    case '6':
      days = 'L';
      break;
    case '7':
      days = 'LW';
      break;
    case '9':
      days = `L-${fallback(day.cronDaysBeforeEomMinus, 1)}`;
      break;
    case '10':
      days = `${fallback(day.cronDaysNearestWeekday, 1)}W`;
      break;
    case '13':
      days = `${fallback(day.rangeStart, 1)}-${fallback(day.rangeEnd, 1)}`;
      break;
  }

  let weeks = '';
  switch ((day.cronEvery || '').toString()) {
    case '1':
    case '3':
    case '5':
    case '6':
    case '7':
    case '9':
    case '10':
    case '13':
      weeks = '?';
      break;
    case '4':
      weeks = joinValues(week.specificSpecific);
      break;
    case '8':
      weeks = `${fallback(week.cronLastSpecificDomDay, 1)}L`;
      break;
    case '11':
      weeks = `${fallback(week.cronNthDayDay, 1)}#${fallback(week.cronNthDayNth, 1)}`;
      break;
    case '12':
      weeks = `${fallback(week.rangeStart, 1)}-${fallback(week.rangeEnd, 1)}`;
      break;
  }

  let months = '';
  switch ((month.cronEvery || '').toString()) {
    case '1':
      months = '*';
      break;
    case '2':
      months = `${fallback(month.incrementStart, 1)}/${fallback(month.incrementIncrement, 1)}`;
      break;
    case '3':
      months = joinValues(month.specificSpecific);
      break;
    case '4':
      months = `${fallback(month.rangeStart, 1)}-${fallback(month.rangeEnd, 1)}`;
      break;
  }

  let years = '';
  switch ((year.cronEvery || '').toString()) {
    case '1':
      years = '*';
      break;
    case '2':
      years = `${fallback(year.incrementStart, 2021)}/${fallback(year.incrementIncrement, 1)}`;
      break;
    case '3':
      years = joinValues(year.specificSpecific);
      break;
    case '4':
      years = `${fallback(year.rangeStart, 2021)}-${fallback(year.rangeEnd, 2021)}`;
      break;
  }

  return {
    seconds: seconds || '*',
    minutes: minutes || '*',
    hours: hours || '*',
    days: days || '*',
    months: months || '*',
    weeks: weeks || '?',
    years: years || '*',
  };
}

export function buildCronExpression(result) {
  const fields = buildCronFields(result);
  return `${fields.seconds} ${fields.minutes} ${fields.hours} ${fields.days} ${fields.months} ${fields.weeks} ${fields.years}`;
}
