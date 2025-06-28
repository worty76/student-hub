'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  GraduationCap, 
  ShoppingBag, 
  Users, 
  Shield, 
  Heart,
  TrendingUp,
  MapPin,
  Star,
  Clock,
  MessageCircle,
  Target,
  Lightbulb,
  Award,
  Eye,
  Handshake,
  BookOpen,
  Coffee,
  Smile
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center space-x-3 mb-6">
              <MapPin className="h-6 w-6 text-blue-200" />
              <span className="text-blue-200 font-medium">Về Chúng Tôi</span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            >
              Kết Nối Sinh Viên
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                {" "}Đà Nẵng
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-8"
            >
              Chúng tôi tin rằng mỗi sinh viên đều xứng đáng có cơ hội tiếp cận những món đồ chất lượng 
              với giá phải chăng và tạo ra một cộng đồng tin cậy, gắn kết.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/products">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg cursor-pointer"
                >
                  Khám Phá Ngay
                </motion.button>
              </Link>
              <Link href="/auth/register">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 cursor-pointer"
                >
                  Tham Gia Cùng Chúng Tôi
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
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

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInLeft}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Câu Chuyện Của Chúng Tôi
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  Sinh ra từ trải nghiệm của những sinh viên tại Đà Nẵng, chúng tôi hiểu rõ những khó khăn 
                  mà các bạn phải đối mặt: ngân sách hạn hẹp, nhu cầu tìm kiếm đồ dùng chất lượng với giá phải chăng, 
                  và mong muốn có một không gian an toàn để giao dịch.
                </p>
                <p>
                  Năm 2023, một nhóm sinh viên từ các trường đại học hàng đầu tại Đà Nẵng đã quyết định tạo ra 
                  một nền tảng khác biệt - nơi sinh viên có thể tin tưởng, chia sẻ và hỗ trợ lẫn nhau trong việc 
                  mua bán đồ cũ.
                </p>
                <p>
                  Ngày hôm nay, chúng tôi tự hào là cầu nối tin cậy cho hàng nghìn sinh viên tại Đà Nẵng, 
                  giúp các bạn tiết kiệm chi phí và tạo ra những kết nối ý nghĩa trong cộng đồng.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeInRight}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold">5,200+</div>
                    <div className="text-blue-100 text-sm">Sinh Viên</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold">12+</div>
                    <div className="text-blue-100 text-sm">Trường ĐH</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold">2,500+</div>
                    <div className="text-blue-100 text-sm">Sản Phẩm</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-blue-100 text-sm">Hài Lòng</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
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
              Sứ Mệnh & Tầm Nhìn
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Chúng tôi cam kết xây dựng một cộng đồng bền vững và đáng tin cậy
            </motion.p>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div 
              variants={scaleIn}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ Mệnh</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Tạo ra một nền tảng mua bán đồ cũ an toàn, tiện lợi và đáng tin cậy, giúp sinh viên 
                Đà Nẵng tiết kiệm chi phí sinh hoạt và xây dựng một cộng đồng gắn kết, chia sẻ.
              </p>
            </motion.div>

            <motion.div 
              variants={scaleIn}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tầm Nhìn</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Trở thành nền tảng mua bán đồ cũ hàng đầu cho sinh viên tại Việt Nam, lan tỏa 
                tinh thần chia sẻ và phát triển bền vững trong cộng đồng giáo dục.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
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
              Giá Trị Cốt Lõi
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Những nguyên tắc dẫn dắt chúng tôi trong hành trình phục vụ cộng đồng sinh viên
            </motion.p>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: Shield,
                title: "An Toàn",
                description: "Bảo vệ thông tin và đảm bảo giao dịch an toàn cho mọi thành viên",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Handshake,
                title: "Tin Cậy",
                description: "Xây dựng lòng tin thông qua minh bạch và trách nhiệm",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Heart,
                title: "Chia Sẻ",
                description: "Khuyến khích tinh thần hỗ trợ và chia sẻ trong cộng đồng",
                color: "from-red-500 to-red-600"
              },
              {
                icon: Lightbulb,
                title: "Đổi Mới",
                description: "Không ngừng cải tiến để mang lại trải nghiệm tốt nhất",
                color: "from-yellow-500 to-yellow-600"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
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
              Tại Sao Chọn Chúng Tôi?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Những điểm khác biệt làm nên sức mạnh của nền tảng
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
                icon: MapPin,
                title: "Địa Phương Hóa",
                description: "Tập trung phục vụ riêng cho cộng đồng sinh viên Đà Nẵng với hiểu biết sâu sắc về nhu cầu địa phương",
                stats: "100% Đà Nẵng"
              },
              {
                icon: Clock,
                title: "Phản Hồi Nhanh",
                description: "Hệ thống hỗ trợ 24/7 và cộng đồng năng động với thời gian phản hồi trung bình dưới 2 giờ",
                stats: "< 2h phản hồi"
              },
              {
                icon: Star,
                title: "Chất Lượng Cao",
                description: "Hệ thống đánh giá minh bạch và nghiêm ngặt đảm bảo chất lượng sản phẩm và dịch vụ",
                stats: "4.8/5 sao"
              },
              {
                icon: TrendingUp,
                title: "Giá Cả Hợp Lý",
                description: "Cam kết mức giá sinh viên với nhiều chương trình ưu đãi và hỗ trợ cho các giao dịch",
                stats: "30% tiết kiệm"
              },
              {
                icon: MessageCircle,
                title: "Giao Tiếp Dễ Dàng",
                description: "Hệ thống chat tích hợp giúp kết nối nhanh chóng giữa người mua và người bán",
                stats: "Chat realtime"
              },
              {
                icon: Award,
                title: "Được Tin Tưởng",
                description: "Được các trường đại học và sinh viên công nhận là nền tảng uy tín và đáng tin cậy",
                stats: "12+ trường"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                  {feature.stats}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
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
              Đội Ngũ Của Chúng Tôi
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Những sinh viên đam mê công nghệ và mong muốn tạo ra sự thay đổi tích cực
            </motion.p>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Coffee,
                title: "Đội Ngũ Phát Triển",
                description: "Sinh viên CNTT từ các trường hàng đầu, chuyên về web development và mobile app"
              },
              {
                icon: Users,
                title: "Đội Ngũ Vận Hành",
                description: "Sinh viên kinh doanh và marketing, hiểu rõ nhu cầu của cộng đồng sinh viên"
              },
              {
                icon: Shield,
                title: "Đội Ngũ Bảo Mật",
                description: "Chuyên gia an ninh thông tin đảm bảo tính bảo mật cho mọi giao dịch"
              },
              {
                icon: Smile,
                title: "Đội Ngũ Hỗ Trợ",
                description: "Sinh viên tình nguyện từ khắp các trường, sẵn sàng hỗ trợ cộng đồng 24/7"
              }
            ].map((team, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-all duration-300">
                  <team.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{team.title}</h3>
                <p className="text-gray-600 leading-relaxed">{team.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center text-white"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Tác Động Cộng Đồng
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-blue-100 max-w-3xl mx-auto mb-12"
            >
              Những con số biết nói về sự thành công của chúng tôi trong việc phục vụ cộng đồng
            </motion.p>

            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { number: "₫2.1 tỷ", label: "Tổng Giá Trị Giao Dịch", icon: TrendingUp },
                { number: "15,000+", label: "Tin Nhắn Trao Đổi", icon: MessageCircle },
                { number: "850+", label: "Kết Nối Thành Công", icon: Handshake },
                { number: "95%", label: "Giao Dịch An Toàn", icon: Shield }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <stat.icon className="h-12 w-12 text-blue-200 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-blue-200">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container mx-auto px-4 text-center"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Sẵn Sàng Trở Thành Một Phần Của Câu Chuyện?
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Hãy tham gia cùng hàng nghìn sinh viên Đà Nẵng đã tin tưởng và lựa chọn chúng tôi. 
            Cùng nhau xây dựng một cộng đồng mua bán lành mạnh và phát triển bền vững.
          </motion.p>
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/auth/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg cursor-pointer"
              >
                Đăng Ký Ngay
              </motion.button>
            </Link>
            <Link href="/products">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer"
              >
                Khám Phá Sản Phẩm
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
} 