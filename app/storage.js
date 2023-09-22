const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const { storageConfig } = require('./config')
let blobServiceClient
let containersInitialised

if (storageConfig.useConnectionStr) {
  blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionStr)
} else {
  const uri = `https://${storageConfig.storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
}

const container = blobServiceClient.getContainerClient(storageConfig.container)

const initialiseContainers = async () => {
  await container.createIfNotExists()
  containersInitialised = true
}

const getBlob = async (filename) => {
  containersInitialised ?? await initialiseContainers()
  return container.getBlockBlobClient(filename)
}

const fileExists = async (filename) => {
  containersInitialised ?? await initialiseContainers()
  const fileList = []
  for await (const item of container.listBlobsFlat()) {
    fileList.push(item.name)
  }
  return fileList.includes(filename)
}

const downloadFile = async (filename) => {
  containersInitialised ?? await initialiseContainers()
  const blob = await getBlob(filename)
  const downloaded = await blob.downloadToBuffer()
  return downloaded.toString()
}

const getBlobClient = async (filename) => {
  containersInitialised ?? await initialiseContainers()
  return container.getBlockBlobClient(filename)
}

module.exports = {
  downloadFile,
  blobServiceClient,
  getBlobClient,
  fileExists
}
