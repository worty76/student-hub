'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
// import { BannerSlider } from './BannerSlider';
// import { FeaturedCategories } from './FeaturedCategories';
import { SuggestedListings } from './SuggestedListings';
import { CategoriesList } from './CategoriesList';
// import { bannerSlides } from '@/constants/marketplace-data';
import { 
  GraduationCap, 
  ShoppingBag, 
  Users, 
  Shield, 
  BookOpen, 
  Heart,
  TrendingUp,
  MapPin,
  Star,
  Clock,
  MessageCircle
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};



const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div 
              className="text-white space-y-8"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-blue-200" />
                <span className="text-blue-200 font-medium">Chuyên dành cho sinh viên Đà Nẵng</span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-bold leading-tight"
              >
                Kết Nối Sinh Viên
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  {" "}Đà Nẵng
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl md:text-2xl text-blue-100 leading-relaxed"
              >
                Nền tảng mua bán đồ cũ tin cậy dành riêng cho cộng đồng sinh viên các trường đại học tại Đà Nẵng. 
                Tìm kiếm, chia sẻ và trao đổi những món đồ yêu thích với giá sinh viên!
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/products">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg cursor-pointer w-full sm:w-auto"
                  >
                    <ShoppingBag className="inline h-5 w-5 mr-2" />
                    Khám Phá Ngay
                  </motion.button>
                </Link>
                <Link href="/auth/register">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 cursor-pointer w-full sm:w-auto"
                  >
                    <Users className="inline h-5 w-5 mr-2" />
                    Tham Gia Miễn Phí
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Hero Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/20 rounded-2xl p-4 text-center"
                  >
                    <GraduationCap className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">12+</div>
                    <div className="text-blue-200 text-sm">Trường ĐH</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/20 rounded-2xl p-4 text-center"
                  >
                    <Users className="h-8 w-8 text-green-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">5K+</div>
                    <div className="text-blue-200 text-sm">Sinh Viên</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/20 rounded-2xl p-4 text-center"
                  >
                    <ShoppingBag className="h-8 w-8 text-purple-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">2.5K+</div>
                    <div className="text-blue-200 text-sm">Sản Phẩm</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/20 rounded-2xl p-4 text-center"
                  >
                    <Heart className="h-8 w-8 text-red-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">98%</div>
                    <div className="text-blue-200 text-sm">Hài Lòng</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 right-20 opacity-20"
        >
          <BookOpen className="h-16 w-16 text-white" />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-20 left-20 opacity-20"
        >
          <GraduationCap className="h-20 w-20 text-white" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Tại Sao Chọn Chúng Tôi?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Nền tảng được thiết kế đặc biệt cho sinh viên với những tính năng an toàn và tiện lợi nhất
            </motion.p>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Shield,
                title: "An Toàn & Đáng Tin Cậy",
                description: "Xác thực sinh viên qua email trường, đảm bảo giao dịch trong cộng đồng học sinh sinh viên",
                color: "text-green-500",
                bgColor: "bg-green-50"
              },
              {
                icon: MapPin,
                title: "Hiện Diện Tại Đà Nẵng",
                description: "Giao dịch địa phương, gặp gỡ trực tiếp, tiết kiệm chi phí vận chuyển",
                color: "text-blue-500",
                bgColor: "bg-blue-50"
              },
              {
                icon: TrendingUp,
                title: "Giá Sinh Viên",
                description: "Mọi thứ đều ở mức giá phải chăng, phù hợp với túi tiền sinh viên",
                color: "text-purple-500",
                bgColor: "bg-purple-50"
              },
              {
                icon: MessageCircle,
                title: "Chat Trực Tiếp",
                description: "Trao đổi, thương lượng giá cả nhanh chóng qua hệ thống chat tích hợp",
                color: "text-orange-500",
                bgColor: "bg-orange-50"
              },
              {
                icon: Clock,
                title: "Phản Hồi Nhanh",
                description: "Cộng đồng năng động, phản hồi và giao dịch diễn ra trong ngày",
                color: "text-red-500",
                bgColor: "bg-red-50"
              },
              {
                icon: Star,
                title: "Đánh Giá Uy Tín",
                description: "Hệ thống đánh giá minh bạch giúp xây dựng lòng tin trong cộng đồng",
                color: "text-yellow-500",
                bgColor: "bg-yellow-50"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                className={`${feature.bgColor} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg`}
              >
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesList />

      {/* Banner Slider */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* <BannerSlider slides={bannerSlides} autoPlayInterval={6000} /> */}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Cách Thức Hoạt Động
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600"
            >
              Chỉ với 3 bước đơn giản để bắt đầu mua bán
            </motion.p>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                title: "Đăng Ký Tài Khoản",
                description: "Tạo tài khoản bằng email trường đại học để xác thực danh tính sinh viên",
                icon: Users
              },
              {
                step: "02",
                title: "Đăng Tin & Tìm Kiếm",
                description: "Đăng sản phẩm muốn bán hoặc tìm kiếm món đồ cần mua trong kho tàng phong phú",
                icon: ShoppingBag
              },
              {
                step: "03",
                title: "Kết Nối & Giao Dịch",
                description: "Chat trực tiếp với người mua/bán, thỏa thuận và gặp gỡ để hoàn tất giao dịch",
                icon: MessageCircle
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="relative mb-6"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:shadow-xl transition-all duration-300">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Suggested Listings */}
      <SuggestedListings />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="relative container mx-auto px-4 text-center"
        >
          <div className="max-w-4xl mx-auto text-white">
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Sẵn Sàng Tham Gia Cộng Đồng Sinh Viên Đà Nẵng?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl mb-8 text-blue-100"
            >
              Hàng ngàn sinh viên đã tin tưởng và tham gia. Hãy trở thành một phần của cộng đồng 
              mua bán đồ cũ lớn nhất dành cho sinh viên tại Đà Nẵng!
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/products/create">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg cursor-pointer"
                >
                  Đăng Tin Bán Ngay
                </motion.button>
              </Link>
              <Link href="/products">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 cursor-pointer"
                >
                  Khám Phá Sản Phẩm
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-t">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container mx-auto px-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "2,500+", label: "Sản Phẩm Hoạt Động", color: "text-blue-600" },
              { number: "5,200+", label: "Sinh Viên Tham Gia", color: "text-green-600" },
              { number: "1,850+", label: "Giao Dịch Thành Công", color: "text-purple-600" },
              { number: "12+", label: "Trường Đại Học", color: "text-orange-600" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className={`text-3xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
} 