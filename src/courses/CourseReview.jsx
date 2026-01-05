import { useEffect, useState } from "react";

const reviews = [
  { name: "Alex Morgan", time: "2 weeks ago", text: "Very practical and beginner friendly.", rating: 5 },
  { name: "Jordan Lee", time: "1 month ago", text: "Clear explanations and great structure.", rating: 4 },
  { name: "Sam Rivera", time: "3 weeks ago", text: "Worth every rupee. nalla irukku.", rating: 5 },
  { name: "Chris Paul", time: "1 week ago", text: "Good but could be better.", rating: 3 },
  { name: "David Roy", time: "5 days ago", text: "Average experience.", rating: 2 },
  { name: "Mark John", time: "2 days ago", text: "Not recommended.", rating: 1 },
];

function ReviewSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex gap-8">
      {/* LEFT STAR COLUMN */}
      <div className="flex flex-col justify-center gap-3">
        {[5, 4, 3, 2, 1].map((s) => (
          <div
            key={s}
            className={`text-sm ${
              reviews[index].rating === s
                ? "text-yellow-400 font-semibold"
                : "text-gray-600"
            }`}
          >
            {"★".repeat(s)}
          </div>
        ))}
      </div>

      {/* SLIDING REVIEW */}
      <div className="overflow-hidden flex-1">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {reviews.map((r, i) => (
            <div key={i} className="min-w-full">
              <Review {...r} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Review({ name, time, text, rating }) {
  return (
    <div className="p-4">
      <div className="text-yellow-400 mb-3">
        {"★".repeat(rating)}
        <span className="text-gray-600">
          {"★".repeat(5 - rating)}
        </span>
      </div>

      <p className="text-gray-300 mb-6">{text}</p>

      <div className="flex justify-between text-sm text-gray-400">
        <span className="text-white font-medium">{name}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}
export default ReviewSlider;
