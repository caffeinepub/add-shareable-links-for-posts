export function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;
    
    // Handle common backend errors
    if (message.includes('Unauthorized')) {
      return 'You do not have permission to perform this action.';
    }
    
    if (message.includes('not found')) {
      return 'The requested resource was not found.';
    }
    
    if (message.includes('already exists')) {
      return 'This item already exists. Please choose a different name.';
    }
    
    if (message.includes('expired')) {
      return 'This invite link has expired.';
    }
    
    if (message.includes('Invalid invite')) {
      return 'This invite link is invalid or has been revoked.';
    }
    
    if (message.includes('already a member')) {
      return 'You are already a member of this cave.';
    }
    
    if (message.includes('cannot be empty')) {
      return 'Please fill in all required fields.';
    }
    
    return message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}
