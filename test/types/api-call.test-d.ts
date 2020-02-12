// Licensed to Elasticsearch B.V under one or more agreements.
// Elasticsearch B.V licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information

'use strict'

import { expectType, expectError } from 'tsd'
import { IncomingMessage, ServerResponse, Server } from 'http'
// @ts-ignore
import { buildServer } from '../utils'
import { Client, ApiResponse } from '../..'
import { TransportErrors } from '../../lib/Transport'

function handler (req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json;utf=8')
  res.end(JSON.stringify({ hello: 'world' }))
}

buildServer(handler, async (opts: { port: number }, server: { stop: any }) => {
  const client = new Client({
    node: `http://localhost:${opts.port}`
  })

  client.on('request', (err: TransportErrors, response: ApiResponse) => {
    expectType<TransportErrors>(err)
    expectType<ApiResponse>(response)
  })

  client.on('response', (err: TransportErrors, response: ApiResponse) => {
    expectType<TransportErrors>(err)
    expectType<ApiResponse>(response)
  })

  await runCallback(client)
  await runPromise(client)

  const response = await client.search({
    index: 'test',
    q: 'foo:bar'
  })

  expectType<ApiResponse>(response)

  server.stop()
})

function runCallback (client: Client) {
  return new Promise((resolve, reject) => {
    client.search({
      index: 'test',
      q: 'foo:bar'
    }, (err, response) => {
      expectType<TransportErrors>(err)
      expectType<ApiResponse>(response)
      resolve()
    })
  })
}

function runPromise (client: Client) {
  return client
    .search({
      index: 'test',
      q: 'foo:bar'
    })
    .then(response => expectType<ApiResponse>(response))
    .catch(err => { throw new Error('Should not fail') })
}