/* ==============================
   NAVBAR (Dynamic Login / Logout)
============================== */

function renderNavbar() {
    const navbar = document.getElementById("navbar");
    const user = JSON.parse(localStorage.getItem("currentUser"));
  
    if (!navbar) return;
  
    if (!user) {
      navbar.innerHTML = `<a href="login.html" class="login-btn">LOGIN</a>`;
    } else {
      let dashboardLink = "";
  
      if (user.role === "student") {
        dashboardLink = "student-dashboard.html";
      } else if (user.role === "coordinator") {
        dashboardLink = "coordinator-dashboard.html";
      } else {
        dashboardLink = "admin-dashboard.html";
      }
  
      navbar.innerHTML = `
        <span style="color:white; margin-right:20px;">Hi, ${user.name}</span>
        <a href="${dashboardLink}" class="login-btn">DASHBOARD</a>
        <a href="#" class="login-btn" id="logoutBtn">LOGOUT</a>
      `;
  
      document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        window.location.reload();
      });
    }
  }
  
  renderNavbar();
  
  
  /* ==============================
     CALENDAR SYSTEM
  ============================== */
  
  // Events database
  const events = {
    '2026-02-18': { name: 'VIBRANCE', club: 'Vibrance', type: 'festival' },
    '2026-02-19': { name: 'VIBRANCE', club: 'Vibrance', type: 'festival' },
    '2026-02-20': { name: 'VIBRANCE', club: 'Vibrance', type: 'festival' },
    '2026-02-21': { name: 'VIBRANCE', club: 'Vibrance', type: 'festival' },
    '2026-02-25': { name: 'Sports Championship', club: 'Sports Club' },
    '2026-03-05': { name: 'Art & Photography Exhibition', club: 'Art Club' },
    '2026-03-12': { name: 'Music & Talent Show', club: 'Music Club' },
  };
  
  let currentDate = new Date(2026, 1, 13);
  
  const monthYear = document.getElementById('monthYear');
  const calendarDays = document.getElementById('calendarDays');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const eventDetailsPopup = document.getElementById('eventDetailsPopup');
  const closePopupBtn = document.getElementById('closePopup');
  
  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  
  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
  
    monthYear.textContent = monthNames[month] + ' ' + year;
    calendarDays.innerHTML = '';
  
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'day empty';
      calendarDays.appendChild(emptyDay);
    }
  
    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'day';
      dayCell.textContent = day;
  
      const dateString =
        year + '-' +
        String(month + 1).padStart(2, '0') + '-' +
        String(day).padStart(2, '0');
  
      if (events[dateString]) {
        const eventType = events[dateString].type;
        dayCell.classList.add('has-event');
  
        if (eventType === 'festival') {
          dayCell.classList.add('festival-event');
          dayCell.innerHTML = `
            <span class="day-number">${day}</span>
            <span class="festival-indicator">✨ VIBRANCE</span>
          `;
        } else {
          dayCell.innerHTML = `
            <span class="day-number">${day}</span>
            <span class="event-indicator">
              ${events[dateString].club.split(' ')[0]}
            </span>
          `;
        }
  
        dayCell.style.cursor = 'pointer';
  
        dayCell.addEventListener('click', function () {
          showEventDetails(dateString);
        });
  
        dayCell.addEventListener('mouseenter', function () {
          dayCell.classList.add('glowing');
        });
  
        dayCell.addEventListener('mouseleave', function () {
          dayCell.classList.remove('glowing');
        });
      }
  
      calendarDays.appendChild(dayCell);
    }
  }
  
  function showEventDetails(dateString) {
    const event = events[dateString];
    const [year, month, day] = dateString.split('-');
  
    document.getElementById('popupEventName').textContent = event.name;
    document.getElementById('popupEventClub').textContent = '🏢 ' + event.club;
    document.getElementById('popupEventDate').textContent =
      '📅 ' + monthNames[parseInt(month) - 1] + ' ' + day + ', ' + year;
  
    eventDetailsPopup.classList.add('show');
  }
  
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', function () {
      eventDetailsPopup.classList.remove('show');
    });
  }
  
  if (eventDetailsPopup) {
    eventDetailsPopup.addEventListener('click', function (e) {
      if (e.target === eventDetailsPopup) {
        eventDetailsPopup.classList.remove('show');
      }
    });
  }
  
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', function () {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
  }
  
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', function () {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  }
  
  renderCalendar();
  
  
  /* ==============================
     EVENT REGISTRATION SYSTEM
  ============================== */
  
  
      
  
  function updateRegisterButtons() {

    const participants =
      JSON.parse(localStorage.getItem("eventParticipants")) || {};
  
    const user =
      JSON.parse(localStorage.getItem("currentUser"));
  
    if (!user) return; // important safety
  
    const buttons = document.querySelectorAll(".event-btn");
  
    buttons.forEach(button => {
  
      const eventTitle =
        button.parentElement.querySelector("h3").textContent;
  
      if (
        participants[eventTitle] &&
        participants[eventTitle].includes(user.name)
      ) {
        button.textContent = "Registered";
        button.disabled = true;
        button.style.background = "gray";
      }
  
    });
  }
  
  
  updateRegisterButtons();
  