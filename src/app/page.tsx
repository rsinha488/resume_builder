'use client';
import Link from 'next/link';
import { FaRocket, FaMagic, FaDownload } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Build a Professional Resume in Minutes
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Create a stunning resume that gets you hired. Our easy-to-use builder helps you stand out from the crowd with professional templates and expert tips.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-md bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all"
              >
                Get Started for Free
              </Link>
              <Link href="/login" className="text-lg font-semibold leading-6 text-gray-900">
                Sign In <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Build Faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to build a great resume
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <FaMagic className="text-white" />
                  </div>
                  Easy to Use
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Our intuitive interface makes resume building a breeze. Just fill in your details and watch your resume come to life.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <FaRocket className="text-white" />
                  </div>
                  Professional Templates
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Choose from a variety of modern, recruiter-approved templates designed to showcase your skills.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <FaDownload className="text-white" />
                  </div>
                  Instant Download
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Download your resume in high-quality PDF format instantly and start applying to your dream jobs.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
