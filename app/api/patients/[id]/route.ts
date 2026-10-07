import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// GET SINGLE PATIENT
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const [rows] = await db.execute(
      "SELECT * FROM patients_data WHERE id = ?",
      [id],
    );

    const patients = rows as any[];

    if (patients.length === 0) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(patients[0]);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch patient" },
      { status: 500 },
    );
  }
}

// PUT - COMPLETE UPDATE
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;

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
      `UPDATE patients_data
       SET patientName = ?,
           email = ?,
           age = ?,
           city = ?
       WHERE id = ?`,
      [patientName, email, age, city, id],
    );
 
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Patient updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to update patient" },
      { status: 500 },
    );
  }
}

// PATCH - PARTIAL UPDATE
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const body = await request.json();

    const { patientName, email, age, city } = body;

    const fields = [];
    const values = [];

    if (patientName !== undefined) {
      fields.push("patientName = ?");
      values.push(patientName);
    }

    if (email !== undefined) {
      fields.push("email = ?");
      values.push(email);
    }

    if (age !== undefined) {
      fields.push("age = ?");
      values.push(age);
    }

    if (city !== undefined) {
      fields.push("city = ?");
      values.push(city);
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { message: "No fields provided for update" },
        { status: 400 },
      );
    }

    values.push(id);

    const [result]: any = await db.execute(
      `UPDATE patients_data
       SET ${fields.join(", ")}
       WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Patient partially updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to partially update patient" },
      { status: 500 },
    );
  }
}

// DELETE PATIENT
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const [result]: any = await db.execute(
      "DELETE FROM patients_data WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to delete patient" },
      { status: 500 },
    );
  }
}
