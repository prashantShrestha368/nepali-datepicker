const dateConfig = {
  1: "बैशाख",
  2: "जेठ",
  3: "असार",
  4: "साउन",
  5: "भदौ",
  6: "असोज",
  7: "कार्तिक",
  8: "मंसिर",
  9: "पुष",
  10: "माघ",
  11: "फागुन",
  12: "चैत",
};

function getCalendarData(year, month, callback) {
  var url = window.location.origin.split("/")[2] || "kavre.nivid.app";
  $.ajax({
    url: `https://${url}/dashboard/getMonthCalendarApi${
      year && month ? `?year=${year}&month=${month}` : ""
    }`,
    type: "GET",
    success: function (response) {
      callback(response);
    },
    error: function (error) {
      console.log(error);
    },
  });
}
function removeCalendar() {
  $(".calendar").remove();
}
function generateCalendar(response) {
  const current = $("#calendar-nepali");
  const dateResponse = response;
  const date = dateResponse.monthdata;

  removeCalendar();
  //add active class to the input field
  $(current).addClass("active");
  const today_date = new Date();

  const selected_nepali_date = current.val()?.split("/").pop();
  const selected_nepali_month = current.val()?.split("/")[1];

  const today = selected_nepali_date
    ? date.find((each) => each.gate == selected_nepali_date)?.englishDate
    : today_date.getDate();
  const current_month = selected_nepali_month
    ? Number(
        date.find((each) => each.nepaliMonth == selected_nepali_month)
          ?.englishMonth
      ) + 1
    : today_date.getMonth() + 1;

  //create the body of the calendar
  function createBody() {
    var calendarBody = $("<div class='calendar-body'></div>").appendTo(
      container
    );
    var selectedDate = $("#calendar-nepali").val();
    $.each(date, function (index, item) {
      // var isActive =
      //   today == item.englishDate && selected_nepali_month == item.nepaliMonth;
      var itemDate =
        item.year.toString() +
        "/" +
        item.nepaliMonth.toString() +
        "/" +
        item.gate.toString();
      var isActive = selectedDate === itemDate;
      var calendarItem = $(
        `<div id='${item.dayid}' class="${item.active ? "" : "disabled"} ${
          isActive ? "active" : ""
        }"}  style="color: ${item?.eventColour};"></div>`
      )
        .addClass("calendar-item")
        .html(`<div >${item.gate}</div>`)
        .appendTo(calendarBody);
      calendarItem.on("click", function () {
        //add active class to the clicked item
        $(this).addClass("active");
        //remove active class from other items
        $(this).siblings().removeClass("active");
        //get the value of the clicked item
        var value = $(this).text();
        //set the value of the input field
        $("#calendar-nepali").val(
          `${dateResponse.curYear}/${dateResponse.curMonth}/${value}`
        );

        //remove the calendar container
        removeCalendar();
      });
    });
  }
  var activeMonth = dateConfig[dateResponse.curMonth];
  //create a div with calendar class to wrap calendar-header and calendar-container
  $(".calendar").remove();
  var wrapper = $("<div></div>")
    .addClass("calendar")
    .appendTo($(current).parent());

  // create and show a container just below the input field
  $(
    `<div class='calendar-header'><div class='action-button' id='previous'>&laquo;</div>
    <div class="date-title">${
      dateResponse.curYear + " " + activeMonth
    }</div><div class='action-button' id='next'>&raquo;</div></div></div>`
  ).appendTo(wrapper);
  $(
    `<div class='calendar-day'><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thur</span><span>Fri</span><span>Sat</span></div>`
  ).appendTo(wrapper);
  var container = $(`<div></div>`)
    .addClass("calendar-container")
    .appendTo(wrapper);

  //change active month on click of next and previous button
  $("#previous").on("click", function () {
    getCalendarData(
      dateResponse.prevYear,
      dateResponse.prevMonth,
      generateCalendar
    );
  });

  $("#next").on("click", function () {
    getCalendarData(
      dateResponse.nextYear,
      dateResponse.nextMonth,
      generateCalendar
    );
  });

  createBody(activeMonth);
  //trigger onchange event handler in the input field
  $("#calendar-nepali").trigger("change");

  //console on change
  $("#calendar-nepali").on("change", function () {
    console.log("changed");
  });
}
getCalendarData(null, null, createCalendar);

function createCalendar(response) {
  $("#calendar-nepali").on("focus", function () {
    const selected_nepali_year = $(this).val()?.split("/")[0];
    const selected_nepali_month = $(this).val()?.split("/")[1];
    if (selected_nepali_month && selected_nepali_year) {
      return getCalendarData(
        selected_nepali_year,
        selected_nepali_month,
        generateCalendar
      );
    }
    generateCalendar(response);
  });
}

//call a function in document ready
$(document).ready(function () {
  var current = $("#calendar-nepali");
  $(current).wrap('<div class="nepali-calendar"></div>');
  // add a suffix icon to the input field

  //   current.on("focusout", function () {
  //     console.log("focusout");
  //     removeCalendar();
  //   });
});
