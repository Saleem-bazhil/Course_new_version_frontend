import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api";
import GuideCard from "../guidesection/GuideCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchasedGuides = async () => {
      try {
        const rawUser = localStorage.getItem("user");
        const token =
          (rawUser && JSON.parse(rawUser)?.token) ||
          localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        // ✅ BACKEND IS SOURCE OF TRUTH
        const res = await api.get("/payment/my-purchases", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setGuides(res.data.data.guides || []);
      } catch (err) {
        console.error("Error fetching purchased guides:", err);
        setGuides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedGuides();
  }, [navigate]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background pt-24">
        <p className="text-muted-foreground">
          Loading your purchased guides…
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background">
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
              My <span className="text-primary">Purchased Guides</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              All the guides you&apos;ve unlocked with your account.
            </p>
          </div>

          {guides.length === 0 ? (
            <div className="mt-12 text-center text-muted-foreground">
              You haven&apos;t purchased any guides yet.
            </div>
          ) : (
            <GuideCard guides={guides} forceView  />
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
