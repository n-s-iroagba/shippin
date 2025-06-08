'use client';

import { 
  TruckIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  UsersIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const stats = [
    { label: 'Years of Experience', value: '15+', icon: ClockIcon },
    { label: 'Countries Served', value: '50+', icon: GlobeAltIcon },
    { label: 'Happy Customers', value: '10K+', icon: UsersIcon },
    { label: 'Successful Deliveries', value: '100K+', icon: TruckIcon },
  ];

  const services = [
    {
      title: 'International Shipping',
      description: 'Reliable delivery services to over 50 countries worldwide with real-time tracking.',
      icon: GlobeAltIcon,
    },
    {
      title: 'Express Delivery',
      description: 'Fast and secure express shipping for urgent packages and documents.',
      icon: ClockIcon,
    },
    {
      title: 'Freight Services',
      description: 'Comprehensive freight solutions for businesses of all sizes.',
      icon: TruckIcon,
    },
    {
      title: 'Secure Handling',
      description: 'Advanced security measures and insurance coverage for valuable items.',
      icon: ShieldCheckIcon,
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Chief Executive Officer',
      description: 'Leading GlobalShip with 20+ years of logistics experience.',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      description: 'Ensuring smooth operations across all shipping channels.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Relations Director',
      description: 'Dedicated to providing exceptional customer service experience.',
    },
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About GlobalShip
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Connecting the world through reliable, secure, and efficient shipping solutions
            </p>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <TruckIcon className="w-16 h-16 text-blue-200 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                    <Icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-blue-900 mb-2">{stat.value}</div>
                    <div className="text-sm text-blue-700">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-blue-100">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
                Our Story
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-lg leading-relaxed mb-6">
                  Founded in 2008, GlobalShip began as a small logistics company with a big vision: 
                  to make international shipping accessible, reliable, and transparent for everyone. 
                  What started as a local courier service has grown into a global network spanning 
                  over 50 countries.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Our journey has been driven by innovation and customer-centricity. We were among 
                  the first to introduce real-time package tracking, automated customs clearance, 
                  and AI-powered route optimization. Today, we handle over 100,000 successful 
                  deliveries annually while maintaining our commitment to excellence.
                </p>
                <p className="text-lg leading-relaxed">
                  At GlobalShip, we believe that distance should never be a barrier to connection. 
                  Whether you're sending a gift to family abroad, shipping products to customers 
                  worldwide, or managing complex supply chains, we're here to bridge the gap with 
                  reliable, secure, and efficient shipping solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12 text-center">
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div key={index} className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                    <div className="bg-blue-100 p-4 rounded-full w-fit mb-6">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12 text-center">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 text-center">
                  <div className="bg-blue-100 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <UsersIcon className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-700">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Get in Touch
            </h2>
            <p className="text-xl text-blue-200 mb-12">
              Ready to ship with us? Our team is here to help you every step of the way.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full mb-4">
                  <PhoneIcon className="w-8 h-8 text-blue-200" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                <p className="text-blue-200">+1 (555) 123-4567</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full mb-4">
                  <EnvelopeIcon className="w-8 h-8 text-blue-200" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                <p className="text-blue-200">support@globalship.com</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full mb-4">
                  <MapPinIcon className="w-8 h-8 text-blue-200" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                <p className="text-blue-200">123 Shipping St, Logistics City</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}