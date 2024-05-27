/**
 * v0:
 * The initial "dummy" version.
 * Differences between single record and batch put.
 */

const { Kinesis } = require('@aws-sdk/client-kinesis');
const { STREAM_NAME } = process.env

const kinesis = new Kinesis()

/**
 * Sends a single record
 */
const putKinesisRecord = (data, partitionKey) => {
  const record = {
    StreamName: STREAM_NAME,
    Data: JSON.stringify(data),
    PartitionKey: partitionKey
  }
  //console.log('RECORD:', record)
  return kinesis.putRecord(record);
}

/**
 * Sends an array of records as a single request
 */
const putKinesisRecords = (records) => {
  const payload = {
    StreamName: STREAM_NAME,
    Records: records
  }
  return kinesis.putRecords(payload);
}

exports.sendSeparateRecords = async (partitionKeys) => {
  const sendArrayOfRecords = partitionKeys.map((key) => putKinesisRecord({
    importantStuff: 'Your data is important!',
    smthElse: 'Kinesis will take good care of it'
  },
  key))
  await Promise.all(sendArrayOfRecords)
}

exports.sendRecordsInABatch = async (partitionKeys) => {
  const records = partitionKeys.map((key) => ({
    Data: JSON.stringify({
      importantStuff: 'Your data is important!',
      smthElse: 'Kinesis will take good care of it'
    }),
    PartitionKey: key
  }))
  await putKinesisRecords(records)
}
