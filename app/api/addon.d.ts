import { FastifyInstance, FastifyReply, RouteGeneric, RawServer, RawRequest, FastifySchema } from 'fastify';
import { IncomingMessage } from "http";
import { RateLimitPluginOptions } from 'fastify-rate-limit';
import { SecurityRequirementObject } from 'openapi3-ts'

declare var __debugPoint: string;

type ServerTimings = {
  t: Date,
  s: string,
}

type Token = {
  // Can subscribe to publish/subscribe
  pubsub: boolean,
  // Registered user identifier
  uid: string, // user id
  // Predefine user roles
  roles: UserRoles[],
  // Client can upload file, Number of acceptable bytes in range
  upload: number, // can upload file
};

type RequestLogItem = {
  level: 1 | 2 | 3 | 4 | 5,
  args: any,
}

type RequestLog = {
  ip: string,
  headers: RawRequest['headers'] & RouteGeneric['Headers'],
  uri: string,
  method: string,
  params?: RouteGeneric['Params'],
  body?: RouteGeneric['Body'],
  query?: RouteGeneric['QueryString'],
  logs: RequestLogItem[],
};

type UserActions = 'VIEW' | 'ADD' | 'EDIT' | 'DELETE' | 'LIST' | 'PUBLISH' | 'UN_PUBLISH' | 'ARCHIVE' | 'UN_ARCHIVE';
type UserRoles =
  // guest
  'G' |
  // administrator
  'A' |
  // moderator
  'M' |
  // registered
  'R';

type EntityModel = 'MODEL_GENERAL' | 'MODEL_LOG' | 'MODEL_USER';

declare module 'http' {
  interface IncomingMessage {
    token?: Token,
    requireUserRole(roles: string[]): boolean,
    log(msg: string | object, level?: string): void
    getClientIP(): string,
    isFromPrivateNetwork(): boolean,
    serverTimings: ServerTimings[],
    addTiming(step: string, time: Date = new Date()): void;
    getFirstHeader(name: string): string;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    baseURL(path: string): string,
    openAPIBaseURL(path: string): string,
    userAuthPreHandler(req, reply, next): void;
  }
  interface FastifySchema {
    hide?: boolean,
    description?: string,
    consumes?: string[],
    tags?: string[],
    security?: SecurityRequirementObject[],
  }
  interface FastifyReply {
    setResponseCacheTTL(ttl: number, staleAddon?: number): void;
  }
}
