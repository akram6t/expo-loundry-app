import { formatDate } from "./FormatDate";

export function FilterSlotTime(timing, selectedDate) {
    const timeSlots = [...timing];
    if (formatDate(selectedDate) !== 'Today') {
        return timeSlots;
    }
    // Get current time
    //  const timeSlots = ['9 AM - 10 AM', '10 AM - 11 AM', '11 AM - 12 PM', '12 PM - 1 PM', '1 PM - 2 PM', '2 PM - 3 PM', '3 PM - 4 PM', '4 PM - 5 PM', '5 PM - 6 PM', '6 PM - 7 PM', '7 PM - 8 PM', '8 PM - 9 PM'];
    var currentTime = new Date();

    // Function to format time to 'hh AM/PM' format
    function formatTime(time) {
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (12 AM)
        minutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero for single-digit minutes
        var formattedTime = hours + ' ' + ampm;
        return formattedTime;
    }

    // Format the current time
    // 2 PM
    var formattedCurrentTime = formatTime(currentTime);

    let currentHour = formattedCurrentTime.split(' ');
    if (currentHour[1].includes('PM')) {
        currentHour = parseInt(currentHour[0]) === 12 ? 12 : parseInt(currentHour[0]) + 12;
    } else if (currentHour[1] === 'AM') {
        currentHour = parseInt(currentHour[0]) === 12 ? 0 : parseInt(currentHour[0]) + 0;
    }
    const filteredTimeSlots = timeSlots.filter(timeSlot => {
        // Extract the start time from each slot
        let splitTimeSlot = timeSlot.time.split(' ');
        let times = 0;
        if (splitTimeSlot[1] === 'PM') {
            times = parseInt(splitTimeSlot[0]) === 12 ? 12 : parseInt(splitTimeSlot[0]) + 12;
        } else if (splitTimeSlot[1] === 'AM') {
            times = parseInt(splitTimeSlot[0]) === 12 ? 0 : parseInt(splitTimeSlot[0]) + 0;
        }
        return currentHour < times;
    })


    return filteredTimeSlots;


}