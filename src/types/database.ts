
export interface DbChild {
  id: string;
  name: string | null;
  date_of_birth: string | null;
  initials: string;
  parent_children?: { parent_id: string }[];
}

export interface DbProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
}

export interface DbCoParentInvite {
  id: string;
  email: string;
  invited_by: string;
  status: string;
  invited_at: string;
  responded_at: string | null;
}
