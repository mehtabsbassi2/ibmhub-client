import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { subDays } from "date-fns";
import { Tooltip } from "react-tooltip";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";

const ActivityHeatmap = ({ data }) => {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <section className="bg-white  mt-6 text-xs">
      <h2 className="text-lg font-semibold text-ibmblue mb-4">📆 QA Activity Heatmap</h2>
      <CalendarHeatmap
        startDate={subDays(new Date(), 300)}
        endDate={new Date()}
        values={safeData}
        classForValue={(value) => {
          if (!value) return "color-empty";
          if (value.count === 1) return "color-scale-1";
          if (value.count === 2) return "color-scale-2";
          if (value.count === 3) return "color-scale-3";
          return "color-scale-4";
        }}
        tooltipDataAttrs={(value) => ({
          "data-tooltip-id": "qa-tooltip",
          "data-tooltip-content": value.date
            ? `${value.count} QA activities on ${value.date}`
            : "No activity",
        })}
        showWeekdayLabels={false}
        transformDayElement={(rect) =>
          React.cloneElement(rect, { width: 8, height: 8 })
        }
      />
      <Tooltip id="qa-tooltip" place="top" />
    </section>
  );
};

export default ActivityHeatmap;
