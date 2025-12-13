import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getProfile } from "../../redux/userSlice";
import WelcomeSection from "./WelcomeSection";
import { useNavigate } from "react-router-dom";
import { getDashboard, getUserBadges, updateUserPoints } from "../../api/api";
import "react-circular-progressbar/dist/styles.css";
import { Bar } from "react-chartjs-2";
import { BarChart2, Trophy, X } from "lucide-react";
import { TrendingUp, BookText } from "lucide-react";
import "react-calendar-heatmap/dist/styles.css";

import "react-tooltip/dist/react-tooltip.css";
import CareerProgress from "./CareerProgress";
import { ASK_NEW_QUESTION } from "../../util/Routes";
import UserBadges from "./UserBadges";

const Home = () => {
  const profile = useSelector(getProfile);
  const [dashboardData, setDashboardData] = useState(null);
  const [skillset, setSkillset] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [badges, setBadges] = useState([]);
  const [showMaxPointsNotification, setShowMaxPointsNotification] = useState(false);

  const navigate = useNavigate();

  const careerRef = useRef(null);
  const qaRef = useRef(null);
  const skillsRef = useRef(null);

  useEffect(() => {
    if (!profile?.id) return; 
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard(profile.id);
        setDashboardData(res);

        console.log("RES",res)
        const newPoints = res.user?.points || 0;

        const apires = await updateUserPoints(profile.id, newPoints);
        console.log("APIRES",apires)

        if (res.roles && res.roles.length > 0) {
          setSelectedRole(res.roles[0]);
          setSkillset(res.roles[0].skills || []);
          
          if (res.roles[0].rolePoints >= 500) {
            setShowMaxPointsNotification(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    if (profile?.id) fetchDashboard();
  }, [profile]);

  useEffect(() => {
    if (!profile?.id) return;
    
    const fetchBadges = async () => {
      const res = await getUserBadges(profile.id);
      setBadges(res);
    };

    fetchBadges();
  }, [profile?.id]);

  useEffect(() => {
    if (selectedRole) {
      setSkillset(selectedRole.skills || []);
      const recs = generateRecommendations(selectedRole.skills || []);
      setRecommendations(recs);
      
      if (selectedRole.rolePoints >= 500) {
        setShowMaxPointsNotification(true);
      } else {
        setShowMaxPointsNotification(false);
      }
    }
  }, [selectedRole]);

  const generateRecommendations = (skills) => {
    const recs = [];

    skills.forEach((skill) => {
      if (skill.level < 3) {
        recs.push(
          `Improve ${skill.skill_name} by answering more related questions.`
        );
      }
      if (skill.votes_recieved < 5) {
        recs.push(
          `Earn more upvotes in ${skill.skill_name} by writing high-quality answers.`
        );
      }
    });

    if (skills.length === 0) {
      recs.push(
        "You have no tracked skills yet. Start answering questions to build your profile."
      );
    }

    return recs;
  };

  if (!dashboardData)
    return (
      <div className="flex justify-center p-6">
        <span className="loading loading-bars loading-xl text-ibmblue"></span>
      </div>
    );

  const { user } = dashboardData;
  console.log("USER",user)
  const recentQuestions = selectedRole?.recentQuestions || [];
  const recentAnswers = selectedRole?.recentAnswers || [];

  const sortedSkills = [...skillset].sort((a, b) => a.level - b.level);

  const funnelData = {
    labels: sortedSkills.map((s) => s.skill_name),
    datasets: [
      {
        label: "Points",
        data: sortedSkills.map((s) => s.level),
        backgroundColor: "#1f70c1",
      },
    ],
  };

  const funnelOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Skill Funnel (Highest at Bottom)" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.x} points`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: { display: true, text: "Points" },
      },
      y: {
        title: { display: true, text: "Skills" },
      },
    },
  };

  return (
    <div className="min-h-screen bg-ibmlight">
      {/* Maximum Points Achievement Notification */}
      {showMaxPointsNotification && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={28} className="animate-pulse" />
              <div>
                <h3 className="font-bold text-lg">
                  🎉 Congratulations! Maximum Points Reached!
                </h3>
                <p className="text-sm text-green-50">
                  You've achieved 500 points for {selectedRole?.role_name}! You're ready to advance to the next level.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMaxPointsNotification(false)}
              className="p-2 hover:bg-white/20 rounded-full transition"
              aria-label="Close notification"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-10 p-6 md:p-10">
        {/* 👋 Welcome */}
        <div className="flex justify-between items-center">
          <WelcomeSection />
          <div className="mb-6">
            <label className="font-medium text-gray-700 mr-2">Select Role:</label>
            <select
              className="border border-ibmblue rounded px-4 py-2"
              value={selectedRole?.id || ""}
              onChange={(e) => {
                const role = dashboardData.roles.find(
                  (r) => r.id === Number(e.target.value)
                );
                setSelectedRole(role);
              }}
            >
              {dashboardData.roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ⚡ Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            ⚡ Quick Actions
          </h2>
          <div className="flex flex-wrap ">
            <a
              href={ASK_NEW_QUESTION}
              onClick={(e) => {
                e.preventDefault();
                navigate(ASK_NEW_QUESTION);
              }}
              className="inline-block underline underline-offset-4 text-ibmblue px-4 py-1.5 rounded hover:bg-ibmlight transition"
            >
              Ask Question
            </a>
            <a
              href="/questions?tag=myskills"
              onClick={(e) => {
                e.preventDefault();
                navigate("/questions?tag=myskills");
              }}
              className="inline-block underline underline-offset-4 text-ibmblue px-4 py-1.5 rounded hover:bg-ibmlight transition"
            >
              Browse All Questions
            </a>
            <a
              href="/profile"
              onClick={(e) => {
                e.preventDefault();
                navigate("/profile");
              }}
              className="inline-block underline underline-offset-4 text-ibmblue px-4 py-1.5 rounded hover:bg-ibmlight transition"
            >
              Update Career Goals
            </a>

            <a
              href="#career"
              onClick={(e) => {
                e.preventDefault();
                careerRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-block underline underline-offset-4 text-ibmblue px-4 py-1.5 rounded hover:bg-ibmlight transition"
            >
              Career Progress
            </a>

            <a
              href="#qa"
              onClick={(e) => {
                e.preventDefault();
                qaRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-block underline underline-offset-4 text-ibmblue px-4 py-1.5 rounded hover:bg-ibmlight transition"
            >
              Recent Q&A
            </a>

            <a
              href="#skills"
              onClick={(e) => {
                e.preventDefault();
                skillsRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-block underline underline-offset-4 text-ibmblue px-4 py-1.5 rounded hover:bg-ibmlight transition"
            >
              Skills & Recommendations
            </a>
          </div>
        </section>

        {/* 🎯 Career Progress */}
        <section ref={careerRef} id="career" className=" ">
          <div className="flex gap-[20px]">
            <div className="w-full">
              <CareerProgress user={user} role={selectedRole} />
            </div>
            <div className="w-full">
              <section className="w-full overflow-x-auto h-[100%] bg-white rounded">
                <div className="w-full  overflow-x-auto p-6">
                  <h2 className="text-lg font-semibold mb-2 text-ibmblue flex items-center gap-2">
                    <TrendingUp size={18} className="text-ibmblue" /> Skill Growth
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Track your progress across different skills - levels increase as you answer questions and receive upvotes in each area.
                  </p>
                  <Bar
                    className="overflow-x-auto"
                    data={funnelData}
                    options={funnelOptions}
                  />
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* Earned Badges */}
        <section>
          <UserBadges badges={badges} />
        </section>

        {/* 📌 Recent Questions & 🗣️ Answers */}
        <section ref={qaRef} id="qa" className="flex  gap-12">
          <div className="w-full bg-white p-6 rounded-lg  ">
            <h2 className="text-lg font-bold text-ibmblue mb-2">
              📌 Recent Questions in Your Skill Areas
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Questions tagged with your target role skills - answer these to earn points and level up.
            </p>
            {recentQuestions?.length > 0 ? (
              <ul className="space-y-2">
                {recentQuestions.map((q) => (
                  <li
                    key={q.id}
                    onClick={() => navigate(`/questions/${q.id}`)}
                    className="text-sm text-ibmblue cursor-pointer hover:underline"
                  >
                    {q.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No recent questions in your skills yet.
              </p>
            )}
          </div>

          <div className="w-full bg-white p-6 rounded-lg  ">
            <h2 className="text-lg font-bold text-ibmblue mb-2">
              🗣️ Your Recent Answers
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Your latest contributions to the community - keep answering to build your expertise.
            </p>
            {recentAnswers?.length > 0 ? (
              <ul className="space-y-4">
                {recentAnswers.map((a) => (
                  <li key={a.id} className="text-sm ">
                    <div
                      className="prose prose-sm max-w-none text-gray-800"
                      dangerouslySetInnerHTML={{
                        __html: a.content.slice(0, 150) + "...",
                      }}
                    />
                    <div className="text-xs mt-1">
                      on:{" "}
                      <span
                        onClick={() => navigate(`/questions/${a.question?.id}`)}
                        className="italic text-ibmblue cursor-pointer hover:underline "
                      >
                        {a.question?.title}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                You haven't answered any questions yet.
              </p>
            )}
          </div>
        </section>

        <div className="w-full" ref={skillsRef} id="skills">
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 mt-8">
              <BookText size={18} className="text-ibmblue" /> Recommendations
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Personalized suggestions to help you improve your skills and reach your career goals faster.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-gray-800 text-sm">
              {recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
              <li>
                Take Advanced training at{" "}
                <a
                  className="text-blue-600 underline"
                  href="https://yourlearning.ibm.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YourLearning
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
