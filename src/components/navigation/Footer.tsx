'use client';

import Link from 'next/link';
import { 
  ShoppingBag, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Github,
  Heart
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  // const quickLinks = [
  //   { href: '/', label: 'Home' },
  //   { href: '/browse', label: 'Browse Items' },
  //   { href: '/categories', label: 'Categories' },
  //   { href: '/sell', label: 'Sell Item' },
  //   { href: '/about', label: 'About Us' },
  //   { href: '/contact', label: 'Contact' },
  // ];

  // const supportLinks = [
  //   { href: '/help', label: 'Help Center' },
  //   { href: '/faq', label: 'FAQ' },
  //   { href: '/safety', label: 'Safety Guidelines' },
  //   { href: '/shipping', label: 'Shipping Info' },
  //   { href: '/returns', label: 'Returns & Refunds' },
  //   { href: '/support', label: 'Customer Support' },
  // ];

  // const legalLinks = [
  //   { href: '/privacy', label: 'Privacy Policy' },
  //   { href: '/terms', label: 'Terms of Service' },
  //   { href: '/cookies', label: 'Cookie Policy' },
  //   { href: '/community-guidelines', label: 'Community Guidelines' },
  //   { href: '/seller-agreement', label: 'Seller Agreement' },
  // ];

  const socialLinks = [
    { href: 'https://facebook.com/studenthub', icon: Facebook, label: 'Facebook' },
    { href: 'https://twitter.com/studenthub', icon: Twitter, label: 'Twitter' },
    { href: 'https://instagram.com/studenthub', icon: Instagram, label: 'Instagram' },
    { href: 'https://linkedin.com/company/studenthub', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://github.com/studenthub', icon: Github, label: 'GitHub' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row justify-between space-y-8 lg:space-y-0 lg:space-x-8">
          {/* Company Info */}
          <div className="lg:flex-1 lg:max-w-md">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">StudentHub</span>
            </Link>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              Website hàng đầu dành cho sinh viên mua và bán các mặt hàng cũ chất lượng.
              Tìm kiếm sách, điện tử, nội thất, và nhiều hơn nữa trong cộng đồng sinh viên của bạn.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm break-all">support@studenthub.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm leading-relaxed">
                  470 Đ. Trần Đại Nghĩa, Hoà Hải, Ngũ Hành Sơn, Đà Nẵng 550000, Việt Nam
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:flex-1 lg:max-w-sm">
            <h3 className="text-white font-semibold mb-2">Liên lạc với chúng tôi</h3>
            <p className="text-gray-400 text-sm mb-4">
              Nếu bạn có bất kỳ câu hỏi hoặc ý tưởng nào, vui lòng liên hệ với chúng tôi.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-0"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm text-gray-400 text-center sm:text-left">
              <span>© {currentYear} StudentHub.</span>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center space-x-1">
                <span>Được làm bởi </span>
                <Heart className="h-3 w-3 text-red-500" />
                <span>cho sinh viên</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-sm text-gray-400">Theo dõi chúng tôi:</span>
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 