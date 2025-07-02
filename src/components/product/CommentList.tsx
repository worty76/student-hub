'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MessageCircle, Clock, Reply, ChevronDown, ChevronUp, Edit, Users } from 'lucide-react';
import { CommentWithUserInfo } from '@/types/comment';
import { useCommentStore } from '@/store/commentStore';
import ConnectionStatus from './ConnectionStatus';
import ReplyForm from './ReplyForm';
import LikeButton from './LikeButton';
import EditCommentForm from './EditCommentForm';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuthStore } from '@/store/authStore';
import { DeleteCommentButton } from './DeleteCommentButton';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

interface CommentListProps {
  productId: string;
}

const isValidAvatarUrl = (url: string | undefined): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
  }
};

const processAvatarUrl = (url: string | undefined): string | undefined => {
  if (!url || !isValidAvatarUrl(url)) return undefined;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (url.startsWith('/')) {
    return url;
  }
  
  return url;
};

export default function CommentList({ }: CommentListProps) {
  const { comments, isLoading, error, connectionStatus, editingComments, setEditingComment } = useCommentStore();
  const { isAuthenticated, user } = useAuthStore();
  const [activeReplyForm, setActiveReplyForm] = useState<string | null>(null);
  const [collapsedReplies, setCollapsedReplies] = useState<Set<string>>(new Set());

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Vừa xong';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} giờ trước`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ngày trước`;
    } else {
      return formatDate.dateTime(dateString);
    }
  };

  const toggleReplies = (commentId: string) => {
    const newCollapsed = new Set(collapsedReplies);
    if (newCollapsed.has(commentId)) {
      newCollapsed.delete(commentId);
    } else {
      newCollapsed.add(commentId);
    }
    setCollapsedReplies(newCollapsed);
  };

  const handleReplyClick = (commentId: string) => {
    if (activeReplyForm === commentId) {
      setActiveReplyForm(null);
    } else {
      setActiveReplyForm(commentId);
    }
  };

  const handleEditClick = (commentId: string) => {
    setEditingComment(commentId, true);
    // Close any open reply forms when starting to edit
    setActiveReplyForm(null);
  };

  const handleEditCancel = (commentId: string) => {
    setEditingComment(commentId, false);
  };

  const canEditComment = (comment: CommentWithUserInfo): boolean => {
    if (!isAuthenticated || !user) return false;
    
    const userId = user._id || (user as {id?: string})?.id || (user as {userId?: string})?.userId;
    const commentUserId = comment.userInfo?._id || comment.user;
    
    return userId === commentUserId;
  };

  const ReplyItem = ({ reply }: { reply: CommentWithUserInfo }) => {
    const [imageError, setImageError] = React.useState(false);
    const { user } = useAuthStore();
    const { displayUser } = useUserProfile();

    const currentUser = displayUser || user;
    const isEditing = editingComments.has(reply._id);
    const canEdit = canEditComment(reply);
    
    if (isEditing) {
      return (
        <div className="ml-14 mt-3">
          <EditCommentForm
            comment={reply}
            onCancel={() => handleEditCancel(reply._id)}
          />
        </div>
      );
    }
    
    return (
      <div className="group flex items-start space-x-3 p-4 bg-gradient-to-r from-slate-50/50 to-blue-50/30 rounded-xl border border-slate-200/60 ml-14 mt-3 hover:shadow-md hover:border-blue-200/60 transition-all duration-200">
        <div className="flex-shrink-0">
          {(() => {
            const avatarUrl = processAvatarUrl(reply.userInfo?.avatar || currentUser?.avatar);
            return avatarUrl && !imageError ? (
              <div className="relative">
                <Image
                  src={avatarUrl}
                  alt={reply.userInfo?.name || 'User avatar'}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
                  onError={(e) => {
                    console.error('Reply avatar image failed to load:', avatarUrl, 'Error:', e);
                    setImageError(true);
                  }}
                  onLoad={() => {}}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border border-white"></div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ring-1 ring-slate-200">
                  {reply.userInfo?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border border-white"></div>
              </div>
            );
          })()}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h5 className="text-sm font-semibold text-slate-800 truncate">
                {reply.userInfo?.name || 'Người dùng ẩn danh'}
              </h5>
              <div className="flex items-center space-x-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                <span>{formatDateDisplay(reply.createdAt)}</span>
                {reply.updatedAt !== reply.createdAt && (
                  <span className="text-amber-600 font-medium">(đã sửa)</span>
                )}
              </div>
            </div>
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full"
                onClick={() => handleEditClick(reply._id)}
                title="Chỉnh sửa trả lời"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words mb-3 bg-white/70 p-3 rounded-lg border border-slate-100">
            {reply.content}
          </div>
          
          {/* Reply Actions */}
          <div className="flex items-center space-x-3">
            <LikeButton comment={reply} size="sm" />
            <DeleteCommentButton
              commentId={reply._id}
              userId={reply.userInfo?._id || reply.user}
              size="sm"
            />
          </div>
        </div>
      </div>
    );
  };

  const CommentItem = ({ comment }: { comment: CommentWithUserInfo }) => {
    const [imageError, setImageError] = React.useState(false);
    const { user } = useAuthStore();
    const { displayUser } = useUserProfile();

    const currentUser = displayUser || user;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isRepliesCollapsed = collapsedReplies.has(comment._id);
    const showReplyForm = activeReplyForm === comment._id;
    const isEditing = editingComments.has(comment._id);
    const canEdit = canEditComment(comment);
    
    return (
      <div className="border-b border-slate-200/60 last:border-b-0 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-blue-50/20 transition-all duration-200">
        <div className="group flex items-start space-x-4 p-6">
          <div className="flex-shrink-0">
            {(() => {
              const avatarUrl = processAvatarUrl(comment.userInfo?.avatar || currentUser?.avatar);
              return avatarUrl && !imageError ? (
                <div className="relative">
                  <Image
                    src={avatarUrl}
                    alt={comment.userInfo?.name || 'User avatar'}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-slate-200"
                    onError={(e) => {
                      console.error('Avatar image failed to load:', avatarUrl, 'Error:', e);
                      setImageError(true);
                    }}
                    onLoad={() => {}}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-slate-200">
                    {comment.userInfo?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
                </div>
              );
            })()}
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <h4 className="text-base font-semibold text-slate-900 truncate">
                  {comment.userInfo?.name || 'Người dùng ẩn danh'}
                </h4>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDateDisplay(comment.createdAt)}</span>
                  {comment.updatedAt !== comment.createdAt && (
                    <span className="text-amber-600 font-medium">(đã sửa)</span>
                  )}
                </div>
              </div>
              {canEdit && !isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full"
                  onClick={() => handleEditClick(comment._id)}
                  title="Chỉnh sửa bình luận"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <EditCommentForm
                comment={comment}
                onCancel={() => handleEditCancel(comment._id)}
                className="mb-3"
              />
            ) : (
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words mb-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {comment.content}
              </div>
            )}
            
            {!isEditing && (
              <>
                {/* Comment Actions */}
                <div className="flex items-center space-x-6 text-sm">
                  <LikeButton comment={comment} size="md" />
                  
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 rounded-full"
                      onClick={() => handleReplyClick(comment._id)}
                    >
                      <Reply className="h-3.5 w-3.5 mr-2" />
                      Trả lời
                    </Button>
                  )}
                  
                  {hasReplies && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-200 rounded-full"
                      onClick={() => toggleReplies(comment._id)}
                    >
                      {isRepliesCollapsed ? (
                        <>
                          <ChevronDown className="h-3.5 w-3.5 mr-2" />
                          Hiện {comment.replies?.length} trả lời
                        </>
                      ) : (
                        <>
                          <ChevronUp className="h-3.5 w-3.5 mr-2" />
                          Ẩn trả lời
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && !isEditing && (
          <div className="px-6 pb-4">
            <ReplyForm
              parentCommentId={comment._id}
              onCancel={() => setActiveReplyForm(null)}
            />
          </div>
        )}

        {/* Replies */}
        {hasReplies && !isRepliesCollapsed && !isEditing && (
          <div className="space-y-2 pb-4">
            {comment.replies?.map((reply) => (
              <ReplyItem key={reply._id} reply={reply} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <Card className="border border-red-200 bg-gradient-to-br from-red-50 to-rose-50 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Lỗi tải bình luận</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalReplies = comments.reduce((total, comment) => total + (comment.replies?.length || 0), 0);

  return (
    <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4 bg-gradient-to-r from-slate-50/50 to-blue-50/30 border-b border-slate-200/60">
        <CardTitle className="text-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-slate-800 font-bold">Bình luận</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-3 py-1">
                <Users className="h-3 w-3 mr-1" />
                {comments.length}
              </Badge>
              {totalReplies > 0 && (
                <Badge variant="outline" className="border-slate-300 text-slate-600 bg-white/80 font-medium px-3 py-1">
                  <Reply className="h-3 w-3 mr-1" />
                  {totalReplies}
                </Badge>
              )}
            </div>
            <ConnectionStatus 
              isRealTime={connectionStatus === 'realtime'} 
              isPolling={connectionStatus === 'polling'} 
            />
          </div>
          {isLoading && (
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && comments.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Đang tải bình luận</h3>
              <p className="text-slate-500">Vui lòng chờ trong giây lát...</p>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-slate-50/50 to-blue-50/30">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full mb-6">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Chưa có bình luận nào</h3>
            <p className="text-slate-500 mb-1">Hãy là người đầu tiên chia sẻ ý kiến của bạn!</p>
            <p className="text-slate-400 text-sm">Bình luận của bạn sẽ giúp người khác hiểu rõ hơn về sản phẩm này.</p>
          </div>
        ) : (
          <div className="max-h-[32rem] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 