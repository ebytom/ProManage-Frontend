import React from "react";
import { Badge, Calendar } from "antd";
import dayjs from "dayjs";

// Holiday definitions
const holidays = [
  // April 2025
  { date: "2025-04-01", name: "April Fools’ Day" },
  { date: "2025-04-07", name: "World Health Day" },
  { date: "2025-04-14", name: "Ambedkar Jayanti" },
  { date: "2025-04-22", name: "Earth Day" },

  // May 2025
  { date: "2025-05-01", name: "Labour Day" },
  { date: "2025-05-09", name: "Rabindranath Tagore Jayanti" },
  { date: "2025-05-12", name: "International Nurses Day" },
  { date: "2025-05-25", name: "World Geek Pride Day" },

  // June 2025 (existing + 1 extra to make 4)
  { date: "2025-06-05", name: "World Environment Day" },
  { date: "2025-06-15", name: "Founders Day" },
  { date: "2025-06-21", name: "International Yoga Day" },
  { date: "2025-06-28", name: "Social Media Day" },

  // July 2025
  { date: "2025-07-01", name: "National Doctor’s Day" },
  { date: "2025-07-04", name: "American Independence Day" },
  { date: "2025-07-11", name: "World Population Day" },
  { date: "2025-07-17", name: "World Emoji Day" },

  // August 2025
  { date: "2025-08-12", name: "International Youth Day" },
  { date: "2025-08-15", name: "Independence Day (India)" },
  { date: "2025-08-19", name: "World Photography Day" },
  { date: "2025-08-29", name: "National Sports Day" },
];

// Check if a date is a holiday
const isHoliday = (value) => {
  return holidays.some((h) => h.date === value.format("YYYY-MM-DD"));
};

// Get holiday details
const getHolidayData = (value) => {
  const formatted = value.format("YYYY-MM-DD");
  const holiday = holidays.find((h) => h.date === formatted);
  return holiday ? [{ type: "processing", content: `${holiday.name}` }] : [];
};

// Events + Holidays
const getListData = (value) => {
  let listData = [];
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "Deadline approaching." },
        { type: "success", content: "Task completed." },
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "Pending review." },
        { type: "success", content: "Milestone achieved." },
        { type: "error", content: "Build failed." },
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "Overdue task." },
        { type: "success", content: "Sprint completed." },
        { type: "error", content: "Merge conflict." },
        { type: "error", content: "Deployment error." },
        { type: "error", content: "Test case failed." },
        { type: "error", content: "Missing dependencies." },
      ];
      break;
    default:
  }
  return [...listData, ...getHolidayData(value)];
};

const Calender = () => {
  const dateCellRender = (value) => {
    const listData = getListData(value);
    const isHolidayDate = isHoliday(value);

    return (
      <div className={isHolidayDate ? "holiday-cell" : ""}>
        <ul className="events">
          {listData.map((item) => (
            <li key={item.content}>
              <Badge status={item.type} text={item.content} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    // <div className='m-4 p-1 rounded' style={{ background: "#eee" }}>
    <div
    className="rounded"
      style={{
        padding: "2rem",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Calendar cellRender={cellRender} />
    </div>
  );
};

export default Calender;
