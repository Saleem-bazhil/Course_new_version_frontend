import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api";
import GuideCard from "../guidesection/GuideCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current logged-in user
  let currentUserId = null;
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      currentUserId = parsed._id || parsed.id || null;
    }
  } catch {
    currentUserId = null;
  }

  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
      return;
    }

    const fetchGuides = async () => {
      try {
        const res = await api.get("/pdf");
        const all = res.data?.data || [];

        // Filter to only guides the user has paid for (based on local paid flag)
        const purchased = all.filter((guide) => {
          const id = guide._id || guide.id;
          if (!id) return false;
          const key = `paid_${currentUserId}_${id}`;
          return localStorage.getItem(key) === "true";
        });

        setGuides(purchased);
      } catch (err) {
        console.error("Error fetching guides for dashboard:", err);
        setGuides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [currentUserId, navigate]);

  if (!currentUserId) {
    return null;
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background pt-24">
        <p className="text-sm md:text-base text-muted-foreground">
          Loading your guides…
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-white">
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              My <span className="text-blue-600">Purchased Guides</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              All the guides you&apos;ve unlocked with your account. Click
              &quot;View Guide&quot; to resume reading.
            </p>
          </div>

          {guides.length === 0 ? (
            <div className="mt-12 text-center text-muted-foreground">
              You haven&apos;t purchased any guides yet.
            </div>
          ) : (
            <GuideCard guides={guides} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;


