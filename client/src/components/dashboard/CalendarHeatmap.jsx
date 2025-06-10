import React, { useEffect, useRef } from 'react';

const CalendarHeatmap = ({ id, platform, data, handle, theme = 'light' }) => {
  // Get current date and calculate the start date (6 months ago)
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - 6);

  // Create a map of date strings to submission counts
  const dataMap = {};
  if (data && data[platform]) {
    data[platform].forEach(entry => {
      const dateStr = entry.date;
      dataMap[dateStr] = entry.subs;
    });
  }

  console.log("Data : ",data);


  // Generate all dates for the past 6 months
  const generateDates = () => {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= today) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const allDates = generateDates();


  // Group dates by weeks, starting from Sunday
  const weeks = [];
  let currentWeek = [];

  // Find the first Sunday at or before startDate
  const firstSunday = new Date(startDate);
  while (firstSunday.getDay() !== 0) {
    firstSunday.setDate(firstSunday.getDate() - 1);
  }

  // Generate weeks starting from the first Sunday
  const currentDate = new Date(firstSunday);
  while (currentDate <= today) {
    currentWeek = [];
    for (let day = 0; day < 7; day++) {
      if (currentDate <= today) {
        currentWeek.push(new Date(currentDate));
      } else {
        currentWeek.push(null);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(currentWeek);
  }


  // Get color intensity based on submission count
  const getIntensity = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  const getColor = (intensity) => {
    const lightColors = [
      'bg-gray-100', // No submissions
      'bg-green-200', // Low
      'bg-green-300', // Medium-low
      'bg-green-500', // Medium-high
      'bg-green-700'  // High
    ];
    const darkColors = [
      'bg-gray-700', // No submissions
      'bg-green-800', // Low
      'bg-green-600', // Medium-low
      'bg-green-500', // Medium-high
      'bg-green-400'  // High
    ];
    return `dark:${darkColors[intensity]} ${lightColors[intensity]}`;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const dateString = `${year}-${month}-${day}`;
    return dateString;
  };

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate month labels - only show if there's enough space (at least 3 weeks)
  const getMonthLabels = () => {
    const labels = [];
    const monthWeekCounts = {};

    // Count weeks for each month
    weeks.forEach((week, weekIndex) => {
      const firstDate = week.find(date => date !== null && date >= startDate);
      if (firstDate) {
        const monthKey = `${firstDate.getFullYear()}-${firstDate.getMonth()}`;
        if (!monthWeekCounts[monthKey]) {
          monthWeekCounts[monthKey] = {
            month: firstDate.getMonth(),
            year: firstDate.getFullYear(),
            startWeek: weekIndex,
            weekCount: 0
          };
        }
        monthWeekCounts[monthKey].weekCount++;
      }
    });

    // Only add labels for months with at least 3 weeks
    Object.values(monthWeekCounts).forEach(monthData => {
      if (monthData.weekCount >= 3) {
        labels.push({
          weekIndex: monthData.startWeek,
          month: months[monthData.month]
        });
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  // Filter out dates that are before our 6-month window
  const isDateInRange = (date) => {
    return date >= startDate && date <= today;
  };

  //To sync scroll of month labels with heatmap regions
  const labelRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const labelEl = labelRef.current;
    const gridEl = gridRef.current;

    if (!labelEl || !gridEl) return;

    const syncScroll = (source, target) => () => {
      target.scrollLeft = source.scrollLeft;
    };

    const onLabelScroll = syncScroll(labelEl, gridEl);
    const onGridScroll = syncScroll(gridEl, labelEl);

    labelEl.addEventListener('scroll', onLabelScroll);
    gridEl.addEventListener('scroll', onGridScroll);

    return () => {
      labelEl.removeEventListener('scroll', onLabelScroll);
      gridEl.removeEventListener('scroll', onGridScroll);
    };
  }, []);

  return (
    data?.[platform].length === 0 ? <div className="min-h-[300px] w-full h-full flex items-center justify-center text-gray-700 dark:text-gray-200 font-medium text-center">
      {!handle ? "Add your coding handles to enable data fetching." : platform === 'codechef' ? "Codechef currently doesn't provide public access to heatmap data via API." : "No heatmap data available"}
    </div> :
      <div className="w-full">
        <div className="flex flex-col space-y-3">
          {/* Month labels */}
          <div className='flex'>
            <div className="flex ml-11 overflow-x-auto hide-scrollbar" ref={labelRef}
            >
              {monthLabels.map((label, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 text-xs font-medium text-gray-400 dark:text-white w-[89px] text-center border-1`}
                >
                  {label.month}
                </div>
              ))}
            </div>
          </div>

          <div className="flex ">
            {/* Day labels - show all days */}
            <div className="flex flex-col space-y-1 mr-3 flex-shrink-0">
              {days.map((day, index) => (
                <div key={index} className={`text-xs font-medium h-4 leading-4 w-8 text-gray-400 dark:text-white`}>
                  {index % 2 === 1 ? day.slice(0, 1) : ''}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex space-x-1 overflow-x-auto thin-scrollbar" ref={gridRef}>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col space-y-1">
                  {week.map((date, dayIndex) => {
                    if (!date || !isDateInRange(date)) {
                      return <div key={dayIndex} className="w-4 h-4"></div>;
                    }

                    const dateStr = formatDate(date);
                    const count = dataMap[dateStr] || 0;
                    const intensity = getIntensity(count);

                    return (
                      <div
                        key={dayIndex}
                        className={`w-4 h-4 rounded-sm ${getColor(intensity)} ${theme === 'dark' ? 'border border-gray-600' : 'border border-gray-200'
                          } cursor-pointer hover:ring-2 ${theme === 'dark' ? 'hover:ring-blue-400' : 'hover:ring-blue-300'
                          } transition-all`}
                        title={`${formatDateForDisplay(date)}: ${count} submissions`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4">
            <div className={`text-sm text-gray-400 dark:text-white`}>
              {data && data[platform] ?
                `${data[platform].filter(entry => {
                  const entryDate = new Date(entry.date);
                  return entryDate >= startDate && entryDate <= today;
                }).length} active days` :
                '0 active days'
              }
            </div>

            <div className="flex items-center space-x-2">
              <span className={`text-xs text-gray-400 dark:text-white`}>Less</span>
              <div className="flex space-x-1">
                {[0, 1, 2, 3, 4].map(intensity => (
                  <div
                    key={intensity}
                    className={`w-4 h-4 rounded-sm ${getColor(intensity)} ${theme === 'dark' ? 'border border-gray-600' : 'border border-gray-200'
                      }`}
                  />
                ))}
              </div>
              <span className={`text-xs text-gray-400 dark:text-white`}>More</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CalendarHeatmap;