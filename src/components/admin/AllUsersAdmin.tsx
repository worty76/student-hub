/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth";
import { useAuthStore } from "@/store/authStore";
import { useAdminStore } from "@/store/adminStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  Users,
  Star,
  MapPin,
  Calendar,
  Mail,
  Loader,
  Grid3X3,
  List,
} from "lucide-react";
import { DeleteUserButton } from "./DeleteUserButton";

type ViewMode = "table" | "grid";

export function AllUsersAdmin() {
  const { token, user: currentUser } = useAuthStore();
  const { users, loading, error, fetchAllUsers, clearError } = useAdminStore();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Check authentication and authorization
  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (!currentUser || currentUser.role !== "admin") {
      router.push("/");
      return;
    }

    fetchAllUsers(token);
  }, [token, currentUser, router, fetchAllUsers]);

  const handleRefresh = () => {
    if (token) {
      clearError();
      fetchAllUsers(token);
    }
  };

  // Filter users based on search term
  const filteredUsers = Array.isArray(users)
    ? users.filter((user: User) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.location?.toLowerCase().includes(searchLower) ||
          user.role?.toLowerCase().includes(searchLower)
        );
      })
    : [];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "seller":
        return "bg-green-100 text-green-800 border-green-200";
      case "user":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tất cả người dùng
            </h1>
            <p className="text-gray-600 mt-1">Đang tải dữ liệu người dùng...</p>
          </div>
          <Button disabled variant="outline" size="sm">
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            Đang tải...
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tất cả người dùng
            </h1>
            <p className="text-gray-600 mt-1">Lỗi tải dữ liệu người dùng</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 text-red-600">
              <AlertTriangle className="h-8 w-8" />
              <div>
                <h3 className="text-lg font-semibold">Lỗi tải người dùng</h3>
                <p className="text-sm text-gray-600 mt-1">{error}</p>

                {error.includes("Unauthorized") && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Phiên đăng nhập có thể đã hết hạn. Vui lòng đăng nhập lại.
                    </p>
                  </div>
                )}

                {error.includes("Forbidden") && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      Bạn cần quyền admin để truy cập tính năng này.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tất cả người dùng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý và xem tất cả người dùng đã đăng ký ({users.length} tổng
            cộng)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-l-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm người dùng theo tên, email, địa điểm hoặc vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Display */}
      {viewMode === "table" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Đánh giá</TableHead>
                    <TableHead>Địa điểm</TableHead>
                    <TableHead>Ngày tham gia</TableHead>
                    <TableHead>Cập nhật cuối</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        {searchTerm
                          ? "Không tìm thấy người dùng phù hợp."
                          : "Không có người dùng nào."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-medium">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </div>
                              {user.bio && (
                                <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                                  {user.bio}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs ${getRoleBadgeColor(
                              user.role
                            )}`}
                            variant="secondary"
                          >
                            {user.role.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium">
                              {user.rating?.toFixed(1) || "0.0"}
                            </span>
                            <span className="text-gray-400 text-sm">
                              ({user.ratingCount || 0})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span>{user.location || "Chưa xác định"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(user.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">
                            {formatDate(user.updatedAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DeleteUserButton
                            user={user}
                            variant="icon"
                            size="sm"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">
                    {searchTerm
                      ? "Không tìm thấy người dùng phù hợp."
                      : "Không có người dùng nào."}
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <Card
                    key={user._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-4">
                        {/* User Avatar and Basic Info */}
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            {user.avatar ? (
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
                            <Badge
                              className={`text-xs ${getRoleBadgeColor(
                                user.role
                              )}`}
                              variant="secondary"
                            >
                              {user.role.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.location && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                          {user.bio && (
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {user.bio}
                            </p>
                          )}
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
                            <div className="flex items-center justify-center space-x-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium">
                                {formatDate(user.createdAt)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Tham gia
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <div className="text-xs text-gray-500">
                            {user.favorites?.length || 0} yêu thích
                          </div>
                          <DeleteUserButton
                            user={user}
                            variant="icon"
                            size="sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
