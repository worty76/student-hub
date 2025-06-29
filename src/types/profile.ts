import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không được vượt quá 100 ký tự')
    .trim(),
  email: z
    .string()
    .email('Vui lòng nhập địa chỉ email hợp lệ')
    .min(1, 'Email là bắt buộc'),
  bio: z
    .string()
    .max(500, 'Giới thiệu không được vượt quá 500 ký tự'),
  avatar: z
    .union([
      z.string(),
      z.instanceof(File)
    ])
    .refine((val) => {
      if (typeof val === 'string') {
        return val === '' || z.string().url().safeParse(val).success;
      }
      return val instanceof File && val.type.startsWith('image/');
    }, {
      message: 'Vui lòng chọn file ảnh hợp lệ hoặc nhập URL hợp lệ',
    }),
  location: z
    .string()
    .max(100, 'Địa chỉ không được vượt quá 100 ký tự'),
  role: z.enum(['user', 'admin'], {
    required_error: 'Vui lòng chọn vai trò',
  }),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>; 