"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UserX, Star, Calendar, Mail } from "lucide-react";
import { User, UserRole } from "@/types/auth";
import { DeleteUserButton } from "./DeleteUserButton";

interface AdminUser extends User {
  status?: "active" | "suspended" | "banned";
  lastLogin?: string;
  reportsCount?: number;
}

interface UserGridProps {
  users: AdminUser[];
  onUserAction: (
    userId: string,
    action: "suspend" | "activate" | "ban" | "promote"
  ) => void;
}

export function UserGrid({ users, onUserAction }: UserGridProps) {
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "seller":
        return "bg-green-100 text-green-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không có người dùng nào.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <Card key={user._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              {/* User Avatar and Basic Info */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-medium text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={`text-xs ${getRoleBadgeColor(user.role)}`}
                      variant="secondary"
                    >
                      {user.role === "admin"
                        ? "Quản trị viên"
                        : user.role === "user"
                        ? "Người dùng"
                        : user.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{user.email}</span>
                </div>
                {/* {user.location && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{user.location}</span>
                  </div>
                )} */}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">
                      {user.rating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {user.ratingCount || 0} đánh giá
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mt-1">Tham gia vào</div>
                  <div className="flex items-center justify-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reports Count */}
              {user.reportsCount && user.reportsCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-red-800">
                    {user.reportsCount} Báo cáo
                  </div>
                  <div className="text-xs text-red-600">Cần chú ý</div>
                </div>
              )}

              {/* Last Login */}
              {user.lastLogin && (
                <div className="text-xs text-gray-500">
                  Lần cuối đăng nhập: {formatDate(user.lastLogin)}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                <div className="flex gap-2 flex-1">
                  {user.status === "active" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <UserX className="h-4 w-4 mr-1" />
                          Tạm khóa
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Tạm khóa người dùng
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn tạm khóa {user.name}? Họ sẽ
                            không thể truy cập tài khoản của mình.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onUserAction(user._id, "suspend")}
                          >
                            Tạm khóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>

                {/* Delete Button */}
                <DeleteUserButton user={user} variant="icon" size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
