/**
 * v1:
 * Configure retries and timeouts.
 * Add try/catch
 */

const { Kinesis } = require('@aws-sdk/client-kinesis')
const { NodeHttpHandler } = require('@smithy/node-http-handler')
const { ConfiguredRetryStrategy } = require('@smithy/util-retry')

const { STREAM_NAME, MAX_ATTEMPTS } = process.env

const kinesis = new Kinesis({
  retryStrategy: new ConfiguredRetryStrategy({
    maxAttempts: Number(MAX_ATTEMPTS),  // Default: 3
  }),
  requestHandler: new NodeHttpHandler(
    {
      connectionTimeout: 2000, // Default: 0..
      requestTimeout: 2000 // Default: 0..
    }
  )
})


const putKinesisRecords = (records) => {
  const payload = {
    StreamName: STREAM_NAME,
    Records: records
  }
  return kinesis.putRecords(payload);
}

const generateKinesisRecords = (partitionKeys) => partitionKeys.map((key) => ({
  Data: JSON.stringify({
    importantStuff: 'Your data is important!',
    smthElse: 'Kinesis will take good care of it'
  }),
  PartitionKey: key
}))

exports.sendRecordsInABatch = async (partitionKeys) => {
  const records = generateKinesisRecords(partitionKeys)
  try {
    await putKinesisRecords(records)
  } catch (err) {
    console.error('ERROR: Smth bad happened!')
  }
}
