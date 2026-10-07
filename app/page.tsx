"use client";

import { useEffect, useState } from "react";

type Patient = {
  id: number;
  patientName: string;
  email: string;
  age: number;
  city: string;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const [form, setForm] = useState({
    patientName: "",
    email: "",
    age: "",
    city: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  // =========================
  // GET
  // =========================

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/patients");

      const data = await response.json();
      console.log("Data get at frontend", data); //
      setPatients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // POST / PUT
  // =========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const url = editingId ? `/api/patients/${editingId}` : "/api/patients";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName: form.patientName,
          email: form.email,
          age: Number(form.age),
          city: form.city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      resetForm();

      fetchPatients();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (patient: Patient) => {
    setEditingId(patient.id);

    setForm({
      patientName: patient.patientName,
      email: patient.email,
      age: String(patient.age),
      city: patient.city,
    });
  };

  // =========================
  // PATCH
  // =========================

  const handlePatch = async (id: number) => {
    const newCity = prompt("Enter new city:");

    if (!newCity) return;

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: newCity,
        }),
      });

      const data = await response.json();

      alert(data.message);

      fetchPatients();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this patient?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      alert(data.message);

      fetchPatients();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // RESET
  // =========================

  const resetForm = () => {
    setForm({
      patientName: "",
      email: "",
      age: "",
      city: "",
    });

    setEditingId(null);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          PEB Healthcare - Patient Management
        </h1>

        {/* ================= FORM ================= */}

        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            {editingId ? "Update Patient" : "Add Patient"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={form.patientName}
              onChange={handleChange}
              className="rounded border p-3 text-black"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="rounded border p-3 text-black"
              required
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              className="rounded border p-3 text-black"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="rounded border p-3 text-black"
            />

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                {editingId ? "Update Patient" : "Add Patient"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded bg-gray-500 px-6 py-3 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ================= TABLE ================= */}

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b p-5">
            <h2 className="text-xl font-semibold text-gray-800">
              Patient List
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-gray-600">Loading...</p>
          ) : patients.length === 0 ? (
            <p className="p-6 text-gray-600">No patients found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left text-gray-700">ID</th>

                    <th className="p-4 text-left text-gray-700">Name</th>

                    <th className="p-4 text-left text-gray-700">Email</th>

                    <th className="p-4 text-left text-gray-700">Age</th>

                    <th className="p-4 text-left text-gray-700">City</th>

                    <th className="p-4 text-left text-gray-700">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 text-gray-800">{patient.id}</td>

                      <td className="p-4 text-gray-800">
                        {patient.patientName}
                      </td>

                      <td className="p-4 text-gray-800">{patient.email}</td>

                      <td className="p-4 text-gray-800">{patient.age}</td>

                      <td className="p-4 text-gray-800">{patient.city}</td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(patient)}
                            className="rounded bg-blue-500 px-3 py-2 text-sm text-white"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handlePatch(patient.id)}
                            className="rounded bg-orange-500 px-3 py-2 text-sm text-white"
                          >
                            PATCH City
                          </button>

                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="rounded bg-red-500 px-3 py-2 text-sm text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
