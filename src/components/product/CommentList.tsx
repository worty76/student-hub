'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MessageCircle, Clock, Reply, ChevronDown, ChevronUp, Edit } from 'lucide-react';
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
        <div className="ml-12 mt-2">
          <EditCommentForm
            comment={reply}
            onCancel={() => handleEditCancel(reply._id)}
          />
        </div>
      );
    }
    
    return (
      <div className="group flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 ml-12 mt-2">
        <div className="flex-shrink-0">
          {(() => {
            const avatarUrl = processAvatarUrl(reply.userInfo?.avatar || currentUser?.avatar);
            return avatarUrl && !imageError ? (
              <Image
                src={avatarUrl}
                alt={reply.userInfo?.name || 'User avatar'}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover border border-gray-300"
                onError={(e) => {
                  console.error('Reply avatar image failed to load:', avatarUrl, 'Error:', e);
                  setImageError(true);
                }}
                onLoad={() => {}}
              />
            ) : (
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                {reply.userInfo?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            );
          })()}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h5 className="text-xs font-semibold text-gray-800 truncate">
                {reply.userInfo?.name || 'Người dùng ẩn danh'}
              </h5>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="h-2.5 w-2.5" />
                <span>{formatDateDisplay(reply.createdAt)}</span>
                {reply.updatedAt !== reply.createdAt && (
                  <span className="text-gray-400">(đã sửa)</span>
                )}
              </div>
            </div>
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => handleEditClick(reply._id)}
                title="Chỉnh sửa trả lời"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap break-words mb-2">
            {reply.content}
          </div>
          
          {/* Reply Actions */}
          <div className="flex items-center space-x-2">
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
      <div className="border-b border-gray-100 last:border-b-0">
        <div className="group flex items-start space-x-3 p-4">
          <div className="flex-shrink-0">
            {(() => {
              const avatarUrl = processAvatarUrl(comment.userInfo?.avatar || currentUser?.avatar);
              return avatarUrl && !imageError ? (
                <Image
                  src={avatarUrl}
                  alt={comment.userInfo?.name || 'User avatar'}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    console.error('Avatar image failed to load:', avatarUrl, 'Error:', e);
                    setImageError(true);
                  }}
                  onLoad={() => {}}
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {comment.userInfo?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              );
            })()}
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {comment.userInfo?.name || 'Người dùng ẩn danh'}
                </h4>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatDateDisplay(comment.createdAt)}</span>
                  {comment.updatedAt !== comment.createdAt && (
                    <span className="text-gray-400">(đã sửa)</span>
                  )}
                </div>
              </div>
              {canEdit && !isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => handleEditClick(comment._id)}
                  title="Chỉnh sửa bình luận"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <EditCommentForm
                comment={comment}
                onCancel={() => handleEditCancel(comment._id)}
                className="mb-2"
              />
            ) : (
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words mb-2">
                {comment.content}
              </div>
            )}
            
            {!isEditing && (
              <>
                {/* Comment Actions */}
                <div className="flex items-center space-x-4 text-xs">
                  <LikeButton comment={comment} size="md" />
                  
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-gray-500 hover:text-blue-600"
                      onClick={() => handleReplyClick(comment._id)}
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Trả lời
                    </Button>
                  )}
                  
                  {hasReplies && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-gray-500 hover:text-gray-700"
                      onClick={() => toggleReplies(comment._id)}
                    >
                      {isRepliesCollapsed ? (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
                          Hiện {comment.replies?.length} trả lời
                        </>
                      ) : (
                        <>
                          <ChevronUp className="h-3 w-3 mr-1" />
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
          <ReplyForm
            parentCommentId={comment._id}
            onCancel={() => setActiveReplyForm(null)}
          />
        )}

        {/* Replies */}
        {hasReplies && !isRepliesCollapsed && !isEditing && (
          <div className="space-y-2 pb-2">
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
      <Card className="border-red-200">
        <CardContent className="p-4">
          <div className="text-center text-red-600">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalReplies = comments.reduce((total, comment) => total + (comment.replies?.length || 0), 0);

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            <span>Bình luận</span>
            <Badge variant="secondary" className="text-xs">
              {comments.length} bình luận
            </Badge>
            {totalReplies > 0 && (
              <Badge variant="outline" className="text-xs">
                {totalReplies} trả lời
              </Badge>
            )}
            <ConnectionStatus 
              isRealTime={connectionStatus === 'realtime'} 
              isPolling={connectionStatus === 'polling'} 
            />
          </div>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && comments.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Đang tải bình luận...</p>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 text-sm">Chưa có bình luận nào</p>
            <p className="text-gray-400 text-xs mt-1">Hãy là người đầu tiên bình luận!</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 