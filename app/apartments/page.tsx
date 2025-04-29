import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative bg-gray-50 flex flex-col items-center justify-center text-center py-16 px-4"
        aria-label="Hero Section"
      >
        <div className="absolute inset-0">
          <Image
            src="/hero-apartment.png"
            alt="A vibrant and inviting image of a modern apartment building with lush greenery and a clear blue sky"
            layout="fill"
            objectFit="cover"
            quality={80}
            className="opacity-70"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-30" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Find Your Perfect Apartment
          </h1>
          <p className="text-lg sm:text-xl text-gray-100 mb-8">
            Discover the best apartments in your area with ease.
          </p>
          <Link href="/search">
            <Button
              className="inline-block bg-teal-400 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-500 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50"
              aria-label="Get Started"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Grid Section */}
      <section className="bg-white py-16 px-4" aria-label="Features">
        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Verified Listings Card */}
          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              <Image
                src="/icon-verified.png"
                alt="Icon representing verified listings with a checkmark over a stylized apartment building"
                width={64}
                height={64}
              />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">
              Verified Listings
            </h3>
            <p className="text-gray-700 text-center">
              All apartments are verified and updated daily.
            </p>
          </div>

          {/* Expert Guidance Card */}
          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              <Image
                src="/icon-expert.png"
                alt="Icon symbolizing expert guidance with a silhouette holding a magnifying glass over a map"
                width={64}
                height={64}
              />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">
              Expert Guidance
            </h3>
            <p className="text-gray-700 text-center">
              Our experts help you choose the best option.
            </p>
          </div>

          {/* Easy Booking Card */}
          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              <Image
                src="/icon-booking.png"
                alt="Icon illustrating easy booking with a calendar and a clicking hand cursor"
                width={64}
                height={64}
              />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">
              Easy Booking
            </h3>
            <p className="text-gray-700 text-center">
              Book a tour with a single click.
            </p>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section
        className="bg-gray-50 py-16 px-4"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="how-it-works-heading" className="text-3xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-gray-700 text-lg">
            Our platform uses advanced algorithms to match you with the perfect
            apartment based on your preferences and lifestyle.
          </p>
        </div>
      </section>

      {/* Picture Section */}
      <section className="bg-white py-16 px-4" aria-label="Apartment Interior">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="relative w-full h-96 rounded-lg overflow-hidden shadow">
            <Image
              src="/interior-apartment.png"
              alt="A cozy and modern apartment interior showcasing a comfortable living room with stylish furniture and decor"
              layout="fill"
              objectFit="cover"
              quality={80}
            />
          </div>
          <p className="mt-4 text-gray-700 text-center text-lg">
            Modern apartment interiors designed for comfort.
          </p>
        </div>
      </section>
    </main>
  );
}
