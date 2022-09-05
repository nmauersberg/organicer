import {
  encodeOperation,
  KeyPair,
  OperationFields,
  signAndEncodeEntry,
} from 'p2panda-js';
import { GraphQLClient, gql } from 'graphql-request';

export async function createSchema(
  client: GraphQLClient,
  keyPair: KeyPair,
  fields: string[]
): Promise<string> {
  const args = await nextArgs(client, keyPair.publicKey());
  const name = 'journal_test';

  const operationFields = new OperationFields({
    name,
    description: 'Testing schema creation',
  });

  operationFields.insert(
    'fields',
    'pinned_relation_list',
    fields.map((operationId) => {
      return [operationId];
    })
  );

  const payload = encodeOperation({
    action: 'create',
    schemaId: 'schema_definition_v1',
    fields: operationFields,
  });

  const entry = signAndEncodeEntry(
    {
      ...args,
      payload,
    },
    keyPair
  );

  const { backlink } = await publish(client, entry, payload);
  console.log(`Created schema ${name}_${backlink}`);
  return `${name}_${backlink}`;
}

async function publish(
  client: GraphQLClient,
  entry: string,
  operation: string
): Promise<NextArgs> {
  const query = gql`
    mutation Publish($entry: String!, $operation: String!) {
      publish(entry: $entry, operation: $operation) {
        logId
        seqNum
        backlink
        skiplink
      }
    }
  `;

  const result = await client.request(query, {
    entry,
    operation,
  });

  return result.publish;
}

type NextArgs = {
  logId: string;
  seqNum: string;
  backlink?: string;
  skiplink?: string;
};

async function nextArgs(
  client: GraphQLClient,
  publicKey: string,
  viewId?: string
): Promise<NextArgs> {
  const query = gql`
    query NextArgs($publicKey: String!, $viewId: String) {
      nextArgs(publicKey: $publicKey, viewId: $viewId) {
        logId
        seqNum
        backlink
        skiplink
      }
    }
  `;

  const result = await client.request(query, {
    publicKey,
    viewId,
  });

  return result.nextArgs;
}
