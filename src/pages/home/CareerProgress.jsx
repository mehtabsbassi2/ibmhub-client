import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Briefcase, TrendingUp, Rocket } from "lucide-react";
import { formatDistanceToNowStrict, parseISO, isBefore } from "date-fns";


const CareerProgress = ({ user, role }) => {
  const getProgressStages = (points) => {
    const stage1Max = 250;
    const stage2Max = 375;
    const stage3Max = 500;

    const circle1 = Math.min((points / stage1Max) * 100, 100);
    const circle2 = points <= stage1Max ? 0 : Math.min(((points - stage1Max) / (stage2Max - stage1Max)) * 100, 100);
    const circle3 = points <= stage2Max ? 0 : Math.min(((points - stage2Max) / (stage3Max - stage2Max)) * 100, 100);

    return [circle1, circle2, circle3];
  };

  const getTimeLeft = (targetDateStr) => {
    if (!targetDateStr) return "0 days";
    const targetDate = parseISO(targetDateStr);
    const now = new Date();
    if (isBefore(targetDate, now)) return "Deadline passed";
    return formatDistanceToNowStrict(targetDate, { unit: "day" });
  };

  if (!role) return null;

  const timeLeft = getTimeLeft(role.timeline);
  const [circle1, circle2, circle3] = getProgressStages(role.rolePoints);

  return (
    <section className="bg-white p-6 rounded h-[100%]">
      <h2 className="text-lg font-bold text-ibmblue mb-4">🎯 Career Progress</h2>
      <p className="text-sm text-gray-600 mt-2">
        ⏳ Time Left to Reach <strong>{role.role_name}</strong>:{" "}
        <span className="font-medium text-ibmblue">{timeLeft}</span>
      </p>

      <div className="w-full flex items-center justify-center gap-1 mt-6">
        {[ 
          {
            label: user.job_title,
            color: "#1f70c1",
            icon: <Briefcase size={24} />,
            value: circle1,
            text: `${role.rolePoints}%`,
            range: "0–250 pts",
          },
          {
            label: "Mid Level",
            color: "#016630",
            icon: <TrendingUp size={24} className="text-green-800" />,
            value: circle2,
            text: role.rolePoints >= 250 ? `${role.rolePoints}%` : "0%",
            range: "250–375 pts",
          },
          {
            label: role.role_name,
            color: "#7e2a0c",
            icon: <Rocket size={24} className="text-orange-900" />,
            value: circle3,
            text: role.rolePoints >= 375 ? `${role.rolePoints}%` : "0%",
            range: "375–500 pts",
          },
        ].map((stage, idx) => (
          <React.Fragment key={idx}>
            <div className="w-full flex flex-col items-center space-y-1">
              <h1 className="rounded text-white text-sm px-1" style={{ background: stage.color }}>
                {stage.label}
              </h1>
              <div className="w-[130px] h-[130px] relative">
                <CircularProgressbar
                  value={stage.value}
                  styles={buildStyles({
                    pathColor: stage.color,
                    trailColor: "#e0e0e0",
                  })}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs text-center">
                  <div className="flex flex-col items-center">
                    {stage.icon}
                    <h1 className="text-[12px] font-bold">{stage.text}</h1>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600">{stage.range}</span>
            </div>
            {idx < 2 && <div className="h-1 w-full rounded" style={{ background: stage.color }} />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};


export default CareerProgress;
