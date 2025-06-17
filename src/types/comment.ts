export interface Comment {
  _id: string;
  content: string;
  user: string;
  product: string;
  parent?: string;
  likes: string[];
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentWithUserInfo extends Comment {
  userInfo?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  replies?: CommentWithUserInfo[];
}

export interface CreateCommentRequest {
  productId: string;
  content: string;
}

export interface CreateReplyRequest {
  content: string;
}

export interface EditCommentRequest {
  content: string;
}

export interface LikeCommentResponse {
  success: boolean;
  message: string;
  comment?: Comment;
  isLiked?: boolean;
  likeCount?: number;
}

export interface EditCommentResponse {
  success: boolean;
  message: string;
  comment?: Comment;
}

export interface DeleteCommentResponse {
  success: boolean;
  message: string;
  deletedCommentId?: string;
}

export interface CreateCommentResponse {
  success: boolean;
  message: string;
  comment?: Comment;
}

export interface CreateReplyResponse {
  success: boolean;
  message: string;
  reply?: Comment;
}

export interface CommentState {
  comments: CommentWithUserInfo[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  connectionStatus: 'realtime' | 'polling' | 'disconnected';
  replySubmissions: Record<string, boolean>; // Track reply submission state per comment
  likeSubmissions: Record<string, boolean>; // Track like submission state per comment
  editSubmissions: Record<string, boolean>; // Track edit submission state per comment
  deleteSubmissions: Record<string, boolean>; // Track delete submission state per comment
  editingComments: Set<string>; // Track which comments are currently being edited
}

export interface CommentStore extends CommentState {
  // Actions
  addComment: (comment: CommentWithUserInfo) => void;
  addReply: (parentCommentId: string, reply: CommentWithUserInfo) => void;
  updateComment: (commentId: string, updatedComment: Comment) => void;
  removeComment: (commentId: string) => void;
  updateCommentLike: (commentId: string, isLiked: boolean, likeCount: number, userId: string) => void;
  setComments: (comments: CommentWithUserInfo[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSubmitting: (submitting: boolean) => void;
  setReplySubmitting: (commentId: string, submitting: boolean) => void;
  setLikeSubmitting: (commentId: string, submitting: boolean) => void;
  setEditSubmitting: (commentId: string, submitting: boolean) => void;
  setDeleteSubmitting: (commentId: string, submitting: boolean) => void;
  setEditingComment: (commentId: string, isEditing: boolean) => void;
  setConnectionStatus: (status: 'realtime' | 'polling' | 'disconnected') => void;
  clearComments: () => void;
  createComment: (productId: string, content: string) => Promise<void>;
  createReply: (parentCommentId: string, content: string) => Promise<void>;
  editComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  unlikeComment: (commentId: string) => Promise<void>;
  subscribeToComments: (productId: string) => () => void;
  fetchComments: (productId: string) => Promise<void>;
} 