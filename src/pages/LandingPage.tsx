import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Sun,
  Moon,
} from "lucide-react";
import { VideoTestimonial } from "@/components/VideoTestimonial";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";

export default function LandingPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [showTestimonialVideo, setShowTestimonialVideo] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Lock scroll if any modal is open
  useEffect(() => {
    document.body.style.overflow =
      showIntroVideo || showTestimonialVideo ? "hidden" : "auto";
  }, [showIntroVideo, showTestimonialVideo]);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content:
        "EduLearn has completely transformed my learning experience. The interactive courses and supportive community made complex topics easy to understand.",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Engineer",
      content:
        "As someone who needs to constantly update my skills, EduLearn's courses have been invaluable. The platform is intuitive and the content is always up-to-date.",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      rating: 5,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Data Science Professional",
      content:
        "The quality of courses on EduLearn is exceptional. I've taken several data science courses, and each one has directly contributed to my career growth.",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      rating: 4,
    },
  ];

  const features = [
    {
      id: 1,
      title: "Expert-Led Courses",
      description:
        "Learn from industry experts and renowned academics through our carefully curated courses.",
      icon: "BookOpen",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Interactive Learning",
      description:
        "Engage with dynamic content, quizzes, and hands-on projects that reinforce concepts.",
      icon: "LayoutGrid",
      color: "bg-indigo-500",
    },
    {
      id: 3,
      title: "Personalized Path",
      description:
        "Follow a learning journey tailored to your goals, pace, and preferred learning style.",
      icon: "Route",
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Community Support",
      description:
        "Join a global community of learners and educators who support each other's growth.",
      icon: "Users",
      color: "bg-pink-500",
    },
    {
      id: 5,
      title: "Recognized Credentials",
      description:
        "Earn certificates and badges that are recognized and valued by employers.",
      icon: "Award",
      color: "bg-orange-500",
    },
    {
      id: 6,
      title: "Anytime, Anywhere",
      description:
        "Access your courses from any device, at any time, with our mobile-friendly platform.",
      icon: "Globe",
      color: "bg-green-500",
    },
  ];

  return (
    <div className={`flex flex-col min-h-screen w-full ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b sticky top-0 z-10 w-full">
        <div className="w-full mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-3 rounded-md shadow-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              EduLearn Platform
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Dark/Light toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <Sun className="h-6 w-6 text-yellow-500" />
              ) : (
                <Moon className="h-6 w-6 text-gray-900" />
              )}
            </button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-md px-6 py-2 shadow-sm"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-2.5 shadow-lg"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-28 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center dark:bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-indigo-900/70 to-purple-900/70"></div>
        <div className="relative w-full mx-auto px-8 flex flex-col md:flex-row items-center text-center md:text-left">
          <div className="md:w-1/2 mb-12 md:mb-0 z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white leading-tight drop-shadow-2xl">
              Unlock Your Learning Potential
            </h1>
            <p className="text-2xl mb-10 text-blue-100 drop-shadow-md">
              Join thousands of students worldwide on a journey of discovery,
              growth, and achievement with our interactive platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-10 py-3 shadow-lg"
                onClick={() => navigate("/signup")}
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-10 py-3 shadow-lg"
                onClick={() => navigate("/dashboard")}
              >
                Explore Courses <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 justify-center md:justify-start">
              {["Expert Teachers", "Quality Content", "Lifetime Access"].map(
                (text) => (
                  <div key={text} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-lg text-white drop-shadow-sm">
                      {text}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="md:w-1/2 relative z-10">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Student learning online"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6">
                  <Button
                    variant="outline"
                    className="bg-white/30 backdrop-blur-sm border border-white/30 text-white hover:bg-white/40 shadow-lg"
                    onClick={() => setShowIntroVideo(true)}
                  >
                    Watch Introduction Video
                  </Button>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white dark:bg-gray-700 rounded-xl p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {testimonials.map(({ avatar, id }) => (
                    <img
                      key={id}
                      className="h-10 w-10 rounded-full ring-2 ring-white"
                      src={avatar}
                      alt=""
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Join 10,000+ learners
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Video Modal */}
      {showIntroVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe
              width="100%"
              height="100%"
              className="rounded-xl shadow-lg"
              src="https://www.youtube.com/embed/TlQhI-73rLA?autoplay=1"
              title="Introduction Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={() => setShowIntroVideo(false)}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80"
              aria-label="Close video"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-28 bg-white dark:bg-gray-900 text-center relative">
        {/* Decorative background image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="w-full mx-auto px-8 relative z-10">
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Our Mission: Empower Through Knowledge
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300">
              At EduLearn, education is not just a journey, but a transformation.
              Learn, grow, and excel with us.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonial Section */}
      <section className="py-28 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 text-center">
        <div className="w-full mx-auto px-8">
          <div className="max-w-3xl mx-auto mb-14">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              See Our Impact
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300">
              Hear directly from students whose lives were transformed by EduLearn.
            </p>
          </div>
          {/* Wrap VideoTestimonial with clickable container */}
          <div
            onClick={() => setShowTestimonialVideo(true)}
            className="cursor-pointer inline-block"
          >
            <VideoTestimonial />
          </div>
          {/* Alternatively, provide a dedicated button */}
          <div className="mt-8">
            <Button
              variant="outline"
              className="bg-white/30 backdrop-blur-sm border border-white/30 text-white hover:bg-white/40 shadow-lg"
              onClick={() => setShowTestimonialVideo(true)}
            >
              Watch Testimonial Video
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial Cards Section */}
      <section className="py-28 bg-white dark:bg-gray-900 text-center">
        <div className="w-full mx-auto px-8">
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              What Our Students Say
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300">
              Thousands of students have transformed their lives with our platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Video Modal */}
      {showTestimonialVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe
              width="100%"
              height="100%"
              className="rounded-xl shadow-lg"
              src="https://www.youtube.com/embed/N8kDyrKsNac?autoplay=1"
              title="Testimonial Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={() => setShowTestimonialVideo(false)}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80"
              aria-label="Close video"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-28 bg-blue-600 text-center relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="w-full mx-auto px-8 relative z-10">
          <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-lg">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-2xl mb-10 text-blue-100 max-w-2xl mx-auto drop-shadow-sm">
            Join thousands of students already advancing their careers and unlocking new opportunities with EduLearn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-3 shadow-lg"
              onClick={() => navigate("/signup")}
            >
              Sign Up Now
            </Button>
            <Button
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-3 shadow-lg"
              onClick={() => navigate("/dashboard")}
            >
              Explore Courses <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="w-full mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 text-white p-3 rounded-md shadow-lg">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">EduLearn</h3>
              </div>
              <p className="text-gray-400 text-lg">
                Transforming lives through accessible and engaging education for everyone.
              </p>
            </div>
            {[
              {
                title: "Platform",
                items: ["Courses", "Pricing", "For Business", "For Universities"],
              },
              {
                title: "Resources",
                items: ["Blog", "Tutorials", "Documentation", "Podcast"],
              },
              {
                title: "Company",
                items: ["About Us", "Careers", "Contact", "Press"],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="text-xl font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-gray-400 text-lg">
                  {section.items.map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 EduLearn Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((link) => (
                <a key={link} href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
