
/**
 * Child-related types
 */

/**
 * A child in the system
 */
export type Child = {
  /** Unique identifier */
  id: string;
  /** Full name of the child (optional) */
  name: string | null;
  /** Initials of the child (required) */
  initials: string;
  /** Date of birth in ISO format (optional) */
  dateOfBirth: string | null;
  /** IDs of parents associated with this child */
  parentIds: string[];
};

/**
 * Input for adding a new child
 */
export type AddChildInput = Pick<Child, 'name' | 'initials' | 'dateOfBirth'>;

/**
 * Input for updating an existing child
 */
export type UpdateChildInput = AddChildInput;
