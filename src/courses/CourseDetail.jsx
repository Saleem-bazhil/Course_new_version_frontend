import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Users,
  Clock,
  PlayCircle,
} from "lucide-react";

import Coursecirculam from "./Coursecirculam";
import CoursePriceCard from "./CoursePriceCard";
import CourseReview from "./CourseReview";
import api from "../Api";

const CourseDetail = () => {
  const { id } = useParams(); // ✅ get course id
  const [courseDetail, setCourseDetail] = useState(null);

  useEffect(() => {
    api
      .get(`/courses/${id}`) // ✅ single course API
      .then((res) => {
        console.log(res.data);
        setCourseDetail(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!courseDetail) return null; // or loader

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-14 mt-30">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-8">

          <h1 className="text-4xl font-semibold leading-tight">
            {courseDetail.title}
          </h1>

          <p className="text-gray-400 max-w-2xl leading-relaxed">
            {courseDetail.description}
          </p>

          <div className="flex flex-wrap gap-8 text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <Star size={16} className="text-yellow-400" />
              {courseDetail.rating || 4.8}
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} />
              {courseDetail.students || "12,453"} students
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />
              {courseDetail.hours} hours
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-neutral-800">
            <img
              src={courseDetail.image}
              alt={courseDetail.title}
              className="w-full h-[320px] object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <PlayCircle className="h-16 w-16 text-white/80" />
            </div>
          </div>
        </div>

        {/* PRICE CARD */}
        <div className="sticky top-24 h-fit">
          <CoursePriceCard course={courseDetail} />
        </div>
      </div>

      {/* CURRICULUM */}
      <div className="max-w-7xl mx-auto px-6 mb-14">
        <Coursecirculam chapters={courseDetail.chapters} />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <CourseReview />
      </div>
    </div>
  );
};

export default CourseDetail;
