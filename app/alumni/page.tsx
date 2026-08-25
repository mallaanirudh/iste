import AlumniCard from "../components/AlumniCard";
import { alumni } from "../../lib/data/alumni"

export default function AlumniPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">ISTE NITK Alumni</h1>

          <p className="mt-2 text-gray-600">
            Explore our alumni community and see where they are today.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {alumni.map((person) => (
            <AlumniCard
              key={`${person.name}-${person.graduationYear}-${person.linkedinId}`}
              alumni={person}
            />
          ))}
        </div>
      </div>
    </main>
  );
}