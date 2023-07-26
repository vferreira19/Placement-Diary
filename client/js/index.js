function pageLoaded() {
  console.log('js ready');
  const shareButton = document.getElementById('share-btn');
  shareButton.addEventListener('click', function () {
    const readOnlyLink = window.location.origin + '/read_only.html';
    alert('Share this link with others to view your diary: \n\n' + readOnlyLink);
  });
}

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const diaryEntryElement = document.getElementById('diaryEntry');

displayCalendar(currentMonth, currentYear);

function displayCalendar(month, year) {
  const daysInMonth = getDaysInMonth(month, year);
  const calendar = document.getElementById('calendar');

  // Clear calendar
  calendar.innerHTML = '';

  // Set calendar header
  const header = document.createElement('h2');

  header.innerHTML = getMonthName(month) + ' ' + year;
  calendar.appendChild(header);

  // Create table for calendar
  const table = document.createElement('table');
  calendar.appendChild(table);

  // Create table header with weekday names
  const row = document.createElement('tr');
  table.appendChild(row);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < weekdays.length; i++) {
    const cell = document.createElement('td');
    cell.innerHTML = weekdays[i];
    row.appendChild(cell);
  }

  // Fill table with days of month
  let dayOfMonth = 1;
  for (let i = 0; i < 6; i++) {
    const rowElement = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      // eslint-disable-next-line no-redeclare
      const cell = document.createElement('td');
      cell.classList.add('day');
      if ((i === 0 && j < new Date(year, month, 1).getDay()) || dayOfMonth > daysInMonth) {
        // Display empty cell for days before first day of month or after last day of month
        cell.classList.add('disabled');
      } else {
        cell.innerHTML = dayOfMonth;
        if (dayOfMonth === new Date().getDate() && month === currentMonth && year === currentYear) {
          // Add today class to today's cell
          cell.classList.add('today');
        }
        dayOfMonth++;
      }
      rowElement.appendChild(cell);
    }
    table.appendChild(rowElement);
  }

  addEventListener('click', function (event) {
    if (event.target.classList.contains('day')) {
      const day = event.target.innerHTML;
      const month = currentMonth;
      const year = currentYear;

      // Remove selected class from previously selected day
      const selectedDay = document.querySelector('.selected');
      if (selectedDay) {
        selectedDay.classList.remove('selected');
      }

      // Add selected class to selected day
      event.target.classList.add('selected');

      // Update diary entry for selected date
      const date = new Date(year, month, day);

      displayDiaryEntry(date);
    }
  });

  // Add buttons to change month
  const nextMonth = document.createElement('button');
  nextMonth.innerHTML = '<i class="fa fa-chevron-right"></i>';
  nextMonth.classList.add('calendar-btn');
  nextMonth.id = 'nextMonth';
  nextMonth.addEventListener('click', function () {
    if (month === 11) {
      displayCalendar(0, year + 1);
    } else {
      displayCalendar(month + 1, year);
    }
  });
  header.appendChild(nextMonth);

  const prevMonth = document.createElement('button');
  prevMonth.id = 'prevMonth';
  prevMonth.innerHTML = '<i class="fa fa-chevron-left"></i>';
  prevMonth.classList.add('calendar-btn');
  prevMonth.addEventListener('click', function () {
    if (month === 0) {
      displayCalendar(11, year - 1);
    } else {
      displayCalendar(month - 1, year);
    }
  });
  header.appendChild(prevMonth);
}

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthName(month) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[month];
}

function displayDiaryEntry(date) {
  diaryEntryElement.innerHTML = '';
  const day = date.getDate();

  // Date
  const header = document.createElement('h2');
  header.id = 'diary_header';
  header.innerHTML = date.toDateString();
  diaryEntryElement.appendChild(header);

  // Input
  const inputOneValue = '';
  const inputTwoValue = '';
  const inputThreeValue = '';

  createInput('inputOne', inputOneValue, 'Work carried out');
  createInput('inputTwo', inputTwoValue, 'Skills developed');
  createInput('inputThree', inputThreeValue, 'Competency');

  // eslint-disable-next-line no-undef
  inputOne.classList.add('input');
  // eslint-disable-next-line no-undef
  inputTwo.classList.add('input');
  // eslint-disable-next-line no-undef
  inputThree.classList.add('input'); // these inputs are defined with the createInput() function.

  // Button Submit
  createButton('submitbtn', '<i class="fa fa-check"></i>', function () {
    const inputOneValue = document.getElementById('inputOne').value;
    const inputTwoValue = document.getElementById('inputTwo').value;
    const inputThreeValue = document.getElementById('inputThree').value;
    const arr = [inputOneValue, inputTwoValue, inputThreeValue];
    give(day, JSON.stringify(arr));
  });

  // Button Remove
  createButton('removebtn', '<i class="fa fa-trash"></i>', remove, day);

  // Button Clear
  createButton('clearbtn', '<i class="fa fa-times"></i>', clear);

  // eslint-disable-next-line no-undef
  submitbtn.classList.add('functions');
  // eslint-disable-next-line no-undef
  removebtn.classList.add('functions');
  // eslint-disable-next-line no-undef
  clearbtn.classList.add('functions'); // These buttons are defined with the createButton() function.

  // Get stored values and set input values
  const storedArr = JSON.parse(get(day));
  if (storedArr && storedArr.length === 3) {
    document.getElementById('inputOne').value = storedArr[0];
    document.getElementById('inputTwo').value = storedArr[1];
    document.getElementById('inputThree').value = storedArr[2];
  }
}

// Utility functions

function createButton(id, content, onclickFunc, onclickParams) {
  const btn = document.createElement('button');
  btn.id = id;
  btn.innerHTML = content;
  btn.addEventListener('click', function () {
    if (Array.isArray(onclickParams)) {
      onclickFunc(...onclickParams);
    } else {
      onclickFunc(onclickParams);
    }
  });
  diaryEntryElement.appendChild(btn);
}

function createInput(id, content, placeholder) {
  const input = document.createElement('textarea');
  input.id = id;
  input.textContent = content;
  input.placeholder = placeholder;
  diaryEntryElement.appendChild(input);
}

// eslint-disable-next-line no-unused-vars
function openNav() {
  document.getElementById('mySidenav').style.width = '250px';
}

// eslint-disable-next-line no-unused-vars
function closeNav() {
  document.getElementById('mySidenav').style.width = '0'; // These functions are used inside the HTML file
}

// Local Storage Functions

function give(key, value) {
  localStorage.setItem(key, value);
}
function get(day) {
  return localStorage.getItem(day);
}
function remove(day) {
  localStorage.removeItem(day);
}
function clear() {
  localStorage.clear();
}

pageLoaded();
