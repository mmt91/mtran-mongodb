import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Course } from "@/types/course";

// Define the path to the JSON file
const dataFilePath = path.join(process.cwd(), "data", "courses.json");

// Helper function to read courses from the JSON file
const readCourses = (): Course[] => {
  try {
    const jsonData = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(jsonData) as Course[];
  } catch (error) {
    console.error("Error reading courses file:", error);
    return [];
  }
};

// Helper function to write courses to the JSON file
const writeCourses = (courses: Course[]) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(courses, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to courses file:", error);
  }
};

// GET: Retrieve all courses
export async function GET() {
  try {
    const courses = readCourses();
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error retrieving courses:", error);
    return NextResponse.json(
      { error: "Failed to retrieve courses." },
      { status: 500 }
    );
  }
}

// POST: Add a new course
export async function POST(request: Request) {
  try {
    const newCourse: Course = await request.json();
    const courses = readCourses();

    newCourse.id = courses.length ? courses[courses.length - 1].id + 1 : 1;
    courses.push(newCourse);
    writeCourses(courses);

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json(
      { error: "Failed to add course." },
      { status: 500 }
    );
  }
}
