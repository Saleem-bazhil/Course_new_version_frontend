import React from "react";
import { motion } from "framer-motion";
import { Wrench, HardHat, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseCard from "./CourseCard";

const CoursesUnderConstruction = () => {
  return (
    <section className="min-h-screen bg-background mt-30 px-6 md:px-20">
         <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-semibold">Explore Courses</h2>
          {/* <p className="text-gray-400">Find the perfect course for you</p> */}
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <CourseCard/>
      </div>

    </section>
  );
};

export default CoursesUnderConstruction;
