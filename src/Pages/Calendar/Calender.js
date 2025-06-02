import React, { useEffect, useState, useContext } from "react";
import { Badge, Calendar } from "antd";
import dayjs from "dayjs";
import { Axios } from "../../Config/Axios/Axios";
import { UserContext } from "../../App";

// Default holidays with type 'holiday'
const defaultHolidays = [
  { date: "2025-04-07", name: "World Health Day", type: "holiday" },
  { date: "2025-04-14", name: "Ambedkar Jayanti", type: "holiday" },
  { date: "2025-04-22", name: "Earth Day", type: "holiday" },
  { date: "2025-05-09", name: "Rabindranath Tagore Jayanti", type: "holiday" },
  { date: "2025-05-12", name: "International Nurses Day", type: "holiday" },
  { date: "2025-05-25", name: "World Geek Pride Day", type: "holiday" },
  { date: "2025-06-05", name: "World Environment Day", type: "holiday" },
  { date: "2025-06-15", name: "Founders Day", type: "holiday" },
  { date: "2025-06-21", name: "International Yoga Day", type: "holiday" },
  { date: "2025-07-01", name: "National Doctor’s Day", type: "holiday" },
  { date: "2025-07-04", name: "American Independence Day", type: "holiday" },
  { date: "2025-07-11", name: "World Population Day", type: "holiday" },
  { date: "2025-08-12", name: "International Youth Day", type: "holiday" },
  { date: "2025-08-15", name: "Independence Day (India)", type: "holiday" },
  { date: "2025-08-19", name: "World Photography Day", type: "holiday" },
];

const CalendarComponent = () => {
  const { user } = useContext(UserContext);
  const [days, setDays] = useState(defaultHolidays);

  useEffect(() => {
    if (user?.id) {
      Axios.get(`/api/tasks/${user.id}/end-dates`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          console.log(response);
          
          // Assuming response.data is an array of objects like { date: "YYYY-MM-DD", name: "Task Name" }
          const fetchedTasks = response.data.map((item) => ({
            date: item.date,
            name: item.name || "Task Due",
            type: "task",
          }));
          setDays((prev) => [...prev, ...fetchedTasks]);
        })
        .catch((error) => {
          console.error("Error fetching task dates:", error);
        });
    }
  }, [user?.id]);

  // Get all events (holiday/task) for a date
  const getEventsForDate = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    return days
      .filter((item) => item.date === formattedDate)
      .map((item) => ({
        type: item.type === "holiday" ? "success" : "warning",
        content: item.name,
      }));
  };

  // Render the cell content, apply special class for holidays
  const dateCellRender = (value) => {
    const events = getEventsForDate(value);
    const isHolidayDate = days.some(
      (d) => d.date === value.format("YYYY-MM-DD") && d.type === "holiday"
    );

    return (
      <div className={isHolidayDate ? "holiday-cell" : ""}>
        <ul className="events" style={{ paddingLeft: 0, margin: 0 }}>
          {events.map((item, index) => (
            <li key={index} style={{ listStyle: "none", marginBottom: 2 }}>
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
    <div
      className="rounded"
      style={{
        padding: "2rem",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Calendar cellRender={cellRender} />
      <style>{`
        .holiday-cell {
          background-color: #red; /* Light blue background for holidays */
          border-radius: 4px;
          padding: 4px;
        }
        .events li {
          margin-bottom: 2px;
        }
      `}</style>
    </div>
  );
};

export default CalendarComponent;
