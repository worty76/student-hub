import { create } from 'zustand';
import { CommentStore, Comment, CommentWithUserInfo } from '@/types/comment';
import { CommentService } from '@/services/comment.service';
import { UserInfoService } from '@/services/user-info.service';
import { useAuthStore } from './authStore';
import { toast } from 'sonner';

export const useCommentStore = create<CommentStore>()((set, get) => ({
  // State
  comments: [],
  isLoading: false,
  error: null,
  isSubmitting: false,
  replySubmissions: {},
  likeSubmissions: {},
  editSubmissions: {},
  deleteSubmissions: {},
  editingComments: new Set(),
  connectionStatus: 'disconnected' as 'realtime' | 'polling' | 'disconnected',

  // Actions
  addComment: (comment: CommentWithUserInfo) => {
    set((state) => ({
      comments: [comment, ...state.comments], // Add new comment at the top
    }));
  },

  addReply: (parentCommentId: string, reply: CommentWithUserInfo) => {
    set((state) => ({
      comments: state.comments.map(comment => {
        if (comment._id === parentCommentId) {
          const existingReplies = comment.replies || [];
          // Check if reply already exists to prevent duplicates
          const replyExists = existingReplies.some(r => r._id === reply._id);
          if (!replyExists) {
            return {
              ...comment,
              replies: [...existingReplies, reply].sort((a, b) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              )
            };
          }
        }
        return comment;
      })
    }));
  },

  updateComment: (commentId: string, updatedComment: Comment) => {
    set((state) => {
      const updateCommentInArray = (comments: CommentWithUserInfo[]): CommentWithUserInfo[] => {
        return comments.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              content: updatedComment.content,
              updatedAt: updatedComment.updatedAt
            };
          }
          if (comment.replies?.length) {
            return {
              ...comment,
              replies: updateCommentInArray(comment.replies)
            };
          }
          return comment;
        });
      };

      return {
        comments: updateCommentInArray(state.comments)
      };
    });
  },

  removeComment: (commentId: string) => {
    set((state) => {
      const removeCommentFromArray = (comments: CommentWithUserInfo[]): CommentWithUserInfo[] => {
        return comments.filter(comment => {
          if (comment._id === commentId) {
            return false; // Remove this comment
          }
          if (comment.replies?.length) {
            // Remove from replies and keep the parent comment
            comment.replies = removeCommentFromArray(comment.replies);
          }
          return true;
        });
      };

      return {
        comments: removeCommentFromArray(state.comments)
      };
    });
  },

  updateCommentLike: (commentId: string, isLiked: boolean, likeCount: number, userId: string) => {
    set((state) => {
      const updateLikeInArray = (comments: CommentWithUserInfo[]): CommentWithUserInfo[] => {
        return comments.map(comment => {
          if (comment._id === commentId) {
            const updatedLikes = isLiked 
              ? [...(comment.likes || []), userId]
              : (comment.likes || []).filter(id => id !== userId);
            
            return {
              ...comment,
              likes: updatedLikes,
              likeCount: likeCount
            };
          }
          if (comment.replies?.length) {
            return {
              ...comment,
              replies: updateLikeInArray(comment.replies)
            };
          }
          return comment;
        });
      };

      return {
        comments: updateLikeInArray(state.comments)
      };
    });
  },

  setComments: (comments: CommentWithUserInfo[]) => {
    set({ comments: comments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )});
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setSubmitting: (submitting: boolean) => {
    set({ isSubmitting: submitting });
  },

  setReplySubmitting: (commentId: string, submitting: boolean) => {
    set((state) => ({
      replySubmissions: {
        ...state.replySubmissions,
        [commentId]: submitting
      }
    }));
  },

  setLikeSubmitting: (commentId: string, submitting: boolean) => {
    set((state) => ({
      likeSubmissions: {
        ...state.likeSubmissions,
        [commentId]: submitting
      }
    }));
  },

  setEditSubmitting: (commentId: string, submitting: boolean) => {
    set((state) => ({
      editSubmissions: {
        ...state.editSubmissions,
        [commentId]: submitting
      }
    }));
  },

  setDeleteSubmitting: (commentId: string, submitting: boolean) => {
    set((state) => ({
      deleteSubmissions: {
        ...state.deleteSubmissions,
        [commentId]: submitting
      }
    }));
  },

  setEditingComment: (commentId: string, isEditing: boolean) => {
    set((state) => {
      const newEditingComments = new Set(state.editingComments);
      if (isEditing) {
        newEditingComments.add(commentId);
      } else {
        newEditingComments.delete(commentId);
      }
      return {
        editingComments: newEditingComments
      };
    });
  },

  setConnectionStatus: (status: 'realtime' | 'polling' | 'disconnected') => {
    set({ connectionStatus: status });
  },

  clearComments: () => {
    set({ 
      comments: [], 
      error: null, 
      connectionStatus: 'disconnected',
      replySubmissions: {},
      likeSubmissions: {},
      editSubmissions: {},
      editingComments: new Set()
    });
  },

  createComment: async (productId: string, content: string) => {
    const { token } = useAuthStore.getState();
    
    if (!token) {
      set({ error: 'Vui lòng đăng nhập để bình luận' });
      return;
    }

    if (!content.trim()) {
      set({ error: 'Nội dung bình luận không được để trống' });
      return;
    }

    set({ isSubmitting: true, error: null });

    try {
      const response = await CommentService.createComment(token, {
        productId,
        content: content.trim(),
      });

      if (response.success && response.comment) {
        // Add comment immediately to provide instant feedback
        // The real-time system will handle duplicates if both work
        const { user } = useAuthStore.getState();
        
        // Handle different possible user ID field names
        const userId = user?._id || (user as {id?: string})?.id || (user as {userId?: string})?.userId;
        
        const commentWithUserInfo: CommentWithUserInfo = {
          ...response.comment,
          replies: [],
          userInfo: user && userId ? {
            _id: userId,
            name: user.name,
            avatar: user.avatar
          } : undefined
        };
        
        get().addComment(commentWithUserInfo);
        set({ isSubmitting: false });
      } else {
        throw new Error(response.message || 'Lỗi khi gửi bình luận');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Lỗi khi gửi bình luận',
        isSubmitting: false 
      });
      throw error;
    }
  },

  createReply: async (parentCommentId: string, content: string) => {
    const { token } = useAuthStore.getState();
    
    if (!token) {
      set({ error: 'Vui lòng đăng nhập để trả lời' });
      return;
    }

    if (!content.trim()) {
      set({ error: 'Nội dung trả lời không được để trống' });
      return;
    }

    get().setReplySubmitting(parentCommentId, true);
    set({ error: null });

    try {
      const response = await CommentService.createReply(token, parentCommentId, {
        content: content.trim(),
      });

      if (response.success && response.reply) {
        // Add reply immediately to provide instant feedback
        const { user } = useAuthStore.getState();
        
        // Handle different possible user ID field names
        const userId = user?._id || (user as {id?: string})?.id || (user as {userId?: string})?.userId;
        
        const replyWithUserInfo: CommentWithUserInfo = {
          ...response.reply,
          userInfo: user && userId ? {
            _id: userId,
            name: user.name,
            avatar: user.avatar
          } : undefined
        };
        
        get().addReply(parentCommentId, replyWithUserInfo);
        get().setReplySubmitting(parentCommentId, false);
      } else {
        throw new Error(response.message || 'Lỗi khi gửi trả lời');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Lỗi khi gửi trả lời'
      });
      get().setReplySubmitting(parentCommentId, false);
      throw error;
    }
  },

  editComment: async (commentId: string, content: string) => {
    const { setEditSubmitting } = get();
    const token = useAuthStore.getState().token;
    
    if (!token) {
      toast.error('Vui lòng đăng nhập để chỉnh sửa bình luận');
      return;
    }

    setEditSubmitting(commentId, true);

    try {
      await CommentService.editComment(token, commentId, { content });
      
      set((state) => ({
        editingComments: new Set([...state.editingComments].filter(id => id !== commentId))
      }));
      
      toast.success('Bình luận đã được cập nhật thành công');
    } catch (error) {
      console.error('Error editing comment:', error);
      toast.error(error instanceof Error ? error.message : 'Lỗi khi chỉnh sửa bình luận');
    } finally {
      setEditSubmitting(commentId, false);
    }
  },

  deleteComment: async (commentId: string) => {
    const { setDeleteSubmitting, removeComment } = get();
    const token = useAuthStore.getState().token;
    
    if (!token) {
      toast.error('Vui lòng đăng nhập để xóa bình luận');
      return;
    }

    setDeleteSubmitting(commentId, true);

    try {
      await CommentService.deleteComment(token, commentId);
      
      // Remove comment from local state immediately
      removeComment(commentId);
      
      toast.success('Bình luận đã được xóa thành công');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error instanceof Error ? error.message : 'Lỗi khi xóa bình luận');
    } finally {
      setDeleteSubmitting(commentId, false);
    }
  },

  likeComment: async (commentId: string) => {
    const { token, user } = useAuthStore.getState();
    
    if (!token) {
      set({ error: 'Vui lòng đăng nhập để thích bình luận' });
      return;
    }

    const userId = user?._id || (user as {id?: string})?.id || (user as {userId?: string})?.userId;
    if (!userId) {
      set({ error: 'Không thể xác định thông tin người dùng' });
      return;
    }

    // Check if comment is already liked
    const { comments } = get();
    let targetComment: CommentWithUserInfo | undefined;
    
    // Find the comment (could be a top-level comment or a reply)
    for (const comment of comments) {
      if (comment._id === commentId) {
        targetComment = comment;
        break;
      }
      if (comment.replies) {
        const reply = comment.replies.find(r => r._id === commentId);
        if (reply) {
          targetComment = reply;
          break;
        }
      }
    }

    if (!targetComment) {
      set({ error: 'Bình luận không tồn tại' });
      return;
    }

    const isCurrentlyLiked = targetComment.likes.includes(userId);
    
    get().setLikeSubmitting(commentId, true);
    set({ error: null });

    try {
      let response;
      if (isCurrentlyLiked) {
        // Unlike the comment
        response = await CommentService.unlikeComment(token, commentId);
      } else {
        // Like the comment
        response = await CommentService.likeComment(token, commentId);
      }

      if (response.success) {
        // Update like immediately for instant feedback
        get().updateCommentLike(
          commentId, 
          response.isLiked || false, 
          response.likeCount || 0, 
          userId
        );
        
        get().setLikeSubmitting(commentId, false);
      } else {
        throw new Error(response.message || 'Lỗi khi thực hiện thao tác');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Lỗi khi thực hiện thao tác'
      });
      get().setLikeSubmitting(commentId, false);
      throw error;
    }
  },

  unlikeComment: async (commentId: string) => {
    const { token, user } = useAuthStore.getState();
    
    if (!token) {
      set({ error: 'Vui lòng đăng nhập để bỏ thích bình luận' });
      return;
    }

    const userId = user?._id || (user as {id?: string})?.id || (user as {userId?: string})?.userId;
    if (!userId) {
      set({ error: 'Không thể xác định thông tin người dùng' });
      return;
    }

    get().setLikeSubmitting(commentId, true);
    set({ error: null });

    try {
      const response = await CommentService.unlikeComment(token, commentId);

      if (response.success) {
        // Update like immediately for instant feedback
        get().updateCommentLike(
          commentId, 
          false, 
          response.likeCount || 0, 
          userId
        );
        
        get().setLikeSubmitting(commentId, false);
      } else {
        throw new Error(response.message || 'Lỗi khi bỏ thích bình luận');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Lỗi khi bỏ thích bình luận'
      });
      get().setLikeSubmitting(commentId, false);
      throw error;
    }
  },

  fetchComments: async (productId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const comments = await CommentService.getComments(productId);
      
      // Handle API response where user field contains full user objects
      const commentsWithUserInfo: CommentWithUserInfo[] = await Promise.all(
        comments
          .filter(comment => !comment.parent) // Only get top-level comments
          .map(async (comment) => {
            // Handle user info
            let commentWithUserInfo: CommentWithUserInfo;
            
            if (typeof comment.user === 'object' && comment.user !== null) {
              const userObj = comment.user as {_id: string; name: string; avatar?: string};
              commentWithUserInfo = {
                ...comment,
                user: userObj._id, // Convert to user ID string
                userInfo: {
                  _id: userObj._id,
                  name: userObj.name,
                  avatar: userObj.avatar
                },
                replies: []
              };
            } else {
              commentWithUserInfo = {
                ...comment,
                userInfo: undefined,
                replies: []
              };
            }

            // Fetch replies for this comment
            try {
              const replies = await CommentService.getReplies(comment._id);
              const repliesWithUserInfo: CommentWithUserInfo[] = replies.map(reply => {
                if (typeof reply.user === 'object' && reply.user !== null) {
                  const userObj = reply.user as {_id: string; name: string; avatar?: string};
                  return {
                    ...reply,
                    user: userObj._id,
                    userInfo: {
                      _id: userObj._id,
                      name: userObj.name,
                      avatar: userObj.avatar
                    }
                  };
                } else {
                  return {
                    ...reply,
                    userInfo: undefined
                  };
                }
              });
              
              commentWithUserInfo.replies = repliesWithUserInfo.sort((a, b) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              );
            } catch (error) {
              console.error(`Error fetching replies for comment ${comment._id}:`, error);
              commentWithUserInfo.replies = [];
            }

            return commentWithUserInfo;
          })
      );
      
      set({ 
        comments: commentsWithUserInfo.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Lỗi khi tải bình luận',
        isLoading: false 
      });
    }
  },

  subscribeToComments: (productId: string) => {
    // First, load existing comments
    get().fetchComments(productId);

    // Then subscribe to real-time updates
    const unsubscribe = CommentService.subscribeToComments(
      productId,
      async (comment: Comment) => {
        // Handle new top-level comments
        if (!comment.parent) {
          const { comments } = get();
          const exists = comments.some(c => c._id === comment._id);
          if (!exists) {
            // Fetch user info for the new comment
            const userInfo = await UserInfoService.getUserInfo(comment.user);
            const commentWithUserInfo: CommentWithUserInfo = {
              ...comment,
              replies: [],
              userInfo
            };
            get().addComment(commentWithUserInfo);
          }
        }
      },
      async (reply: Comment, parentCommentId: string) => {
        // Handle new replies
        const { comments } = get();
        const parentComment = comments.find(c => c._id === parentCommentId);
        if (parentComment) {
          const replyExists = parentComment.replies?.some(r => r._id === reply._id);
          if (!replyExists) {
            // Fetch user info for the new reply
            const userInfo = await UserInfoService.getUserInfo(reply.user);
            const replyWithUserInfo: CommentWithUserInfo = {
              ...reply,
              userInfo
            };
            get().addReply(parentCommentId, replyWithUserInfo);
          }
        }
      },
      (commentId: string, likeCount: number, likes: string[]) => {
        // Handle like/unlike updates with improved state tracking
        const { comments } = get();
        let targetComment: CommentWithUserInfo | undefined;
        
        // Find the comment (could be a top-level comment or a reply)
        for (const comment of comments) {
          if (comment._id === commentId) {
            targetComment = comment;
            break;
          }
          if (comment.replies) {
            const reply = comment.replies.find(r => r._id === commentId);
            if (reply) {
              targetComment = reply;
              break;
            }
          }
        }
        
        if (targetComment && targetComment.likeCount !== likeCount) {
          console.log(`Real-time like update for comment ${commentId}: ${targetComment.likeCount} → ${likeCount}`);
          
          // Determine if this was a like or unlike operation
          const wasLikeOperation = likeCount > targetComment.likeCount;
          
          // Update the comment with new like data
          set((state) => ({
            comments: state.comments.map(comment => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  likes: [...likes],
                  likeCount: likeCount
                };
              }
              
              // Also update replies
              if (comment.replies) {
                const updatedReplies = comment.replies.map(reply => {
                  if (reply._id === commentId) {
                    return {
                      ...reply,
                      likes: [...likes],
                      likeCount: likeCount
                    };
                  }
                  return reply;
                });
                
                if (updatedReplies !== comment.replies) {
                  return {
                    ...comment,
                    replies: updatedReplies
                  };
                }
              }
              
              return comment;
            })
          }));
        }
      },
      (commentId: string, updatedComment: Comment) => {
        // Handle comment edit updates
        console.log(`Real-time edit update for comment ${commentId}: content updated`);
        get().updateComment(commentId, updatedComment);
      },
      (commentId: string) => {
        // Handle comment deletion
        console.log(`Real-time delete update for comment ${commentId}: comment deleted`);
        get().removeComment(commentId);
      },
      (status: 'realtime' | 'polling' | 'disconnected') => {
        get().setConnectionStatus(status);
      }
    );

    return unsubscribe;
  },
})); 