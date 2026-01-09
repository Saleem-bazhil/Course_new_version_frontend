import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Users, Clock } from "lucide-react";

import Coursecirculam from "./Coursecirculam";
import CoursePriceCard from "./CoursePriceCard";
import CourseReview from "./CourseReview";
import PaymentModal from "@/paymentmodel/PaymentModel";
import api from "../Api";

const CourseDetail = () => {
  const { id } = useParams();
  const [courseDetail, setCourseDetail] = useState(null);
const [showPayment, setShowPayment] = useState(false);

  // fetch course details using id
  useEffect(() => {
    api
      .get(`/courses/${id}`)
      .then((res) => setCourseDetail(res.data.data))
      .catch(console.log);
  }, [id]);

  // wait until data is ready
  if (!courseDetail) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">

      {/* hero section */}
      <section className="relative border-b border-white/10 mt-20">
      {/* <div className="absolute h-32 w-2 bg-primary rounded-full"></div> */}
        <div className="absolute bg-background" />

        <div className="
          relative px-30 mx-auto 
          pt-14 pb-12
          grid grid-cols-1 lg:grid-cols-3 gap-12
        ">

          {/* left content */}
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {courseDetail.title}
            </h1>

            <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
              {courseDetail.description}
            </p>

            {/* stats */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-yellow-400" />
                {courseDetail.rating || 4.8}
              </div>

              <div className="flex items-center gap-2">
                <Users size={16} />
                {courseDetail.students || "12,453"} students
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} />
                {courseDetail.hours} hours
              </div>
            </div>

            {/* course image */}
            <div className="
              mt-4
              rounded-2xl overflow-hidden
              border border-white/10
              shadow-2xl bg-black mt-6
            ">
              <img
                src={courseDetail.image}
                alt={courseDetail.title}
                className="w-full h-[380px] object-cover"
              />
            </div>
          </div>

          {/* price card */}
          <aside className="lg:sticky lg:top-24 self-start">
            <CoursePriceCard
  course={courseDetail}
  onBuy={() => setShowPayment(true)}
/>

            {showPayment && (
  <PaymentModal
    guide={courseDetail}
    itemType="Course"
    onClose={() => setShowPayment(false)}
  />
)}
          </aside>
        </div>
      </section>

      {/* curriculum */}
      <section className="max-w-7xl mx-auto ">
        <Coursecirculam chapters={courseDetail.chapters} />
      </section>

      {/* reviews */}
      <section className="max-w-7xl mx-auto  py-10">
        <CourseReview />
      </section>
    </div>
  );
};

export default CourseDetail;
