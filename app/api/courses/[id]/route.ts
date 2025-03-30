import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Course } from "@/types/course";

// Define the path to the JSON file
const dataFilePath = path.join(process.cwd(), "data", "courses.json");

// Helper function to read courses
const readCourses = (): Course[] => {
  try {
    const jsonData = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(jsonData) as Course[];
  } catch (error) {
    console.error("Error reading courses file:", error);
    return [];
  }
};

// Helper function to write courses
const writeCourses = (courses: Course[]) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(courses, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to courses file:", error);
  }
};

// GET: Retrieve a course by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    const courses = readCourses();
    const course = courses.find((c) => c.id === courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error retrieving course:", error);
    return NextResponse.json(
      { error: "Failed to retrieve course." },
      { status: 500 }
    );
  }
}

// PUT: Update a course by ID
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    const updatedCourse: Partial<Course> = await request.json();
    const courses = readCourses();
    const index = courses.findIndex((c) => c.id === courseId);

    if (index === -1) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    courses[index] = { ...courses[index], ...updatedCourse, id: courseId };

    writeCourses(courses);

    return NextResponse.json(courses[index], { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a course by ID
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    let courses = readCourses();
    const initialLength = courses.length;
    courses = courses.filter((c) => c.id !== courseId);

    if (courses.length === initialLength) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    writeCourses(courses);

    return NextResponse.json(
      { message: `Course with ID ${courseId} deleted.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course." },
      { status: 500 }
    );
  }
}
