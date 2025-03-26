
export interface Database {
  public: {
    Tables: {
      children: {
        Row: {
          id: string;
          name: string | null;
          date_of_birth: string | null;
          initials: string;
        };
        Insert: {
          name?: string | null;
          date_of_birth?: string | null;
          initials: string;
        };
      };
      parent_children: {
        Row: {
          parent_id: string;
          child_id: string;
          is_primary: boolean;
        };
        Insert: {
          parent_id: string;
          child_id: string;
          is_primary?: boolean;
        };
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
        };
      };
      co_parent_invites: {
        Row: {
          id: string;
          email: string;
          invited_by: string;
          status: string;
          invited_at: string;
          responded_at: string | null;
        };
        Insert: {
          email: string;
          invited_by: string;
          status: string;
          invited_at?: string;
          responded_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          text: string;
          timestamp: string;
          status: string;
          attachments: any | null;
          conversation_id: string | null;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          text: string;
          timestamp?: string;
          status?: string;
          attachments?: any | null;
          conversation_id?: string | null;
        };
      };
      conversations: {
        Row: {
          id: string;
          participants: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          participants: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          message: string;
          related_id: string | null;
          created_at: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          message: string;
          related_id?: string | null;
          created_at?: string;
          read?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
