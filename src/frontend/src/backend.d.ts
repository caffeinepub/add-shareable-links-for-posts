import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export type Time = bigint;
export interface Post {
    media?: ExternalBlob;
    content: string;
    author: Principal;
    timestamp: Time;
}
export interface Message {
    content: string;
    author: Principal;
    timestamp: Time;
}
export interface Cave {
    id: string;
    members: Array<Principal>;
    messages: Array<Message>;
}
export interface UserProfile {
    displayName: string;
    avatar?: ExternalBlob;
}
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCave(id: string): Promise<void>;
    createInvite(caveId: string, token: string, expires: Time | null): Promise<void>;
    createPost(content: string, media: ExternalBlob | null): Promise<void>;
    generateInviteCode(): Promise<string>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCaves(): Promise<Array<Cave>>;
    getFeed(): Promise<Array<Post>>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getProfile(user: Principal): Promise<UserProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    joinCave(token: string): Promise<void>;
    revokeInvite(token: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(caveId: string, content: string): Promise<void>;
    setDisplayName(name: string): Promise<void>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
    uploadMedia(media: ExternalBlob): Promise<ExternalBlob>;
}
