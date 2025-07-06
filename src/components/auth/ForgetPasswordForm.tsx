/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const forgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Vui lòng nhập địa chỉ email hợp lệ"),
});

type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

export function ForgetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    try {
      setIsLoading(true);

      const response = await authService.forgetPassword(data);

      setIsSuccess(true);

      toast.success("Thành công!", {
        description:
          "Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.",
      });
    } catch (error) {
      toast.error("Gửi yêu cầu thất bại", {
        description:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi không xác định.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-green-500/10">
        <CardHeader className="space-y-2 pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Email đã được gửi!
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Vui lòng kiểm tra hộp thư của bạn và nhấn vào liên kết để đặt lại
              mật khẩu.
            </p>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Lưu ý:</strong> Nếu không thấy email, hãy kiểm tra
                thư mục spam hoặc junk mail.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Link
              href="/auth/login"
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-orange-500/10">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Quên mật khẩu
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Nhập địa chỉ email để nhận liên kết đặt lại mật khẩu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="user@example.com"
                        className="pl-12 pr-4 py-3 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? "Đang gửi..." : "Gửi yêu cầu đặt lại"}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="flex items-center justify-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại đăng nhập
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
