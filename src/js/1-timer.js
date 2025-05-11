import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputRef = document.querySelector('input#datetime-picker');
const startBtn = document.querySelector('[data-start]');

startBtn.disabled = true;

let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    console.log(selectedDates[0]);

    if (selectedDate.getTime() > Date.now()) {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    } else {
      iziToast.warning({
        title: 'Warning',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
    }
  },
};

flatpickr('#datetime-picker', options);

startBtn.addEventListener('click', startTimer);

function startTimer() {
  if (timerId) return;
  timerId = setInterval(() => {
    const now = Date.now();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(timerId);
      timerId = null;
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      inputRef.disabled = false;
      startBtn.disabled = true;
      return;
    }

    const time = convertMs(diff);
    updateTimerDisplay(time);
  }, 1000);

  inputRef.disabled = true;
  startBtn.disabled = true;
}
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent =
    addLeadingZero(seconds);
}
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
