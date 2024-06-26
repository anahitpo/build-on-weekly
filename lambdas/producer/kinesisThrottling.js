/**
 * v2:
 * Simulate throttling when sending too many records.
 */

const { Kinesis } = require('@aws-sdk/client-kinesis')
const { NodeHttpHandler } = require('@smithy/node-http-handler')
const { ConfiguredRetryStrategy } = require('@smithy/util-retry')

const { STREAM_NAME, MAX_ATTEMPTS } = process.env

const kinesis = new Kinesis({
  retryStrategy: new ConfiguredRetryStrategy({
    maxAttempts: Number(MAX_ATTEMPTS),
  }),
  requestHandler: new NodeHttpHandler(
    {
      connectionTimeout: 2000,
      requestTimeout: 2000
    }
  )
})


const putKinesisRecords = (records) => {
  const payload = {
    StreamName: STREAM_NAME,
    Records: records
  }
  //console.log('REQUEST:', payload)
  return kinesis.putRecords(payload);
}

const generateKinesisRecords = (partitionKeys) => partitionKeys.map((key) => ({
  Data: JSON.stringify({
    importantStuff: 'Your data is important!',
    smthElse: 'Kinesis will take good care of it'
  }),
  PartitionKey: key
}))


/** TOO MUCH! */
const tooManyRecords = (partitionKeys, batchCount) => {
  const batchArray = []
  for (let i = 0; i < batchCount; i++) {
    batchArray.push(generateKinesisRecords(partitionKeys))
  }
  return batchArray
}

exports.sendTooManyRecords = async (partitionKeys, batchCount) => {
  const recordBatches = tooManyRecords(partitionKeys, batchCount)

  try {
    await Promise.all(recordBatches.map(putKinesisRecords))
  } catch (err) {
    console.error('ERROR: Smth bad happened!', err)
  }
}


exports.sendRecordsInABatchWithLogging = async (partitionKeys) => {
  const records = generateKinesisRecords(partitionKeys)
  try {
    const response = await putKinesisRecords(records)
    console.log('RESPONSE:', response)
  } catch (err) {
    console.error('ERROR: Smth bad happened!')
  }
}

//

const logFailedResponse = (response) => {
  if (response?.FailedRecordCount > 0) {
    console.log('PARTIAL FAILURE:', response)
  }
}

exports.sendTooManyRecordsWithLogging = async (partitionKeys, batchCount) => {
  const recordBatches = tooManyRecords(partitionKeys, batchCount)

  try {
    await Promise.all(recordBatches.map(async (records) => {
      const response = await putKinesisRecords(records)

      logFailedResponse(response)
    }))
  } catch (err) {
    console.error('ERROR: Smth bad happened!', err)
  }
}
// <----
