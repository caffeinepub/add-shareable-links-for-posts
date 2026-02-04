import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import InviteLinksModule "invite-links/invite-links-module";
import AccessControl "authorization/access-control";

actor {
  // Include blob storage for media and avatars
  include MixinStorage();

  public type UserProfile = {
    displayName : Text;
    avatar : ?Storage.ExternalBlob;
  };

  public type Post = {
    author : Principal;
    content : Text;
    timestamp : Time.Time;
    media : ?Storage.ExternalBlob;
  };

  module PostArray {
    public func compareByTimestampDesc(posts1 : [Post], posts2 : [Post]) : Order.Order {
      switch (posts1.size(), posts2.size()) {
        case (0, 0) { #equal };
        case (0, _) { #greater };
        case (_, 0) { #less };
        case (_, _) {
          let first1 = posts1[0];
          let first2 = posts2[0];
          let timestampComparison = Int.compare(first2.timestamp, first1.timestamp);
          switch (timestampComparison) {
            case (#equal) {
              Int.compare(posts1.size(), posts2.size());
            };
            case (order) { order };
          };
        };
      };
    };
  };

  public type Cave = {
    id : Text;
    members : [Principal];
    messages : [Message];
  };

  module Cave {
    public func compare(cave1 : Cave, cave2 : Cave) : Order.Order {
      switch (Text.compare(cave1.id, cave2.id)) {
        case (#equal) {
          Int.compare(cave1.members.size(), cave2.members.size());
        };
        case (order) { order };
      };
    };
  };

  public type Message = {
    author : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  public type Invite = {
    caveId : Text;
    token : Text;
    created : Time.Time;
    expires : ?Time.Time;
  };

  public type UserRole = {
    #admin;
    #user;
    #guest;
  };

  type CaveState = {
    var caves : Map.Map<Text, Cave>;
    var invites : Map.Map<Text, Invite>;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let posts = List.empty<Post>();

  let caveState : CaveState = {
    var caves = Map.empty<Text, Cave>();
    var invites = Map.empty<Text, Invite>();
  };

  // Include authorization with external state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Include Invite Links state
  let inviteLinksState = InviteLinksModule.initState();

  // Required profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let trimmedName = profile.displayName.trimEnd(#char(' ')).trimStart(#char(' '));
    if (trimmedName.size() == 0) {
      Runtime.trap("Display name cannot be empty");
    };
    let validatedProfile : UserProfile = {
      displayName = trimmedName;
      avatar = profile.avatar;
    };
    userProfiles.add(caller, validatedProfile);
  };

  // Legacy profile function for backward compatibility
  public shared ({ caller }) func setDisplayName(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set display name");
    };
    let trimmedName = name.trimEnd(#char(' ')).trimStart(#char(' '));
    if (trimmedName.size() == 0) {
      Runtime.trap("Display name cannot be empty");
    };
    let existingProfile = userProfiles.get(caller);
    let profile : UserProfile = {
      displayName = trimmedName;
      avatar = switch (existingProfile) {
        case (?p) { p.avatar };
        case (null) { null };
      };
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(user);
  };

  // Post management - requires authentication
  public shared ({ caller }) func createPost(content : Text, media : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    let trimmedContent = content.trimEnd(#char(' ')).trimStart(#char(' '));
    if (trimmedContent.size() == 0 and media == null) {
      Runtime.trap("Post cannot be empty");
    };
    let post : Post = {
      author = caller;
      content = trimmedContent;
      timestamp = Time.now();
      media;
    };
    posts.add(post);
  };

  public query ({ caller }) func getFeed() : async [Post] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view feed");
    };
    posts.toArray().reverse();
  };

  // Cave system - requires authentication
  public shared ({ caller }) func createCave(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create caves");
    };
    let trimmedId = id.trimEnd(#char(' ')).trimStart(#char(' '));
    if (trimmedId.size() == 0) {
      Runtime.trap("Cave id cannot be empty");
    };
    // Check if cave already exists
    switch (caveState.caves.get(trimmedId)) {
      case (?_) { Runtime.trap("Cave with this id already exists") };
      case (null) {};
    };
    let cave : Cave = {
      id = trimmedId;
      members = [caller];
      messages = [];
    };
    caveState.caves.add(trimmedId, cave);
  };

  public query ({ caller }) func getCaves() : async [Cave] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view caves");
    };
    let cavesArray = caveState.caves.toArray();
    let cavesWithCallerMember = cavesArray.filter(
      func((_, cave) : (Text, Cave)) : Bool {
        cave.members.find<Principal>(func(member) { member == caller }) != null;
      }
    );
    let result = cavesWithCallerMember.map(func((_, cave) : (Text, Cave)) : Cave { cave });
    result.sort();
  };

  public shared ({ caller }) func sendMessage(caveId : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    let cave = switch (caveState.caves.get(caveId)) {
      case (null) { Runtime.trap("Cave not found") };
      case (?cave) { cave };
    };
    // Check if caller is a member
    let isMember = cave.members.find<Principal>(func(member) { member == caller }) != null;
    if (not isMember) {
      Runtime.trap("You are not a member of this cave");
    };
    let trimmedContent = content.trimEnd(#char(' ')).trimStart(#char(' '));
    if (trimmedContent.size() == 0) {
      Runtime.trap("Message cannot be empty");
    };
    let message : Message = {
      author = caller;
      content = trimmedContent;
      timestamp = Time.now();
    };
    let newMessages = cave.messages.concat([message]);
    let updatedCave : Cave = {
      id = caveId;
      members = cave.members;
      messages = newMessages;
    };
    caveState.caves.add(caveId, updatedCave);
  };

  // Invite system - requires authentication
  public shared ({ caller }) func createInvite(caveId : Text, token : Text, expires : ?Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create invites");
    };
    let cave = switch (caveState.caves.get(caveId)) {
      case (null) { Runtime.trap("Cave not found") };
      case (?cave) { cave };
    };
    // Check if caller is a member
    let isMember = cave.members.find<Principal>(func(member) { member == caller }) != null;
    if (not isMember) {
      Runtime.trap("You are not a member of this cave");
    };
    let trimmedToken = token.trimEnd(#char(' ')).trimStart(#char(' '));
    if (trimmedToken.size() == 0) {
      Runtime.trap("Invite token cannot be empty");
    };
    let invite : Invite = {
      caveId;
      token = trimmedToken;
      created = Time.now();
      expires;
    };
    caveState.invites.add(trimmedToken, invite);
  };

  public shared ({ caller }) func joinCave(token : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join caves");
    };
    let invite = switch (caveState.invites.get(token)) {
      case (null) { Runtime.trap("Invalid invite token") };
      case (?invite) { invite };
    };
    // Check if invite has expired
    switch (invite.expires) {
      case (?expiryTime) {
        if (Time.now() > expiryTime) {
          Runtime.trap("Invite has expired");
        };
      };
      case (null) {};
    };
    let cave = switch (caveState.caves.get(invite.caveId)) {
      case (null) { Runtime.trap("Cave not found") };
      case (?cave) { cave };
    };
    // Check if already a member
    let alreadyMember = cave.members.find<Principal>(func(member) { member == caller }) != null;
    if (alreadyMember) {
      Runtime.trap("You are already a member of this cave");
    };
    let newMembers = cave.members.concat([caller]);
    let updatedCave : Cave = {
      id = invite.caveId;
      members = newMembers;
      messages = cave.messages;
    };
    caveState.caves.add(invite.caveId, updatedCave);
  };

  public shared ({ caller }) func revokeInvite(token : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can revoke invites");
    };
    let invite = switch (caveState.invites.get(token)) {
      case (null) { Runtime.trap("Invalid invite token") };
      case (?invite) { invite };
    };
    let cave = switch (caveState.caves.get(invite.caveId)) {
      case (null) { Runtime.trap("Cave not found") };
      case (?cave) { cave };
    };
    // Check if caller is a member
    let isMember = cave.members.find<Principal>(func(member) { member == caller }) != null;
    if (not isMember) {
      Runtime.trap("You are not a member of this cave");
      return;
    };
    caveState.invites.remove(token);
  };

  public shared ({ caller }) func uploadMedia(media : Storage.ExternalBlob) : async Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload media");
    };
    Runtime.trap("Image Storage must be done via JavaScript. This function is never called from the Internet Computer. The images will be retrieved from the local Blob Store on the client's machine and loaded into the canvas. During export, you download all the files from the Storage canister and generate a ZIP archive. The saved files must be accessible from the Canister HTTP asset path.");
  };

  // --- Invite Links Required Functions ---
  public shared ({ caller }) func generateInviteCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate invite codes");
    };
    let blob = "test-blob".encodeUtf8();
    let code = InviteLinksModule.generateUUID(blob);
    InviteLinksModule.generateInviteCode(inviteLinksState, code);
    code;
  };

  public func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    InviteLinksModule.submitRSVP(inviteLinksState, name, attending, inviteCode);
  };

  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view RSVPs");
    };
    InviteLinksModule.getAllRSVPs(inviteLinksState);
  };

  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view invite codes");
    };
    InviteLinksModule.getInviteCodes(inviteLinksState);
  };
};
