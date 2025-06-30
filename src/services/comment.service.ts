import { CreateCommentRequest, CreateCommentResponse, CreateReplyRequest, CreateReplyResponse, EditCommentRequest, EditCommentResponse, DeleteCommentResponse, LikeCommentResponse, Comment } from '@/types/comment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class CommentService {
  static async createComment(token: string, commentData: CreateCommentRequest): Promise<CreateCommentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập để bình luận');
        }
        
        if (response.status === 400) {
          throw new Error(data.message || 'Nội dung bình luận không hợp lệ');
        }
        
        if (response.status === 404) {
          throw new Error('Sản phẩm không tồn tại');
        }
        
        throw new Error(data.message || `Lỗi khi gửi bình luận: ${response.statusText}`);
      }

      return {
        success: true,
        message: data.message || 'Bình luận đã được gửi thành công',
        comment: data.comment || data,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi gửi bình luận');
    }
  }

  static async createReply(token: string, parentCommentId: string, replyData: CreateReplyRequest): Promise<CreateReplyResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${parentCommentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(replyData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập để trả lời');
        }
        
        if (response.status === 400) {
          throw new Error(data.message || 'Nội dung trả lời không hợp lệ');
        }
        
        if (response.status === 404) {
          throw new Error('Bình luận gốc không tồn tại');
        }
        
        throw new Error(data.message || `Lỗi khi gửi trả lời: ${response.statusText}`);
      }

      return {
        success: true,
        message: data.message || 'Trả lời đã được gửi thành công',
        reply: data._id ? data : data.reply,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi gửi trả lời');
    }
  }

  static async editComment(token: string, commentId: string, editData: EditCommentRequest): Promise<EditCommentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập để chỉnh sửa bình luận');
        }
        
        if (response.status === 400) {
          throw new Error(data.message || 'Nội dung bình luận không hợp lệ');
        }
        
        if (response.status === 403) {
          throw new Error('Bạn không có quyền chỉnh sửa bình luận này');
        }
        
        if (response.status === 404) {
          throw new Error('Bình luận không tồn tại');
        }
        
        throw new Error(data.message || `Lỗi khi chỉnh sửa bình luận: ${response.statusText}`);
      }

      return {
        success: true,
        message: data.message || 'Bình luận đã được cập nhật thành công',
        comment: data.comment || data,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi chỉnh sửa bình luận');
    }
  }

  static async likeComment(token: string, commentId: string): Promise<LikeCommentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập để thích bình luận');
        }
        
        if (response.status === 400) {
          throw new Error(data.message || 'Bình luận đã được thích');
        }
        
        if (response.status === 404) {
          throw new Error('Bình luận không tồn tại');
        }
        
        throw new Error(data.message || `Lỗi khi thích bình luận: ${response.statusText}`);
      }

      return {
        success: true,
        message: data.message || 'Đã thích bình luận',
        comment: data.comment || data,
        isLiked: true,
        likeCount: data.likeCount || data.comment?.likeCount || 0,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi thích bình luận');
    }
  }

  static async unlikeComment(token: string, commentId: string): Promise<LikeCommentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập để bỏ thích bình luận');
        }
        
        if (response.status === 400) {
          throw new Error(data.message || 'Bình luận chưa được thích');
        }
        
        if (response.status === 404) {
          throw new Error('Bình luận không tồn tại');
        }
        
        throw new Error(data.message || `Lỗi khi bỏ thích bình luận: ${response.statusText}`);
      }

      return {
        success: true,
        message: data.message || 'Đã bỏ thích bình luận',
        comment: data.comment || data,
        isLiked: false,
        likeCount: data.likeCount || data.comment?.likeCount || 0,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi bỏ thích bình luận');
    }
  }

  static async getComments(productId: string): Promise<Comment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/product/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Sản phẩm không tồn tại');
        }
        throw new Error(`Lỗi khi tải bình luận: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi tải bình luận');
    }
  }

  static async getReplies(commentId: string): Promise<Comment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/replies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Bình luận không tồn tại');
        }
        throw new Error(`Lỗi khi tải trả lời: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi tải trả lời');
    }
  }

  static subscribeToComments(
    productId: string, 
    onComment: (comment: Comment) => void,
    onReply?: (reply: Comment, parentCommentId: string) => void,
    onLikeUpdate?: (commentId: string, likeCount: number, likes: string[]) => void,
    onCommentUpdate?: (commentId: string, updatedComment: Comment) => void,
    onCommentDelete?: (commentId: string) => void,
    onStatusChange?: (status: 'realtime' | 'polling' | 'disconnected') => void
  ): () => void {
    let pollingInterval: NodeJS.Timeout | null = null;
    let lastCommentId: string | null = null;
    let lastReplyTimestamp: number = Date.now();
    const previousLikeCounts: Map<string, number> = new Map();
    const previousCommentUpdates: Map<string, string> = new Map(); // Track last updated timestamps
    let previousCommentIds: Set<string> = new Set(); // Track comment IDs to detect deletions
    const previousReplyIds: Map<string, Set<string>> = new Map(); // Track reply IDs per comment
    let cleanup = false;

    const startPolling = () => {
      if (pollingInterval) return;

      onStatusChange?.('polling');
      
      pollingInterval = setInterval(async () => {
        if (cleanup) return;
        
        try {
          const comments = await CommentService.getComments(productId);
          
          // Check for deleted comments
          if (onCommentDelete && previousCommentIds.size > 0) {
            const currentCommentIds = new Set(comments.map(c => c._id));
            for (const previousId of previousCommentIds) {
              if (!currentCommentIds.has(previousId)) {
                console.log(`Comment deleted: ${previousId}`);
                onCommentDelete(previousId);
              }
            }
          }
          
          // Update current comment IDs
          previousCommentIds = new Set(comments.map(c => c._id));
          
          // Check for new top-level comments
          if (lastCommentId) {
            const lastIndex = comments.findIndex(c => c._id === lastCommentId);
            if (lastIndex > 0) {
              const newComments = comments.slice(0, lastIndex);
              newComments.reverse().forEach(comment => {
                onComment(comment);
              });
              lastCommentId = comments[0]?._id || lastCommentId;
            } else if (lastIndex === -1 && comments.length > 0) {
              onComment(comments[0]);
              lastCommentId = comments[0]._id;
            }
          } else if (comments.length > 0) {
            lastCommentId = comments[0]._id;
          }

          // Check for new replies on all comments
          if (onReply) {
            for (const comment of comments) {
              try {
                const replies = await CommentService.getReplies(comment._id);
                
                // Check for deleted replies
                if (onCommentDelete) {
                  const previousReplies = previousReplyIds.get(comment._id) || new Set();
                  const currentReplyIds = new Set(replies.map(r => r._id));
                  
                  for (const previousReplyId of previousReplies) {
                    if (!currentReplyIds.has(previousReplyId)) {
                      console.log(`Reply deleted: ${previousReplyId}`);
                      onCommentDelete(previousReplyId);
                    }
                  }
                }
                
                // Update current reply IDs
                previousReplyIds.set(comment._id, new Set(replies.map(r => r._id)));
                
                const newReplies = replies.filter(reply => 
                  new Date(reply.createdAt).getTime() > lastReplyTimestamp
                );
                
                newReplies.forEach(reply => {
                  onReply(reply, comment._id);
                });

                // Also check for like updates and edit updates on replies
                if (onLikeUpdate || onCommentUpdate) {
                  replies.forEach(reply => {
                    // Check for like updates
                    if (onLikeUpdate) {
                      const previousCount = previousLikeCounts.get(reply._id) || 0;
                      if (reply.likeCount !== previousCount) {
                        onLikeUpdate(reply._id, reply.likeCount, reply.likes);
                        previousLikeCounts.set(reply._id, reply.likeCount);
                      }
                    }

                    // Check for content updates
                    if (onCommentUpdate) {
                      const previousUpdate = previousCommentUpdates.get(reply._id);
                      if (previousUpdate !== reply.updatedAt) {
                        onCommentUpdate(reply._id, reply);
                        previousCommentUpdates.set(reply._id, reply.updatedAt);
                      }
                    }
                  });
                }
              } catch (error) {
                console.error(`Error fetching replies for comment ${comment._id}:`, error);
              }
            }
          }

          // Check for like count updates and content updates on top-level comments
          if (onLikeUpdate || onCommentUpdate) {
            comments.forEach(comment => {
              // Check for like updates
              if (onLikeUpdate) {
                const previousCount = previousLikeCounts.get(comment._id) || 0;
                if (comment.likeCount !== previousCount) {
                  onLikeUpdate(comment._id, comment.likeCount, comment.likes);
                  previousLikeCounts.set(comment._id, comment.likeCount);
                }
              }

              // Check for content updates
              if (onCommentUpdate) {
                const previousUpdate = previousCommentUpdates.get(comment._id);
                if (previousUpdate !== comment.updatedAt) {
                  onCommentUpdate(comment._id, comment);
                  previousCommentUpdates.set(comment._id, comment.updatedAt);
                }
              }
            });
          }
          
          lastReplyTimestamp = Date.now();
        } catch (error) {
          console.error('Polling error:', error);
          onStatusChange?.('disconnected');
        }
      }, 5000); 
    };

    startPolling();

    return () => {
      cleanup = true;
      
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }

  static async deleteComment(token: string, commentId: string): Promise<DeleteCommentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vui lòng đăng nhập để xóa bình luận');
        }
        
        if (response.status === 403) {
          throw new Error('Bạn không có quyền xóa bình luận này');
        }
        
        if (response.status === 404) {
          throw new Error('Bình luận không tồn tại');
        }
        
        throw new Error(data.message || `Lỗi khi xóa bình luận: ${response.statusText}`);
      }

      return {
        success: true,
        message: data.message || 'Bình luận đã được xóa thành công',
        deletedCommentId: commentId
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi xóa bình luận');
    }
  }
} 