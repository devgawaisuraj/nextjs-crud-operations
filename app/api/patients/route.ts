import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET ALL PATIENTS
export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM patients_data ORDER BY id DESC",
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch patients" },
      { status: 500 },
    );
  }
}

// POST - CREATE PATIENT
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { patientName, email, age, city } = body;

    if (!patientName || !email) {
      return NextResponse.json(
        {
          message: "Patient name and email are required",
        },
        { status: 400 },
      );
    }

    const [result]: any = await db.execute(
      `INSERT INTO patients_data
       (patientName, email, age, city)
       VALUES (?, ?, ?, ?)`,
      [patientName, email, age, city],
    );

    return NextResponse.json(
      {
        message: "Patient created successfully",
        id: result.insertId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create patient" },
      { status: 500 },
    );
  }
}
