// src/components/home/HomeSkeleton.jsx
import { Skeleton } from "@/Components/ui/skeleton";

export default function HomeSkeleton() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center mt-10 space-y-4">
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-5 w-1/2 mx-auto" />
        <div className="flex justify-center space-x-3 mt-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3 text-center">
            <Skeleton className="h-12 w-12 mx-auto rounded-full" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        ))}
      </section>

      {/* Logo Strip */}
      <section className="flex flex-wrap justify-center items-center gap-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-md" />
        ))}
      </section>

      {/* Services */}
      <section>
        <div className="text-center space-y-2 mb-8">
          <Skeleton className="h-8 w-1/3 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3 p-4 border rounded-2xl shadow-sm">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section>
        <div className="text-center space-y-2 mb-8">
          <Skeleton className="h-8 w-1/3 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="text-center space-y-2 mb-8">
          <Skeleton className="h-8 w-1/3 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 border rounded-xl space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section>
        <div className="text-center space-y-2 mb-8">
          <Skeleton className="h-8 w-1/3 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 border rounded-xl space-y-3">
              <Skeleton className="h-6 w-1/2 mx-auto" />
              <Skeleton className="h-8 w-1/3 mx-auto" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
              <Skeleton className="h-10 w-32 mx-auto rounded-md" />
            </div>
          ))}
        </div>
      </section>

      {/* Invite / Call to Action */}
      <section className="text-center py-12 space-y-4">
        <Skeleton className="h-8 w-2/3 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <Skeleton className="h-10 w-36 mx-auto rounded-md" />
      </section>
    </div>
  );
}
