// Licensed to Elasticsearch B.V under one or more agreements.
// Elasticsearch B.V licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information

import { ApiResponse } from './Transport'

export declare class ElasticsearchClientError extends Error {
  name: string;
  message: string;
}

export class TimeoutError extends ElasticsearchClientError {
  name: string;
  message: string;
  meta: ApiResponse;
  constructor(message: string, meta: ApiResponse);
}

export class ConnectionError extends ElasticsearchClientError {
  name: string;
  message: string;
  meta: ApiResponse;
  constructor(message: string, meta: ApiResponse);
}

export class NoLivingConnectionsError extends ElasticsearchClientError {
  name: string;
  message: string;
  meta: ApiResponse;
  constructor(message: string, meta: ApiResponse);
}

export class SerializationError extends ElasticsearchClientError {
  name: string;
  message: string;
  constructor(message: string);
}

export class DeserializationError extends ElasticsearchClientError {
  name: string;
  message: string;
  constructor(message: string);
}

export class ConfigurationError extends ElasticsearchClientError {
  name: string;
  message: string;
  constructor(message: string);
}

export class ResponseError extends ElasticsearchClientError {
  name: string;
  message: string;
  meta: ApiResponse;
  body: any;
  statusCode: number;
  headers: any;
  constructor(meta: ApiResponse);
}
