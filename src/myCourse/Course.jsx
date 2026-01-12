import React from "react";
import MyCourseCard from "./MyCourseCard";

const Course = () => {
  return (
    <section className="min-h-screen bg-background mt-30 px-6 md:px-20">
      <h1 className="text-3xl font-semibold  mb-10">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <MyCourseCard />
      </div>
    </section>
  );
};

export default Course;
