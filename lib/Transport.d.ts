// Licensed to Elasticsearch B.V under one or more agreements.
// Elasticsearch B.V licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information

import { Readable as ReadableStream } from 'stream'
import { ConnectionPool, CloudConnectionPool } from './pool';
import Connection from './Connection';
import Serializer from './Serializer';
import {
  ConnectionError,
  TimeoutError,
  NoLivingConnectionsError,
  ResponseError,
  ConfigurationError
} from './errors'

export interface nodeSelectorFn {
  (connections: Connection[]): Connection;
}

export interface nodeFilterFn {
  (connection: Connection): boolean;
}

export interface generateRequestIdFn {
  (params: TransportRequestParams, options: TransportRequestOptions): any;
}

declare type noopFn = (...args: any[]) => void;
declare type emitFn = (event: string | symbol, ...args: any[]) => boolean;

interface TransportOptions {
  emit: emitFn;
  connectionPool: ConnectionPool | CloudConnectionPool;
  serializer: Serializer;
  maxRetries: number;
  requestTimeout: number | string;
  suggestCompression: boolean;
  compression?: 'gzip';
  sniffInterval: number | boolean;
  sniffOnConnectionFault: boolean;
  sniffEndpoint: string;
  sniffOnStart: boolean;
  nodeFilter?: nodeFilterFn;
  nodeSelector?: string | nodeSelectorFn;
  headers?: Record<string, any>;
  generateRequestId?: generateRequestIdFn;
  name: string;
}

export interface RequestEvent<T = any, C = any> {
  body: T;
  statusCode: number | null;
  headers: Record<string, any> | null;
  warnings: string[] | null;
  meta: {
    context: C;
    name: string;
    request: {
      params: TransportRequestParams;
      options: TransportRequestOptions;
      id: any;
    };
    connection: Connection;
    attempts: number;
    aborted: boolean;
    sniff?: {
      hosts: any[];
      reason: string;
    };
  };
}

// ApiResponse and RequestEvent are the same thing
// we are doing this for have more clear names
export interface ApiResponse<T = any, C = any> extends RequestEvent<T, C> {}

export interface TransportRequestParams {
  method: string;
  path: string;
  body?: Record<string, any> | string | ReadableStream;
  bulkBody?: Array<Record<string, any>> | string | ReadableStream;
  querystring?: Record<string, any>;
}

export interface TransportRequestOptions {
  ignore?: number[];
  requestTimeout?: number | string;
  maxRetries?: number;
  asStream?: boolean;
  headers?: Record<string, any>;
  querystring?: Record<string, any>;
  compression?: string;
  id?: any;
  context?: any;
  warnings?: string[];
}

export type TransportErrors = ConnectionError | TimeoutError | NoLivingConnectionsError | ResponseError | ConfigurationError | null
export type TransportRequestCallback = (err: TransportErrors, result: ApiResponse) => void

export interface TransportRequestReturn {
  abort: () => void
}

export interface TransportGetConnectionOptions {
  requestId: string;
}

export interface TransportSniffOptions {
  reason: string;
  requestId?: string;
}

export default class Transport {
  static sniffReasons: {
    SNIFF_ON_START: 'sniff-on-start',
    SNIFF_INTERVAL: 'sniff-interval',
    SNIFF_ON_CONNECTION_FAULT: 'sniff-on-connection-fault',
    DEFAULT: 'default'
  };
  emit: emitFn & noopFn;
  connectionPool: ConnectionPool | CloudConnectionPool;
  serializer: Serializer;
  maxRetries: number;
  requestTimeout: number;
  suggestCompression: boolean;
  compression: 'gzip' | false;
  sniffInterval: number;
  sniffOnConnectionFault: boolean;
  sniffEndpoint: string;
  _sniffEnabled: boolean;
  _nextSniff: number;
  _isSniffing: boolean;
  constructor(opts: TransportOptions);
  request (params: TransportRequestParams, options?: TransportRequestOptions): Promise<ApiResponse>
  request (params: TransportRequestParams, callback: TransportRequestCallback): TransportRequestReturn
  request (params: TransportRequestParams, options: TransportRequestOptions, callback: TransportRequestCallback): TransportRequestReturn
  getConnection(opts: TransportGetConnectionOptions): Connection | null;
  sniff(opts?: TransportSniffOptions, callback?: (...args: any[]) => void): void;
}

export {};
